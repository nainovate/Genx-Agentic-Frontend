import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { Session } from '@/lib/types'
import { initializeInstances } from '@/app/login/actions'
import { getUserAgents } from './actions'
import { nanoid } from '@/lib/utils'
import { getAgentQuestions } from '@/app/(chat)/[agentid]/actions'
import { AudioTest } from '@/components/audiotest'


export interface AgentPageProps {
  params: {
    agentid: string
  }
}

export default async function AgentPage({ params }: AgentPageProps) {
  const session = (await auth()) as Session

  if (!session?.user) {
    redirect(`/login?next=/${params.agentid}`)
  }
  const id: string=nanoid()
  const userId = session.user.id as string
  const agents = await getUserAgents(userId)
  if (!agents) {
    redirect('/')
  }

  if (!(params.agentid in agents)) {
    notFound()
  }
  const agentInfo = JSON.parse(agents[params.agentid])
  await initializeInstances(params.agentid, session.user)
  const questions = await getAgentQuestions(session.user.deviceHash, params.agentid,session.user.id)

  return (
    <AI initialAIState={{ agentId: params.agentid, chatId: id, messages: []}}>
      <div
      className="group w-full flex peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
    >
      <AudioTest session={session} />
      <Chat
        agentId={params.agentid}
        id={id}
        agentInfo={agentInfo}
        session={session}
        questions={questions}
      />
      </div>
    </AI>
  )
}