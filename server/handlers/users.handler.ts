import type { Request, Response } from "express";
import type { Users } from "../utils/data.ts";

function getNationalities(users: Users) {
  return [...new Set(users.map((user) => user.nationality))];
}

function getTopHobbies(users: Users, topAmount = 20) {
  const hobbieCount: Record<string, number> = {};
  for (let user of users) {
    user.hobbies.forEach((hob) => {
      if (hobbieCount[hob]) {
        hobbieCount[hob] = hobbieCount[hob] + 1;
      } else {
        hobbieCount[hob] = 1;
      }
    });
  }

  const topHobbies = Object.entries(hobbieCount)
    .sort(([, a], [, b]) => b - a)
    .map(([key]) => key)
    .slice(0, topAmount);

  return topHobbies;
}

function getBatchedUsers(users: Users, offset: number, limit: number) {
  return users.slice(offset, offset + limit);
}

function getParsedFilters(filters: string) {
  if (!filters) return null;

  const pFilters = JSON.parse(filters);
  const parsedHobbies = pFilters.hobbies.filter(Boolean);
  const parsedNationalities = pFilters.nationalities.filter(Boolean);
  const isHobbies = parsedHobbies.length;
  const isNationalities = parsedNationalities.length;

  if (isHobbies || isNationalities) {
    return { hobbies: parsedHobbies, nationalities: parsedNationalities };
  }
  return null;
}

function getFilteredUsers(
  users: Users,
  filters: { hobbies: string[]; nationalities: string[] } | null
) {
  if (!filters) return users;

  const usersByNationality = users.filter((user) => {
    return filters.nationalities.includes(user.nationality);
  });
  const usersByHobbies = users.filter((user) => {
    return user.hobbies.some((u) => filters.hobbies.includes(u));
  });

  return [...usersByNationality, ...usersByHobbies];
}

export function usersHandler(req: Request, res: Response, db: any) {
  const { page = 1, limit = 20, query = "", filters = "" } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  const { users: initUsers } = db.data;

  console.log(filters);
  const parsedFilters = getParsedFilters(filters.toString());
  const users = getFilteredUsers(initUsers, parsedFilters);

  res.json({
    users: getBatchedUsers(users, offset, Number(limit)),
    filters: {
      nationalities: getNationalities(users),
      topHobbies: getTopHobbies(users),
    },
    nextPage: Number(page) + 1,
  });
}
