"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import axios from "axios"

// Define the interface for the team standings
interface TeamStanding {
  teamId: number
  teamName: string
  matchesWon: number
  matchesLost: number
  matchesDrawn: number
  noResultMatches: number
  totalMatchesPlayed: number
  totalPoints: string
}

export default function TournamentStandings({ tournamentId }: { tournamentId: string }) {
  const [standings, setStandings] = useState<TeamStanding[]>([])

  const fetchPointsTable = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/pointsTable/${tournamentId}`)
      const transformedData = response.data.map((team: TeamStanding, index: number) => ({
        ...team,
        position: index + 1,
        teamShort: team.teamName.split(' ').map(word => word[0]).join(''), 
      }))
      console.log(transformedData)
      setStandings(transformedData)
    } catch (error) {
      console.error('Error fetching points table:', error)
    }
  }

  useEffect(() => {
    fetchPointsTable()
  }, [tournamentId])

  return (
    <div>
      <h2 className="text-2xl font-bold text-dark-olive mb-6">Points Table</h2>
      <Card className="border-olive/20">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-olive/10">
                <TableHead className="w-12 text-dark-olive">Pos</TableHead>
                <TableHead className="text-dark-olive">Team</TableHead>
                <TableHead className="text-dark-olive text-center">P</TableHead>
                <TableHead className="text-dark-olive text-center">W</TableHead>
                <TableHead className="text-dark-olive text-center">L</TableHead>
                <TableHead className="text-dark-olive text-center">T</TableHead>
                <TableHead className="text-dark-olive text-center">NR</TableHead>
                <TableHead className="text-dark-olive text-center">Pts</TableHead>
                <TableHead className="text-dark-olive text-center">NRR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standings.map((team, index) => (
                <TableRow key={team.teamId} className="hover:bg-olive/5">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-light-teal rounded-full flex items-center justify-center">
                        <span className="font-bold text-dark-olive text-xs">
                          {team.teamName.split(' ').map(word => word[0]).join('')}
                        </span>
                      </div>
                      <span>{team.teamName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{team.totalMatchesPlayed}</TableCell>
                  <TableCell className="text-center">{team.matchesWon}</TableCell>
                  <TableCell className="text-center">{team.matchesLost}</TableCell>
                  <TableCell className="text-center">{team.matchesDrawn}</TableCell>
                  <TableCell className="text-center">{team.noResultMatches}</TableCell>
                  <TableCell className="text-center font-bold">{team.totalPoints}</TableCell>
                  <TableCell className="text-center">-</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
      <div className="mt-4 text-sm text-olive">
        <p>P: Played, W: Won, L: Lost, T: Tied, NR: No Result, Pts: Points, NRR: Net Run Rate</p>
      </div>
    </div>
  )
}

