import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CalendarDays, Trophy, Users, MapPin, BarChart3, Clock } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="bg-gradient-to-r from-dark-olive to-teal rounded-lg p-8 text-beige">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Cricket Tournament Manager</h1>
            <p className="text-lg mb-6">
              A comprehensive platform for managing cricket tournaments, teams, players, and statistics.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-light-teal hover:bg-teal text-dark-olive">
                <Link href="/tournaments/create">Create Tournament</Link>
              </Button>
              <Button asChild variant="outline" className="bg-light-teal hover:bg-teal text-dark-olive">
                <Link href="/tournaments">View Tournaments</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-dark-olive">Active Tournaments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-olive/20 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-dark-olive">IPL 2023</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>Apr 1 - May 30, 2023</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-olive" />
                    <span>Multiple venues, India</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-olive" />
                    <span>10 Teams</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-olive" />
                    <span>T20 Format</span>
                  </div>
                  <div className="mt-4">
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href={`/tournaments/${i}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button asChild variant="outline" className="border-dark-olive text-dark-olive">
            <Link href="/tournaments">View All Tournaments</Link>
          </Button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-dark-olive">Upcoming Matches</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-olive/20 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-olive" />
                    <span className="text-sm text-olive">IPL 2023</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-olive" />
                    <span className="text-sm text-olive">7:30 PM IST</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="h-12 w-12 bg-light-teal rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="font-bold text-dark-olive">CSK</span>
                    </div>
                    <h3 className="font-medium text-dark-olive">Chennai Super Kings</h3>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-dark-olive">VS</div>
                  </div>
                  <div className="text-center">
                    <div className="h-12 w-12 bg-light-teal rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="font-bold text-dark-olive">MI</span>
                    </div>
                    <h3 className="font-medium text-dark-olive">Mumbai Indians</h3>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-olive mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>Wankhede Stadium, Mumbai</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-olive">
                    <CalendarDays className="h-4 w-4" />
                    <span>April 15, 2023</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={`/matches/${i}`}>Match Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button asChild variant="outline" className="border-dark-olive text-dark-olive">
            <Link href="/matches">View All Matches</Link>
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-olive/20">
          <CardHeader>
            <CardTitle className="text-dark-olive flex items-center gap-2">
              <Trophy className="h-5 w-5 text-teal" />
              Tournaments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-dark-olive">5</div>
            <p className="text-olive">Active tournaments</p>
          </CardContent>
        </Card>
        <Card className="border-olive/20">
          <CardHeader>
            <CardTitle className="text-dark-olive flex items-center gap-2">
              <Users className="h-5 w-5 text-teal" />
              Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-dark-olive">24</div>
            <p className="text-olive">Registered teams</p>
          </CardContent>
        </Card>
        <Card className="border-olive/20">
          <CardHeader>
            <CardTitle className="text-dark-olive flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-teal" />
              Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-dark-olive">156</div>
            <p className="text-olive">Completed matches</p>
          </CardContent>
        </Card>
        <Card className="border-olive/20">
          <CardHeader>
            <CardTitle className="text-dark-olive flex items-center gap-2">
              <MapPin className="h-5 w-5 text-teal" />
              Venues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-dark-olive">12</div>
            <p className="text-olive">Active venues</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

