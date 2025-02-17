import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { Session } from '@/lib/types'
import { initializeInstances } from '@/app/login/actions'
import { getTaskQuestions, getUserTasks } from './actions'
import { nanoid } from '@/lib/utils'
import { AudioTest } from '@/components/audiotest'


export interface AgentPageProps {
  params: {
    taskId: string
  }
}

export default async function AgentPage({ params }: AgentPageProps) {
  const session = (await auth()) as Session

  if (!session?.user) {
    redirect(`/login?next=/${params.taskId}`)
  }
  const id: string=nanoid()
  const userId = session.user.id as string
  const tasks = await getUserTasks(userId)
  if (!tasks) {
    redirect('/')
  }
  if (!(params.taskId in tasks)) {
    notFound()
  }
  const taskInfo = JSON.parse(tasks[params.taskId])
  await initializeInstances(taskInfo.agentId, session.user)
  const questions = await getTaskQuestions(session.user.deviceHash, taskInfo,session.user.id)
  return (
    <AI initialAIState={{ taskInfo:taskInfo, chatId: id, messages: []}}>
      <div
      className="group w-full flex peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
    >
      <AudioTest session={session} />
      <Chat
        id={id}
        taskInfo={taskInfo}
        session={session}
        questions={questions}
      />
      </div>
    </AI>
  )
}