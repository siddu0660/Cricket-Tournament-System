import axios from 'axios';
import { MatchData, MatchResponse } from '@/types/match';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const addMatches = async (tournamentId: number, matches: MatchData[]): Promise<MatchResponse> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/v2/matchesTournament/${tournamentId}`, matches);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to add matches');
        }
        throw error;
    }
}; 