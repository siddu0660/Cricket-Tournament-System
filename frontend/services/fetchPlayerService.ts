import axios from 'axios';
import { Player } from '@/types/player';

export const fetchPlayers = async (): Promise<Player[]> => {
  try {
    const response = await axios.get<Player[]>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/players`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch players: ${error.message}`);
      console.log(error);
    }
    throw new Error('Failed to fetch players');
    console.log(error);
  }
}; 