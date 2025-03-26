"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { VenueForm } from "@/components/venues/venue-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Venue {
  venueId: number;
  venueName: string;
  capacity: number;
  venueLocation: string;
  surfaceType: string;
  country: string;
}

// Add new Match interface after the Venue interface
interface Match {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  result: string;
}

interface VenueWithMatches extends Venue {
  matches: Match[];
}

// Modify the static data to include matches (replace the existing staticVenues)
const staticVenues: VenueWithMatches[] = [
  {
    venueId: 1,
    venueName: "Rajiv Gandi International Stadium",
    capacity: 100024,
    venueLocation: "Hyderabad, Telangana",
    surfaceType: "hybrid",
    country: "India",
    matches: [
      {
        matchId: 1,
        homeTeam: "India",
        awayTeam: "Australia",
        date: "2024-01-15",
        result: "India won by 5 wickets"
      }
    ]
  },
  {
    venueId: 2,
    venueName: "Eden Gardens",
    capacity: 68000,
    venueLocation: "Kolkata, West Bengal",
    surfaceType: "grass",
    country: "India",
    matches: [
      {
        matchId: 1,
        homeTeam: "India",
        awayTeam: "Australia",
        date: "2024-01-15",
        result: "India won by 5 wickets"
      }
    ]
  },
  {
    venueId: 3,
    venueName: "Lords Cricket Ground",
    capacity: 30000,
    venueLocation: "London, England",
    surfaceType: "grass",
    country: "England",
    matches: [
      {
        matchId: 1,
        homeTeam: "India",
        awayTeam: "Australia",
        date: "2024-01-15",
        result: "India won by 5 wickets"
      }
    ]
  },
  {
    venueId: 4,
    venueName: "Newlands Cricket Ground",
    capacity: 25000,
    venueLocation: "Cape Town, Western Cape",
    surfaceType: "grass",
    country: "South Africa",
    matches: [
      {
        matchId: 1,
        homeTeam: "India",
        awayTeam: "Australia",
        date: "2024-01-15",
        result: "India won by 5 wickets"
      }
    ]
  },
  {
    venueId: 5,
    venueName: "Dubai International Cricket Stadium",
    capacity: 25000,
    venueLocation: "Dubai, UAE",
    surfaceType: "artificial",
    country: "UAE",
    matches: [
      {
        matchId: 1,
        homeTeam: "India",
        awayTeam: "Australia",
        date: "2024-01-15",
        result: "India won by 5 wickets"
      }
    ]
  }
]


export default function VenuesPage() {
  const [venues, setVenues] = useState<VenueWithMatches[]>([]);
  const [expandedVenue, setExpandedVenue] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Simulate API call with static data
    const fetchVenues = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVenues(staticVenues);
    };
    fetchVenues();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Venues</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Venue
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Venue</DialogTitle>
            </DialogHeader>
            <VenueForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead> {/* For expand/collapse button */}
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Surface Type</TableHead>
              <TableHead>Country</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {venues.map((venue) => (
              <>
                <TableRow key={venue.venueId} className="cursor-pointer hover:bg-gray-100" onClick={() => setExpandedVenue(expandedVenue === venue.venueId ? null : venue.venueId)}>
                  <TableCell>
                    {expandedVenue === venue.venueId ? "▼" : "▶"}
                  </TableCell>
                  <TableCell>{venue.venueName}</TableCell>
                  <TableCell>{venue.venueLocation}</TableCell>
                  <TableCell>{venue.capacity.toLocaleString()}</TableCell>
                  <TableCell className="capitalize">{venue.surfaceType}</TableCell>
                  <TableCell>{venue.country}</TableCell>
                </TableRow>
                {expandedVenue === venue.venueId && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="p-4 bg-gray-50">
                        <h3 className="font-semibold mb-2">Matches Played</h3>
                        {venue.matches.length > 0 ? (
                          <table className="w-full">
                            <thead>
                              <tr>
                                <th className="text-left">Date</th>
                                <th className="text-left">Teams</th>
                                <th className="text-left">Result</th>
                              </tr>
                            </thead>
                            <tbody>
                              {venue.matches.map((match) => (
                                <tr key={match.matchId}>
                                  <td>{new Date(match.date).toLocaleDateString()}</td>
                                  <td>{match.homeTeam} vs {match.awayTeam}</td>
                                  <td>{match.result}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="text-gray-500">No matches played at this venue yet.</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 