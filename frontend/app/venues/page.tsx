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

// Static venue data
const staticVenues: Venue[] = [
  {
    venueId: 1,
    venueName: "Rajiv Gandi International Stadium",
    capacity: 100024,
    venueLocation: "Hyderabad, Telangana",
    surfaceType: "hybrid",
    country: "India"
  },
  {
    venueId: 2,
    venueName: "Eden Gardens",
    capacity: 68000,
    venueLocation: "Kolkata, West Bengal",
    surfaceType: "grass",
    country: "India"
  },
  {
    venueId: 3,
    venueName: "Lords Cricket Ground",
    capacity: 30000,
    venueLocation: "London, England",
    surfaceType: "grass",
    country: "England"
  },
  {
    venueId: 4,
    venueName: "Newlands Cricket Ground",
    capacity: 25000,
    venueLocation: "Cape Town, Western Cape",
    surfaceType: "grass",
    country: "South Africa"
  },
  {
    venueId: 5,
    venueName: "Dubai International Cricket Stadium",
    capacity: 25000,
    venueLocation: "Dubai, UAE",
    surfaceType: "artificial",
    country: "UAE"
  }
];

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
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
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Surface Type</TableHead>
              <TableHead>Country</TableHead>
              {/* <TableHead>Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {venues.map((venue) => (
              <TableRow key={venue.venueId}>
                <TableCell>{venue.venueName}</TableCell>
                <TableCell>{venue.venueLocation}</TableCell>
                <TableCell>{venue.capacity.toLocaleString()}</TableCell>
                <TableCell className="capitalize">{venue.surfaceType}</TableCell>
                <TableCell>{venue.country}</TableCell>
                {/* <TableCell>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 