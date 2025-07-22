'use client'
import * as React from 'react'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { PromptForm } from '@/components/prompt-form'
import Footer from '@/components/footer'

export interface ChatPanelProps {
  sessionId: string
  taskInfo: any
  id?: any
  title?: string
  input: string
  setShow: (value: boolean) => void
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
  show: boolean
  questions: any
  activeDocument?: any
}

export function ChatPanel({
  sessionId,
  taskInfo,
  id,
  title,
  setShow,
  input,
  setInput,
  isAtBottom,
  scrollToBottom,
  show,
  questions,
  activeDocument
}: ChatPanelProps) {
  return (
    <div className={`fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]${activeDocument ? ' pr-[600px]' : ''}`}>
      {/*  <div className='w-full relative sticky bottom-0 py-2'> */}
      {/* <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      /> */}

      <div className="w-full flex flex-col items-center sm:px-4">
        <div className="space-y-4 border-t w-full sm:w-[800px] bg-background px-4 py-2 shadow-lg sm:rounded-2xl sm:border md:py-4">
          <PromptForm sessionId={sessionId} setShow={setShow} taskInfo={taskInfo} id={id} input={input} setInput={setInput} show={show} questions={questions} />
        </div>
        <Footer/>
      </div>
    </div>
  )
}