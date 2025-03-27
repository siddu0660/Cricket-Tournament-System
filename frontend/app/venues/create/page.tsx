"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import axios from "axios";


export default function CreateVenuePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    venueName: "",
    capacity: "",
    venueLocation: "",
    surfaceType: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Convert capacity to number
      const payload = {
        ...formData,
        capacity: parseInt(formData.capacity)
      };

      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/venue`, payload);
      router.push('/venues');
    } catch (error) {
      setError("Failed to create venue. Please try again.");
      console.error("Error creating venue:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Create New Venue</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="venueName" className="text-sm font-medium">
            Venue Name
          </label>
          <Input
            id="venueName"
            name="venueName"
            value={formData.venueName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="capacity" className="text-sm font-medium">
            Capacity
          </label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="venueLocation" className="text-sm font-medium">
            Location
          </label>
          <Input
            id="venueLocation"
            name="venueLocation"
            value={formData.venueLocation}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="surfaceType" className="text-sm font-medium">
            Surface Type
          </label>
          <select
            id="surfaceType"
            name="surfaceType"
            value={formData.surfaceType}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select surface type</option>
            <option value="grass">Grass</option>
            <option value="artificial">Artificial</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-medium">
            Country
          </label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Venue"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/venues')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
} 