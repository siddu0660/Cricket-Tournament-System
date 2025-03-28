"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { addPlayer } from '@/services/createPlayerService'

export default function CreatePlayer() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      firstName: formData.get("firstName"),
      secondName: formData.get("secondName"),
      dateOfBirth: formData.get("dateOfBirth"),
      jerseyNumber: formData.get("jerseyNumber"),
      playerRole: formData.get("playerRole"),
      battingStyle: formData.get("battingStyle"),
      bowlingStyle: formData.get("bowlingStyle"),
      gender: formData.get("gender") === "male" ? true : false,
      nationality: formData.get("nationality"),
    }

    try {
      await addPlayer(data)
      router.push("/players")
      router.refresh()
    } catch (error) {
      console.error("Error creating player:", error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Register New Player</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondName">Second Name</Label>
                <Input id="secondName" name="secondName" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jerseyNumber">Jersey Number</Label>
                <Input id="jerseyNumber" name="jerseyNumber" type="number" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="playerRole">Player Role</Label>
                <Select name="playerRole" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Batsman">Batsman</SelectItem>
                    <SelectItem value="Bowler">Bowler</SelectItem>
                    <SelectItem value="All-Rounder">All-Rounder</SelectItem>
                    <SelectItem value="Wicket Keeper">Wicket Keeper</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input id="nationality" name="nationality" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="battingStyle">Batting Style</Label>
                <Select name="battingStyle" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select batting style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Right-handed">Right Handed</SelectItem>
                    <SelectItem value="Left-handed">Left Handed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bowlingStyle">Bowling Style</Label>
                <Select name="bowlingStyle" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bowling style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Right-arm fast">Right-arm fast</SelectItem>
                    <SelectItem value="Right-arm medium">Right-arm medium</SelectItem>
                    <SelectItem value="Right-arm off-spin">Right-arm off-spin</SelectItem>
                    <SelectItem value="Left-arm fast">Left-arm fast</SelectItem>
                    <SelectItem value="Left-arm medium">Left-arm medium</SelectItem>
                    <SelectItem value="Left-arm spin">Left-arm spin</SelectItem>
                </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select name="gender" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Player"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
