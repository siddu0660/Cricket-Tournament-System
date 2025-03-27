"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Award, CalendarDays, MapPin, Users, Search, Trophy } from "lucide-react"
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState, useEffect } from "react"
import { Tournament } from '@/types/tournament'
import { fetchTournaments } from '@/services/fetchtournamentService'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Venue } from '@/types/venue'
import { fetchVenues } from '@/services/fetchVenueService'
import { Team } from '@/types/tour'
import { fetchTournamentTeams, generateGroupFixtures } from '@/services/teamService'
import { Fixture } from '@/types/tour'

export default function TournamentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [formatFilter, setFormatFilter] = useState("all")
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [venues, setVenues] = useState<Venue[]>([])
  const [tournamentTeams, setTournamentTeams] = useState<Team[]>([])
  const [generatedFixtures, setGeneratedFixtures] = useState<Fixture[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedVenue, setSelectedVenue] = useState<string>('')
  const [isLoadingTeams, setIsLoadingTeams] = useState(false)
  const [isFixturesGenerated, setIsFixturesGenerated] = useState(false)

  useEffect(() => {
    const loadTournaments = async () => {
      try {
        const data = await fetchTournaments()
        setTournaments(data)
      } catch (err) {
        setError('Failed to load tournaments')
      } finally {
        setIsLoading(false)
      }
    }

    const loadVenues = async () => {
      try {
        const venueData = await fetchVenues()
        setVenues(venueData)
      } catch (err) {
        setError('Failed to load venues')
      }
    }

    loadTournaments()
    loadVenues()
  }, [])

  const fetchTeams = async (tournamentName: string) => {
    try {
      setIsLoadingTeams(true)
      setError(null)
      
      console.log('Fetching teams for tournament:', tournamentName)
      const data = await fetchTournamentTeams(tournamentName)
      console.log('Fetched teams data:', data)
      
      const teams = Array.isArray(data) ? data : data.teams
      
      if (!teams || !Array.isArray(teams)) {
        throw new Error('Invalid teams data received')
      }
      
      if (teams.length === 0) {
        throw new Error('No teams found for this tournament')
      }
      
      setTournamentTeams(teams)
      return teams
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch teams'
      console.error('Failed to fetch teams:', errorMessage)
      setError(errorMessage)
      throw error
    } finally {
      setIsLoadingTeams(false)
    }
  }

  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch = tournament.tournamentName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFormat = formatFilter === "all" || tournament.tourFormat.toLowerCase() === formatFilter.toLowerCase()
    return matchesSearch && matchesFormat
  })

  const renderTournamentCard = (tournament: Tournament) => (
    <Card key={tournament.tournamentId} className="border-olive/20 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-dark-olive">{tournament.tournamentName}</CardTitle>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              new Date(tournament.startDate) <= new Date() && new Date(tournament.endDate) >= new Date()
                ? "bg-green-100 text-green-800"
                : new Date(tournament.startDate) > new Date()
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {new Date(tournament.startDate) <= new Date() && new Date(tournament.endDate) >= new Date()
              ? "Active"
              : new Date(tournament.startDate) > new Date()
                ? "Upcoming"
                : "Completed"}
          </div>
        </div>
        <CardDescription className="flex items-center gap-1">
          <CalendarDays className="h-4 w-4" />
          <span>
            {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
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
            <span>{tournament.tourFormat} Format</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/tournaments/${tournament.tournamentId}`}>View Details</Link>
        </Button>
        
        <Dialog onOpenChange={(open) => {
          if (open) {
            setGeneratedFixtures([]);
            setTournamentTeams([]);
            setError(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm" className="w-full">
              Manage Fixtures
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-dark-olive flex items-center gap-2">
                <Award className="h-6 w-6" />
                {tournament.tournamentName} - Fixture Management
              </DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="group" className="w-full">
              <TabsList className="w-full justify-start mb-4">
                <TabsTrigger value="group" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Group Matches
                </TabsTrigger>
                <TabsTrigger value="knockout" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Knockout Matches
                </TabsTrigger>
              </TabsList>

              <TabsContent value="group">
                <div className="space-y-6">
                  {!isFixturesGenerated && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-dark-olive" />
                          Generate Group Stage Fixtures
                        </CardTitle>
                        <CardDescription>
                          Generate fixtures for the group stage of the tournament automatically
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button 
                          className="w-full bg-light-teal hover:bg-teal text-dark-olive"
                          disabled={isLoadingTeams}
                          onClick={async () => {
                            if (tournament.tournamentName) {
                              try {
                                setError(null);
                                setGeneratedFixtures([]);
                                const teams = await fetchTeams(tournament.tournamentName);
                                if (!teams || teams.length < 2) {
                                  setError('Need at least 2 teams to generate fixtures');
                                  return;
                                }
                                const fixtures = generateGroupFixtures(teams);
                                setGeneratedFixtures(fixtures);
                                setIsFixturesGenerated(true);
                              } catch (error) {
                                setError(error instanceof Error ? error.message : 'Failed to generate fixtures');
                              }
                            }
                          }}
                        >
                          {isLoadingTeams ? 'Loading Teams...' : 'Generate Group Fixtures'}
                        </Button>

                        {tournamentTeams.length > 0 && (
                          <p className="mt-2 text-sm text-gray-500">
                            {tournamentTeams.length} teams loaded
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {error && (
                    <div className="p-4 text-sm text-red-800 bg-red-100 rounded-md">
                      {error}
                    </div>
                  )}

                  {generatedFixtures.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CalendarDays className="h-5 w-5 text-dark-olive" />
                          Generated Fixtures ({generatedFixtures.length})
                        </CardTitle>
                        <CardDescription>Assign venues and match times for each fixture</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {generatedFixtures.map((fixture, index) => (
                          <Card key={fixture.fixtureId} className="border-olive/20">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                  <span className="text-lg font-semibold text-dark-olive">Match {index + 1}</span>
                                  <span className="px-4 py-2 bg-light-teal/20 rounded-md">
                                    {fixture.team1.teamName} vs {fixture.team2.teamName}
                                  </span>
                                </div>
                                <div className="flex gap-4">
                                  <Select
                                    value={fixture.venueId?.toString()}
                                    onValueChange={(value) => {
                                      const updatedFixtures = [...generatedFixtures];
                                      updatedFixtures[index] = {
                                        ...updatedFixtures[index],
                                        venueId: parseInt(value)
                                      };
                                      setGeneratedFixtures(updatedFixtures);
                                    }}
                                  >
                                    <SelectTrigger className="w-[200px]">
                                      <SelectValue placeholder="Select venue" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {venues.map((venue) => (
                                        <SelectItem key={venue.venueId} value={venue.venueId.toString()}>
                                          {venue.venueName}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Input 
                                    type="datetime-local"
                                    className="w-[200px]"
                                    value={fixture.matchDate}
                                    onChange={(e) => {
                                      const updatedFixtures = [...generatedFixtures];
                                      updatedFixtures[index] = {
                                        ...updatedFixtures[index],
                                        matchDate: e.target.value
                                      };
                                      setGeneratedFixtures(updatedFixtures);
                                    }}
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="knockout">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Knockout Match</CardTitle>
                    <CardDescription>Create individual knockout stage matches</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Match Date & Time</label>
                        <Input type="datetime-local" className="w-full" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Venue</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select venue" />
                          </SelectTrigger>
                          <SelectContent>
                            {venues.map((venue) => (
                              <SelectItem key={venue.venueId} value={venue.venueId.toString()}>
                                {venue.venueName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Team 1</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select team" />
                          </SelectTrigger>
                          <SelectContent>
                            {tournamentTeams.map((team) => (
                              <SelectItem key={team.teamId} value={team.teamId.toString()}>
                                {team.teamName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Team 2</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select team" />
                          </SelectTrigger>
                          <SelectContent>
                            {tournamentTeams.map((team) => (
                              <SelectItem key={team.teamId} value={team.teamId.toString()}>
                                {team.teamName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button className="w-full bg-light-teal hover:bg-teal text-dark-olive">
                      Add Knockout Match
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-dark-olive" />
            <span className="text-xl font-bold">Tournaments</span>
          </div>
          <div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
              <Select value={formatFilter} onValueChange={setFormatFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Formats</SelectItem>
                    <SelectItem value="t20">T20</SelectItem>
                    <SelectItem value="odi">ODI</SelectItem>
                    <SelectItem value="test">Test</SelectItem>
                    <SelectItem value="100-ball">100-ball</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Search tournaments..."
                  className="w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="secondary" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <Button asChild className="bg-light-teal hover:bg-teal text-dark-olive">
                <Link href="/tournaments/create">Create Tournament</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments.length > 0 ? (
                filteredTournaments.map(renderTournamentCard)
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No tournaments found matching your criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="active" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments.filter(t => 
                new Date(t.startDate) <= new Date() && new Date(t.endDate) >= new Date()
              ).length > 0 ? (
                filteredTournaments
                  .filter(t => 
                    new Date(t.startDate) <= new Date() && new Date(t.endDate) >= new Date()
                  )
                  .map(renderTournamentCard)
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No active tournaments found matching your criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="upcoming" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments.filter(t => 
                new Date(t.startDate) > new Date()
              ).length > 0 ? (
                filteredTournaments
                  .filter(t => new Date(t.startDate) > new Date())
                  .map(renderTournamentCard)
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No upcoming tournaments found matching your criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="completed" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments.filter(t => 
                new Date(t.endDate) < new Date()
              ).length > 0 ? (
                filteredTournaments
                  .filter(t => new Date(t.endDate) < new Date())
                  .map(renderTournamentCard)
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No completed tournaments found matching your criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}