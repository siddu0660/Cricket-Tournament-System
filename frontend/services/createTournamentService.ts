import axios from 'axios';
import { Tournament } from '@/types/tournament';



export const createTournament = async (tournamentData: Tournament): Promise<Tournament> => {
  try {
    const formattedData = {
      ...tournamentData,
      startDate: new Date(tournamentData.startDate).toISOString().split('T')[0],
      endDate: new Date(tournamentData.endDate).toISOString().split('T')[0],
      teams: JSON.stringify(tournamentData.teams),
      weightage: JSON.stringify(tournamentData.weightage),
      sponsorship: JSON.stringify(tournamentData.sponsorship),
    };

    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/tournaments`, formattedData);
    console.log(response.data);
    
    if (response.status !== 201) {
      throw new Error('Failed to create tournament');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create tournament');
    }
    throw error;
  }
} 