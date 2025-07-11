'use client'
import * as React from 'react'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { useAIState, useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/lib/chat/actions'
import { nanoid } from 'nanoid'
import { UserMessage } from './stocks/message'
import { useTheme } from 'next-themes'
import { useAudiobar } from '@/lib/hooks/use-audiobar';




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
  questions
}: ChatPanelProps) {

  const { isAudiobarOpen } = useAudiobar();


  function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background:theme?.includes('dark') ?'':'black', borderRadius:'15px' }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background:theme?.includes('dark') ?'':'black',borderRadius:'15px' }}
      onClick={onClick}
    />
  );
}
  const [aiState] = useAIState()
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()
  const { theme } = useTheme()
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '1',
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  return (
    // <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <div className='w-full py-2'>
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="w-full sm:px-4">
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-2xl sm:border md:py-4">
          <PromptForm sessionId={sessionId} setShow={setShow} taskInfo={taskInfo} id={id} input={input} setInput={setInput} show={show} questions={questions} />
          {/* <FooterText className="hidden sm:block" /> */}
        </div>
      </div>
    </div>
  )
}