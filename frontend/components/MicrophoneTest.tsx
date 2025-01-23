import { IconMic,IconClose } from "./ui/icons";

import React, { useState, useEffect, useRef } from 'react';

import {
    AlertDialog,
    AlertDialogContent,
  } from './ui/alert-dialog'
import {  Room, VideoPresets } from "livekit-client";



const MicrophoneTest = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [audioLevels, setAudioLevels] = useState<number[]>([0, 0, 0, 0, 0]);
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [isMicAccessGranted, setIsMicAccessGranted] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const wsRef = useRef<WebSocket | null>(null); // WebSocket reference

  useEffect(() => {
    return () => {
      // if (audioContextRef.current) {
      //   audioContextRef.current.close();
      // }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const startAudioProcessing = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
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
        requestAnimationFrame(updateAudioLevels);
      };

      updateAudioLevels();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const handleMicrophoneClick = async () => {
    try {
      // Request microphone access
      // const tokenResponse = await fetch("/api/getLiveKitToken", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ roomName, userName }),
      // });
  
      // const { token } = await tokenResponse.json();
      // const room = new Room({
      //   adaptiveStream: true,
      //   dynacast: true,
      //   videoCaptureDefaults: {
      //     resolution: VideoPresets.h720.resolution,
      //   },
      // });
      // console.log('----token',token)
  
      // await room.connect("ws://172.10.10.26:7880", token);
      // setRoom(room);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (stream) {
        console.log('Microphone access granted');
        setIsMicAccessGranted(true);
        setDialogOpen(true); // Open popover after permission is granted
      }
    } catch (error) {
      console.error('Microphone access denied or error:', error);
      alert('Microphone access is required to proceed. Please allow it in your browser settings.');
    }
  };

  useEffect(() => {
    if (dialogOpen) {
      startAudioProcessing();
      console.log('---------hello')
    }
  }, [dialogOpen]);

  return (
    <div>
      {/* <button
        className="bg-background text-foreground rounded-full"
        onClick={togglePopover}
      >
        <IconMic/>
      </button> */}
      <div className="">
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="size-7 p-0 hover:bg-muted"
            //   disabled={isRemovePending}
              onClick={() => setDialogOpen(true)}
            >
              <IconMic />
              <span className="sr-only">Microphone</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Tap to speak</TooltipContent>
        </Tooltip> */}
        <button
        className="bg-background text-foreground rounded-full"
        onClick={handleMicrophoneClick}
        >
        <IconMic/>
      </button>
      </div>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        
        <AlertDialogContent className="bg-transparent border-none shadow-none flex w-full h-full">
        <div className="w-full">
          
          {/* <AlertDialogTitle> */}
            <div className="w-full flex justify-end">
                <button
            className="top-5 right-5 p-2 bg-red-500 text-white rounded-full"
            onClick={() => setDialogOpen(false)}
            >
            <IconClose/>
          </button>
          </div>
            {/* </AlertDialogTitle> */}

          <div className="flex gap-4 h-full justify-center items-center">
            {audioLevels.map((level, index) => (
              <div
                key={index}
                className="w-10 h-10 bg-white rounded-full transition-transform duration-100"
                style={{
                  transform: `scale(${1 + level * 2})`,
                }}
              ></div>
            ))}
          </div>
        </div>
        </AlertDialogContent>
      </AlertDialog>

      
    </div>
  );
};

export default MicrophoneTest;
