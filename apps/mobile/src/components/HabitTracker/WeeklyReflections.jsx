import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export function WeeklyReflections({
  weeklyData,
  weeklyReflections,
  updateWeeklyReflection,
}) {
  return (
    <View style={styles.reflectionsSection}>
      <Text style={styles.reflectionsTitle}>📝 Weekly Reflections</Text>
      {weeklyData.map((week, idx) => (
        <View key={idx} style={styles.reflectionCard}>
          <View style={styles.reflectionHeader}>
            <Text style={styles.reflectionWeek}>Week {week.week}</Text>
            <View style={styles.reflectionBadge}>
              <Text style={styles.reflectionBadgeText}>{week.total}</Text>
            </View>
          </View>
          <Text style={styles.reflectionDays}>
            Days {week.days[0]}-{week.days[week.days.length - 1]}
          </Text>
          <TextInput
            value={weeklyReflections[week.week] || ""}
            onChangeText={(text) => updateWeeklyReflection(week.week, text)}
            placeholder="What went well? What to improve?"
            placeholderTextColor="#94a3b8"
            multiline
            maxLength={200}
            style={styles.reflectionInput}
          />
          <Text style={styles.reflectionCounter}>
            {(weeklyReflections[week.week] || "").length}/200
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  reflectionsSection: {
    padding: 16,
  },
  reflectionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
  reflectionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  reflectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reflectionWeek: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
  },
  reflectionBadge: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  reflectionBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  reflectionDays: {
    fontSize: 11,
    color: "#64748b",
    marginBottom: 12,
  },
  reflectionInput: {
    backgroundColor: "#f8fafc",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
    minHeight: 80,
    textAlignVertical: "top",
  },
  reflectionCounter: {
    fontSize: 11,
    color: "#94a3b8",
    textAlign: "right",
    marginTop: 4,
  },
});
