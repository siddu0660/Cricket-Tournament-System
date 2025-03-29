import { Tournament } from '../types/tournament';
import { fetchTournaments } from './fetchtournamentService';

export const getActiveTournaments = async (): Promise<Tournament[]> => {
  try {
    // Fetch all tournaments
    const tournaments = await fetchTournaments();
    
    // Get current date at midnight for accurate date comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter tournaments where today is between start and end dates
    const activeTournaments = tournaments.filter(tournament => {
      const startDate = new Date(tournament.startDate);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(tournament.endDate);
      endDate.setHours(23, 59, 59, 999);

      return startDate <= today && today <= endDate;
    });

    return activeTournaments;
  } catch (error) {
    console.error('Error fetching active tournaments:', error);
    throw error;
  }
}; 