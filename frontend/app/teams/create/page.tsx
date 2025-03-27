"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"


interface Team {
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


export default function CreateTeamPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<Team>({
    teamName: "",
    teamOwner: "",
    sinceYear: 0,
    tournamentsPlayed: [],
    matchesWon: 0,
    matchesLost: 0,
    matchesDrawn: 0,
    noResultMatches: 0,
    totalPoints: 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log("Sending data:", formData)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/teams`, formData)
      console.log("Successfully added team:", response.data)
      router.push('/teams')
      router.refresh()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error details:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        })
      } else {
        console.error("Unexpected error:", error)
      }
      alert("Failed to create team. Please try again.")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sinceYear' || 
              name === 'matchesWon' || 
              name === 'matchesLost' || 
              name === 'matchesDrawn' ||
              name === 'noResultMatches' ||
              name === 'totalPoints'
        ? parseInt(value) || 0 
        : name === 'tournamentsPlayed' 
          ? value.split(',').map(item => item.trim()).filter(item => item !== '')
          : value
    }))
  }

  return (
    <div className="container py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Register New Team</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Team Name</label>
              <Input
                name="teamName"
                value={formData.teamName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Owner</label>
              <Input
                name="teamOwner"
                value={formData.teamOwner}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Established Year</label>
              <Input
                type="number"
                name="sinceYear"
                value={formData.sinceYear}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tournaments Played (comma-separated)</label>
              <Input
                name="tournamentsPlayed"
                value={formData.tournamentsPlayed.join(', ')}
                onChange={handleChange}
                placeholder="Tournament 1, Tournament 2, ..."
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Matches Won</label>
                <Input
                  type="number"
                  name="matchesWon"
                  value={formData.matchesWon}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Matches Lost</label>
                <Input
                  type="number"
                  name="matchesLost"
                  value={formData.matchesLost}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Matches Drawn</label>
                <Input
                  type="number"
                  name="matchesDrawn"
                  value={formData.matchesDrawn}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">No Result Matches</label>
                <Input
                  type="number"
                  name="noResultMatches"
                  value={formData.noResultMatches}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total Points</label>
                <Input
                  type="number"
                  name="totalPoints"
                  value={formData.totalPoints}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit">
                Register Team
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}