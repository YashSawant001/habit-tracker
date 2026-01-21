export function generateWeeklyReport({
  weekNum,
  selectedMonth,
  selectedYear,
  weekData,
  habits,
  getHabitStats,
  getTopHabits,
  getDayTypeStats,
  getOverallCompletion,
  getWeeklyData,
  mode,
}) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const activeHabits = habits.filter((h) => h.name);
  const topHabits = getTopHabits();
  const dayTypeStats = getDayTypeStats();
  const overallCompletion = getOverallCompletion();

  const avgCompletion =
    activeHabits.length > 0
      ? activeHabits.reduce((sum, h) => sum + getHabitStats(h).percentage, 0) /
        activeHabits.length
      : 0;

  const strugglingHabits = activeHabits.filter(
    (h) => getHabitStats(h).percentage < 50,
  );
  const excellingHabits = activeHabits.filter(
    (h) => getHabitStats(h).percentage >= 80,
  );
  const weeklyTrend = getWeeklyData().map((w) => w.total);
  const isImproving =
    weeklyTrend.length >= 2 &&
    weeklyTrend[weeklyTrend.length - 1] > weeklyTrend[weeklyTrend.length - 2];

  let mentorInsights = [];
  if (overallCompletion >= 80) {
    mentorInsights.push(
      "🏆 EXCEPTIONAL: Top 5% performance. Maintain momentum.",
    );
  } else if (overallCompletion >= 60) {
    mentorInsights.push(
      "✅ SOLID: Strong foundations. Push for 80%+ consistency.",
    );
  } else if (overallCompletion >= 40) {
    mentorInsights.push(
      "⚠️ NEEDS WORK: Foundation shaky. Focus on 3 core habits first.",
    );
  } else {
    mentorInsights.push(
      "🚨 CRITICAL: Reset needed. Pick ONE habit, master 7 days straight.",
    );
  }

  if (strugglingHabits.length > 0) {
    mentorInsights.push(
      `📉 STRUGGLING: ${strugglingHabits
        .map((h) => h.name)
        .slice(0, 3)
        .join(", ")}. Lower goals, fix environment, add triggers.`,
    );
  }

  if (excellingHabits.length > 0) {
    mentorInsights.push(
      `🌟 WINNING: ${excellingHabits
        .slice(0, 3)
        .map((h) => h.name)
        .join(", ")}. Replicate this system.`,
    );
  }

  if (isImproving) {
    mentorInsights.push(
      "📈 MOMENTUM: Last week > previous. Don't break the chain.",
    );
  } else if (weeklyTrend.length >= 2) {
    mentorInsights.push("📉 MOMENTUM LOSS: Last week < previous. Fix it NOW.");
  }

  const report = `╔═══════════════════════════════════════════════════════╗
║           WEEKLY PERFORMANCE REPORT                   ║
║        ${months[selectedMonth]} ${selectedYear} - Week ${weekNum}                     ║
╚═══════════════════════════════════════════════════════╝
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 EXECUTIVE SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall Completion: ${overallCompletion}%
Average Success:    ${Math.round(avgCompletion)}%
Weekly Total:       ${weekData.total} habits
Active Tracking:    ${activeHabits.length} habits
Momentum:           ${isImproving ? "📈 UP" : "📉 DOWN"}
College Days: ${dayTypeStats.collegeDays}
Free Days:    ${dayTypeStats.freeDays}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 TOP 5 HABITS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${topHabits
  .map((h, i) => {
    const stats = getHabitStats(h);
    const bar =
      "█".repeat(Math.floor(stats.percentage / 5)) +
      "░".repeat(20 - Math.floor(stats.percentage / 5));
    return `${i + 1}. ${h.name.padEnd(35)} ${stats.percentage}%
   ${bar} [${stats.completed}/${h.goal}]
   Streak: ${stats.streak} | Best: ${stats.bestStreak}`;
  })
  .join("\n\n")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 WEEKLY TREND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${getWeeklyData()
  .map(
    (w) => `Week ${w.week}: ${"█".repeat(Math.floor(w.total / 5))} ${w.total}`,
  )
  .join("\n")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ NEEDS ATTENTION (<50%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${
  strugglingHabits.length > 0
    ? strugglingHabits
        .map((h) => {
          const stats = getHabitStats(h);
          return `❌ ${h.name}: ${stats.percentage}% (${stats.completed}/${h.goal})`;
        })
        .join("\n")
    : "✅ All habits above 50%!"
}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 MENTOR INSIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${mentorInsights.join("\n\n")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 COMMANDS FOR NEXT WEEK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${
  overallCompletion >= 80
    ? "✅ MAINTAIN & EXPAND: Add one challenging habit. Teach your system to someone."
    : overallCompletion >= 60
      ? "⚡ OPTIMIZE & PUSH: Get top 3 habits to 90%+. Kill #1 time-waster for 7 days."
      : overallCompletion >= 40
        ? "🔥 RESET & FOCUS: Track only 3 core habits. Set phone reminders. Fix environment."
        : "🚨 EMERGENCY: ONE habit only. 7 days straight. Delete distractions. Daily accountability text."
}
Generated: ${new Date().toLocaleString()}
Mode: ${mode}
`;

  return report;
}
