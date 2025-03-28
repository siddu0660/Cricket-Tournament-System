import axios from 'axios';
import { Match } from '@/types/matchDetails';

export const extractMatchIdFromUrl = (url: string): number => {
  const matches = url.match(/matches\/(\d+)|(\d+)$/);
  if (!matches) {
    throw new Error('Invalid URL format: Could not extract match ID');
  }
  const id = parseInt(matches[1] || matches[2]);
  if (isNaN(id)) {
    throw new Error('Invalid match ID: Not a number');
  }
  return id;
};

export const getMatchDetails = async (id: number): Promise<Match> => {
  try {
    console.log('Fetching match details for ID:', id);
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/matches/${id}`);
    console.log('API Response:', response.data);
    console.log('API URL:', response.config.url);
    
    if (!response.data) {
      console.error('No data received from API');
      throw new Error('No data received from API');
    }
    
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching match details:', error);
    throw new Error(`Failed to fetch match details: ${error.message}`);
  }
};