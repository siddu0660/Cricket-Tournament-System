"use client"

import axios from 'axios';
import { Venue } from '@/types/venue';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getVenuesByTournament = async (tournamentId: string | number): Promise<Venue[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v2/venue/${tournamentId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch venues');
    }
    throw error;
  }
};
