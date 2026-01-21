import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

export function ReportModal({
  visible,
  onClose,
  weeklyData,
  selectedWeek,
  setSelectedWeek,
  onExport,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>📊 Export Report</Text>
          <ScrollView style={styles.weekList}>
            {weeklyData.map((week, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.weekItem,
                  selectedWeek === week.week && styles.weekItemSelected,
                ]}
                onPress={() => setSelectedWeek(week.week)}
              >
                <Text style={styles.weekItemWeek}>Week {week.week}</Text>
                <Text style={styles.weekItemTotal}>
                  {week.total} completions
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalDownloadButton}
              onPress={() => {
                onExport();
                onClose();
              }}
            >
              <Text style={styles.modalDownloadButtonText}>
                Copy to Clipboard
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={onClose}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
  weekList: {
    maxHeight: 300,
    marginBottom: 16,
  },
  weekItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    marginBottom: 8,
  },
  weekItemSelected: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },
  weekItemWeek: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  weekItemTotal: {
    fontSize: 12,
    color: "#64748b",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalDownloadButton: {
    flex: 1,
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalDownloadButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  modalCancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    alignItems: "center",
  },
  modalCancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
});
