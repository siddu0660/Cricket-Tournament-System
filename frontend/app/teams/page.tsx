"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Users, Search, Trash2 } from "lucide-react"
import axios from "axios"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

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

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [teamToDelete, setTeamToDelete] = useState<number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/teams`);
      setTeams(response.data); 
      console.log("Successfully fetched teams");
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const deleteTeam = async (teamId: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/teams/${teamId}`);
      await fetchTeams();
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };
  

  useEffect(() => {
    fetchTeams(); 
  }, []);

  const handleDeleteConfirm = async () => {
    if (teamToDelete !== null) {
      await deleteTeam(teamToDelete);
      setDialogOpen(false);
      setTeamToDelete(null);
    }
  };

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
                <div className="flex gap-2">
                  <Button asChild variant="default" size="sm">
                    <Link href={`/teams/${team.teamName}/players`}>View Players</Link>
                  </Button>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setTeamToDelete(team.teamId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Team</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this team? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteConfirm}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

