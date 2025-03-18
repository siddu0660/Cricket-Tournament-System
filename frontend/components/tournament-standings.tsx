"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"

export default function TournamentStandings({ tournamentId }: { tournamentId: string }) {
  // Mock standings data
  const standings = [
    {
      position: 1,
      team: "Chennai Super Kings",
      teamShort: "CSK",
      played: 8,
      won: 6,
      lost: 2,
      tied: 0,
      noResult: 0,
      points: 12,
      netRunRate: "+0.978",
    },
    {
      position: 2,
      team: "Mumbai Indians",
      teamShort: "MI",
      played: 8,
      won: 5,
      lost: 3,
      tied: 0,
      noResult: 0,
      points: 10,
      netRunRate: "+0.546",
    },
    {
      position: 3,
      team: "Rajasthan Royals",
      teamShort: "RR",
      played: 8,
      won: 5,
      lost: 3,
      tied: 0,
      noResult: 0,
      points: 10,
      netRunRate: "+0.325",
    },
    {
      position: 4,
      team: "Royal Challengers Bangalore",
      teamShort: "RCB",
      played: 8,
      won: 4,
      lost: 4,
      tied: 0,
      noResult: 0,
      points: 8,
      netRunRate: "+0.123",
    },
    {
      position: 5,
      team: "Kolkata Knight Riders",
      teamShort: "KKR",
      played: 8,
      won: 4,
      lost: 4,
      tied: 0,
      noResult: 0,
      points: 8,
      netRunRate: "-0.052",
    },
    {
      position: 6,
      team: "Delhi Capitals",
      teamShort: "DC",
      played: 8,
      won: 3,
      lost: 5,
      tied: 0,
      noResult: 0,
      points: 6,
      netRunRate: "-0.195",
    },
    {
      position: 7,
      team: "Punjab Kings",
      teamShort: "PBKS",
      played: 8,
      won: 3,
      lost: 5,
      tied: 0,
      noResult: 0,
      points: 6,
      netRunRate: "-0.254",
    },
    {
      position: 8,
      team: "Sunrisers Hyderabad",
      teamShort: "SRH",
      played: 8,
      won: 2,
      lost: 6,
      tied: 0,
      noResult: 0,
      points: 4,
      netRunRate: "-0.889",
    },
  ]

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
              {standings.map((team) => (
                <TableRow key={team.position} className="hover:bg-olive/5">
                  <TableCell className="font-medium">{team.position}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-light-teal rounded-full flex items-center justify-center">
                        <span className="font-bold text-dark-olive text-xs">{team.teamShort}</span>
                      </div>
                      <span>{team.team}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{team.played}</TableCell>
                  <TableCell className="text-center">{team.won}</TableCell>
                  <TableCell className="text-center">{team.lost}</TableCell>
                  <TableCell className="text-center">{team.tied}</TableCell>
                  <TableCell className="text-center">{team.noResult}</TableCell>
                  <TableCell className="text-center font-bold">{team.points}</TableCell>
                  <TableCell className="text-center">{team.netRunRate}</TableCell>
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

