import axios from 'axios';
import { Tournament } from '../types/tournament';


export const fetchTournaments = async (): Promise<Tournament[]> => {
  try {
    const response = await axios.get<Tournament[]>(`${process.env.BACKEND_URL}/api/v2/tournaments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    throw error;
  }
}; 