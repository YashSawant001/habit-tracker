import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";

export function HabitDetailModal({
  visible,
  onClose,
  selectedHabitDay,
  habits,
  updateTime,
  updateProof,
  toggleCompletion,
}) {
  if (!selectedHabitDay) return null;

  const habit = habits.find((h) => h.id === selectedHabitDay.habitId);
  const day = selectedHabitDay.day;

  if (!habit) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Day {day}</Text>
            <TouchableOpacity
              onPress={() => {
                toggleCompletion(habit.id, day);
                onClose();
              }}
            >
              <Text style={styles.modalClear}>Clear ✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalField}>
            <Text style={styles.modalLabel}>Start Time</Text>
            <TextInput
              value={habit.times[day]?.start || ""}
              onChangeText={(text) => updateTime(habit.id, day, "start", text)}
              placeholder="HH:MM"
              placeholderTextColor="#94a3b8"
              style={styles.modalInput}
            />
          </View>

          <View style={styles.modalField}>
            <Text style={styles.modalLabel}>End Time</Text>
            <TextInput
              value={habit.times[day]?.end || ""}
              onChangeText={(text) => updateTime(habit.id, day, "end", text)}
              placeholder="HH:MM"
              placeholderTextColor="#94a3b8"
              style={styles.modalInput}
            />
          </View>

          <View style={styles.modalField}>
            <Text style={styles.modalLabel}>Proof Link</Text>
            <TextInput
              value={habit.proofs[day] || ""}
              onChangeText={(text) => updateProof(habit.id, day, text)}
              placeholder="https://..."
              placeholderTextColor="#94a3b8"
              style={styles.modalInput}
              autoCapitalize="none"
            />
          </View>

          {(habit.times[day]?.start ||
            habit.times[day]?.end ||
            habit.proofs[day]) && (
            <View style={styles.savedIndicator}>
              <Text style={styles.savedText}>✓ Saved</Text>
            </View>
          )}

          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  modalClear: {
    color: "#ef4444",
    fontSize: 12,
  },
  modalField: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: "#1e293b",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#475569",
    fontSize: 14,
  },
  savedIndicator: {
    backgroundColor: "rgba(34,197,94,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  savedText: {
    color: "#16a34a",
    fontSize: 11,
  },
  modalCloseButton: {
    backgroundColor: "#f1f5f9",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCloseButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
});
