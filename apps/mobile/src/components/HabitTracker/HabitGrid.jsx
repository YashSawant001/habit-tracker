import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";

export function HabitGrid({
  habits,
  days,
  getHabitStats,
  updateHabit,
  toggleCompletion,
  openHabitDetail,
}) {
  const getCellStatus = (habit, day) => {
    return habit.completions[day] ? "valid" : "empty";
  };

  return (
    <View style={styles.trackerContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View>
          <View style={styles.tableHeader}>
            <View style={styles.headerCell}>
              <Text style={styles.headerText}>Habit</Text>
            </View>
            <View style={styles.headerCellSmall}>
              <Text style={styles.headerText}>Goal</Text>
            </View>
            <View style={styles.headerCellSmall}>
              <Text style={styles.headerText}>Done</Text>
            </View>
            <View style={styles.headerCellSmall}>
              <Text style={styles.headerText}>%</Text>
            </View>
            <View style={styles.headerCellMedium}>
              <Text style={styles.headerText}>Streak</Text>
            </View>
            <View style={styles.headerCellMedium}>
              <Text style={styles.headerText}>Best</Text>
            </View>
            {days.map((day) => (
              <View key={day} style={styles.headerCellDay}>
                <Text style={styles.headerText}>{day}</Text>
              </View>
            ))}
          </View>

          {habits.map((habit, idx) => {
            const stats = getHabitStats(habit);
            return (
              <View
                key={habit.id}
                style={[
                  styles.tableRow,
                  idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
                ]}
              >
                <View style={styles.cellHabit}>
                  <TextInput
                    value={habit.name}
                    onChangeText={(text) => updateHabit(habit.id, "name", text)}
                    placeholder={`Habit ${habit.id + 1}`}
                    placeholderTextColor="#94a3b8"
                    style={styles.habitInput}
                  />
                </View>

                <View style={styles.cellSmall}>
                  <TextInput
                    value={String(habit.goal)}
                    onChangeText={(text) =>
                      updateHabit(habit.id, "goal", Number(text) || 0)
                    }
                    keyboardType="number-pad"
                    style={styles.goalInput}
                  />
                </View>

                <View style={styles.cellSmall}>
                  <Text style={styles.statText}>{stats.completed}</Text>
                </View>

                <View style={styles.cellSmall}>
                  <Text
                    style={[
                      styles.statText,
                      stats.percentage >= 100
                        ? styles.statGreen
                        : stats.percentage >= 70
                          ? styles.statDark
                          : styles.statGray,
                    ]}
                  >
                    {stats.percentage}
                  </Text>
                </View>

                <View style={styles.cellMedium}>
                  {stats.streak > 0 ? (
                    <View style={styles.streakBadge}>
                      <Text style={styles.streakText}>🔥{stats.streak}</Text>
                    </View>
                  ) : (
                    <Text style={styles.statGray}>-</Text>
                  )}
                </View>

                <View style={styles.cellMedium}>
                  {stats.bestStreak > 0 ? (
                    <View style={styles.bestStreakBadge}>
                      <Text style={styles.streakText}>
                        ⭐{stats.bestStreak}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.statGray}>-</Text>
                  )}
                </View>

                {days.map((day) => {
                  const status = getCellStatus(habit, day);
                  const isCompleted = status === "valid";

                  return (
                    <View key={day} style={styles.cellDay}>
                      <TouchableOpacity
                        style={[
                          styles.dayButton,
                          isCompleted
                            ? styles.dayButtonCompleted
                            : styles.dayButtonEmpty,
                        ]}
                        onPress={() => {
                          if (isCompleted) {
                            openHabitDetail(habit.id, day);
                          } else {
                            toggleCompletion(habit.id, day);
                          }
                        }}
                        onLongPress={() => {
                          if (isCompleted) {
                            toggleCompletion(habit.id, day);
                          }
                        }}
                      >
                        <Text
                          style={[
                            styles.dayButtonText,
                            isCompleted
                              ? styles.dayButtonTextCompleted
                              : styles.dayButtonTextEmpty,
                          ]}
                        >
                          {isCompleted ? "✓" : day}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  trackerContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerCell: {
    width: 200,
    padding: 12,
    justifyContent: "center",
  },
  headerCellSmall: {
    width: 50,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCellMedium: {
    width: 60,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCellDay: {
    width: 48,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableRowEven: {
    backgroundColor: "#fff",
  },
  tableRowOdd: {
    backgroundColor: "#f8fafc",
  },
  cellHabit: {
    width: 200,
    padding: 8,
    justifyContent: "center",
  },
  habitInput: {
    fontSize: 11,
    color: "#1e293b",
  },
  cellSmall: {
    width: 50,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cellMedium: {
    width: 60,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cellDay: {
    width: 48,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  goalInput: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1e293b",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 4,
    textAlign: "center",
    width: 40,
  },
  statText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  statGreen: {
    color: "#16a34a",
  },
  statDark: {
    color: "#1e293b",
  },
  statGray: {
    color: "#cbd5e1",
  },
  streakBadge: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bestStreakBadge: {
    backgroundColor: "#d97706",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  streakText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  dayButtonCompleted: {
    backgroundColor: "#1e293b",
  },
  dayButtonEmpty: {
    backgroundColor: "#f1f5f9",
    borderWidth: 2,
    borderColor: "#cbd5e1",
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  dayButtonTextCompleted: {
    color: "#fff",
    fontSize: 18,
  },
  dayButtonTextEmpty: {
    color: "#94a3b8",
  },
});
