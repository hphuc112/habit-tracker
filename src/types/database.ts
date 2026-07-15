export type Habit = {
  id: string;
  user_id: string;
  name: string;
  created_at?: string;
};

export type HabitCompletion = {
  id: string;
  habit_id: string;
  completed_at: string;
  note?: string | null;
};
