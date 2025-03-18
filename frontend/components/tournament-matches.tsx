"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { CalendarDays, Clock, MapPin } from "lucide-react"

export default function TournamentMatches({ tournamentId }: { tournamentId: string }) {
  // Mock matches data
  const matches = [
    {
      id: 1,
      team1: "Chennai Super Kings",
      team1Short: "CSK",
      team2: "Mumbai Indians",
      team2Short: "MI",
      date: "Apr 15, 2023",
      time: "7:30 PM IST",
      venue: "Wankhede Stadium, Mumbai",
      result: "CSK won by 5 wickets",
      status: "completed",
    },
    {
      id: 2,
      team1: "Royal Challengers Bangalore",
      team1Short: "RCB",
      team2: "Kolkata Knight Riders",
      team2Short: "KKR",
      date: "Apr 18, 2023",
      time: "7:30 PM IST",
      venue: "M. Chinnaswamy Stadium, Bangalore",
      result: "KKR won by 21 runs",
      status: "completed",
    },
    {
      id: 3,
      team1: "Delhi Capitals",
      team1Short: "DC",
      team2: "Rajasthan Royals",
      team2Short: "RR",
      date: "Apr 20, 2023",
      time: "3:30 PM IST",
      venue: "Arun Jaitley Stadium, Delhi",
      result: "",
      status: "upcoming",
    },
    {
      id: 4,
      team1: "Punjab Kings",
      team1Short: "PBKS",
      team2: "Sunrisers Hyderabad",
      team2Short: "SRH",
      date: "Apr 22, 2023",
      time: "7:30 PM IST",
      venue: "Punjab Cricket Association Stadium, Mohali",
      result: "",
      status: "upcoming",
    },
  ]

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-dark-olive">Matches</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Matches</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-light-teal hover:bg-teal text-dark-olive" asChild>
            <Link href={`/tournaments/${tournamentId}/matches/create`}>Add Match</Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {matches.map((match) => (
          <Card key={match.id} className="border-olive/20 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-olive" />
                      <span className="text-sm text-olive">{match.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-olive" />
                      <span className="text-sm text-olive">{match.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="h-12 w-12 bg-light-teal rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="font-bold text-dark-olive">{match.team1Short}</span>
                      </div>
                      <h3 className="font-medium text-dark-olive">{match.team1}</h3>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-dark-olive">VS</div>
                    </div>
                    <div className="text-center">
                      <div className="h-12 w-12 bg-light-teal rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="font-bold text-dark-olive">{match.team2Short}</span>
                      </div>
                      <h3 className="font-medium text-dark-olive">{match.team2}</h3>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-olive mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{match.venue}</span>
                    </div>
                    {match.status === "completed" && (
                      <div className="text-sm font-medium text-dark-olive mt-2">{match.result}</div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="w-full md:w-auto" asChild>
                    <Link href={`/matches/${match.id}`}>
                      {match.status === "upcoming" ? "Match Details" : "Scorecard"}
                    </Link>
                  </Button>
                  {match.status === "upcoming" && (
                    <Button size="sm" className="w-full md:w-auto bg-light-teal hover:bg-teal text-dark-olive" asChild>
                      <Link href={`/matches/${match.id}/edit`}>Edit Match</Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

