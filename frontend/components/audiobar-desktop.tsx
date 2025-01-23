import { AudioTest } from './audiotest';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Session } from '@/lib/types';


export async function AudiobarDesktop() {
  const session = (await auth()) as Session

  if (!session?.user) {
    redirect(`/login`)
  }  return (
    <AudioTest session={session}/>
  )
}
