import axios from 'axios';
import { Player } from '@/types/player';

export const updatePlayer = async (playerId: string, playerData: Partial<Player>) => {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/players/${playerId}`, playerData);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 