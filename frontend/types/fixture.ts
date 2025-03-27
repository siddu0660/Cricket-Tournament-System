export interface Fixture {
  team1: string;
  team2: string;
  date: Date | null;
  venue: string | null;
  stage?: 'group' | 'knockout';
} 