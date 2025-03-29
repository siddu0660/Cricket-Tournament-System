"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent, BarChart, Bar, XAxis, YAxis } from "@/components/ui/chart"
import { useEffect, useState } from "react"
import axios from "axios"

interface PlayerStats {
  playerStatsId: number
  playerId: number
  playerName: string
  teamName: string
  matchesPlayed: number
  totalRuns: number
  highestScore: number
  strikeRate: string
  totalWickets: number
  bestBowlingFigures: string
  economyRate: string
  numberOf6s: number
  numberOf4s: number
  numberOfManOfTheMatch: number
  tournamentId: number
  oversPlayed: number
  oversBowled: number
}

export default function TournamentStats({ tournamentId }: { tournamentId: string }) {
  const [battingStats, setBattingStats] = useState<PlayerStats[]>([])
  const [bowlingStats, setBowlingStats] = useState<PlayerStats[]>([])

  const getPlayerStats = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/playerStats/tournament/${tournamentId}`)
      const players: PlayerStats[] = Array.isArray(response.data) ? response.data : []

      if (players.length === 0) {
        console.log("No player statistics available")
        setBattingStats([])
        setBowlingStats([])
        return
      }

      // Process all players for different stats
      const allBattingPlayers = [...players].filter(player => player.totalRuns > 0)
      const allBowlingPlayers = [...players].filter(player => player.totalWickets > 0)

      setBattingStats(allBattingPlayers)
      setBowlingStats(allBowlingPlayers)

    } catch (error) {
      console.error("Error fetching player statistics:", error)
      setBattingStats([])
      setBowlingStats([])
    }
  }

  useEffect(() => {
    getPlayerStats()
  }, [tournamentId])

  return (
    <div>
      <h2 className="text-2xl font-bold text-dark-olive mb-6">Tournament Statistics</h2>

      <Tabs defaultValue="batting" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="batting">Batting Stats</TabsTrigger>
          <TabsTrigger value="bowling">Bowling Stats</TabsTrigger>
          <TabsTrigger value="highest-runs">Most Runs</TabsTrigger>
          <TabsTrigger value="highest-wickets">Most Wickets</TabsTrigger>
          <TabsTrigger value="best-sr">Best Strike Rate</TabsTrigger>
          <TabsTrigger value="best-economy">Best Economy</TabsTrigger>
        </TabsList>

        <TabsContent value="batting" className="mt-0">
          <Card className="border-olive/20">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-olive/10">
                    <TableHead className="w-12 text-dark-olive">Pos</TableHead>
                    <TableHead className="text-dark-olive">Player</TableHead>
                    <TableHead className="text-dark-olive">Team</TableHead>
                    <TableHead className="text-dark-olive text-center">M</TableHead>
                    <TableHead className="text-dark-olive text-center">Runs</TableHead>
                    <TableHead className="text-dark-olive text-center">HS</TableHead>
                    <TableHead className="text-dark-olive text-center">Avg</TableHead>
                    <TableHead className="text-dark-olive text-center">SR</TableHead>
                    <TableHead className="text-dark-olive text-center">4s</TableHead>
                    <TableHead className="text-dark-olive text-center">6s</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {battingStats
                    .sort((a, b) => b.totalRuns - a.totalRuns)
                    .map((player, index) => (
                      <TableRow key={player.playerStatsId} className="hover:bg-olive/5">
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{player.playerName}</TableCell>
                        <TableCell>{player.teamName}</TableCell>
                        <TableCell className="text-center">{player.matchesPlayed}</TableCell>
                        <TableCell className="text-center font-bold">{player.totalRuns}</TableCell>
                        <TableCell className="text-center">{player.highestScore}</TableCell>
                        <TableCell className="text-center">
                          {(player.totalRuns / player.matchesPlayed).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">{player.strikeRate}</TableCell>
                        <TableCell className="text-center">{player.numberOf4s}</TableCell>
                        <TableCell className="text-center">{player.numberOf6s}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="bowling" className="mt-0">
          <Card className="border-olive/20">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-olive/10">
                    <TableHead className="w-12 text-dark-olive">Pos</TableHead>
                    <TableHead className="text-dark-olive">Player</TableHead>
                    <TableHead className="text-dark-olive">Team</TableHead>
                    <TableHead className="text-dark-olive text-center">M</TableHead>
                    <TableHead className="text-dark-olive text-center">O</TableHead>
                    <TableHead className="text-dark-olive text-center">W</TableHead>
                    <TableHead className="text-dark-olive text-center">Best</TableHead>
                    <TableHead className="text-dark-olive text-center">Econ</TableHead>
                    <TableHead className="text-dark-olive text-center">SR</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bowlingStats
                    .sort((a, b) => b.totalWickets - a.totalWickets)
                    .map((player, index) => (
                      <TableRow key={player.playerStatsId} className="hover:bg-olive/5">
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{player.playerName}</TableCell>
                        <TableCell>{player.teamName}</TableCell>
                        <TableCell className="text-center">{player.matchesPlayed}</TableCell>
                        <TableCell className="text-center">{player.oversBowled}</TableCell>
                        <TableCell className="text-center font-bold">{player.totalWickets}</TableCell>
                        <TableCell className="text-center">{player.bestBowlingFigures}</TableCell>
                        <TableCell className="text-center">{player.economyRate}</TableCell>
                        <TableCell className="text-center">
                          {((player.oversBowled * 6) / player.totalWickets).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="highest-runs" className="mt-0">
          <Card className="border-olive/20">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-olive/10">
                    <TableHead className="w-12 text-dark-olive">Pos</TableHead>
                    <TableHead className="text-dark-olive">Player</TableHead>
                    <TableHead className="text-dark-olive">Team</TableHead>
                    <TableHead className="text-dark-olive text-center">M</TableHead>
                    <TableHead className="text-dark-olive text-center">Runs</TableHead>
                    <TableHead className="text-dark-olive text-center">HS</TableHead>
                    <TableHead className="text-dark-olive text-center">SR</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...battingStats]
                    .sort((a, b) => b.totalRuns - a.totalRuns)
                    .slice(0, 10)
                    .map((player, index) => (
                      <TableRow key={player.playerStatsId} className="hover:bg-olive/5">
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{player.playerName}</TableCell>
                        <TableCell>{player.teamName}</TableCell>
                        <TableCell className="text-center">{player.matchesPlayed}</TableCell>
                        <TableCell className="text-center font-bold">{player.totalRuns}</TableCell>
                        <TableCell className="text-center">{player.highestScore}</TableCell>
                        <TableCell className="text-center">{player.strikeRate}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="highest-wickets" className="mt-0">
          <Card className="border-olive/20">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-olive/10">
                    <TableHead className="w-12 text-dark-olive">Pos</TableHead>
                    <TableHead className="text-dark-olive">Player</TableHead>
                    <TableHead className="text-dark-olive">Team</TableHead>
                    <TableHead className="text-dark-olive text-center">M</TableHead>
                    <TableHead className="text-dark-olive text-center">W</TableHead>
                    <TableHead className="text-dark-olive text-center">Best</TableHead>
                    <TableHead className="text-dark-olive text-center">Econ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...bowlingStats]
                    .sort((a, b) => b.totalWickets - a.totalWickets)
                    .slice(0, 10)
                    .map((player, index) => (
                      <TableRow key={player.playerStatsId} className="hover:bg-olive/5">
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{player.playerName}</TableCell>
                        <TableCell>{player.teamName}</TableCell>
                        <TableCell className="text-center">{player.matchesPlayed}</TableCell>
                        <TableCell className="text-center font-bold">{player.totalWickets}</TableCell>
                        <TableCell className="text-center">{player.bestBowlingFigures}</TableCell>
                        <TableCell className="text-center">{player.economyRate}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="best-sr" className="mt-0">
          <Card className="border-olive/20">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-olive/10">
                    <TableHead className="w-12 text-dark-olive">Pos</TableHead>
                    <TableHead className="text-dark-olive">Player</TableHead>
                    <TableHead className="text-dark-olive">Team</TableHead>
                    <TableHead className="text-dark-olive text-center">M</TableHead>
                    <TableHead className="text-dark-olive text-center">Runs</TableHead>
                    <TableHead className="text-dark-olive text-center">SR</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...battingStats]
                    .sort((a, b) => parseFloat(b.strikeRate) - parseFloat(a.strikeRate))
                    .slice(0, 10)
                    .map((player, index) => (
                      <TableRow key={player.playerStatsId} className="hover:bg-olive/5">
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{player.playerName}</TableCell>
                        <TableCell>{player.teamName}</TableCell>
                        <TableCell className="text-center">{player.matchesPlayed}</TableCell>
                        <TableCell className="text-center">{player.totalRuns}</TableCell>
                        <TableCell className="text-center font-bold">{player.strikeRate}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="best-economy" className="mt-0">
          <Card className="border-olive/20">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-olive/10">
                    <TableHead className="w-12 text-dark-olive">Pos</TableHead>
                    <TableHead className="text-dark-olive">Player</TableHead>
                    <TableHead className="text-dark-olive">Team</TableHead>
                    <TableHead className="text-dark-olive text-center">O</TableHead>
                    <TableHead className="text-dark-olive text-center">W</TableHead>
                    <TableHead className="text-dark-olive text-center">Econ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...bowlingStats]
                    .sort((a, b) => parseFloat(a.economyRate) - parseFloat(b.economyRate))
                    .slice(0, 10)
                    .map((player, index) => (
                      <TableRow key={player.playerStatsId} className="hover:bg-olive/5">
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{player.playerName}</TableCell>
                        <TableCell>{player.teamName}</TableCell>
                        <TableCell className="text-center">{player.oversBowled}</TableCell>
                        <TableCell className="text-center">{player.totalWickets}</TableCell>
                        <TableCell className="text-center font-bold">{player.economyRate}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
