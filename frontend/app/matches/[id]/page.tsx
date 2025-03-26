import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Trophy, Clock, Award, User, ArrowLeft } from "lucide-react"

export default function MatchDetailsPage({ params }: { params: { id: string } }) {
  // This would be fetched from an API in a real application
  const match = {
    id: Number.parseInt(params.id),
    tournament: {
      id: 1,
      name: "Premier Cricket League 2025",
    },
    team1: {
      id: 1,
      name: "Mumbai Mavericks",
      score: "189/6",
      overs: "20.0",
    },
    team2: {
      id: 5,
      name: "Kolkata Kings",
      score: "164/8",
      overs: "20.0",
    },
    date: "2025-03-22",
    time: "19:00",
    venue: "Wankhede Stadium",
    location: "Mumbai, India",
    status: "completed",
    result: "Mumbai Mavericks won by 25 runs",
    toss: {
      winner: "Mumbai Mavericks",
      decision: "Bat",
    },
    umpires: ["Kumar Dharmasena", "Richard Illingworth"],
    manOfTheMatch: {
      id: 1,
      name: "Rohit Sharma",
      team: "Mumbai Mavericks",
      performance: "78 runs off 46 balls",
    },
    battingStats: {
      team1: [
        { player: "Rohit Sharma", runs: 78, balls: 46, fours: 6, sixes: 4, strikeRate: 169.57 },
        { player: "Quinton de Kock", runs: 45, balls: 32, fours: 4, sixes: 2, strikeRate: 140.63 },
        { player: "Suryakumar Yadav", runs: 32, balls: 20, fours: 3, sixes: 1, strikeRate: 160.0 },
        { player: "Kieron Pollard", runs: 22, balls: 12, fours: 1, sixes: 2, strikeRate: 183.33 },
        { player: "Hardik Pandya", runs: 8, balls: 6, fours: 1, sixes: 0, strikeRate: 133.33 },
        { player: "Krunal Pandya", runs: 2, balls: 3, fours: 0, sixes: 0, strikeRate: 66.67 },
        { player: "Rahul Chahar", runs: 0, balls: 1, fours: 0, sixes: 0, strikeRate: 0.0 },
      ],
      team2: [
        { player: "Shubman Gill", runs: 43, balls: 36, fours: 5, sixes: 1, strikeRate: 119.44 },
        { player: "Nitish Rana", runs: 37, balls: 28, fours: 3, sixes: 2, strikeRate: 132.14 },
        { player: "Eoin Morgan", runs: 29, balls: 20, fours: 2, sixes: 1, strikeRate: 145.0 },
        { player: "Dinesh Karthik", runs: 22, balls: 15, fours: 2, sixes: 1, strikeRate: 146.67 },
        { player: "Andre Russell", runs: 18, balls: 10, fours: 1, sixes: 1, strikeRate: 180.0 },
        { player: "Shakib Al Hasan", runs: 8, balls: 6, fours: 1, sixes: 0, strikeRate: 133.33 },
        { player: "Pat Cummins", runs: 5, balls: 4, fours: 0, sixes: 0, strikeRate: 125.0 },
        { player: "Lockie Ferguson", runs: 0, balls: 1, fours: 0, sixes: 0, strikeRate: 0.0 },
      ],
    },
    bowlingStats: {
      team1: [
        { player: "Jasprit Bumrah", overs: "4.0", maidens: 0, runs: 27, wickets: 3, economy: 6.75 },
        { player: "Trent Boult", overs: "4.0", maidens: 0, runs: 32, wickets: 2, economy: 8.0 },
        { player: "Rahul Chahar", overs: "4.0", maidens: 0, runs: 35, wickets: 2, economy: 8.75 },
        { player: "Krunal Pandya", overs: "4.0", maidens: 0, runs: 29, wickets: 1, economy: 7.25 },
        { player: "Hardik Pandya", overs: "4.0", maidens: 0, runs: 38, wickets: 0, economy: 9.5 },
      ],
      team2: [
        { player: "Pat Cummins", overs: "4.0", maidens: 0, runs: 35, wickets: 2, economy: 8.75 },
        { player: "Lockie Ferguson", overs: "4.0", maidens: 0, runs: 42, wickets: 1, economy: 10.5 },
        { player: "Shakib Al Hasan", overs: "4.0", maidens: 0, runs: 33, wickets: 1, economy: 8.25 },
        { player: "Varun Chakravarthy", overs: "4.0", maidens: 0, runs: 30, wickets: 1, economy: 7.5 },
        { player: "Andre Russell", overs: "4.0", maidens: 0, runs: 45, wickets: 1, economy: 11.25 },
      ],
    },
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
              <Link href="/matches">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <Trophy className="h-6 w-6 text-cricket-darkOlive" />
            <span className="text-xl font-bold">Match Details</span>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-8">
        <Card className="mb-6">
          <CardHeader className="bg-cricket-sage text-cricket-darkOlive pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {match.team1.name} vs {match.team2.name}
                </CardTitle>
                <CardDescription className="text-cricket-darkOlive/80">{match.tournament.name}</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/tournaments/${match.tournament.id}`}>View Tournament</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-cricket-brown" />
                  <span>{new Date(match.date).toLocaleDateString()}</span>
                  <Clock className="h-5 w-5 ml-2 text-cricket-brown" />
                  <span>{match.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-cricket-brown" />
                  <span>
                    {match.venue}, {match.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-cricket-brown" />
                  <span className="font-medium">{match.result}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-cricket-brown" />
                  <span>
                    Toss: {match.toss.winner} won and elected to {match.toss.decision}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-cricket-brown" />
                  <span>Umpires: {match.umpires.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-cricket-brown" />
                  <span>
                    Man of the Match: {match.manOfTheMatch.name} ({match.manOfTheMatch.performance})
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-lg">{match.team1.name}</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="text-2xl font-bold">{match.team1.score}</div>
                  <div className="text-sm text-muted-foreground">{match.team1.overs} overs</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-lg">{match.team2.name}</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="text-2xl font-bold">{match.team2.score}</div>
                  <div className="text-sm text-muted-foreground">{match.team2.overs} overs</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="scorecard" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
            <TabsTrigger value="commentary">Commentary</TabsTrigger>
          </TabsList>
          <TabsContent value="scorecard" className="border rounded-md mt-2 p-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">{match.team1.name} Batting</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-cricket-sage text-cricket-darkOlive">
                        <th className="p-2 text-left">Batter</th>
                        <th className="p-2 text-center">Runs</th>
                        <th className="p-2 text-center">Balls</th>
                        <th className="p-2 text-center">4s</th>
                        <th className="p-2 text-center">6s</th>
                        <th className="p-2 text-center">SR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {match.battingStats.team1.map((player, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-2 text-left font-medium">{player.player}</td>
                          <td className="p-2 text-center">{player.runs}</td>
                          <td className="p-2 text-center">{player.balls}</td>
                          <td className="p-2 text-center">{player.fours}</td>
                          <td className="p-2 text-center">{player.sixes}</td>
                          <td className="p-2 text-center">{player.strikeRate.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">{match.team2.name} Bowling</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-cricket-sage text-cricket-darkOlive">
                        <th className="p-2 text-left">Bowler</th>
                        <th className="p-2 text-center">Overs</th>
                        <th className="p-2 text-center">Maidens</th>
                        <th className="p-2 text-center">Runs</th>
                        <th className="p-2 text-center">Wickets</th>
                        <th className="p-2 text-center">Economy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {match.bowlingStats.team2.map((player, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-2 text-left font-medium">{player.player}</td>
                          <td className="p-2 text-center">{player.overs}</td>
                          <td className="p-2 text-center">{player.maidens}</td>
                          <td className="p-2 text-center">{player.runs}</td>
                          <td className="p-2 text-center">{player.wickets}</td>
                          <td className="p-2 text-center">{player.economy.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">{match.team2.name} Batting</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-cricket-sage text-cricket-darkOlive">
                        <th className="p-2 text-left">Batter</th>
                        <th className="p-2 text-center">Runs</th>
                        <th className="p-2 text-center">Balls</th>
                        <th className="p-2 text-center">4s</th>
                        <th className="p-2 text-center">6s</th>
                        <th className="p-2 text-center">SR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {match.battingStats.team2.map((player, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-2 text-left font-medium">{player.player}</td>
                          <td className="p-2 text-center">{player.runs}</td>
                          <td className="p-2 text-center">{player.balls}</td>
                          <td className="p-2 text-center">{player.fours}</td>
                          <td className="p-2 text-center">{player.sixes}</td>
                          <td className="p-2 text-center">{player.strikeRate.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">{match.team1.name} Bowling</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-cricket-sage text-cricket-darkOlive">
                        <th className="p-2 text-left">Bowler</th>
                        <th className="p-2 text-center">Overs</th>
                        <th className="p-2 text-center">Maidens</th>
                        <th className="p-2 text-center">Runs</th>
                        <th className="p-2 text-center">Wickets</th>
                        <th className="p-2 text-center">Economy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {match.bowlingStats.team1.map((player, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-2 text-left font-medium">{player.player}</td>
                          <td className="p-2 text-center">{player.overs}</td>
                          <td className="p-2 text-center">{player.maidens}</td>
                          <td className="p-2 text-center">{player.runs}</td>
                          <td className="p-2 text-center">{player.wickets}</td>
                          <td className="p-2 text-center">{player.economy.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="commentary" className="border rounded-md mt-2 p-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Commentary not available for this match</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

