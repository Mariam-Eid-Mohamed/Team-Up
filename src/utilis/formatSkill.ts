
export const formatSkill = (input: string): string =>
  input
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());