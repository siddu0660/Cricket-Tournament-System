import axios from 'axios';
import { Tournament } from '@/types/tournament';

export const getTournamentById = async (id: string): Promise<Tournament> => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/tournaments/${id}`);
  return response.data;
}; 