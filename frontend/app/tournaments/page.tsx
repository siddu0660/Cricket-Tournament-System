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

export default function TournamentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [formatFilter, setFormatFilter] = useState("all")
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

    loadTournaments()
  }, [])

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
      <CardFooter>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/tournaments/${tournament.tournamentId}`}>View Details</Link>
        </Button>
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