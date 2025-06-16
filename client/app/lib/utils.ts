export function updateFilters(filters: string[], item: string) {
  const exists = filters?.includes(item);
  if (exists) {
    return filters.filter((el) => {
      return el !== item;
    });
  }
  return [...(filters ?? []), item];
}

export function isFilter(
  filterObjectString: string | null,
  compareValue: string,
  filterType: "hobbies" | "nationalities"
): boolean {
  if (!filterObjectString) return false;
  const parsedObject = JSON.parse(filterObjectString);
  return filterType === "hobbies"
    ? parsedObject.hobbies?.includes(compareValue)
    : parsedObject.nationalities?.includes(compareValue);
}

export function getSelectedFilters(params: URLSearchParams) {
  const selected = params.get("filters");
  if (selected) {
    const pf = JSON.parse(selected);
    return { hobbies: pf.hobbies, nationalities: pf.nationalites };
  }
  return { hobbies: undefined, nationalities: undefined };
}
