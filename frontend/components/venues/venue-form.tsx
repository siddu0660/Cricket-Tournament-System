"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const venueFormSchema = z.object({
  venueName: z.string().min(2, "Venue name must be at least 2 characters"),
  capacity: z.string().transform((val) => parseInt(val, 10)),
  venueLocation: z.string().min(2, "Location must be at least 2 characters"),
  surfaceType: z.string().min(2, "Surface type must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});

type VenueFormValues = z.infer<typeof venueFormSchema>;

interface VenueFormProps {
  onSuccess?: () => void;
  initialData?: VenueFormValues;
}

export function VenueForm({ onSuccess, initialData }: VenueFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<VenueFormValues>({
    resolver: zodResolver(venueFormSchema),
    defaultValues: initialData || {
      venueName: "",
      capacity: "",
      venueLocation: "",
      surfaceType: "",
      country: "",
    },
  });

  async function onSubmit(data: VenueFormValues) {
    setIsLoading(true);
    try {
      // TODO: Implement API call to create/update venue
      // const response = await fetch('/api/venues', {
      //   method: initialData ? 'PUT' : 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to save venue');
      // }

      toast({
        title: "Success",
        description: `Venue ${initialData ? "updated" : "created"} successfully`,
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save venue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="venueName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter venue name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter capacity" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="venueLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter venue location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="surfaceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Surface Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select surface type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="grass">Grass</SelectItem>
                  <SelectItem value="artificial">Artificial</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="Enter country" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Venue" : "Create Venue"}
        </Button>
      </form>
    </Form>
  );
} 