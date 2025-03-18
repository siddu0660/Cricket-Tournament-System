"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent, BarChart, Bar, XAxis, YAxis } from "@/components/ui/chart"

export default function TournamentStats({ tournamentId }: { tournamentId: string }) {
  // Mock batting stats
  const battingStats = [
    {
      position: 1,
      player: "Virat Kohli",
      team: "RCB",
      matches: 8,
      innings: 8,
      runs: 420,
      highestScore: 82,
      average: 60.0,
      strikeRate: 155.56,
      fifties: 4,
      hundreds: 0,
      fours: 38,
      sixes: 20,
    },
    {
      position: 2,
      player: "Faf du Plessis",
      team: "CSK",
      matches: 8,
      innings: 8,
      runs: 380,
      highestScore: 95,
      average: 54.29,
      strikeRate: 148.44,
      fifties: 3,
      hundreds: 0,
      fours: 35,
      sixes: 18,
    },
    {
      position: 3,
      player: "Jos Buttler",
      team: "RR",
      matches: 8,
      innings: 8,
      runs: 375,
      highestScore: 100,
      average: 53.57,
      strikeRate: 156.25,
      fifties: 2,
      hundreds: 1,
      fours: 32,
      sixes: 22,
    },
    {
      position: 4,
      player: "KL Rahul",
      team: "PBKS",
      matches: 8,
      innings: 8,
      runs: 350,
      highestScore: 91,
      average: 50.0,
      strikeRate: 140.0,
      fifties: 3,
      hundreds: 0,
      fours: 30,
      sixes: 16,
    },
    {
      position: 5,
      player: "Shubman Gill",
      team: "KKR",
      matches: 8,
      innings: 8,
      runs: 340,
      highestScore: 85,
      average: 48.57,
      strikeRate: 145.3,
      fifties: 3,
      hundreds: 0,
      fours: 36,
      sixes: 12,
    },
  ]

  // Mock bowling stats
  const bowlingStats = [
    {
      position: 1,
      player: "Jasprit Bumrah",
      team: "MI",
      matches: 8,
      innings: 8,
      overs: 32,
      wickets: 15,
      bestBowling: "4/20",
      average: 15.33,
      economy: 6.75,
      strikeRate: 12.8,
    },
    {
      position: 2,
      player: "Yuzvendra Chahal",
      team: "RR",
      matches: 8,
      innings: 8,
      overs: 32,
      wickets: 14,
      bestBowling: "4/25",
      average: 16.57,
      economy: 7.25,
      strikeRate: 13.71,
    },
    {
      position: 3,
      player: "Rashid Khan",
      team: "SRH",
      matches: 8,
      innings: 8,
      overs: 32,
      wickets: 12,
      bestBowling: "3/19",
      average: 18.33,
      economy: 6.85,
      strikeRate: 16.0,
    },
    {
      position: 4,
      player: "Mohammed Shami",
      team: "PBKS",
      matches: 8,
      innings: 8,
      overs: 30,
      wickets: 11,
      bestBowling: "3/21",
      average: 20.18,
      economy: 7.4,
      strikeRate: 16.36,
    },
    {
      position: 5,
      player: "Kagiso Rabada",
      team: "DC",
      matches: 8,
      innings: 8,
      overs: 31,
      wickets: 10,
      bestBowling: "3/25",
      average: 22.5,
      economy: 7.26,
      strikeRate: 18.6,
    },
  ]

  // Mock data for charts
  const topRunScorers = [
    { player: "Kohli", runs: 420, fill: "var(--color-top-run-scorer-1)" },
    { player: "du Plessis", runs: 380, fill: "var(--color-top-run-scorer-2)" },
    { player: "Buttler", runs: 375, fill: "var(--color-top-run-scorer-3)" },
    { player: "Rahul", runs: 350, fill: "var(--color-top-run-scorer-4)" },
    { player: "Gill", runs: 340, fill: "var(--color-top-run-scorer-5)" },
  ]

  const topWicketTakers = [
    { player: "Bumrah", wickets: 15, fill: "var(--color-top-wicket-taker-1)" },
    { player: "Chahal", wickets: 14, fill: "var(--color-top-wicket-taker-2)" },
    { player: "Rashid", wickets: 12, fill: "var(--color-top-wicket-taker-3)" },
    { player: "Shami", wickets: 11, fill: "var(--color-top-wicket-taker-4)" },
    { player: "Rabada", wickets: 10, fill: "var(--color-top-wicket-taker-5)" },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-dark-olive mb-6">Tournament Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-olive/20">
          <CardHeader>
            <CardTitle className="text-dark-olive">Top Run Scorers</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                runs: {
                  label: "Runs",
                },
                "top-run-scorer-1": {
                  label: "Virat Kohli",
                  color: "hsl(var(--chart-1))",
                },
                "top-run-scorer-2": {
                  label: "Faf du Plessis",
                  color: "hsl(var(--chart-2))",
                },
                "top-run-scorer-3": {
                  label: "Jos Buttler",
                  color: "hsl(var(--chart-3))",
                },
                "top-run-scorer-4": {
                  label: "KL Rahul",
                  color: "hsl(var(--chart-4))",
                },
                "top-run-scorer-5": {
                  label: "Shubman Gill",
                  color: "hsl(var(--chart-5))",
                },
              }}
              className="min-h-[300px]"
            >
              <BarChart
                accessibilityLayer
                data={topRunScorers}
                layout="vertical"
                margin={{
                  left: 0,
                }}
              >
                <YAxis dataKey="player" type="category" tickLine={false} tickMargin={10} axisLine={false} />
                <XAxis dataKey="runs" type="number" hide />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="runs" layout="vertical" radius={5} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-olive/20">
          <CardHeader>
            <CardTitle className="text-dark-olive">Top Wicket Takers</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                wickets: {
                  label: "Wickets",
                },
                "top-wicket-taker-1": {
                  label: "Jasprit Bumrah",
                  color: "hsl(var(--chart-1))",
                },
                "top-wicket-taker-2": {
                  label: "Yuzvendra Chahal",
                  color: "hsl(var(--chart-2))",
                },
                "top-wicket-taker-3": {
                  label: "Rashid Khan",
                  color: "hsl(var(--chart-3))",
                },
                "top-wicket-taker-4": {
                  label: "Mohammed Shami",
                  color: "hsl(var(--chart-4))",
                },
                "top-wicket-taker-5": {
                  label: "Kagiso Rabada",
                  color: "hsl(var(--chart-5))",
                },
              }}
              className="min-h-[300px]"
            >
              <BarChart
                accessibilityLayer
                data={topWicketTakers}
                layout="vertical"
                margin={{
                  left: 0,
                }}
              >
                <YAxis dataKey="player" type="category" tickLine={false} tickMargin={10} axisLine={false} />
                <XAxis dataKey="wickets" type="number" hide />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="wickets" layout="vertical" radius={5} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="batting" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="batting">Batting Statistics</TabsTrigger>
          <TabsTrigger value="bowling">Bowling Statistics</TabsTrigger>
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
                    <TableHead className="text-dark-olive text-center">Inns</TableHead>
                    <TableHead className="text-dark-olive text-center">Runs</TableHead>
                    <TableHead className="text-dark-olive text-center">HS</TableHead>
                    <TableHead className="text-dark-olive text-center">Avg</TableHead>
                    <TableHead className="text-dark-olive text-center">SR</TableHead>
                    <TableHead className="text-dark-olive text-center">50s</TableHead>
                    <TableHead className="text-dark-olive text-center">100s</TableHead>
                    <TableHead className="text-dark-olive text-center">4s</TableHead>
                    <TableHead className="text-dark-olive text-center">6s</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {battingStats.map((player) => (
                    <TableRow key={player.position} className="hover:bg-olive/5">
                      <TableCell className="font-medium">{player.position}</TableCell>
                      <TableCell>{player.player}</TableCell>
                      <TableCell>{player.team}</TableCell>
                      <TableCell className="text-center">{player.matches}</TableCell>
                      <TableCell className="text-center">{player.innings}</TableCell>
                      <TableCell className="text-center font-bold">{player.runs}</TableCell>
                      <TableCell className="text-center">{player.highestScore}</TableCell>
                      <TableCell className="text-center">{player.average.toFixed(2)}</TableCell>
                      <TableCell className="text-center">{player.strikeRate.toFixed(2)}</TableCell>
                      <TableCell className="text-center">{player.fifties}</TableCell>
                      <TableCell className="text-center">{player.hundreds}</TableCell>
                      <TableCell className="text-center">{player.fours}</TableCell>
                      <TableCell className="text-center">{player.sixes}</TableCell>
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
                    <TableHead className="text-dark-olive text-center">Inns</TableHead>
                    <TableHead className="text-dark-olive text-center">O</TableHead>
                    <TableHead className="text-dark-olive text-center">W</TableHead>
                    <TableHead className="text-dark-olive text-center">Best</TableHead>
                    <TableHead className="text-dark-olive text-center">Avg</TableHead>
                    <TableHead className="text-dark-olive text-center">Econ</TableHead>
                    <TableHead className="text-dark-olive text-center">SR</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bowlingStats.map((player) => (
                    <TableRow key={player.position} className="hover:bg-olive/5">
                      <TableCell className="font-medium">{player.position}</TableCell>
                      <TableCell>{player.player}</TableCell>
                      <TableCell>{player.team}</TableCell>
                      <TableCell className="text-center">{player.matches}</TableCell>
                      <TableCell className="text-center">{player.innings}</TableCell>
                      <TableCell className="text-center">{player.overs}</TableCell>
                      <TableCell className="text-center font-bold">{player.wickets}</TableCell>
                      <TableCell className="text-center">{player.bestBowling}</TableCell>
                      <TableCell className="text-center">{player.average.toFixed(2)}</TableCell>
                      <TableCell className="text-center">{player.economy.toFixed(2)}</TableCell>
                      <TableCell className="text-center">{player.strikeRate.toFixed(2)}</TableCell>
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

