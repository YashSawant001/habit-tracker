import React, { useState } from "react";
import { View, ScrollView, Alert, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";

import { useHabitData } from "@/hooks/useHabitData";
import { useHabitStats } from "@/hooks/useHabitStats";
import { createDayTypeHelpers } from "@/utils/dayTypeHelpers";
import { generateWeeklyReport } from "@/utils/reportGenerator";

import { Header } from "@/components/HabitTracker/Header";
import { HelpSection } from "@/components/HabitTracker/HelpSection";
import { DayTypeSection } from "@/components/HabitTracker/DayTypeSection";
import { HabitGrid } from "@/components/HabitTracker/HabitGrid";
import { WeeklyReflections } from "@/components/HabitTracker/WeeklyReflections";
import { HabitDetailModal } from "@/components/HabitTracker/HabitDetailModal";
import { ReportModal } from "@/components/HabitTracker/ReportModal";

export default function ExecuteTab() {
  const insets = useSafeAreaInsets();
  const currentDate = new Date();

  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [showHelp, setShowHelp] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedWeekForReport, setSelectedWeekForReport] = useState(1);
  const [selectedHabitDay, setSelectedHabitDay] = useState(null);
  const [showHabitDetailModal, setShowHabitDetailModal] = useState(false);

  const {
    habits,
    dayTypes,
    weeklyReflections,
    mode,
    setMode,
    setDayTypes,
    setWeeklyReflections,
    updateHabit,
    toggleCompletion,
    updateTime,
    updateProof,
    clearAllData,
  } = useHabitData();

  const {
    days,
    daysInMonth,
    setDayType,
    bulkSetDayType,
    setWeekdaysAs,
    setWeekendsAs,
  } = createDayTypeHelpers(selectedYear, selectedMonth, dayTypes, setDayTypes);

  const {
    isValidCompletion,
    getValidCompletions,
    getHabitStats,
    getWeeklyData,
    getTopHabits,
    getOverallCompletion,
    getDayTypeStats,
  } = useHabitStats(habits, dayTypes, daysInMonth);

  const updateWeeklyReflection = (week, text) => {
    setWeeklyReflections((prev) => ({ ...prev, [week]: text }));
  };

  const handleClearAllData = () => {
    Alert.alert("⚠️ Delete ALL Data?", "This cannot be undone!", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: clearAllData,
      },
    ]);
  };

  const openHabitDetail = (habitId, day) => {
    setSelectedHabitDay({ habitId, day });
    setShowHabitDetailModal(true);
  };

  const exportWeeklyReport = async () => {
    const weekNum = selectedWeekForReport;
    const weekData = getWeeklyData()[weekNum - 1] || getWeeklyData()[0];

    const report = generateWeeklyReport({
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
    });

    try {
      await Clipboard.setStringAsync(report);
      Alert.alert(
        "✅ Report Copied!",
        "Weekly report has been copied to your clipboard. You can now paste it anywhere.",
        [{ text: "OK" }],
      );
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert("Error", "Failed to copy report to clipboard");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Header
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        mode={mode}
        setMode={setMode}
        onShowHelp={() => setShowHelp(!showHelp)}
        onShowReport={() => setShowReportModal(true)}
        onClearData={handleClearAllData}
        insets={insets}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <HelpSection visible={showHelp} />

        <DayTypeSection
          days={days}
          dayTypes={dayTypes}
          setDayType={setDayType}
          bulkSetDayType={bulkSetDayType}
          setWeekdaysAs={setWeekdaysAs}
          setWeekendsAs={setWeekendsAs}
          getDayTypeStats={getDayTypeStats}
        />

        <HabitGrid
          habits={habits}
          days={days}
          getHabitStats={getHabitStats}
          updateHabit={updateHabit}
          toggleCompletion={toggleCompletion}
          openHabitDetail={openHabitDetail}
        />

        <WeeklyReflections
          weeklyData={getWeeklyData()}
          weeklyReflections={weeklyReflections}
          updateWeeklyReflection={updateWeeklyReflection}
        />
      </ScrollView>

      <HabitDetailModal
        visible={showHabitDetailModal}
        onClose={() => setShowHabitDetailModal(false)}
        selectedHabitDay={selectedHabitDay}
        habits={habits}
        updateTime={updateTime}
        updateProof={updateProof}
        toggleCompletion={toggleCompletion}
      />

      <ReportModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        weeklyData={getWeeklyData()}
        selectedWeek={selectedWeekForReport}
        setSelectedWeek={setSelectedWeekForReport}
        onExport={exportWeeklyReport}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flex: 1,
  },
});
