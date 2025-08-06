export function toTitleCase(text: string): string {
  if (!text) return "";

  return text
    .toLowerCase()
    .split(" ")
    .filter((word) => word.length > 0)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}
