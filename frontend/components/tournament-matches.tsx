"use client"

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { CalendarDays, Clock, MapPin } from "lucide-react"
import { Match } from '@/types/getMatch';
import { getTournamentMatches } from '@/services/fetchTournamentMatchesService';
import { format, isBefore, isToday, startOfDay } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { concludeMatch } from '@/services/matchConcludeService';

interface TournamentMatchesProps {
  tournamentId: string;
}

// Add this type for match status
type MatchStatus = 'upcoming' | 'ongoing' | 'completed';

export default function TournamentMatches({ tournamentId }: TournamentMatchesProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<MatchStatus | 'all'>('all');
  const [selectedWinner, setSelectedWinner] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  // Add this helper function for status styling
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
                      <div className="h-16 w-16 bg-light-teal rounded-full flex items-center justify-center mx-auto">
                        <span className="font-bold text-xl text-dark-olive">
                          {getTeamInitials(match.team1Name)}
                        </span>
                      </div>
                      <h3 className="font-medium text-dark-olive text-sm">
                        {match.team1Name}
                      </h3>
                    </div>
                    <div className="text-center px-4">
                      <div className="text-2xl font-bold text-dark-olive opacity-50">VS</div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="h-16 w-16 bg-light-teal rounded-full flex items-center justify-center mx-auto">
                        <span className="font-bold text-xl text-dark-olive">
                          {getTeamInitials(match.team2Name)}
                        </span>
                      </div>
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
    </div>
  )
}

