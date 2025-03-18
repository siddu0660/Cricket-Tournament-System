import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { CalendarDays, MapPin, Trophy, Users } from "lucide-react"

export default function TournamentsPage() {
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
          <Input placeholder="Search tournaments..." className="md:max-w-xs" />
          <Select defaultValue="all">
            <SelectTrigger className="md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
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
            {tournaments.map((tournament) => (
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
            ))}
          </div>
        </TabsContent>
        <TabsContent value="active" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments
              .filter((t) => t.status === "active")
              .map((tournament) => (
                <Card key={tournament.id} className="border-olive/20 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-dark-olive">{tournament.name}</CardTitle>
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
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
              ))}
          </div>
        </TabsContent>
        <TabsContent value="upcoming" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments
              .filter((t) => t.status === "upcoming")
              .map((tournament) => (
                <Card key={tournament.id} className="border-olive/20 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-dark-olive">{tournament.name}</CardTitle>
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Upcoming
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
              ))}
          </div>
        </TabsContent>
        <TabsContent value="completed" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments
              .filter((t) => t.status === "completed")
              .map((tournament) => (
                <Card key={tournament.id} className="border-olive/20 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-dark-olive">{tournament.name}</CardTitle>
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Completed
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
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

