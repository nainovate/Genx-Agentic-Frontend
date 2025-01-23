import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { getAgent } from '../login/actions'
import { redirect } from 'next/navigation'
import { getAgentQuestions } from '@/app/(chat)/[agentid]/actions'
import { AudioTest } from '@/components/audiotest'
import { useAudiobar } from '@/lib/hooks/use-audiobar'
export const metadata = {
  title: ' AI Chatbot'
}
export default async function IndexPage() {

  const session = (await auth()) as Session
  if (!session) {
    redirect('/login')
  }
  const agent: any =await getAgent(session.user)
  const agentId = agent[0]
  const agentInfo =agent[1]
  const id = nanoid()
  const questions = await getAgentQuestions(session.user.deviceHash, agentId, session.user.id)

  return (
    <AI initialAIState={{ agentId: agentId, chatId: id, messages: [] }}>
      <div
      className="group w-full flex peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
    >
      <AudioTest session={session}/>
      
      <Chat agentId={agentId} agentInfo={agentInfo} id={id} session={session} questions={questions} />
    </div></AI>
  )
}