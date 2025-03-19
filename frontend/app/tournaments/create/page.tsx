"use client"

import type React from "react"

import { useState } from "react"
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
  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [fixtureType, setFixtureType] = useState<'group' | 'knockout'>('group')

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted")
    router.push("/tournaments")
  }

  const generateFixtures = () => {
    const newFixtures = []
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        newFixtures.push({
          team1: teams[i].name,
          team2: teams[j].name,
          date: null,
          venue: null
        })
      }
    }
    setFixtures(newFixtures)
  }




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
          {[1, 2, 3, 4, 5].map((step) => (
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
                {step === 1 ? "Basic Info" : step === 2 ? "Teams" : step === 3 ? "Format" : step === 4 ? "Fixtures" : "Review"}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-olive/20 h-1 mt-4 rounded-full">
          <div
            className="bg-light-teal h-1 rounded-full transition-all"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
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
                  <Input id="name" placeholder="Enter tournament name" required />
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
                  <Input id="location" placeholder="Enter location" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter tournament description" rows={4} />
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
                  <Button type="button" variant="outline" size="sm" onClick={handleAddTeam} className="text-dark-olive">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Team
                  </Button>
                </div>

                {teams.map((team) => (
                  <div key={team.id} className="flex items-center gap-2">
                    <Input
                      placeholder={`Team ${team.id} name`}
                      value={team.name}
                      onChange={(e) => handleTeamNameChange(team.id, e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveTeam(team.id)}
                      disabled={teams.length === 1}
                      className="text-destructive"
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
                  <Select defaultValue="t20">
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
                  <Select defaultValue="league">
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
              <CardTitle>Fixtures</CardTitle>
              <CardDescription>Set up group stage and knockout matches</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="group" className="w-full" onValueChange={(value) => setFixtureType(value as 'group' | 'knockout')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="group">Group Stage</TabsTrigger>
                  <TabsTrigger value="knockout">Knockout Stage</TabsTrigger>
                </TabsList>

                <TabsContent value="group" className="space-y-4">
                  {fixtures.length === 0 ? (
                    <div className="text-center py-4">
                      <Button 
                        type="button" 
                        onClick={generateFixtures}
                        className="text-dark-olive"
                      >
                        Generate Group Stage Fixtures
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-sm text-olive mb-4">Group Stage Matches</div>
                      {fixtures.map((fixture, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md">
                          <div className="flex items-center justify-center text-center">
                            <span className="font-medium">{fixture.team1}</span>
                            <span className="mx-3">vs</span>
                            <span className="font-medium">{fixture.team2}</span>
                          </div>
                          <div>
                            <Label>Match Date</Label>
                            <DatePicker 
                              selected={fixture.date || undefined}
                              onSelect={(date) => {
                                const newFixtures = [...fixtures];
                                newFixtures[index].date = date || null;
                                setFixtures(newFixtures);
                              }}
                              disabled={(date) => date < (startDate || new Date()) || date > (endDate || new Date(2100, 0, 1))}
                            />
                          </div>
                          <div>
                            <Label>Venue</Label>
                            <Input
                              placeholder="Enter venue"
                              value={fixture.venue || ''}
                              onChange={(e) => {
                                const newFixtures = [...fixtures];
                                newFixtures[index].venue = e.target.value;
                                setFixtures(newFixtures);
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="knockout" className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-olive">Knockout Stage Matches</div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setFixtures([...fixtures, {
                          team1: '',
                          team2: '',
                          date: null,
                          venue: null
                        }])
                      }}
                      className="text-dark-olive"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Knockout Match
                    </Button>
                  </div>

                  {fixtures.filter(f => f.team1 === '' || f.team2 === '').map((fixture, index) => (
                    <div key={`knockout-${index}`} className="grid grid-cols-1 gap-4 p-4 border rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Team 1</Label>
                          <Select
                            value={fixture.team1}
                            onValueChange={(value) => {
                              const newFixtures = [...fixtures];
                              const targetIndex = fixtures.indexOf(fixture);
                              newFixtures[targetIndex] = { ...fixture, team1: value };
                              setFixtures(newFixtures);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select team" />
                            </SelectTrigger>
                            <SelectContent>
                              {teams.map((team) => (
                                <SelectItem key={team.id} value={team.name}>
                                  {team.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Team 2</Label>
                          <Select
                            value={fixture.team2}
                            onValueChange={(value) => {
                              const newFixtures = [...fixtures];
                              const targetIndex = fixtures.indexOf(fixture);
                              newFixtures[targetIndex] = { ...fixture, team2: value };
                              setFixtures(newFixtures);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select team" />
                            </SelectTrigger>
                            <SelectContent>
                              {teams.map((team) => (
                                <SelectItem key={team.id} value={team.name}>
                                  {team.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Match Date</Label>
                          <DatePicker 
                            selected={fixture.date || undefined}
                            onSelect={(date) => {
                              const newFixtures = [...fixtures];
                              const targetIndex = fixtures.indexOf(fixture);
                              newFixtures[targetIndex] = { ...fixture, date: date || null };
                              setFixtures(newFixtures);
                            }}
                            disabled={(date) => date < (startDate || new Date()) || date > (endDate || new Date(2100, 0, 1))}
                          />
                        </div>
                        <div>
                          <Label>Venue</Label>
                          <Input
                            placeholder="Enter venue"
                            value={fixture.venue || ''}
                            onChange={(e) => {
                              const newFixtures = [...fixtures];
                              const targetIndex = fixtures.indexOf(fixture);
                              newFixtures[targetIndex] = { ...fixture, venue: e.target.value };
                              setFixtures(newFixtures);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={handlePrevious}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button 
                type="button" 
                onClick={handleNext}
                disabled={fixtures.length === 0}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 5 && (
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
                  <div>IPL 2023</div>
                  <div className="text-olive">Start Date:</div>
                  <div>{startDate?.toLocaleDateString() || "Not set"}</div>
                  <div className="text-olive">End Date:</div>
                  <div>{endDate?.toLocaleDateString() || "Not set"}</div>
                  <div className="text-olive">Location:</div>
                  <div>Multiple venues, India</div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-dark-olive">Teams</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {teams.map((team) => (
                    <div key={team.id}>{team.name || `Team ${team.id}`}</div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-dark-olive">Format</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-olive">Match Format:</div>
                  <div>T20</div>
                  <div className="text-olive">Tournament Type:</div>
                  <div>League</div>
                  <div className="text-olive">Points System:</div>
                  <div>Default (Win: 2, Tie: 1, Loss: 0)</div>
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

