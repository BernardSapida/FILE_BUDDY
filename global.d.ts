interface TimeDuration {
   days: number;
   hours: number;
   minutes: number;
}

interface Builder {
   id: string;
   title: string;
   timerId: string;
   upgrade_type: 'BUILDING' | 'LABORATORY';
   started_date: date;
   time_duration: TimeDuration;
}

interface Timer {
   id: string;
   name: string;
   builder_apprentice_level: number;
   goldpass: boolean;
   league: 'BRONZE' | 'SILVER' | 'GOLD' | 'CRYSTAL' | 'MASTER' | 'CHAMPION' | 'TITAN' | 'LEGEND';
   builders: Builder[];
}

interface CountdownTimer {
   remainingMilliseconds: number;
   time: string;
   progress: number;
   remainingDays: number;
   remainingHours: number;
   remainingMinutes: number;
   isDone: boolean;
}
