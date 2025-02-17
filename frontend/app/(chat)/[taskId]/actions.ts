import { createRedisInstance } from '../../../redis'
import axios from 'axios'

const BackendServiceIp = process.env.BackendServiceIp
const BackendServicePort = process.env.BackendServicePort

const IP_ADDRESS = `http://${BackendServiceIp}:${BackendServicePort}`;

const redis = createRedisInstance();

export async function getUserTasks(userId: string) {
  const tasks = await redis.hgetall(`user:${userId}tasks`)
  return tasks
}

// get agent questions from backend api route
export async function getTaskQuestions(sessionId: string, taskInfo: any, userId: string,) {
  const questions: any = await redis.hget(`userId:${userId}:questions`, taskInfo._id)
  if (!questions) {
    const data = {
      sessionId: sessionId,
      data:{
        orgId: taskInfo.orgId,
        deployId:taskInfo.agentId,
        taskId:taskInfo._id
      }
    }
    try {
      const response = await axios.post(`${IP_ADDRESS}/chatbot/getQuestionCards`, data);
      const apiQuestions = response.data.questions
      if (response.data.status_code == 200) {
        await redis.hmset(`userId:${userId}:questions`,apiQuestions).catch((error) => {
          console.error('Error setting agent questions in redis:', error);
        });
        return apiQuestions[taskInfo._id]
      } else {
        return []
      }
    }
    catch (error: any) {
      console.error('Error:', error.message);
      return []
    }
  }
  const splitList: string[] = questions.split(',');
  return splitList
}
