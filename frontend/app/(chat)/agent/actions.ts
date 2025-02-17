'use server'

import { createRedisInstance } from '@/redis'
import { redirect } from 'next/navigation';
import axios from 'axios';
import { isEmptyObj } from 'openai/core';


const BackendServiceIp = process.env.BackendServiceIp
const BackendServicePort = process.env.BackendServicePort

const IP_ADDRESS = `http://${BackendServiceIp}:${BackendServicePort}`;
const redis = createRedisInstance();

export async function saveTaskInfo(userId: string, taskInfo: any) {
  const serializedData = { [taskInfo._id]: JSON.stringify(taskInfo) }
  await redis.hmset(`user:${userId}tasks`, serializedData).catch((error) => {
    console.error('Error setting task object:', error);
  });
  redirect(`/${taskInfo._id}`)
}

export async function getTaskIds(user: any) {
  const tasks = await redis.hgetall(`user:${user.id}`)
  if (isEmptyObj(tasks)) {
    try {
      const data = {
        sessionId: user.deviceHash,
      }
      const response = await axios.post(`${IP_ADDRESS}/chatbot/getTaskIds`, data);
      if (response.data.status_code === 200) {
        const tasks = response.data.tasks
        return tasks
      }
      return []
    }
    catch (error: any) {
      console.error('Error:', error.message);
      return []
    }
  }
  const parsedTasks = JSON.parse(tasks.tasks)
  return parsedTasks
}

export async function agentsInfo(userId: string) {
  const agents = await redis.hgetall(`user:${userId}agents`)
  return agents
}

export async function removeAgent(userId: string, agentId: string) {
  await redis.hdel(`user:${userId}agents`, `${agentId}`)
  return
}