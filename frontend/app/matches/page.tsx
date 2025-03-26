import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Trophy, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function MatchesPage() {
  // This would be fetched from an API in a real application
  const matches = [
    {
      id: 101,
      tournament: "Premier Cricket League 2025",
      team1: "Mumbai Mavericks",
      team2: "Delhi Dragons",
      date: "2025-03-25",
      time: "19:00",
      venue: "Wankhede Stadium",
      location: "Mumbai, India",
      status: "upcoming",
    },
    {
      id: 102,
      tournament: "Premier Cricket League 2025",
      team1: "Bangalore Bulls",
      team2: "Chennai Challengers",
      date: "2025-03-26",
      time: "19:00",
      venue: "M. Chinnaswamy Stadium",
      location: "Bangalore, India",
      status: "upcoming",
    },
    {
      id: 98,
      tournament: "Premier Cricket League 2025",
      team1: "Mumbai Mavericks",
      team2: "Kolkata Kings",
      date: "2025-03-22",
      time: "19:00",
      venue: "Wankhede Stadium",
      location: "Mumbai, India",
      status: "completed",
      result: "Mumbai Mavericks won by 25 runs",
      scores: {
        team1: "189/6 (20 overs)",
        team2: "164/8 (20 overs)",
      },
    },
    {
      id: 99,
      tournament: "Premier Cricket League 2025",
      team1: "Delhi Dragons",
      team2: "Punjab Panthers",
      date: "2025-03-23",
      time: "19:00",
      venue: "Arun Jaitley Stadium",
      location: "Delhi, India",
      status: "completed",
      result: "Delhi Dragons won by 6 wickets",
      scores: {
        team1: "145/9 (20 overs)",
        team2: "146/4 (18.3 overs)",
      },
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-cricket-darkOlive" />
            <span className="text-xl font-bold">Matches</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex w-full max-w-sm items-center gap-2">
              <Input
                type="search"
                placeholder="Search matches, players, tournaments..."
                className="w-[300px]"
              />
              <Button variant="secondary" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Button asChild>
              <Link href="/matches/create">Schedule Match</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Upcoming Matches</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {matches
              .filter((match) => match.status === "upcoming")
              .map((match) => (
                <Card key={match.id} className="overflow-hidden">
                  <CardHeader className="bg-cricket-sage text-cricket-darkOlive pb-2">
                    <CardTitle className="text-lg">
                      {match.team1} vs {match.team2}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">{match.tournament}</div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-cricket-brown" />
                        <span className="text-sm">{new Date(match.date).toLocaleDateString()}</span>
                        <Clock className="h-4 w-4 ml-2 text-cricket-brown" />
                        <span className="text-sm">{match.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-cricket-brown" />
                        <span className="text-sm">
                          {match.venue}, {match.location}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                    <Button asChild variant="default" size="sm">
                      <Link href={`/matches/${match.id}`}>Match Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Results</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {matches
              .filter((match) => match.status === "completed")
              .map((match) => (
                <Card key={match.id} className="overflow-hidden">
                  <CardHeader className="bg-cricket-sage text-cricket-darkOlive pb-2">
                    <CardTitle className="text-lg">
                      {match.team1} vs {match.team2}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">{match.tournament}</div>
                      <div className="font-medium text-cricket-brown">{match.result}</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          {match.team1}: {match.scores?.team1}
                        </div>
                        <div>
                          {match.team2}: {match.scores?.team2}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-cricket-brown" />
                        <span className="text-sm">{new Date(match.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-cricket-brown" />
                        <span className="text-sm">
                          {match.venue}, {match.location}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                    <Button asChild variant="default" size="sm">
                      <Link href={`/matches/${match.id}`}>Match Details</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/matches/${match.id}`}>Scorecard</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      </main>
    </div>
  )
}

