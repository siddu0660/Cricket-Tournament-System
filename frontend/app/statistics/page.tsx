'use client';

import { useEffect, useState } from 'react';
import { BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamStats } from '@/components/statistics/TeamStats';
import { PlayerStats } from '@/components/statistics/PlayerStats';
import { TournamentStats } from '@/components/statistics/TournamentStats';
import { MatchStats } from '@/components/statistics/MatchStats';

export default function StatisticsPage() {
  return (
    <div>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2">
            <BarChart className="h-6 w-6 text-cricket-darkOlive" />
            <span className="text-xl font-bold">Statistics</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Statistics</h1>
        
        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tournaments">Tournament Statistics</TabsTrigger>
            <TabsTrigger value="teams">Team Statistics</TabsTrigger>
            <TabsTrigger value="players">Player Statistics</TabsTrigger>
            <TabsTrigger value="matches">Match Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="teams" className="mt-6">
            <TeamStats />
          </TabsContent>
          
          <TabsContent value="players" className="mt-6">
            <PlayerStats />
          </TabsContent>
          
          <TabsContent value="tournaments" className="mt-6">
            <TournamentStats />
          </TabsContent>
          
          <TabsContent value="matches" className="mt-6">
            <MatchStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 