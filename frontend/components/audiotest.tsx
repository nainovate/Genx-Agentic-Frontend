'use client'
import { IconClose } from './ui/icons'
import { useState, useEffect, useRef } from 'react'
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import {
  useAudiobar
} from '@/lib/hooks/use-audiobar';
import { LocalParticipant, Room, VideoPresets, createLocalAudioTrack, RoomEvent, Track } from "livekit-client";
import { Session } from '@/lib/types';

interface Transcription {
  text: string;
  timestamp: string;
}

export function AudioTest({ session }: { session: Session }) {
  const { isAudiobarOpen, toggleAudiobar, finalTranscriptedText } = useAudiobar();
  const [audioLevels, setAudioLevels] = useState<number[]>([0, 0, 0, 0, 0]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [questions] = useLocalStorage('questions', []);

  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamRoom, setStreamRoom] = useState<Room | null>(null);
  const [dataRoom, setDataRoom] = useState<Room | null>(null);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const wsRef = useRef<WebSocket | null>(null);


  useEffect(() => {
    return () => {
      // if (audioContextRef.current) {
      //   audioContextRef.current.close();
      // }
      if (wsRef.current) {
        wsRef.current.close();
      }
      streamRoom?.disconnect();
      dataRoom?.disconnect();
    };
}, [streamRoom]);

  const startAudioProcessing = async (track: Track) => {
    try {
      // Get the MediaStream from the track
      const stream = new MediaStream([track.mediaStreamTrack]);
      mediaStreamRef.current = stream;

      // Set up the audio context and analyser
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 32;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateAudioLevels = () => {
        analyser.getByteFrequencyData(dataArray);
        const normalizedData = Array.from(dataArray)
          .slice(0, 5)
          .map((value) => value / 255); // Normalize to 0-1
        setAudioLevels(normalizedData);
        if (isAudiobarOpen) {
          requestAnimationFrame(updateAudioLevels);
        }
      };

      updateAudioLevels();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const startStreaming = async () => {
    try {
      const streamTokenResponse = await fetch("/api/getLiveKitToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomName: 'default-room',
          userName: session.user.id,
          canPublish: true,
          canSubscribe: false
        }),
      });

      const { token: streamToken } = await streamTokenResponse.json();
      const newStreamRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
        videoCaptureDefaults: {
          resolution: VideoPresets.h720.resolution,
        },
      });

      // Connect to streaming room and publish audio track
      await newStreamRoom.connect("ws://172.10.10.26:7880", streamToken);
      const track = await createLocalAudioTrack();
      await startAudioProcessing(track);
      const audioContext = new AudioContext();
      const mediaStream = new MediaStream([track.mediaStreamTrack]);

      const source = audioContext.createMediaStreamSource(mediaStream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let silenceDuration = 0;
      const silenceThreshold = 0.01; // Adjust this threshold based on noise level

      const checkSilence = async() => {
        analyser.getByteFrequencyData(dataArray);
  
        // Calculate the average volume
        const averageVolume =
          dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        if (averageVolume / 255 < silenceThreshold) {
          silenceDuration += 50; // Increment silence duration (50ms per frame)
        } else {
          silenceDuration = 0; // Reset if sound is detected
        }
        if (silenceDuration >= 3000) {
          console.log('3 seconds of silence detected. Stopping audio track.');
          stopStreaming();
          return;
        }
  
        // Repeat the check
        requestAnimationFrame(checkSilence);
      };
  
      // Start checking for silence
      await checkSilence();
      await newStreamRoom.localParticipant.publishTrack(track, {
        name: `${session.user.id}`
      });

      console.log("Audio track published!", track.sid);
      setStreamRoom(newStreamRoom);


      // 2. Connect to data room for transcriptions
      const dataTokenResponse = await fetch("/api/getLiveKitToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomName: `data-${newStreamRoom.localParticipant.sid}`,
          userName: `${session.user.id}-listener`,
          canPublish: false,
          canSubscribe: true
        }),
      });

      const { token: dataToken } = await dataTokenResponse.json();
      const newDataRoom = new Room();
      await newDataRoom.connect("ws://172.10.10.26:7880", dataToken)

      console.log("Connected to data room:", `data-${newStreamRoom.localParticipant.sid}`);

      setDataRoom(newDataRoom);

      newDataRoom.on(RoomEvent.DataReceived, (payload) => {
        const textDecoder = new TextDecoder();
        const text = textDecoder.decode(payload);
        // console.log(text);
        finalTranscriptedText(text);
      });
      setIsStreaming(true);
    } catch (err) {
      console.error("Failed to start streaming:", err);
      // Cleanup on error
      streamRoom?.disconnect();
      dataRoom?.disconnect();
      setStreamRoom(null);
      setDataRoom(null);
      setIsStreaming(false);
    }
  };

  const stopStreaming = () => {
    // if (audioContextRef.current) {
    //   audioContextRef.current.close();
    // }
    if (wsRef.current) {
      wsRef.current.close();
    }
    streamRoom?.disconnect();
    dataRoom?.disconnect();
    setStreamRoom(null);
    setDataRoom(null);
    setIsStreaming(false);
    setTranscriptions([]);
    // Reset audio levels
    setAudioLevels([0, 0, 0, 0, 0]);
  };

  useEffect(() => {
    if (isAudiobarOpen) {
      startStreaming();
    } else {
      stopStreaming();
    }

    // Cleanup on component unmount
    return () => {
      stopStreaming();
    };
  }, [isAudiobarOpen]);


  return (
    <>
      {isAudiobarOpen && (
        <div className="group flex flex-col w-1/2 border pb-10">

          {/* </AlertDialogTitle> */}
          <div className='flex justify-end'>
            <button
              className="relative right-2 top-2 p-2 bg-primary text-white rounded-full"
              onClick={() => toggleAudiobar()}
            >
              <IconClose />
            </button></div>
          <div className='flex flex-col h-full'>
            <div className=" flex gap-3 h-1/3 w-full justify-center items-center">
              {audioLevels.map((level, index) => (
                <div
                  key={index}
                  className="w-3 h-10 bg-foreground rounded-full transition-transform duration-100"
                  style={{
                    height: `${30 + level * 80}px`
                  }}
                ></div>
              ))}
            </div>
            <div className='flex overflow-auto h-full w-full'>
              <div className="px-3 flex flex-col gap-2 w-full ">
                {questions.map((question: any, index) => (
                  <div
                    key={index}
                    className="w-full border rounded-lg px-3 py-2 bg-background"
                  >{question}</div>
                ))}
              </div>
            </div>
          </div>
        </div>)}
    </>
  )
}
