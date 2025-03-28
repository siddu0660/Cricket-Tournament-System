"use client"

import axios from 'axios';
import { TournamentTeam, Team, Fixture } from '@/types/tour';

export const fetchTournamentTeams = async (tournamentName: string): Promise<TournamentTeam> => {
  try {
    console.log('Attempting to fetch teams for tournament:', tournamentName);
    console.log('API URL:', `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/teamsTournament/${tournamentName}`);
    
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/teamsTournament/${tournamentName}`);
    
    console.log('API Response:', response.data);
    
      // If response.data is an array, wrap it in the expected structure
      if (Array.isArray(response.data)) {
        return { tournamentName, teams: response.data };
      }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(`Failed to fetch tournament teams: ${error.response?.data?.message || error.message}`);
    }
    throw new Error('Failed to fetch tournament teams');
  }
};

export const generateGroupFixtures = (teams: Team[]): Fixture[] => {
  console.log('Starting fixture generation with teams:', teams);
  
  if (!teams || teams.length < 2) {
    console.error('Not enough teams to generate fixtures');
    return [];
  }

  const fixtures: Fixture[] = [];
  
  // Generate round-robin fixtures
  for (let i = 0; i < teams.length - 1; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const fixture: Fixture = {
        fixtureId: `${i}-${j}`, // Generate a unique ID
        groupNumber: 1, // Default to group 1, modify as needed
        team1: teams[i],
        team2: teams[j],
        venueId: '', // Will be set by user
        matchDate: '', // Will be set by user
        matchStatus: 'SCHEDULED',
        tournamentId: teams[i].tournamentId || 0,
        matchResult: null
      };
      fixtures.push(fixture);
    }
  }

  console.log('Generated fixtures:', fixtures);
  return fixtures;
}; 