'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'

import { useActions, useUIState } from 'ai/rsc'

import { UserMessage } from './stocks/message'
import { type AI } from '@/lib/chat/actions'
import { Button, NormalButton } from '@/components/ui/button'
import { IconArrowElbow, IconPlus, IconMic } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import Microphone from './Microphone'
import MicrophoneTest from './MicrophoneTest'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useAudiobar } from '@/lib/hooks/use-audiobar';


export function PromptForm({
  sessionId,
  taskInfo,
  id,
  setShow,
  input,
  setInput,
  show,
  questions
}: {
  sessionId: string
  taskInfo: any
  id: string
  setShow: (value: boolean) => void
  input: string
  setInput: (value: string) => void
  show: boolean
  questions: any
}) {
  const router = useRouter()
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const { submitUserMessage } = useActions()
  const [_, setMessages] = useUIState<typeof AI>()
  const [isStt, setIsStt] = React.useState(false)
  const [recording, setRecording] = React.useState(false);
  const { isAudiobarOpen, toggleAudiobar } = useAudiobar();



  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])
  const handleMicrophoneClick = async () => {
    try {
      toggleAudiobar()
    } catch (error) {
      console.error('Microphone access denied or error:', error);
      alert('Microphone access is required to proceed. Please allow it in your browser settings.');
    }
  };


  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault()
        setShow(true)

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          e.target['message']?.blur()
        }

        const value = input.trim()
        setInput('')
        if (!value) return

        // Optimistically add user message UI
        setMessages(currentMessages => [
          ...currentMessages,
          {
            id: nanoid(),
            display: <UserMessage>{value}</UserMessage>
          }
        ])

        // Submit and get response message
        const responseMessage = await submitUserMessage(sessionId, taskInfo, id, value)
        setShow(false)
        setMessages(currentMessages => [...currentMessages, responseMessage])
      }}
    >
      <div className="relative flex max-h-60 w-full grow flex-row overflow-hidden bg-background px-8 sm:rounded-full sm:border sm:px-12">
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <NormalButton
              variant="outline"
              size="icon"
              className="absolute left-0 top-[14px] size-8 rounded-full bg-background p-0 sm:left-4"
              onClick={() => {
                router.push('/new')
              }}
            >
              <IconPlus />
              <span className="sr-only">New Chat</span>
            </NormalButton>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip> */}
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm disabled:cursor-not-allowed"
          autoFocus
          // disabled={isStt || recording || show}
          disabled={isAudiobarOpen}

          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          // style={{ cursor: isStt ? 'not-allowed' : '' }}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="m-3 rounded-full flex justify-center">
          {/* <Microphone setInput={setInput} setIsStt={setIsStt} isStt={isStt} recording={recording} setRecording={setRecording} buttonRef={buttonRef} show={show}/> */}
          {/* <MicrophoneTest/> */}
          <button
            className="bg-background flex justify-center text-foreground border rounded-full hover:bg-muted disabled:cursor-not-allowed"
            onClick={handleMicrophoneClick}
            type='button'
            disabled={isAudiobarOpen}
          >
            <div className="size-8 pl-2 pt-1" >
              <IconMic />
            </div>          
            </button>
        </div>
        <div className="absolute right-0 top-[13px] sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="submit" size="icon" disabled={input === '' || isAudiobarOpen} ref={buttonRef}>
                <IconArrowElbow />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}
