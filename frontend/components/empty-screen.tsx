
import { useAIState, useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/lib/chat/actions'
import { nanoid } from 'nanoid'
import { UserMessage } from './stocks/message'

export interface EmptyProps {
  taskInfo: any;
  questions: string[];
  setShow: (value: boolean) => void
  sessionId?: string;
  id?: any

}

export function EmptyScreen({ taskInfo, questions, setShow, sessionId, id }: EmptyProps) {
  const [aiState] = useAIState()
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()
  return (
    <div className="flex h-[84vh] w-full items-center justify-center border">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 flex h-full flex-col items-center justify-center text-gray-900 dark:text-gray-100">
        {/* Welcome Icon */}
        <div className="mb-6 h-20 w-20 rounded-full bg-gray-500 flex items-center justify-center text-4xl shadow-xl">
          🤖
        </div>

        {/* Welcome Title */}
        <h2 className="text-3xl font-semibold mb-3 text-center">
          {taskInfo?.taskName || 'Welcome to AI Chat'}
        </h2>

        {/* Welcome Subtitle */}
        <p className="text-base text-gray-600 dark:text-gray-400 mb-8 max-w-md text-center">
          {taskInfo?.description || 'How can I help you today? Choose from these suggestions or start typing your question.'}
        </p>

        {/* Suggestion Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl w-full max-h-[200px] overflow-y-auto">
          {questions?.map((question, index) => (
            <button
              key={index}
              className="flex flex-col gap-2 p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-left hover:-translate-y-1 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all"
              // onClick={() => console.log(`Question clicked: ${question}`)}
              onClick={async () => {
                setShow(true)
                setMessages(currentMessages => [
                  ...currentMessages,
                  {
                    id: nanoid(),
                    display: <UserMessage>{question}</UserMessage>
                  }
                ])

                const responseMessage = await submitUserMessage(sessionId,
                  taskInfo,
                  id,
                  question
                )
                setShow(false)
                setMessages(currentMessages => [
                  ...currentMessages,
                  responseMessage
                ])
              }}
            >
              <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {question}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
