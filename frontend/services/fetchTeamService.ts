import axios from 'axios';
import { Team } from '@/types/team';



export const fetchTeams = async (): Promise<Team[]> => {
  try {
    const response = await axios.get(`${process.env.BACKEND_URL}/api/v2/teams`);
    return response.data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

 