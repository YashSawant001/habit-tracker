export function useHabitStats(habits, dayTypes, daysInMonth) {
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isValidCompletion = (habit, day) => {
    return habit.completions[day];
  };

  const getValidCompletions = (habit, filterDayType = null) => {
    return days.filter((day) => {
      const isValid = isValidCompletion(habit, day);
      if (!filterDayType) return isValid;
      return isValid && dayTypes[day] === filterDayType;
    }).length;
  };

  const getHabitStats = (habit) => {
    const completed = getValidCompletions(habit);
    const percentage =
      habit.goal > 0 ? Math.round((completed / habit.goal) * 100) : 0;

    let streak = 0;
    let bestStreak = 0;
    let currentStreak = 0;

    for (let i = daysInMonth; i >= 1; i--) {
      if (isValidCompletion(habit, i)) {
        currentStreak++;
        if (streak === 0) streak = currentStreak;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    const collegeDays = days.filter((d) => dayTypes[d] === "C").length;
    const freeDays = days.filter((d) => dayTypes[d] === "F").length;
    const collegeComplete = getValidCompletions(habit, "C");
    const freeComplete = getValidCompletions(habit, "F");
    const collegePercent =
      collegeDays > 0 ? Math.round((collegeComplete / collegeDays) * 100) : 0;
    const freePercent =
      freeDays > 0 ? Math.round((freeComplete / freeDays) * 100) : 0;

    return {
      completed,
      percentage,
      streak: Math.min(streak, 7),
      bestStreak: Math.min(bestStreak, 7),
      collegePercent,
      freePercent,
      collegeComplete,
      freeComplete,
    };
  };

  const getWeeklyData = () => {
    const weeks = [];
    let currentWeek = [];

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day);
      if (currentWeek.length === 7 || day === daysInMonth) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    }

    return weeks.map((week, weekIndex) => {
      const weekTotal = habits.reduce((sum, habit) => {
        if (!habit.name) return sum;
        return sum + week.filter((day) => isValidCompletion(habit, day)).length;
      }, 0);
      return { week: weekIndex + 1, total: weekTotal, days: week };
    });
  };

  const getTopHabits = () => {
    return habits
      .filter((h) => h.name)
      .map((h) => ({ ...h, stats: getHabitStats(h) }))
      .sort((a, b) => b.stats.percentage - a.stats.percentage)
      .slice(0, 5);
  };

  const getOverallCompletion = () => {
    const activeHabits = habits.filter((h) => h.name);
    if (activeHabits.length === 0) return 0;

    const totalPossible = activeHabits.reduce((sum, h) => sum + h.goal, 0);
    const totalCompleted = activeHabits.reduce(
      (sum, h) => sum + getValidCompletions(h),
      0,
    );

    return totalPossible > 0
      ? Math.round((totalCompleted / totalPossible) * 100)
      : 0;
  };

  const getDayTypeStats = () => {
    const collegeDays = days.filter((d) => dayTypes[d] === "C").length;
    const freeDays = days.filter((d) => dayTypes[d] === "F").length;
    return { collegeDays, freeDays };
  };

  return {
    isValidCompletion,
    getValidCompletions,
    getHabitStats,
    getWeeklyData,
    getTopHabits,
    getOverallCompletion,
    getDayTypeStats,
  };
}
