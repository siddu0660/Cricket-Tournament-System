"use client"

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { CalendarDays, Clock, MapPin, Send, Plus } from "lucide-react"
import { Match } from '@/types/getMatch';
import { getTournamentMatches } from '@/services/fetchTournamentMatchesService';
import { format, isBefore, isToday, startOfDay } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { concludeMatch } from '@/services/matchConcludeService';
import axios from 'axios';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SquadPlayer } from '@/types/getSquadPlayers';
import { fetchSquadPlayers } from '@/services/fetchSquadPlayersService';

interface TournamentMatchesProps {
  tournamentId: string;
}

// Add this type for match status
type MatchStatus = 'upcoming' | 'ongoing' | 'completed';

interface PlayerMatchStats {
  playerMatchStatisticsId: number;
  playerId: number;
  fullName: string; 
  runsScored: number;
  ballsFaced: number;
  fours: number;
  sixes: number;
  oversBowled: number;
  battingStatus: string;
  runsConceded: number;
  maidens: number;
  wicketsTaken: number;
  catchesTaken: number;
  stumpingsTaken: number;
}

export default function TournamentMatches({ tournamentId }: TournamentMatchesProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<MatchStatus | 'all'>('all');
  const [selectedWinner, setSelectedWinner] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statisticsDialogOpen, setStatisticsDialogOpen] = useState(false);
  const [selectedTeamName, setSelectedTeamName] = useState("");
  const [currentMatchStatisticsId, setCurrentMatchStatisticsId] = useState<number | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerMatchStats[]>([]);
  const [battingTeamName, setBattingTeamName] = useState('');
  const [bowlingTeamName, setBowlingTeamName] = useState('');
  const [selectedBatsman, setSelectedBatsman] = useState<string>("");
  const [selectedBowler, setSelectedBowler] = useState<string>("");
  const [battingSquad, setBattingSquad] = useState<SquadPlayer[]>([]);
  const [bowlingSquad, setBowlingSquad] = useState<SquadPlayer[]>([]);
  const [localPlayerStats, setLocalPlayerStats] = useState<PlayerMatchStats[]>([]);

  // Add this function to determine match status
  const getMatchStatus = (matchDate: string): MatchStatus => {
    const matchDateTime = new Date(matchDate);
    const today = new Date();
    const matchDay = startOfDay(matchDateTime);
    const todayStart = startOfDay(today);

    if (isToday(matchDateTime)) {
      return 'ongoing';
    } else if (isBefore(matchDay, todayStart)) {
      return 'completed';
    } else {
      return 'upcoming';
    }
  };

  // Filter matches based on selected status
  const filteredMatches = matches.filter(match => {
    if (selectedStatus === 'all') return true;
    return getMatchStatus(new Date(match.matchDate).toISOString()) === selectedStatus;
  });

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await getTournamentMatches(tournamentId);
        setMatches(data);
        console.log(data);
      } catch (err) {
        setError('Failed to fetch matches');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [tournamentId]);

  const getTeamInitials = (teamName: string) => {
    if (teamName === "Mumbai Indians") return "MI";
    if (teamName === "Kolkata Knight Riders") return "KKR";
    if (teamName === "Chennai Super Kings") return "CSK";
    if (teamName === "Royal Challengers Bangalore") return "RCB";
    if (teamName === "Delhi Capitals") return "DC";
    if (teamName === "Sunrisers Hyderabad") return "SRH";
    if (teamName === "Rajasthan Royals") return "RR";
    if (teamName === "Kings XI Punjab") return "KXIP";
    if (teamName === "Gujarat Titans") return "GT";
    if (teamName === "Lucknow Super Giants") return "LSG";
    if (teamName === "Punjab Kings") return "PBKS";
    if (teamName === "Rajasthan Royals") return "RR";
    if (teamName === "Sunrisers Hyderabad") return "SRH";
    if( teamName === "India") return "IND";
    if( teamName === "Australia") return "AUS";
    if( teamName === "England") return "ENG";
    if( teamName === "South Africa") return "SA";
    if( teamName === "New Zealand") return "NZ";
    if( teamName === "West Indies") return "WI";
    if( teamName === "Sri Lanka") return "SL";
    if( teamName === "Bangladesh") return "BAN";
    if( teamName === "Afghanistan") return "AFG";
    if( teamName === "Zimbabwe") return "ZIM";
    if( teamName === "Netherlands") return "NED";
    if( teamName === "Ireland") return "IRE";
    if( teamName === "Scotland") return "SCO";
    if( teamName === "Hong Kong") return "HK";
    if( teamName === "Nepal") return "NEP";
    if( teamName === "Oman") return "OMA";
    if( teamName === "Papua New Guinea") return "PNG";
    if( teamName === "United Arab Emirates") return "UAE";
    if( teamName === "Zambia") return "ZAM";
    
  };

  const getStatusStyles = (status: MatchStatus) => {
    const baseStyles = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case 'completed':
        return `${baseStyles} bg-red-100 text-red-700`;
      case 'ongoing':
        return `${baseStyles} bg-green-100 text-green-700`;
      case 'upcoming':
        return `${baseStyles} bg-blue-100 text-blue-700`;
    }
  };

  const handleConcludeMatch = async (matchId: string) => {
    try {
      const conclusionData = {
        winnerId: parseInt(selectedWinner),
        matchResult: description,
        manOfTheMatchId: 1,
      };
      
      await concludeMatch(matchId, conclusionData);
      console.log("Match concluded successfully");
      
      // Reset form
      setSelectedWinner("");
      setDescription("");
      
      // Close dialog
      setIsDialogOpen(false);
      
      // Refresh matches list
      const data = await getTournamentMatches(tournamentId);
      setMatches(data);
    } catch (error) {
      console.error("Error concluding match:", error);
    }
  };

  const handleCreateStatistics = async (matchId: number, teamId: number) => {
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/matchStatistics`, {
        matchId,
        teamId
      });
      if (data) {
        setSelectedTeamName(teamId.toString());
        setStatisticsDialogOpen(true);
      }

      setCurrentMatchStatisticsId(data.matchStatisticsId);
      
      const match = matches.find(m => m.matchId === matchId);
      if (match) {
        if (teamId === match.team1Id) {
          setBattingTeamName(match.team1Name);
          setBowlingTeamName(match.team2Name);
          // Get batting team squad
          const battingSquadData = await fetchSquadPlayers(match.team1Id, parseInt(tournamentId));
          console.log("Batting Squad :" ,battingSquadData)
          setBattingSquad(battingSquadData);
          // Get bowling team squad
          const bowlingSquadData = await fetchSquadPlayers(match.team2Id, parseInt(tournamentId));
          setBowlingSquad(bowlingSquadData);
        } else {
          setBattingTeamName(match.team2Name);
          setBowlingTeamName(match.team1Name);
          // Get batting team squad
          const battingSquadData = await fetchSquadPlayers(match.team2Id, parseInt(tournamentId));
          setBattingSquad(battingSquadData);
          // Get bowling team squad
          const bowlingSquadData = await fetchSquadPlayers(match.team1Id, parseInt(tournamentId));
          setBowlingSquad(bowlingSquadData);
        }
      }
    } catch (error) {
      console.error('Error creating match statistics:', error);
    }
  };

  const handleAddBatsman = async (playerId: string) => {
    try {
      if (!currentMatchStatisticsId) return;

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/playerMatchStatistics`, {
        matchStatisticsId: currentMatchStatisticsId,
        playerId: parseInt(playerId)
      });
      console.log("Response :", response.data)

      // Add the new player stats to the existing stats
      setPlayerStats(prevStats => [...prevStats, response.data],);
      
      // Reset the selected batsman
      setSelectedBatsman("");
    } catch (error) {
      console.error('Error adding batsman:', error);
    }
  };

  const handleAddBowler = async (playerId: string) => {
    try {
      if (!currentMatchStatisticsId) return;
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/playerMatchStatistics`, {
        matchStatisticsId: currentMatchStatisticsId,
        playerId: parseInt(playerId)
      });

      // Add the new player stats to the existing stats
      setPlayerStats(prevStats => [...prevStats, response.data]);
      
      setSelectedBowler("");
    } catch (error) {
      console.error('Error adding bowler:', error);
    }
  };

  // Initialize localPlayerStats when playerStats changes
  useEffect(() => {
    setLocalPlayerStats(playerStats);
  }, [playerStats]);

  // Add a function to handle local updates
  const handleLocalStatChange = (playerMatchStatisticsId: number, updatedStats: Partial<PlayerMatchStats>) => {
    setLocalPlayerStats(prevStats => 
      prevStats.map(player => 
        player.playerMatchStatisticsId === playerMatchStatisticsId 
          ? { ...player, ...updatedStats }
          : player
      )
    );
  };

  // Modify handleUpdatePlayerStats to validate the ID first
  const handleUpdatePlayerStats = async (playerMatchStatisticsId: number, updatedStats: Partial<PlayerMatchStats>) => {
    try {
      if (!playerMatchStatisticsId) {
        console.error('Invalid playerMatchStatisticsId:', playerMatchStatisticsId);
        return;
      }

      console.log("Updating Player Match Statistics for ID:", playerMatchStatisticsId);
      console.log("Update data:", updatedStats);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/playerMatchStatistics/${playerMatchStatisticsId}`,
        updatedStats
      );

      if (response.status === 200) {
        console.log("Successfully updated player stats");
      }
    } catch (error) {
      console.error('Error updating player stats:', error);
    }
  };

  if (loading) {
    return <div>Loading matches...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-dark-olive">Matches</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select 
            defaultValue="all" 
            onValueChange={(value) => setSelectedStatus(value as MatchStatus | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Matches</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredMatches.map((match) => (
          <Card key={match.matchId} className="border-olive/20 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Left side - Match info */}
                <div className="flex-1">
                  {/* Date and Time Row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-olive" />
                        <span className="text-sm font-medium text-olive">
                          {format(new Date(match.matchDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-olive" />
                        <span className="text-sm font-medium text-olive">
                          {format(new Date(match.matchDate), 'hh:mm a')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Teams Section */}
                  <div className="flex items-center justify-between px-4">
                    <div className="text-center space-y-2">
                      <Button
                        variant="ghost"
                        className="h-16 w-16 bg-light-teal rounded-full flex items-center justify-center mx-auto hover:bg-teal"
                        onClick={() => {
                          setSelectedTeamName(match.team1Name);
                          handleCreateStatistics(match.matchId, match.team1Id);
                        }}
                      >
                        <span className="font-bold text-xl text-dark-olive">
                          {getTeamInitials(match.team1Name)}
                        </span>
                      </Button>
                      <h3 className="font-medium text-dark-olive text-sm">
                        {match.team1Name}
                      </h3>
                    </div>
                    <div className="text-center px-4">
                      <div className="text-2xl font-bold text-dark-olive opacity-50">VS</div>
                    </div>
                    <div className="text-center space-y-2">
                      <Button
                        variant="ghost"
                        className="h-16 w-16 bg-light-teal rounded-full flex items-center justify-center mx-auto hover:bg-teal"
                        onClick={() => {
                          setSelectedTeamName(match.team2Name);
                          handleCreateStatistics(match.matchId, match.team2Id);
                        }}
                      >
                        <span className="font-bold text-xl text-dark-olive">
                          {getTeamInitials(match.team2Name)}
                        </span>
                      </Button>
                      <h3 className="font-medium text-dark-olive text-sm">
                        {match.team2Name}
                      </h3>
                    </div>
                  </div>

                  {/* Venue Section */}
                  <div className="mt-6 flex justify-center">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-olive" />
                      <span className="text-sm font-medium text-olive">
                        {match.venueName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side - Status and Buttons */}
                <div className="flex flex-col gap-3 min-w-[140px] items-center">
                  <div className={getStatusStyles(getMatchStatus(new Date(match.matchDate).toISOString()))}>
                    {getMatchStatus(new Date(match.matchDate).toISOString()).toUpperCase()}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-center justify-center font-medium" 
                    asChild
                  >
                    <Link href={`/matches/${match.matchId}`}>
                      {getMatchStatus(new Date(match.matchDate).toISOString()) === 'upcoming' ? (
                        <span className="flex items-center gap-2">
                          Match Details
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          View Scorecard
                        </span>
                      )}
                    </Link>
                  </Button>
                  
                  {getMatchStatus(new Date(match.matchDate).toISOString()) === 'upcoming' && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          className="w-full bg-light-teal hover:bg-teal text-dark-olive font-medium"
                        >
                          Conclude Match
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Conclude Match</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="winner">Select Winner</Label>
                            <Select
                              value={selectedWinner}
                              onValueChange={setSelectedWinner}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select winning team" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={match.team1Id.toString()}>
                                  {match.team1Name}
                                </SelectItem>
                                <SelectItem value={match.team2Id.toString()}>
                                  {match.team2Name}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="description">Match Description</Label>
                            <Textarea
                              id="description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="Enter match summary..."
                              className="h-32"
                            />
                          </div>
                          <Button
                            onClick={() => handleConcludeMatch(match.matchId.toString())}
                            className="bg-light-teal hover:bg-teal text-dark-olive font-medium"
                          >
                            Submit
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={statisticsDialogOpen} onOpenChange={setStatisticsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Match Statistics</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-8">
            {/* Batting Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold text-dark-olive">{battingTeamName} - Batting</h3>
                  <p className="text-sm text-olive/60">Add and manage batting statistics</p>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      size="sm"
                      className="bg-light-teal hover:bg-teal text-dark-olive font-medium flex items-center gap-2"
                    >
                      <span>Add Batter</span>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Select
                      value={selectedBatsman}
                      onValueChange={(value) => {
                        setSelectedBatsman(value);
                        handleAddBatsman(value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select player" />
                      </SelectTrigger>
                      <SelectContent>
                        {battingSquad
                          .filter(player => !playerStats.some(ps => ps.playerId === player.playerId)) // Only show players not already added
                          .map((player) => {
                            if (!player?.playerId) return null;
                            return (
                              <SelectItem 
                                key={player.playerId} 
                                value={player.playerId.toString()}
                              >
                                {player?.playerName || 'Unknown Player'}
                              </SelectItem>
                            );
                        })}
                      </SelectContent>
                    </Select>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="overflow-x-auto rounded-lg border border-olive/20">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-light-teal/20">
                      <th className="p-3 text-left font-semibold text-dark-olive">Batter</th>
                      <th className="p-3 text-center font-semibold text-dark-olive">Status</th>
                      <th className="p-3 text-center font-semibold text-dark-olive">Runs</th>
                      <th className="p-3 text-center font-semibold text-dark-olive">Balls</th>
                      <th className="p-3 text-center font-semibold text-dark-olive">4s</th>
                      <th className="p-3 text-center font-semibold text-dark-olive">6s</th>
                      <th className="p-3 text-center font-semibold text-dark-olive">SR</th>
                      <th className="p-3 text-center font-semibold text-dark-olive">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localPlayerStats.map((player) => (
                      <tr key={player.playerMatchStatisticsId} className="border-t border-olive/20 hover:bg-light-teal/5">
                        <td className="p-3 font-medium text-dark-olive">{player.fullName}</td>
                        <td className="p-3">
                          <select
                            value={player.battingStatus}
                            onChange={(e) => handleLocalStatChange(player.playerMatchStatisticsId, {
                              battingStatus: e.target.value
                            })}
                            className="w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-teal focus:border-transparent"
                          >
                            <option value="Not Out">Not Out</option>
                            <option value="Out">Out</option>
                            <option value="DNB">DNB</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={player.runsScored}
                            onChange={(e) => handleLocalStatChange(player.playerMatchStatisticsId, {
                              runsScored: parseInt(e.target.value) || 0
                            })}
                            className="w-20 p-2 border rounded-md text-center bg-white focus:ring-2 focus:ring-teal focus:border-transparent"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={player.ballsFaced}
                            onChange={(e) => handleLocalStatChange(player.playerMatchStatisticsId, {
                              ballsFaced: parseInt(e.target.value) || 0
                            })}
                            className="w-20 p-2 border rounded-md text-center bg-white focus:ring-2 focus:ring-teal focus:border-transparent"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={player.fours}
                            onChange={(e) => handleLocalStatChange(player.playerMatchStatisticsId, {
                              fours: parseInt(e.target.value) || 0
                            })}
                            className="w-16 p-1 border rounded text-right"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={player.sixes}
                            onChange={(e) => handleLocalStatChange(player.playerMatchStatisticsId, {
                              sixes: parseInt(e.target.value) || 0
                            })}
                            className="w-16 p-1 border rounded text-right"
                          />
                        </td>
                        <td className="p-2 text-right">
                          {player.ballsFaced > 0 
                            ? ((player.runsScored / player.ballsFaced) * 100).toFixed(2) 
                            : '0.00'}
                        </td>
                        <td className="p-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              // Add validation before calling the update function
                              if (player.playerMatchStatisticsId) {
                                handleUpdatePlayerStats(player.playerMatchStatisticsId, {
                                  runsScored: player.runsScored,
                                  ballsFaced: player.ballsFaced,
                                  fours: player.fours,
                                  sixes: player.sixes,
                                  battingStatus: player.battingStatus
                                });
                              } else {
                                console.error('Missing playerMatchStatisticsId for player:', player);
                              }
                            }}
                            className="hover:bg-green-100"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bowling Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-dark-olive">{bowlingTeamName} - Bowling</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      size="sm"
                      className="bg-light-teal hover:bg-teal text-dark-olive font-medium"
                    >
                      Add Bowler
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Select
                      value={selectedBowler}
                      onValueChange={(value) => {
                        setSelectedBowler(value);
                        handleAddBowler(value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select player" />
                      </SelectTrigger>
                      <SelectContent>
                        {bowlingSquad.map((player) => {
                          if (!player?.playerId) return null;

                          return (
                            <SelectItem 
                              key={player.playerId} 
                              value={player.playerId.toString()}
                            >
                              {player?.playerName || 'Unknown Player'}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-light-teal/20">
                      <th className="p-2 text-left">Bowler</th>
                      <th className="p-2 text-right">Overs</th>
                      <th className="p-2 text-right">Maidens</th>
                      <th className="p-2 text-right">Runs</th>
                      <th className="p-2 text-right">Wickets</th>
                      <th className="p-2 text-right">Economy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localPlayerStats
                      .filter(player => player.oversBowled > 0)
                      .map((player) => (
                        <tr key={player.playerMatchStatisticsId} className="border-b">
                          <td className="p-2">{player.fullName}</td>
                          <td className="p-2">
                            <input
                              type="number"
                              step="0.1"
                              value={player.oversBowled}
                              onChange={(e) => handleLocalStatChange(player.playerMatchStatisticsId, {
                                oversBowled: parseFloat(e.target.value) || 0
                              })}
                              className="w-16 p-1 border rounded text-right"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={player.maidens}
                              onChange={(e) => handleLocalStatChange(player.playerMatchStatisticsId, {
                                maidens: parseInt(e.target.value) || 0
                              })}
                              className="w-16 p-1 border rounded text-right"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={player.runsConceded}
                              onChange={(e) => handleLocalStatChange(player.playerMatchStatisticsId, {
                                runsConceded: parseInt(e.target.value) || 0
                              })}
                              className="w-16 p-1 border rounded text-right"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={player.wicketsTaken}
                              onChange={(e) => handleLocalStatChange(player.playerMatchStatisticsId, {
                                wicketsTaken: parseInt(e.target.value) || 0
                              })}
                              className="w-16 p-1 border rounded text-right"
                            />
                          </td>
                          <td className="p-2 text-right">
                            {player.oversBowled > 0 
                              ? (player.runsConceded / player.oversBowled).toFixed(2) 
                              : '0.00'}
                          </td>
                          <td className="p-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                // Add validation before calling the update function
                                if (player.playerMatchStatisticsId) {
                                  handleUpdatePlayerStats(player.playerMatchStatisticsId, {
                                    oversBowled: player.oversBowled,
                                    maidens: player.maidens,
                                    runsConceded: player.runsConceded,
                                    wicketsTaken: player.wicketsTaken
                                  });
                                } else {
                                  console.error('Missing playerMatchStatisticsId for player:', player);
                                }
                              }}
                              className="hover:bg-green-100"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

