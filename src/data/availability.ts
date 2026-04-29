export const availability = [
    { value: "morning", label: "Morning" },
    { value: "evening", label: "Evening" },
    { value: "night", label: "Night" },
    { value: "all day", label: "All Day" },
];

export const availabilityMap: Record<string, string> = Object.fromEntries(
  availability.map(option => [option.value, option.label])
);