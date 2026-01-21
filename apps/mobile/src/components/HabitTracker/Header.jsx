import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

export function Header({
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  mode,
  setMode,
  onShowHelp,
  onShowReport,
  onClearData,
  insets,
}) {
  const currentDate = new Date();
  const years = Array.from(
    { length: 10 },
    (_, i) => currentDate.getFullYear() - 2 + i,
  );
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

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Habit Track</Text>
          <Text style={styles.subtitle}>Execution tracking system</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.reportButton} onPress={onShowReport}>
            <Ionicons name="download-outline" size={16} color="#fff" />
            <Text style={styles.reportButtonText}>Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpButton} onPress={onShowHelp}>
            <Text style={styles.helpButtonText}>?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={onClearData}>
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.controlsRow}>
        <View style={styles.pickerContainer}>
          <Ionicons name="calendar-outline" size={16} color="#cbd5e1" />
          <Picker
            selectedValue={selectedYear}
            onValueChange={(value) => setSelectedYear(value)}
            style={styles.picker}
            dropdownIconColor="#cbd5e1"
          >
            {years.map((year) => (
              <Picker.Item key={year} label={String(year)} value={year} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedMonth}
            onValueChange={(value) => setSelectedMonth(value)}
            style={styles.picker}
            dropdownIconColor="#cbd5e1"
          >
            {months.map((month, idx) => (
              <Picker.Item key={idx} label={month} value={idx} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.controlsRow}>
        <View style={styles.pickerContainer}>
          <Ionicons name="target-outline" size={16} color="#cbd5e1" />
          <Text style={styles.modeLabel}>Mode:</Text>
          <Picker
            selectedValue={mode}
            onValueChange={(value) => setMode(value)}
            style={styles.modePicker}
            dropdownIconColor="#cbd5e1"
          >
            <Picker.Item label="College" value="College" />
            <Picker.Item label="Free" value="Free" />
          </Picker>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 12,
    color: "#94a3b8",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  reportButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  helpButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  helpButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "rgba(220,38,38,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 14,
  },
  controlsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 8,
  },
  picker: {
    color: "#fff",
    flex: 1,
    minWidth: 120,
  },
  modeLabel: {
    color: "#cbd5e1",
    fontSize: 14,
  },
  modePicker: {
    color: "#fff",
    flex: 1,
    minWidth: 100,
  },
});
