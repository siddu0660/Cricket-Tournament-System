"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Users } from "lucide-react"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Team {
  teamId: number;
  teamName: string;
  teamOwner: string;
  sinceYear: number;
  tournamentsPlayed: string[];
  matchesWon: number;
  matchesLost: number;
  matchesDrawn: number;
  noResultMatches: number;
  totalPoints: number;
}

const BACKEND_URL = "https://cricket-tournament-system-1.onrender.com"



export default function TeamsPage() {
  // This would be fetched from an API in a real application
  const [teams, setTeams] = useState<Team[]>([])
  const teamsData = [
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

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v2/teams`);
      setTeams(response.data); 
      console.log("Successfully fetched teams");
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
      console.log("Failed to fetch teams");
    }
  };

  useEffect(() => {
    fetchTeams(); 
  }, []);



  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-cricket-darkOlive" />
            <span className="text-xl font-bold">Teams</span>
          </div>
        <div>
            <div className="flex items-center gap-4">
              <div className="flex w-full max-w-sm items-center gap-2">
                <Input
                  type="search"
                  placeholder="Search teams..."
                  className="w-[300px]"
                />
                <Button variant="secondary" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <Button asChild>
                <Link href="/teams/create">Register Team</Link>
              </Button>
            </div>
          </div>  
        </div>

      </header>
      <main className="flex-1 container py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Card key={team.teamId} className="overflow-hidden">
              <CardHeader className="bg-cricket-sage text-cricket-darkOlive pb-2">
                <CardTitle className="text-xl">{team.teamName}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Owner:</span>
                    <span className="text-sm">{team.teamOwner}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Established:</span>
                    <span className="text-sm">{team.sinceYear}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tournaments:</span>
                    <span className="text-sm">{team.tournamentsPlayed.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Match Statistics:</span>
                    <span className="text-sm">
                      {team.matchesWon}W - {team.matchesLost}L - {team.matchesDrawn}D - {team.noResultMatches}NR
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Points:</span>
                    <span className="text-sm">{team.totalPoints}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/teams/${team.teamId}`}>Team Details</Link>
                </Button>
                <Button asChild variant="default" size="sm">
                  <Link href={`/teams/${team.teamId}/players`}>View Players</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

