"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react"
import { Team } from '@/types/team'
import { Venue } from '@/types/venue'
import { fetchTeams } from '@/services/fetchTeamService'
import { fetchVenues } from '@/services/fetchVenueService'
import { Tournament } from '@/types/tournament'
import { createTournament } from '@/services/createTournamentService'

type Fixture = {
  team1: string;
  team2: string;
  date: Date | null;
  venue: string | null;
  stage?: 'group' | 'knockout';
}

export default function CreateTournamentPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [teams, setTeams] = useState([{ id: 1, name: "" }])
  const [availableTeams, setAvailableTeams] = useState<Team[]>([])
  const [availableVenues, setAvailableVenues] = useState<Venue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [tournamentName, setTournamentName] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [format, setFormat] = useState("t20")
  const [tournamentType, setTournamentType] = useState("league")

  const handleAddTeam = () => {
    setTeams([...teams, { id: teams.length + 1, name: "" }])
  }

  const handleRemoveTeam = (id: number) => {
    if (teams.length > 1) {
      setTeams(teams.filter((team) => team.id !== id))
    }
  }

  const handleTeamNameChange = (id: number, name: string) => {
    setTeams(teams.map((team) => (team.id === id ? { ...team, name } : team)))
  }

  const handleNext = () => {
    setCurrentStep(currentStep + 1)
  }

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData = {
        tournamentName: tournamentName,
        startDate: startDate!.toISOString().split('T')[0],
        endDate: endDate!.toISOString().split('T')[0],
        tourLocation: location,
        numberOfTeams: teams.length,
        teams: teams
          .filter(team => team.name)
          .map(team => team.name),
        numberOfMatches: calculateNumberOfMatches(teams.length),
        tourFormat: format.toString(),
        weightage: {
          win: parseInt((document.getElementById('winPoints') as HTMLInputElement)?.value || '2'),
          loss: parseInt((document.getElementById('lossPoints') as HTMLInputElement)?.value || '0'),
          draw: parseInt((document.getElementById('tiePoints') as HTMLInputElement)?.value || '1'),
        },
        sponsorship: [] 
      };


      if (!formData.tournamentName || !formData.startDate || !formData.endDate || 
          !formData.tourLocation || formData.teams.length < 2) {
        throw new Error('Please fill in all required fields');
      }

      await createTournament(formData);
      router.push("/tournaments");
    } catch (error) {
      console.error('Error creating tournament:', error);
    }
  };

  const calculateNumberOfMatches = (numTeams: number): number => {
    return (numTeams * (numTeams - 1)) / 2;
  };

  const steps = ["Basic Info", "Teams", "Format", "Review"];

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [teamsData, venuesData] = await Promise.all([
          fetchTeams(),
          fetchVenues()
        ])
        setAvailableTeams(teamsData)
        setAvailableVenues(venuesData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" className="mb-4 text-dark-olive hover:text-dark-olive/80" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-dark-olive">Create Tournament</h1>
        <p className="text-olive">Fill in the details to create a new cricket tournament</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex flex-col items-center ${
                step < currentStep ? "text-light-teal" : step === currentStep ? "text-dark-olive" : "text-olive"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  step < currentStep
                    ? "bg-light-teal text-dark-olive"
                    : step === currentStep
                      ? "bg-dark-olive text-beige"
                      : "bg-olive/20 text-olive"
                }`}
              >
                {step}
              </div>
              <span className="text-sm hidden md:block">
                {step === 1 ? "Basic Info" : step === 2 ? "Teams" : step === 3 ? "Format" : "Review"}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-olive/20 h-1 mt-4 rounded-full">
          <div
            className="bg-light-teal h-1 rounded-full transition-all"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Tournament Information</CardTitle>
              <CardDescription>Enter the basic details about the tournament</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tournament Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter tournament name" 
                    required 
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <DatePicker selected={startDate} onSelect={setStartDate} disabled={(date) => date < new Date()} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <DatePicker
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => date < (startDate || new Date())}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Tournament Location</Label>
                  <Input 
                    id="location" 
                    placeholder="Enter location" 
                    required 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Enter tournament description" 
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="button" onClick={handleNext}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Teams</CardTitle>
              <CardDescription>Add teams participating in the tournament</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Teams</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddTeam}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Team
                  </Button>
                </div>

                {teams.map((team) => (
                  <div key={team.id} className="flex items-center gap-2">
                    <Select
                      value={team.name}
                      onValueChange={(value) => handleTeamNameChange(team.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTeams.map((availableTeam) => (
                          <SelectItem 
                            key={availableTeam.teamId} 
                            value={availableTeam.teamName}
                          >
                            {availableTeam.teamName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveTeam(team.id)}
                      disabled={teams.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={handlePrevious}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button type="button" onClick={handleNext}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Tournament Format</CardTitle>
              <CardDescription>Define the format and rules for the tournament</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="format">Match Format</Label>
                  <Select 
                    value={format} 
                    onValueChange={setFormat}
                  >
                    <SelectTrigger id="format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="t20">T20</SelectItem>
                      <SelectItem value="odi">ODI</SelectItem>
                      <SelectItem value="test">Test</SelectItem>
                      <SelectItem value="100-ball">100-ball</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tournamentType">Tournament Type</Label>
                  <Select 
                    value={tournamentType} 
                    onValueChange={setTournamentType}
                  >
                    <SelectTrigger id="tournamentType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="league">League</SelectItem>
                      <SelectItem value="knockout">Knockout</SelectItem>
                      <SelectItem value="group">Group Stage + Knockout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Points System</Label>
                <Tabs defaultValue="default" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="default">Default</TabsTrigger>
                    <TabsTrigger value="custom">Custom</TabsTrigger>
                  </TabsList>
                  <TabsContent value="default" className="p-4 border rounded-md mt-2">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Win</span>
                        <span className="font-medium">2 points</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Tie/No Result</span>
                        <span className="font-medium">1 point</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Loss</span>
                        <span className="font-medium">0 points</span>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="custom" className="space-y-4 p-4 border rounded-md mt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="winPoints">Win Points</Label>
                        <Input id="winPoints" type="number" defaultValue="2" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tiePoints">Tie/No Result Points</Label>
                        <Input id="tiePoints" type="number" defaultValue="1" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lossPoints">Loss Points</Label>
                        <Input id="lossPoints" type="number" defaultValue="0" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bonusPoints">Bonus Points</Label>
                        <Input id="bonusPoints" type="number" defaultValue="0" />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={handlePrevious}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button type="button" onClick={handleNext}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Review & Create</CardTitle>
              <CardDescription>Review the tournament details before creating</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium text-dark-olive">Tournament Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-olive">Tournament Name:</div>
                  <div>{tournamentName || "Not set"}</div>
                  <div className="text-olive">Start Date:</div>
                  <div>{startDate?.toLocaleDateString() || "Not set"}</div>
                  <div className="text-olive">End Date:</div>
                  <div>{endDate?.toLocaleDateString() || "Not set"}</div>
                  <div className="text-olive">Location:</div>
                  <div>{location || "Not set"}</div>
                  <div className="text-olive">Description:</div>
                  <div>{description || "Not set"}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-dark-olive">Teams</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {teams.map((team, index) => (
                    <div key={team.id}>{team.name || `Not selected`}</div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-dark-olive">Format</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-olive">Match Format:</div>
                  <div>{format || "Not set"}</div>
                  <div className="text-olive">Tournament Type:</div>
                  <div>{tournamentType || "Not set"}</div>
                  <div className="text-olive">Points System:</div>
                  <div>
                    Win: {(document.getElementById('winPoints') as HTMLInputElement)?.value || "2"}, 
                    Tie: {(document.getElementById('tiePoints') as HTMLInputElement)?.value || "1"}, 
                    Loss: {(document.getElementById('lossPoints') as HTMLInputElement)?.value || "0"},
                    Bonus: {(document.getElementById('bonusPoints') as HTMLInputElement)?.value || "0"}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={handlePrevious}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button type="submit" className="bg-light-teal hover:bg-teal text-dark-olive">
                Create Tournament
              </Button>
            </CardFooter>
          </Card>
        )}
      </form>
    </div>
  )
}

