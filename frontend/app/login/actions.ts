'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import { z } from 'zod'
import { ResultCode } from '@/lib/utils'
import { createRedisInstance } from '../../redis'
import axios from 'axios'
const BackendServiceIp = process.env.BackendServiceIp
const BackendServicePort = process.env.BackendServicePort

const IP_ADDRESS = `http://${BackendServiceIp}:${BackendServicePort}`;

const redis = createRedisInstance();

export async function getUser(email: string) {
  const user = await redis.hgetall(`user:${email}`)
  return user
}

export async function getTask(user: any) {
  try {
    const data = {
      sessionId: user.deviceHash,
    }
    const response = await axios.post(`${IP_ADDRESS}/chatbot/getTaskIds`, data);
    if (response.data.status_code === 200) {
      const tasks = response.data.tasks
      await redis.hmset(`user:${user.id}`, { tasks: JSON.stringify(tasks) }).catch((error) => {
        console.error('Error setting task list:', error);
      });
      const role = tasks[0].roles[0];
      const taskInfo = role.tasks[0];
      taskInfo["orgId"] = tasks[0].orgId
      const result: any = await initializeInstances(taskInfo.agentId, user)

      if (result.status_code === 200) {
        return taskInfo
      }
    } else {
      return {}
    }
  } catch (error: any) {
    console.error('Error:', error.message);
    return {}
  }
}

export async function initializeInstances(deployId: string, user: any) {
  const data = {
    sessionId: user.deviceHash,
    data: {
      userId: user.id,
      deployId: deployId
    }

  }
  try {
    const response1 = await axios.post(`${IP_ADDRESS}/chatbot/initializeInstances`, data);
    console.log('-----res in itit',deployId,response1.data)

    if (response1.data.status_code == 200) {
      return response1.data
    } else {
      return response1.data
    }
  }
  catch (error: any) {
    console.error('Error:', error.message);
    return 500
  }
}


interface Result {
  type: string
  resultCode: ResultCode
}

export async function authenticate(
  _prevState: Result | undefined,
  formData: FormData
): Promise<Result | undefined> {
  try {
    const username = formData.get('email')
    const password = formData.get('password')

    const parsedCredentials = z
      .object({
        username: z.string(),
        password: z.string().min(6)
      })
      .safeParse({
        username,
        password
      })

    if (parsedCredentials.success) {
      const response = await signIn('credentials', {
        username,
        password,
        redirect: false
      }).then(response => {
        console.log("Sign-in response:", response);
        return 200
      }).catch(error => {
        console.error("Sign-in error:", error);
        return null
      });
      if (!response) {
        return {
          type: 'error',
          resultCode: ResultCode.InvalidCredentials
        }
      }
      return {
        type: 'success',
        resultCode: ResultCode.UserLoggedIn
      }
    } else {
      return {
        type: 'error',
        resultCode: ResultCode.InvalidCredentials
      }
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            type: 'error',
            resultCode: ResultCode.InvalidCredentials
          }
        default:
          return {
            type: 'error',
            resultCode: ResultCode.UnknownError
          }
      }
    }
  }
}