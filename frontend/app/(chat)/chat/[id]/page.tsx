import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getAgentQuestions } from '@/app/(chat)/[agentid]/actions'
import { auth } from '@/auth'
import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { Session } from '@/lib/types'
import { initializeInstances } from '@/app/login/actions'
import { AudioTest } from '@/components/audiotest'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const session = await auth()

  if (!session?.user) {
    return {}
  }

  const chat = await getChat(params.id, session.user.id)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = (await auth()) as Session
  // const missingKeys = await getMissingKeys()

  if (!session?.user) {
    redirect(`/login?next=/chat/${params.id}`)
  }

  const userId = session.user.id as string
  const chat = await getChat(params.id, userId)
  if (!chat) {
    redirect('/')
  }

  if (chat?.userId !== session?.user?.id) {
    notFound()
  }
  await initializeInstances(chat.agentId, session.user)
  const questions = await getAgentQuestions(session.user.deviceHash, chat.agentId, session.user.id)

  return (
    <AI initialAIState={{ agentId: chat.agentId, chatId: chat.id, messages: JSON.parse(chat.messages) }}>
      <div
      className="group w-full flex peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
    >
      <AudioTest session={session} />
      <Chat
        agentId={chat.agentId}
        id={chat.id}
        session={session}
        questions={questions}
      />
      </div>
    </AI>
  )
}
