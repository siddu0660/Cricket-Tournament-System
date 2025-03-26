import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Flag, Calendar, Award, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function PlayersPage() {
  // This would be fetched from an API in a real application
  const players = [
    {
      id: 1,
      firstName: "Rohit",
      lastName: "Sharma",
      dateOfBirth: "1987-04-30",
      jerseyNumber: 45,
      role: "Batsman",
      battingStyle: "Right-handed",
      nationality: "India",
      team: "Mumbai Mavericks",
      stats: {
        matches: 213,
        runs: 5879,
        wickets: 15,
        highestScore: 118,
        bestBowling: "2/9",
      },
    },
    {
      id: 2,
      firstName: "Virat",
      lastName: "Kohli",
      dateOfBirth: "1988-11-05",
      jerseyNumber: 18,
      role: "Batsman",
      battingStyle: "Right-handed",
      nationality: "India",
      team: "Bangalore Bulls",
      stats: {
        matches: 223,
        runs: 6624,
        wickets: 4,
        highestScore: 113,
        bestBowling: "1/15",
      },
    },
    {
      id: 3,
      firstName: "MS",
      lastName: "Dhoni",
      dateOfBirth: "1981-07-07",
      jerseyNumber: 7,
      role: "Wicket-keeper Batsman",
      battingStyle: "Right-handed",
      nationality: "India",
      team: "Chennai Challengers",
      stats: {
        matches: 204,
        runs: 4876,
        wickets: 0,
        highestScore: 84,
        bestBowling: "-",
      },
    },
    {
      id: 4,
      firstName: "Jasprit",
      lastName: "Bumrah",
      dateOfBirth: "1993-12-06",
      jerseyNumber: 93,
      role: "Bowler",
      battingStyle: "Right-handed",
      nationality: "India",
      team: "Mumbai Mavericks",
      stats: {
        matches: 106,
        runs: 56,
        wickets: 130,
        highestScore: 10,
        bestBowling: "5/10",
      },
    },
    {
      id: 5,
      firstName: "Ravindra",
      lastName: "Jadeja",
      dateOfBirth: "1988-12-06",
      jerseyNumber: 8,
      role: "All-rounder",
      battingStyle: "Left-handed",
      nationality: "India",
      team: "Chennai Challengers",
      stats: {
        matches: 200,
        runs: 2386,
        wickets: 127,
        highestScore: 62,
        bestBowling: "5/16",
      },
    },
    {
      id: 6,
      firstName: "KL",
      lastName: "Rahul",
      dateOfBirth: "1992-04-18",
      jerseyNumber: 1,
      role: "Batsman",
      battingStyle: "Right-handed",
      nationality: "India",
      team: "Punjab Panthers",
      stats: {
        matches: 109,
        runs: 3889,
        wickets: 0,
        highestScore: 132,
        bestBowling: "-",
      },
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-6 w-6 text-cricket-darkOlive" />
            <span className="text-xl font-bold">Players</span>
          </div>
          <div>
            <div className="flex items-center gap-4">
              <div className="flex w-full max-w-sm items-center gap-2">
                <Input
                  type="search"
                  placeholder="Search players..."
                  className="w-[300px]"
                />
                <Button variant="secondary" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <Button asChild>
                <Link href="/players/create">Register Player</Link>
              </Button>
            </div>
          </div>
          
        </div>
      </header>
      <main className="flex-1 container py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {players.map((player) => (
            <Card key={player.id} className="overflow-hidden">
              <CardHeader className="bg-cricket-sage text-cricket-darkOlive pb-2">
                <CardTitle className="text-xl">
                  {player.firstName} {player.lastName}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-cricket-brown" />
                    <span className="text-sm">
                      {player.role} | #{player.jerseyNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-cricket-brown" />
                    <span className="text-sm">{player.nationality}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-cricket-brown" />
                    <span className="text-sm">Born: {new Date(player.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-cricket-brown" />
                    <span className="text-sm">Team: {player.team}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <div className="text-sm font-medium mb-1">Career Statistics:</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <div>Matches: {player.stats.matches}</div>
                      <div>Runs: {player.stats.runs}</div>
                      <div>Wickets: {player.stats.wickets}</div>
                      <div>Highest: {player.stats.highestScore}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                <Button asChild variant="default" size="sm">
                  <Link href={`/players/${player.id}`}>View Profile</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

