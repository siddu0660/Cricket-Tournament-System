import axios from 'axios';
import { Match } from '../types/getAllMatches';

export const matchService = {
  getAllMatches: async (): Promise<Match[]> => {
    if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
      throw new Error('Backend URL is not configured');
    }

    try {
      console.log('Fetching matches from:', `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/matches`);
      const response = await axios.get<Match[]>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/matches`);
      
      console.log('API Response:', response.data);
      
      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format from server');
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
          }
        });
        throw new Error(error.response?.data?.error || `Failed to fetch matches: ${error.message}`);
      }
      console.error('Non-axios error:', error);
      throw new Error(`An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};