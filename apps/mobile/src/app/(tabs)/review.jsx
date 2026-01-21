// REVIEW Tab - Analytics Dashboard
// Displays habit statistics, charts, and performance metrics
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ReviewTab() {
  const insets = useSafeAreaInsets();
  const currentDate = new Date();

  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [mode, setMode] = useState("College");
  const [dayTypes, setDayTypes] = useState({});
  const [habits, setHabits] = useState([]);

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

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Load data from AsyncStorage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedData = await AsyncStorage.getItem("habitTrackData");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.habits) setHabits(parsed.habits);
        if (parsed.dayTypes) setDayTypes(parsed.dayTypes);
        if (parsed.mode) setMode(parsed.mode);
      }
    } catch (e) {
      console.error("Load error:", e);
    }
  };

  const isValidCompletion = (habit, day) => {
    return habit.completions && habit.completions[day];
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

  const getDailyConsistency = () => {
    return days.map((day) => {
      const completed = habits.filter(
        (h) => h.name && isValidCompletion(h, day),
      ).length;
      const total = habits.filter((h) => h.name).length;
      return {
        day,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    });
  };

  const getOverallCompletion = () => {
    const activeHabits = habits.filter((h) => h.name);
    if (activeHabits.length === 0) return 0;

    const totalPossible = activeHabits.reduce(
      (sum, h) => sum + (h.goal || 0),
      0,
    );
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

  const overallCompletion = getOverallCompletion();
  const dayTypeStats = getDayTypeStats();
  const topHabits = getTopHabits();
  const weeklyData = getWeeklyData();
  const dailyConsistency = getDailyConsistency();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Performance Review</Text>
        <Text style={styles.subtitle}>
          {months[selectedMonth]} {selectedYear}
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Overall</Text>
            <Text style={styles.summaryValue}>{overallCompletion}%</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>College Days</Text>
            <Text style={[styles.summaryValue, styles.valueBlue]}>
              {dayTypeStats.collegeDays}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Free Days</Text>
            <Text style={[styles.summaryValue, styles.valueGreen]}>
              {dayTypeStats.freeDays}
            </Text>
          </View>
        </View>

        {/* Performance by Day Type Table */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Performance by Day Type</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderText, styles.tableColHabit]}>
                Habit
              </Text>
              <Text style={[styles.tableHeaderText, styles.tableColStat]}>
                Overall %
              </Text>
              <Text style={[styles.tableHeaderText, styles.tableColStat]}>
                College %
              </Text>
              <Text style={[styles.tableHeaderText, styles.tableColStat]}>
                Free %
              </Text>
            </View>
            {/* Table Body */}
            {habits
              .filter((h) => h.name)
              .map((habit, idx) => {
                const stats = getHabitStats(habit);
                return (
                  <View
                    key={habit.id}
                    style={[
                      styles.tableRow,
                      idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
                    ]}
                  >
                    <Text
                      style={[styles.tableText, styles.tableColHabit]}
                      numberOfLines={2}
                    >
                      {habit.name}
                    </Text>
                    <Text
                      style={[
                        styles.tableText,
                        styles.tableColStat,
                        styles.tableBold,
                      ]}
                    >
                      {stats.percentage}%
                    </Text>
                    <Text
                      style={[
                        styles.tableText,
                        styles.tableColStat,
                        styles.tableBold,
                        styles.textBlue,
                      ]}
                    >
                      {stats.collegePercent}%
                    </Text>
                    <Text
                      style={[
                        styles.tableText,
                        styles.tableColStat,
                        styles.tableBold,
                        styles.textGreen,
                      ]}
                    >
                      {stats.freePercent}%
                    </Text>
                  </View>
                );
              })}
            {habits.filter((h) => h.name).length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No habits tracked yet</Text>
              </View>
            )}
          </View>
        </View>

        {/* Top 5 Habits */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Top 5 Habits</Text>
          {topHabits.map((habit, idx) => (
            <View key={habit.id} style={styles.topHabitItem}>
              <View
                style={[
                  styles.topHabitRank,
                  idx === 0
                    ? styles.topHabitRankFirst
                    : styles.topHabitRankOther,
                ]}
              >
                <Text
                  style={[
                    styles.topHabitRankText,
                    idx === 0
                      ? styles.topHabitRankTextFirst
                      : styles.topHabitRankTextOther,
                  ]}
                >
                  {idx + 1}
                </Text>
              </View>
              <View style={styles.topHabitContent}>
                <View style={styles.topHabitHeader}>
                  <Text style={styles.topHabitName} numberOfLines={1}>
                    {habit.name}
                  </Text>
                  <Text style={styles.topHabitPercentage}>
                    {habit.stats.percentage}%
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${habit.stats.percentage}%` },
                    ]}
                  />
                </View>
              </View>
            </View>
          ))}
          {topHabits.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No habits to display</Text>
            </View>
          )}
        </View>

        {/* Weekly Progress Chart */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <View style={styles.chartContainer}>
            {weeklyData.map(({ week, total }) => {
              const maxTotal = Math.max(...weeklyData.map((w) => w.total), 1);
              const heightPercent = (total / maxTotal) * 100;

              return (
                <View key={week} style={styles.barWrapper}>
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        { height: `${Math.max(heightPercent, 15)}%` },
                      ]}
                    >
                      <Text style={styles.barValue}>{total}</Text>
                    </View>
                  </View>
                  <Text style={styles.barLabel}>W{week}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Daily Consistency Chart */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Daily Consistency</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={styles.dailyChartContainer}>
              {dailyConsistency.map(({ day, percentage }) => (
                <View key={day} style={styles.dailyBarWrapper}>
                  <View style={styles.dailyBarContainer}>
                    <View
                      style={[
                        styles.dailyBar,
                        { height: Math.max(percentage * 1.5, 4) },
                      ]}
                    />
                  </View>
                  <Text style={styles.dailyLabel}>{day}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  summaryGrid: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e293b",
  },
  valueBlue: {
    color: "#2563eb",
  },
  valueGreen: {
    color: "#16a34a",
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
  table: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#cbd5e1",
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableRowEven: {
    backgroundColor: "#fff",
  },
  tableRowOdd: {
    backgroundColor: "#f8fafc",
  },
  tableColHabit: {
    flex: 2,
    textAlign: "left",
  },
  tableColStat: {
    flex: 1,
    textAlign: "center",
  },
  tableText: {
    fontSize: 12,
    color: "#1e293b",
  },
  tableBold: {
    fontWeight: "bold",
  },
  textBlue: {
    color: "#2563eb",
  },
  textGreen: {
    color: "#16a34a",
  },
  emptyState: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#94a3b8",
  },
  topHabitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  topHabitRank: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  topHabitRankFirst: {
    backgroundColor: "#1e293b",
  },
  topHabitRankOther: {
    backgroundColor: "#f1f5f9",
  },
  topHabitRankText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  topHabitRankTextFirst: {
    color: "#fff",
  },
  topHabitRankTextOther: {
    color: "#64748b",
  },
  topHabitContent: {
    flex: 1,
  },
  topHabitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  topHabitName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e293b",
    flex: 1,
  },
  topHabitPercentage: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1e293b",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#334155",
    borderRadius: 999,
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 200,
    gap: 8,
  },
  barWrapper: {
    flex: 1,
    alignItems: "center",
    height: "100%",
  },
  barContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bar: {
    width: "100%",
    backgroundColor: "#1e293b",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 8,
    minHeight: "15%",
  },
  barValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  barLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#334155",
    marginTop: 8,
  },
  dailyChartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 200,
    gap: 2,
    paddingHorizontal: 4,
  },
  dailyBarWrapper: {
    alignItems: "center",
    height: "100%",
    width: 20,
  },
  dailyBarContainer: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
  },
  dailyBar: {
    width: "100%",
    backgroundColor: "#334155",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  dailyLabel: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 4,
  },
});
