export function createDayTypeHelpers(
  selectedYear,
  selectedMonth,
  dayTypes,
  setDayTypes,
) {
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const setDayType = (day, type) => {
    setDayTypes((prev) => ({ ...prev, [day]: type }));
  };

  const bulkSetDayType = (type) => {
    const newDayTypes = {};
    days.forEach((day) => {
      newDayTypes[day] = type;
    });
    setDayTypes(newDayTypes);
  };

  const setWeekdaysAs = (type) => {
    const newDayTypes = { ...dayTypes };
    days.forEach((day) => {
      const date = new Date(selectedYear, selectedMonth, day);
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        newDayTypes[day] = type;
      }
    });
    setDayTypes(newDayTypes);
  };

  const setWeekendsAs = (type) => {
    const newDayTypes = { ...dayTypes };
    days.forEach((day) => {
      const date = new Date(selectedYear, selectedMonth, day);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        newDayTypes[day] = type;
      }
    });
    setDayTypes(newDayTypes);
  };

  return {
    days,
    daysInMonth,
    setDayType,
    bulkSetDayType,
    setWeekdaysAs,
    setWeekendsAs,
  };
}
