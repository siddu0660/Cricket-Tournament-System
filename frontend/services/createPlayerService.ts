import axios from 'axios';
import { Player } from '@/types/player';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const addPlayer = async (playerData: Omit<Player, 'playerId'>) => {
  try {
    const response = await axios.post(`${baseURL}/api/v2/players`, playerData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create player');
    }
    throw new Error('An unexpected error occurred');
  }
}; 