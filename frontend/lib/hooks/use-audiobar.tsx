'use client'

import * as React from 'react'

const STATE_STORAGE_KEY = 'microphoneDiv';
const TEXT_STORAGE_KEY = 'text';

interface AudiobarContext {
  isAudiobarOpen: boolean
  toggleAudiobar: () => void
  isLoading: boolean
  transcriptedText: string
  finalTranscriptedText: (text:string)=>void
}

const AudiobarContext = React.createContext<AudiobarContext | undefined>(
  undefined
)

export function useAudiobar() {
  const context = React.useContext(AudiobarContext)
  if (!context) {
    throw new Error('useAudiobarContext must be used within a AudiobarProvider')
  }
  return context
}

interface AudiobarProviderProps {
  children: React.ReactNode
}

export function AudiobarProvider({ children }: AudiobarProviderProps) {
  const [isAudiobarOpen, setAudiobarOpen] = React.useState(true)
  const [isLoading, setLoading] = React.useState(true)
  const [transcriptedText, setTranscriptedText] = React.useState<string>('');

  React.useEffect(() => {
    // const value = localStorage.getItem(STATE_STORAGE_KEY)
    // if (value) {
    //   setAudiobarOpen(JSON.parse(value))
    // }
    // setLoading(false)
    localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(false))
    setAudiobarOpen(false)
    localStorage.setItem(TEXT_STORAGE_KEY,'');
    setTranscriptedText('')
    setLoading(false)
  }, [])

  React.useEffect(() => {
    localStorage.setItem(TEXT_STORAGE_KEY,'');
    setTranscriptedText('')
  }, [isAudiobarOpen])

  const toggleAudiobar = () => {
    setAudiobarOpen(value => {
      const newState = !value
      localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(newState))
      localStorage.setItem(TEXT_STORAGE_KEY,'');
      return newState
    })
  }

  const finalTranscriptedText = (text:string) => {
    setTranscriptedText((value:string) => {
      const newText =  `${value} ${text}`
      localStorage.setItem(TEXT_STORAGE_KEY,newText)
      return newText
    })
  }

  if (isLoading) {
    return null
  }

  return (
    <AudiobarContext.Provider
      value={{ isAudiobarOpen, toggleAudiobar, isLoading, transcriptedText, finalTranscriptedText }}
    >
      {children}
    </AudiobarContext.Provider>
  )
}
