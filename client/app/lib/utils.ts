export function updateFilters(filters: string[], item: string) {
  const parsedFilters = filters.filter(Boolean);
  const exists = parsedFilters.includes(item);
  if (exists) {
    return parsedFilters.filter((el) => {
      return el !== item;
    });
  }

  return [...parsedFilters, item];
}
