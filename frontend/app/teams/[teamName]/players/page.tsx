"use client"

import { useEffect, useState, use } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

interface Player {
  playerId: number
  firstName: string
  secondName: string
  dateOfBirth: string
  jerseyNumber: number[]
  playerRole: string      
  battingStyle: string    
  bowlingStyle: string    
  gender: boolean
  nationality: string
  teamsPlayed: string[]
}

interface ErrorResponse {
  message: string;
}

export default function TeamPlayersPage({ params }: { params: Promise<{ teamName: string }> }) {
  const [players, setPlayers] = useState<Player[]>([])
  const [error, setError] = useState<string | null>(null)
  const resolvedParams = use(params)
  
  console.log("Resolved params:", resolvedParams)

  const getPlayersFromTeam = async (teamName: string) => {
    const decodedTeamName = decodeURIComponent(teamName)
    console.log("Fetching players for team:", decodedTeamName)
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/players/team/${encodeURIComponent(decodedTeamName)}`
      console.log("Making API call to:", url)

      const response = await axios.get(url)
      console.log("API response:", response.data)
      
      // Check if response is an error message
      if ('message' in response.data) {
        setError((response.data as ErrorResponse).message)
        setPlayers([])
      } else {
        setError(null)
        setPlayers(response.data)
      }
    } catch (error) {
      console.error("Error fetching players:", error)
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        })
        setError("Failed to fetch players")
      }
    }
  }

  useEffect(() => {
    console.log("useEffect triggered with teamName:", resolvedParams.teamName)
    getPlayersFromTeam(resolvedParams.teamName)
  }, [resolvedParams.teamName])

  console.log("Current players state:", players)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-cricket-darkOlive" />
            <span className="text-xl font-bold">{decodeURIComponent(resolvedParams.teamName)} (Players)</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container py-8">
        {error ? (
          <div className="flex justify-center items-center h-[200px]">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6 text-center">
                <p className="text-lg text-muted-foreground">{error}</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {players.map((player) => (
              <Card key={player.playerId} className="overflow-hidden">
                <CardHeader className="bg-cricket-sage text-cricket-darkOlive pb-2">
                  <CardTitle className="text-xl">
                    {player.firstName} {player.secondName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Jersey Number:</span>
                      <span className="text-sm">{player.jerseyNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Role:</span>
                      <span className="text-sm">{player.playerRole}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Batting Style:</span>
                      <span className="text-sm">{player.battingStyle}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Bowling Style:</span>
                      <span className="text-sm">{player.bowlingStyle}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Nationality:</span>
                      <span className="text-sm">{player.nationality}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Date of Birth:</span>
                      <span className="text-sm">
                        {new Date(player.dateOfBirth).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
} 