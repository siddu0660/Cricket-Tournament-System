import axios from 'axios';
import { Venue } from '@/types/venue';


export const fetchVenues = async (): Promise<Venue[]> => {
  try {
    const response = await axios.get(`${process.env.BACKEND_URL}/api/v2/venue`);
    return response.data;
  } catch (error) {
    console.error('Error fetching venues:', error);
    throw error;
  }
}; 