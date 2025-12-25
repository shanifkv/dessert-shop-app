export function getPlaceholderImage(query: string, width = 800, height = 600) {
  const q = encodeURIComponent(query || "food");
  return `https://picsum.photos/seed/${q}/${width}/${height}`;
}
