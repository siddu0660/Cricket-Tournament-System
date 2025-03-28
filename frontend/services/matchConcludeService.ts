import axios from 'axios';
import { MatchConcludeRequest } from '@/types/matchConclude';

export const concludeMatch = async (matchId: string, data: Omit<MatchConcludeRequest, 'matchId'>) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/matchConclude/${matchId}`, data);
    return response.data;
  } catch (error: any) {
    console.log('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
}; 