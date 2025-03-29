"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CalendarDays, Award, Users, MapPin, BarChart3, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { Tournament } from "@/types/tournament"
import { Match } from "@/types/getAllMatches"
import { getActiveTournaments } from "@/services/getActiveTournamentsService"
import { matchService } from "@/services/getAllMatchesService"
import { format } from "date-fns"

export default function Home() {
  const [activeTournaments, setActiveTournaments] = useState<Tournament[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchesError, setMatchesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActiveTournaments = async () => {
      try {
        const tournaments = await getActiveTournaments();
        setActiveTournaments(tournaments);
        setError(null);
      } catch (err) {
        setError('Failed to fetch active tournaments');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveTournaments();
  }, []);

  const getTeamAbbreviation = (teamName: string): string => {
    const abbreviations: { [key: string]: string } = {
      "Mumbai Indians": "MI",
      "Kolkata Knight Riders": "KKR",
      "Chennai Super Kings": "CSK",
      "Royal Challengers Bangalore": "RCB",
      "Delhi Capitals": "DC",
      "Sunrisers Hyderabad": "SRH",
      "Rajasthan Royals": "RR",
      "Kings XI Punjab": "KXIP",
      "Gujarat Titans": "GT",
      "Lucknow Super Giants": "LSG",
      "Punjab Kings": "PBKS",
      "India": "IND",
      "Pakistan": "PAK",
      "Australia": "AUS",
      "England": "ENG",
      "South Africa": "SA",
      "New Zealand": "NZ",
      "West Indies": "WI",
      "Sri Lanka": "SL",
      "Bangladesh": "BAN",
      "Afghanistan": "AFG",
      "Zimbabwe": "ZIM",
      "Netherlands": "NED",
      "Ireland": "IRE",
      "Scotland": "SCO",
      "Hong Kong": "HK",
      "Nepal": "NEP",
      "Oman": "OMA",
      "Papua New Guinea": "PNG",
      "United Arab Emirates": "UAE",
      "Zambia": "ZAM"
    };
  
    return abbreviations[teamName] || teamName.split(' ').map(word => word[0]).join('');
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const allMatches = await matchService.getAllMatches();
        // Sort matches by date and get upcoming matches (today and future)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcomingMatches = allMatches
          .filter(match => new Date(match.matchDate) >= today)
          .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime())
          .slice(0, 4); // Get only 4 upcoming matches
          
        setMatches(upcomingMatches);
        setMatchesError(null);
      } catch (err) {
        setMatchesError('Failed to fetch matches');
        console.error(err);
      } finally {
        setMatchesLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="bg-gradient-to-r from-dark-olive to-teal rounded-lg p-8 text-beige">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Cricket Tournament Manager</h1>
            <p className="text-lg mb-6">
              A comprehensive platform for managing cricket tournaments, teams, players, and statistics.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-light-teal hover:bg-teal text-dark-olive">
                <Link href="/tournaments/create">Create Tournament</Link>
              </Button>
              <Button asChild variant="outline" className="bg-light-teal hover:bg-teal text-dark-olive">
                <Link href="/tournaments">View Tournaments</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-dark-olive">Active Tournaments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8 text-olive">Loading tournaments...</div>
          ) : error ? (
            <div className="col-span-full text-center py-8 text-red-500">{error}</div>
          ) : activeTournaments.length === 0 ? (
            <div className="col-span-full text-center py-8 text-olive">No active tournaments found</div>
          ) : (
            activeTournaments.slice(2, 5).map((tournament) => (
              <Card key={tournament.tournamentId} className="border-olive/20 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-dark-olive">{tournament.tournamentName}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                      {format(new Date(tournament.startDate), 'MMM d')} - {format(new Date(tournament.endDate), 'MMM d, yyyy')}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-olive" />
                      <span>{tournament.tourLocation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-olive" />
                      <span>{tournament.numberOfTeams} Teams</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-olive" />
                      <span>{tournament.tourFormat}</span>
                    </div>
                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href={`/tournaments/${tournament.tournamentId}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        <div className="mt-6 text-center">
          <Button asChild variant="outline" className="border-dark-olive text-dark-olive">
            <Link href="/tournaments">View All Tournaments</Link>
          </Button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-dark-olive">Upcoming Matches</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {matchesLoading ? (
            <div className="col-span-full text-center py-8 text-olive">Loading matches...</div>
          ) : matchesError ? (
            <div className="col-span-full text-center py-8 text-red-500">{matchesError}</div>
          ) : matches.length === 0 ? (
            <div className="col-span-full text-center py-8 text-olive">No upcoming matches found</div>
          ) : (
            matches.map((match) => (
              <Card key={match.matchId} className="border-olive/20 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-olive" />
                      <span className="text-sm text-olive">{match.tournamentName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-olive" />
                      <span className="text-sm text-olive">
                        {format(new Date(match.matchDate), 'h:mm a')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                  <div className="text-center">
                      <div className="h-12 w-12 bg-light-teal rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="font-bold text-dark-olive">
                          {getTeamAbbreviation(match.team1Name)}
                        </span>
                      </div>
                      <h3 className="font-medium text-dark-olive">{match.team1Name}</h3>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-dark-olive">VS</div>
                    </div>
                    <div className="text-center">
                      <div className="h-12 w-12 bg-light-teal rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="font-bold text-dark-olive">
                          {getTeamAbbreviation(match.team2Name)}
                        </span>
                      </div>
                      <h3 className="font-medium text-dark-olive">{match.team2Name}</h3>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-olive mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{match.venueName}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-olive">
                      <CalendarDays className="h-4 w-4" />
                      <span>{format(new Date(match.matchDate), 'MMMM d, yyyy')}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href={`/matches/${match.matchId}`}>Match Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        <div className="mt-6 text-center">
          <Button asChild variant="outline" className="border-dark-olive text-dark-olive">
            <Link href="/matches">View All Matches</Link>
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-olive/20">
          <CardHeader>
            <CardTitle className="text-dark-olive flex items-center gap-2">
              <Award className="h-5 w-5 text-teal" />
              Tournaments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-dark-olive">5</div>
            <p className="text-olive">Active tournaments</p>
          </CardContent>
        </Card>
        <Card className="border-olive/20">
          <CardHeader>
            <CardTitle className="text-dark-olive flex items-center gap-2">
              <Users className="h-5 w-5 text-teal" />
              Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-dark-olive">24</div>
            <p className="text-olive">Registered teams</p>
          </CardContent>
        </Card>
        <Card className="border-olive/20">
          <CardHeader>
            <CardTitle className="text-dark-olive flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-teal" />
              Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-dark-olive">156</div>
            <p className="text-olive">Completed matches</p>
          </CardContent>
        </Card>
        <Card className="border-olive/20">
          <CardHeader>
            <CardTitle className="text-dark-olive flex items-center gap-2">
              <MapPin className="h-5 w-5 text-teal" />
              Venues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-dark-olive">12</div>
            <p className="text-olive">Active venues</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

