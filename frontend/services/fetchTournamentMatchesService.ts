import axios from 'axios';
import { Match } from '@/types/getMatch';

export const getTournamentMatches = async (tournamentId: string): Promise<Match[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/tournaments/${tournamentId}/matches`);
    console.log('Tournament matches:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching tournament matches:', error);
    throw error;
  }
}; 