import axios from 'axios';
import { Match } from '@/types/matchDetails';


export const getMatchDetails = async (id: number): Promise<Match> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/matches/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch match details');
  }
};