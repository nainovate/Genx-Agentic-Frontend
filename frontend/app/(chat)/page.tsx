import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import {  getTask } from '../login/actions'
import { redirect } from 'next/navigation'
import { getTaskQuestions } from '@/app/(chat)/[taskId]/actions'
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
  const taskInfo: any =await getTask(session.user)
  const id = nanoid()
  const questions = await getTaskQuestions(session.user.deviceHash, taskInfo, session.user.id)
  return (
    <AI initialAIState={{ taskInfo: taskInfo, chatId: id, messages: [] }}>
      <div
      className="group w-full flex peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
    >
      <AudioTest session={session}/>
      
      <Chat taskInfo={taskInfo} id={id} session={session} questions={questions} />
    </div></AI>
  )
}