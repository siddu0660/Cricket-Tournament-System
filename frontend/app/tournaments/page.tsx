"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { CalendarDays, MapPin, Trophy, Users } from "lucide-react"
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react"

export default function TournamentsPage() {
  // State for search input and format filter
  const [searchQuery, setSearchQuery] = useState("")
  const [formatFilter, setFormatFilter] = useState("all")

  // Mock data for tournaments
  const tournaments = [
    {
      id: 1,
      name: "IPL 2023",
      startDate: "Apr 1, 2023",
      endDate: "May 30, 2023",
      location: "Multiple venues, India",
      teams: 10,
      format: "T20",
      status: "active",
    },
    {
      id: 2,
      name: "World Cup 2023",
      startDate: "Oct 5, 2023",
      endDate: "Nov 19, 2023",
      location: "India",
      teams: 10,
      format: "ODI",
      status: "upcoming",
    },
    {
      id: 3,
      name: "Big Bash League 2022-23",
      startDate: "Dec 13, 2022",
      endDate: "Feb 4, 2023",
      location: "Australia",
      teams: 8,
      format: "T20",
      status: "completed",
    },
    {
      id: 4,
      name: "The Hundred 2023",
      startDate: "Aug 1, 2023",
      endDate: "Aug 27, 2023",
      location: "England",
      teams: 8,
      format: "100-ball",
      status: "upcoming",
    },
    {
      id: 5,
      name: "Pakistan Super League 2023",
      startDate: "Feb 13, 2023",
      endDate: "Mar 19, 2023",
      location: "Pakistan",
      teams: 6,
      format: "T20",
      status: "completed",
    },
    {
      id: 6,
      name: "Caribbean Premier League 2023",
      startDate: "Aug 31, 2023",
      endDate: "Oct 9, 2023",
      location: "Caribbean",
      teams: 6,
      format: "T20",
      status: "upcoming",
    },
  ]

  // Filter tournaments based on search query and format filter
  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFormat = formatFilter === "all" || tournament.format.toLowerCase() === formatFilter.toLowerCase()
    return matchesSearch && matchesFormat
  })

  // Render tournament card
  const renderTournamentCard = (tournament: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; status: string; startDate: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; endDate: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; location: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; teams: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; format: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }) => (
    <Card key={tournament.id} className="border-olive/20 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-dark-olive">{tournament.name}</CardTitle>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              tournament.status === "active"
                ? "bg-green-100 text-green-800"
                : tournament.status === "upcoming"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
          </div>
        </div>
        <CardDescription className="flex items-center gap-1">
          <CalendarDays className="h-4 w-4" />
          <span>
            {tournament.startDate} - {tournament.endDate}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-olive" />
            <span>{tournament.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-olive" />
            <span>{tournament.teams} Teams</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-olive" />
            <span>{tournament.format} Format</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/tournaments/${tournament.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-olive mb-2">Tournaments</h1>
          <p className="text-olive">Manage all cricket tournaments in one place</p>
        </div>
        <Button asChild className="mt-4 md:mt-0 bg-light-teal hover:bg-teal text-dark-olive">
          <Link href="/tournaments/create">Create Tournament</Link>
        </Button>
      </div>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input 
            placeholder="Search tournaments..." 
            className="md:max-w-xs" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select 
            value={formatFilter} 
            onValueChange={setFormatFilter}
          >
            <SelectTrigger className="md:w-[180px]">
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
        </div>
      </div>

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
            {filteredTournaments.filter((t) => t.status === "active").length > 0 ? (
              filteredTournaments
                .filter((t) => t.status === "active")
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
            {filteredTournaments.filter((t) => t.status === "upcoming").length > 0 ? (
              filteredTournaments
                .filter((t) => t.status === "upcoming")
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
            {filteredTournaments.filter((t) => t.status === "completed").length > 0 ? (
              filteredTournaments
                .filter((t) => t.status === "completed")
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
  )
}