'use client'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useEffect, useState } from 'react'
import { useUIState, useAIState } from 'ai/rsc'
import { Message, Session } from '@/lib/types'
import { usePathname, useRouter } from 'next/navigation'
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor'
import * as React from 'react';
import { Separator } from '@/components/ui/separator';
import { BotCard } from './stocks';
import { useAudiobar } from '@/lib/hooks/use-audiobar'



export interface ChatProps extends React.ComponentProps<'div'> {
  taskInfo?: any
  id?: string
  session?: Session
  questions?: any
}

export function Chat({ taskInfo, id, className, session, questions }: ChatProps) {
  const sessionId: any = session?.user.deviceHash
  const router = useRouter()
  const path = usePathname()
  const [input, setInput] = useState('')
  const [show, setShow] = useState(false)
  const [messages] = useUIState()
  const [aiState] = useAIState()

  const [_, setNewChatId] = useLocalStorage('newChatId', id)
  const [__, setQuestions] = useLocalStorage('questions', questions);
  const { transcriptedText } = useAudiobar();


  useEffect(() => {
    if (session?.user) {
      if (!path.includes('chat') && messages.length === 1) {
        window.history.replaceState({}, '', `/chat/${id}`)
      }
    }
  }, [id, path, session?.user, messages])

  useEffect(() => {
    const messagesLength = aiState.messages?.length
    if (messagesLength === 2) {
      router.refresh()
    }
  }, [aiState.messages, router])

  useEffect(() => {
    setNewChatId(id);
    setQuestions(questions)
  },[])

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor()

  return (
    <div
      className="group flex flex-col justify-between w-full overflow-auto bg-background peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      ref={scrollRef}
    >
      <div
        className={cn('', className)}
        ref={messagesRef}
      >
        {messages.length ? (
          <ChatList messages={messages} show={show} isShared={false} session={session} isAtBottom={isAtBottom} sessionId={sessionId}
            taskInfo={taskInfo}
            id={id}
            input={input}
            setInput={setInput}
            setShow={setShow}
            scrollToBottom={scrollToBottom}
            questions={questions} />
        ) : (
          transcriptedText === '' && <EmptyScreen questions={questions} taskInfo={taskInfo} id={id} sessionId={sessionId} setShow={setShow} />
        )}
        {transcriptedText !== '' && (<div className='relative mx-auto max-w-2xl px-4'>
          <Separator className="my-4" />
          <BotCard >
            {transcriptedText}
          </BotCard>
        </div>)}
        <div className="w-full h-px" ref={visibilityRef} />
      </div>
      {messages.length ? null: (
      <ChatPanel
        sessionId={sessionId}
        taskInfo={taskInfo}
        id={id}
        input={input}
        setInput={setInput}
        setShow={setShow}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
        show={show}
        questions={questions}
      />)}
    </div>
  )
}