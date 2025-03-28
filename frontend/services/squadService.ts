import axios from 'axios';
import { Squad, SquadResponse } from '@/types/squad';


export async function getSquadsByTournament(tournamentId: string): Promise<Squad[]> {
  try {
    const response = await axios.get<Squad[]>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/squads/tournament/${tournamentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching squads:', error);
    throw error;
  }
} 