export function getPlaceholderImage(query: string, width = 800, height = 600) {
  const q = encodeURIComponent(query || "food");
  return `https://source.unsplash.com/${width}x${height}/?${q}`;
}
