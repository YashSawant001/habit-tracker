import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const presetHabits = [
  { name: "Deep Work 90 min", college: 16, free: 22 },
  { name: "DSA 60 min", college: 18, free: 22 },
  { name: "Learn for Project 60 min", college: 12, free: 18 },
  { name: "Build Project 60 min", college: 12, free: 18 },
  { name: "Outreach/Proof Posting 10 min", college: 16, free: 22 },
  { name: "No Novel + No Surfers before work", college: 22, free: 26 },
  { name: "Sleep ≥ 7 hours", college: 16, free: 20 },
  { name: "Daily Execution Log + Proof Link", college: 22, free: 26 },
];

const createInitialHabits = (mode = "College") => {
  return Array(25)
    .fill(null)
    .map((_, i) => {
      if (i < 8) {
        return {
          id: i,
          name: presetHabits[i].name,
          goal:
            mode === "College" ? presetHabits[i].college : presetHabits[i].free,
          completions: {},
          times: {},
          proofs: {},
        };
      }
      return {
        id: i,
        name: "",
        goal: 20,
        completions: {},
        times: {},
        proofs: {},
      };
    });
};

export function useHabitData() {
  const [habits, setHabits] = useState(createInitialHabits());
  const [dayTypes, setDayTypes] = useState({});
  const [weeklyReflections, setWeeklyReflections] = useState({});
  const [mode, setMode] = useState("College");

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
        if (parsed.weeklyReflections)
          setWeeklyReflections(parsed.weeklyReflections);
        if (parsed.mode) setMode(parsed.mode);
      }
    } catch (e) {
      console.error("Load error:", e);
    }
  };

  useEffect(() => {
    saveData();
  }, [habits, dayTypes, weeklyReflections, mode]);

  const saveData = async () => {
    try {
      const dataToSave = {
        habits,
        dayTypes,
        weeklyReflections,
        mode,
        lastSaved: new Date().toISOString(),
      };
      await AsyncStorage.setItem("habitTrackData", JSON.stringify(dataToSave));
    } catch (e) {
      console.error("Save error:", e);
    }
  };

  useEffect(() => {
    setHabits((prev) =>
      prev.map((h, i) => {
        if (i < 8) {
          return {
            ...h,
            goal:
              mode === "College"
                ? presetHabits[i].college
                : presetHabits[i].free,
          };
        }
        return h;
      }),
    );
  }, [mode]);

  const updateHabit = (habitId, field, value) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, [field]: value } : h)),
    );
  };

  const toggleCompletion = (habitId, day) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const newCompletions = { ...h.completions };
          if (newCompletions[day]) {
            delete newCompletions[day];
          } else {
            newCompletions[day] = true;
          }
          return { ...h, completions: newCompletions };
        }
        return h;
      }),
    );
  };

  const updateTime = (habitId, day, field, value) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const newTimes = { ...h.times };
          if (!newTimes[day]) newTimes[day] = {};
          newTimes[day][field] = value;
          return { ...h, times: newTimes };
        }
        return h;
      }),
    );
  };

  const updateProof = (habitId, day, value) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const newProofs = { ...h.proofs };
          if (value.trim()) {
            newProofs[day] = value;
          } else {
            delete newProofs[day];
          }
          return { ...h, proofs: newProofs };
        }
        return h;
      }),
    );
  };

  const clearAllData = async () => {
    await AsyncStorage.removeItem("habitTrackData");
    setHabits(createInitialHabits(mode));
    setDayTypes({});
    setWeeklyReflections({});
  };

  return {
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
  };
}
