import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export function DayTypeSection({
  days,
  dayTypes,
  setDayType,
  bulkSetDayType,
  setWeekdaysAs,
  setWeekendsAs,
  getDayTypeStats,
}) {
  return (
    <View style={styles.dayTypeSection}>
      <View style={styles.dayTypeHeader}>
        <Text style={styles.dayTypeTitle}>Day Type</Text>
        <View style={styles.dayTypeBulkButtons}>
          <TouchableOpacity
            style={styles.bulkButton}
            onPress={() => setWeekdaysAs("C")}
          >
            <Text style={styles.bulkButtonText}>Weekdays→C</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bulkButton, styles.bulkButtonGreen]}
            onPress={() => setWeekendsAs("F")}
          >
            <Text style={styles.bulkButtonText}>Weekends→F</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bulkButton, styles.bulkButtonGray]}
            onPress={() => bulkSetDayType("C")}
          >
            <Text style={styles.bulkButtonText}>All→C</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bulkButton, styles.bulkButtonGray]}
            onPress={() => bulkSetDayType("F")}
          >
            <Text style={styles.bulkButtonText}>All→F</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.dayTypeStats}>
          {getDayTypeStats().collegeDays} C • {getDayTypeStats().freeDays} F
        </Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.dayTypeGrid}>
          {days.map((day) => (
            <View key={day} style={styles.dayTypeItem}>
              <Text style={styles.dayTypeDay}>{day}</Text>
              <View style={styles.dayTypePickerWrapper}>
                <Picker
                  selectedValue={dayTypes[day] || ""}
                  onValueChange={(value) => setDayType(day, value)}
                  style={styles.dayTypePicker}
                >
                  <Picker.Item label="-" value="" />
                  <Picker.Item label="C" value="C" />
                  <Picker.Item label="F" value="F" />
                </Picker>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dayTypeSection: {
    backgroundColor: "#dbeafe",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderWidth: 2,
    borderColor: "#93c5fd",
  },
  dayTypeHeader: {
    marginBottom: 12,
  },
  dayTypeTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dayTypeBulkButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  bulkButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  bulkButtonGreen: {
    backgroundColor: "#16a34a",
  },
  bulkButtonGray: {
    backgroundColor: "#475569",
  },
  bulkButtonText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  dayTypeStats: {
    fontSize: 11,
    color: "#1e293b",
  },
  dayTypeGrid: {
    flexDirection: "row",
    gap: 4,
  },
  dayTypeItem: {
    alignItems: "center",
  },
  dayTypeDay: {
    fontSize: 11,
    marginBottom: 4,
  },
  dayTypePickerWrapper: {
    width: 56,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#93c5fd",
    overflow: "hidden",
  },
  dayTypePicker: {
    width: 56,
    height: 32,
  },
});
