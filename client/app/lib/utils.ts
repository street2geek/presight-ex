export function updateFilters(filters: string[] | undefined, item: string) {
  const exists = filters?.includes(item);
  if (exists) {
    return filters?.filter((el) => {
      return el !== item;
    });
  }
  return [...(filters ?? []), item];
}

export function isFilter(
  filterObjectString: string | null,
  compareValue: string,
  filterType: "hobbies" | "nationalites"
): boolean {
  if (!filterObjectString) return false;
  const parsedObject = JSON.parse(filterObjectString);
  return filterType === "hobbies"
    ? parsedObject.hobbies?.includes(compareValue)
    : parsedObject.nationalites?.includes(compareValue);
}
