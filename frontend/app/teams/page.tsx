import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function TeamsPage() {
  // This would be fetched from an API in a real application
  const teams = [
    {
      id: 1,
      name: "Mumbai Mavericks",
      owner: "Reliance Sports",
      since: 2008,
      tournaments: 15,
      matches: { won: 120, lost: 80, drawn: 5 },
      players: 25,
    },
    {
      id: 2,
      name: "Delhi Dragons",
      owner: "GMR Group",
      since: 2008,
      tournaments: 15,
      matches: { won: 110, lost: 90, drawn: 5 },
      players: 24,
    },
    {
      id: 3,
      name: "Bangalore Bulls",
      owner: "United Spirits",
      since: 2008,
      tournaments: 15,
      matches: { won: 105, lost: 95, drawn: 5 },
      players: 23,
    },
    {
      id: 4,
      name: "Chennai Challengers",
      owner: "India Cements",
      since: 2008,
      tournaments: 15,
      matches: { won: 115, lost: 85, drawn: 5 },
      players: 25,
    },
    {
      id: 5,
      name: "Kolkata Kings",
      owner: "Red Chillies Entertainment",
      since: 2008,
      tournaments: 15,
      matches: { won: 100, lost: 100, drawn: 5 },
      players: 24,
    },
    {
      id: 6,
      name: "Punjab Panthers",
      owner: "Preity Zinta & Ness Wadia",
      since: 2008,
      tournaments: 15,
      matches: { won: 95, lost: 105, drawn: 5 },
      players: 23,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-cricket-darkOlive" />
            <span className="text-xl font-bold">Teams</span>
          </div>
          <Button asChild>
            <Link href="/teams/create">Register Team</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 container py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Card key={team.id} className="overflow-hidden">
              <CardHeader className="bg-cricket-sage text-cricket-darkOlive pb-2">
                <CardTitle className="text-xl">{team.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Owner:</span>
                    <span className="text-sm">{team.owner}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Established:</span>
                    <span className="text-sm">{team.since}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tournaments Played:</span>
                    <span className="text-sm">{team.tournaments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Win/Loss Record:</span>
                    <span className="text-sm">
                      {team.matches.won}W - {team.matches.lost}L - {team.matches.drawn}D
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Squad Size:</span>
                    <span className="text-sm">{team.players} players</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/teams/${team.id}`}>Team Details</Link>
                </Button>
                <Button asChild variant="default" size="sm">
                  <Link href={`/teams/${team.id}/players`}>View Players</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

