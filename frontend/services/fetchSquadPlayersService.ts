import axios, { AxiosError } from 'axios';
import { SquadPlayer } from '@/types/getSquadPlayers';

export const fetchSquadPlayers = async (teamId: number, tournamentId: number): Promise<SquadPlayer[]> => {
    try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/squads/players/${teamId}/${tournamentId}`
        );
        
        console.log('[fetchSquadPlayers] Request params:', { teamId, tournamentId });
        console.log('[fetchSquadPlayers] Response data:', response.data);
        
        // Map each object in the array to our SquadPlayer interface
        if (Array.isArray(response.data)) {
            return response.data.map(player => ({
                playerId: player.id,
                playerName: player.name,
                teamId: player.teamId
            }));
        }
        
        return [];
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error('[fetchSquadPlayers] Error details:', {
            message: error.message,
            status: error.response?.status,
            responseData: error.response?.data
          });
        }
        return [];
      } 
};