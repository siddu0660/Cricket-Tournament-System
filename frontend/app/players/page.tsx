"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Flag, Calendar, Award, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Search, Trash2 } from "lucide-react"
import { fetchPlayers } from '@/services/fetchPlayerService'
import { useState, useEffect } from "react"
import { Player } from "@/types/player"
import { deletePlayer } from '@/services/deletePlayerService'
import { updatePlayer } from '@/services/updatePlayerService'
import { UpdatePlayerForm } from '@/components/UpdatePlayerForm'

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPlayers()
  }, [])

  const loadPlayers = async () => {
    try {
      const fetchedPlayers = await fetchPlayers()
      const playersWithStats = fetchedPlayers.map(player => ({
        ...player,
        stats: {
          matches: null,
          runs: null,
          wickets: null,
          highestScore: null,
          bestBowling: null
        }
      }))
      setPlayers(playersWithStats)
    } catch (error) {
      setError('Failed to load players')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePlayer = async (playerId: string) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await deletePlayer(playerId);
        loadPlayers();
      } catch (error) {
        setError('Failed to delete player');
        console.error(error);
      }
    }
  };

  const handleUpdatePlayer = async (playerId: string, playerData: Partial<Player>) => {
    try {
      if (playerData.dateOfBirth) {
        playerData.dateOfBirth = new Date(playerData.dateOfBirth).toISOString().split('T')[0];
        console.log(playerData.dateOfBirth)
      }
      
      await updatePlayer(playerId, playerData);
      await loadPlayers(); 
    } catch (error) {
      setError('Failed to update player');
      console.error(error);
    }
  };

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
            <Card key={player.playerId} className="overflow-hidden">
              <CardHeader className="bg-cricket-sage text-cricket-darkOlive pb-2">
                <CardTitle className="text-xl">
                  {player.firstName} {player.secondName}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-cricket-brown" />
                    <span className="text-sm">
                      {player.playerRole} | #{player.jerseyNumber}
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
                  {/* <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-cricket-brown" />
                    <span className="text-sm">Teams: {player.teamsPlayed.join(', ')}</span>
                  </div> */}
                  <div className="mt-2 pt-2 border-t">
                    <div className="text-sm font-medium mb-1">Player Details:</div>
                    <div className="flex flex-col gap-1 text-sm">
                      <div>Batting Style: {player.battingStyle}</div>
                      <div>Bowling Style: {player.bowlingStyle}</div>
                      <div>Gender: {player.gender ? 'Male' : 'Female'}</div>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <div className="text-sm font-medium mb-1">Career Statistics:</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <div>Matches: {player.stats?.matches ?? 'N/A'}</div>
                      <div>Runs: {player.stats?.runs ?? 'N/A'}</div>
                      <div>Wickets: {player.stats?.wickets ?? 'N/A'}</div>
                      <div>Highest: {player.stats?.highestScore ?? 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                <Button asChild variant="default" size="sm">
                  <Link href={`/players/${player.playerId}`}>View Profile</Link>
                </Button>
                <div className="flex gap-2">
                  <UpdatePlayerForm player={player} onUpdate={handleUpdatePlayer} />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => player.playerId && handleDeletePlayer(player.playerId.toString())}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

