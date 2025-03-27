"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Award, CalendarDays, MapPin, Users, Search } from "lucide-react"
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Manage Tournament Fixtures - {tournament.tournamentName}</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="group" className="w-full">
              <TabsList>
                <TabsTrigger value="group">Group Matches</TabsTrigger>
                <TabsTrigger value="knockout">Knockout Matches</TabsTrigger>
              </TabsList>
              <TabsContent value="group">
                <div className="space-y-4">
                  <Button 
                    className="w-full"
                    disabled={isLoadingTeams}
                    onClick={async () => {
                      if (tournament.tournamentName) {
                        try {
                          setError(null);
                          setGeneratedFixtures([]);
                          const teams = await fetchTeams(tournament.tournamentName);
                          console.log('Teams fetched for', tournament.tournamentName, ':', teams);

                          if (!teams || teams.length < 2) {
                            setError('Need at least 2 teams to generate fixtures');
                            return;
                          }

                          const fixtures = generateGroupFixtures(teams);
                          console.log('Fixtures generated for', tournament.tournamentName, ':', fixtures);

                          if (fixtures.length === 0) {
                            setError('Failed to generate fixtures');
                            return;
                          }

                          setGeneratedFixtures(fixtures);
                        } catch (error) {
                          console.error('Error:', error);
                          setError(error instanceof Error ? error.message : 'Failed to generate fixtures');
                        }
                      }
                    }}
                  >
                    {isLoadingTeams ? 'Loading Teams...' : 'Generate Group Fixtures'}
                  </Button>

                  {tournamentTeams.length > 0 && (
                    <div className="mt-2 text-sm text-gray-500">
                      Teams loaded: {tournamentTeams.length}
                    </div>
                  )}

                  {isLoadingTeams && (
                    <div className="mt-4 text-center">
                      <p>Loading teams...</p>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 mt-4 text-sm text-red-800 bg-red-100 rounded-md">
                      {error}
                    </div>
                  )}

                  {generatedFixtures.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Generated Fixtures ({generatedFixtures.length})</h3>
                      <div className="space-y-4">
                        {generatedFixtures.map((fixture, index) => (
                          <div key={fixture.fixtureId} className="p-4 border rounded">
                            <div className="flex items-center justify-between gap-4">
                              <p className="font-medium">Match {index + 1}</p>
                              <p className="font-medium">{fixture.team1.teamName} vs {fixture.team2.teamName}</p>
                              <div className="flex gap-4">
                                <div className="w-48">
                                  <Select
                                    value={fixture.venueId?.toString()}
                                    onValueChange={(value) => {
                                      const updatedFixtures = [...generatedFixtures]
                                      updatedFixtures[index] = {
                                        ...updatedFixtures[index],
                                        venueId: parseInt(value)
                                      }
                                      setGeneratedFixtures(updatedFixtures)
                                    }}
                                  >
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
                                <Input 
                                  type="datetime-local"
                                  className="w-48"
                                  value={fixture.matchDate}
                                  onChange={(e) => {
                                    const updatedFixtures = [...generatedFixtures]
                                    updatedFixtures[index] = {
                                      ...updatedFixtures[index],
                                      matchDate: e.target.value
                                    }
                                    setGeneratedFixtures(updatedFixtures)
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="knockout">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Match Date</label>
                      <Input type="datetime-local" />
                    </div>
                    <div>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Team 1</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Add tournament teams here */}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Team 2</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Add tournament teams here */}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="w-full">
                    Add Knockout Match
                  </Button>
                </div>
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