import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function HelpSection({ visible }) {
  if (!visible) return null;

  return (
    <View style={styles.helpContainer}>
      <Text style={styles.helpTitle}>📖 How to Use</Text>
      <View style={styles.helpSection}>
        <Text style={styles.helpSectionTitle}>✅ Basic:</Text>
        <Text style={styles.helpText}>• Tap cells to mark complete</Text>
        <Text style={styles.helpText}>
          • Tap completed cells for times/proof
        </Text>
        <Text style={styles.helpText}>• Set College/Free mode for goals</Text>
        <Text style={styles.helpText}>
          • Mark days as C (College) or F (Free)
        </Text>
      </View>
      <View style={styles.helpSection}>
        <Text style={styles.helpSectionTitle}>💾 Data:</Text>
        <Text style={styles.helpText}>• Auto-saves to device storage</Text>
        <Text style={styles.helpText}>• Data persists across sessions</Text>
        <Text style={styles.helpText}>• Use 🗑️ to clear all data</Text>
        <Text style={styles.helpText}>• Export reports to clipboard</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  helpContainer: {
    backgroundColor: "#dbeafe",
    borderWidth: 2,
    borderColor: "#93c5fd",
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 12,
  },
  helpSection: {
    marginBottom: 12,
  },
  helpSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: 4,
  },
  helpText: {
    fontSize: 12,
    color: "#1e40af",
    marginLeft: 8,
  },
});
