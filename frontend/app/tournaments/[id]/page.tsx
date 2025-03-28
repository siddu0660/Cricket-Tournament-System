"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { CalendarDays, ChevronLeft, MapPin, Trophy, Users, Clock, Award } from "lucide-react"
import TournamentMatches from "@/components/tournament-matches"
import TournamentStandings from "@/components/tournament-standings"
import TournamentStats from "@/components/tournament-stats"
import { getTournamentById } from "@/services/fetchTournamentIdService"
import { Tournament } from "@/types/tournament"
import { useEffect, useState, use } from "react"
import { format } from 'date-fns'

export default function TournamentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const data = await getTournamentById(id);
        setTournament(data);
      } catch (err) {
        setError('Failed to fetch tournament details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (error || !tournament) {
    return <div className="container mx-auto px-4 py-8">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" className="mb-4 text-dark-olive hover:text-dark-olive/80" asChild>
          <Link href="/tournaments">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Tournaments
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-dark-olive">{tournament.tournamentName}</h1>
              <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</div>
            </div>
            <p className="text-olive">The Indian Premier League (IPL) is a professional Twenty20 cricket league in India contested during April and May of every year by franchise teams representing Indian cities</p>
          </div>
          <div className="flex gap-2">
            {/* <Button variant="outline" className="border-dark-olive text-dark-olive" asChild>
              <Link href={`/tournaments/${id}/edit`}>Edit</Link>
            </Button>
            <Button className="bg-light-teal hover:bg-teal text-dark-olive" asChild>
              <Link href={`/tournaments/${id}/matches/create`}>Add Match</Link>
            </Button> */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-olive/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CalendarDays className="h-5 w-5 text-teal" />
              <div>
                <div className="text-sm text-olive">Tournament Dates</div>
                <div className="font-medium text-dark-olive">
                  {format(new Date(tournament.startDate), 'MMM d, yyyy')} - {format(new Date(tournament.endDate), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-olive/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-5 w-5 text-teal" />
              <div>
                <div className="text-sm text-olive">Location</div>
                <div className="font-medium text-dark-olive">{tournament.tourLocation}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-olive/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="h-5 w-5 text-teal" />
              <div>
                <div className="text-sm text-olive">Format</div>
                <div className="font-medium text-dark-olive">{tournament.tourFormat}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="matches" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="standings">Standings</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>
        <TabsContent value="matches" className="mt-0">
          <TournamentMatches tournamentId={id} />
        </TabsContent>
        <TabsContent value="standings" className="mt-0">
          <TournamentStandings tournamentId={id} />
        </TabsContent>
        <TabsContent value="stats" className="mt-0">
          <TournamentStats tournamentId={id} />
        </TabsContent>
        <TabsContent value="teams" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <Card key={i} className="border-olive/20 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-dark-olive">Team {i + 1}</CardTitle>
                  <CardDescription>Chennai Super Kings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-olive" />
                      <span>25 Players</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-olive" />
                      <span>4 IPL Titles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-olive" />
                      <span>Since 2008</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

