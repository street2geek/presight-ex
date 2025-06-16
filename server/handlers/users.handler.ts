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

function getFilteredUsers(
  users: Users,
  filters: { hobbies: string[]; nationalities: string[] } | null
) {
  if (!filters) return users;

  let usersByNationality = null;
  let usersByHobbies = null;

  if (filters.nationalities) {
    usersByNationality = users.filter((user) => {
      return filters.nationalities.includes(user.nationality);
    });
  }

  if (filters.hobbies) {
    usersByHobbies = users.filter((user) => {
      return user.hobbies.some((u) => filters.hobbies.includes(u));
    });
  }

  return [...(usersByNationality ?? []), ...(usersByHobbies ?? [])];
}

function getUserByName(users: Users, query: string) {
  const newUsers = users.filter((user) => {
    return (
      user.firstName.toLowerCase() === query.toLowerCase() ||
      user.lastName.toLowerCase() === query.toLowerCase()
    );
  });

  return newUsers;
}

export function usersHandler(req: Request, res: Response, db: any) {
  const { page = 1, limit = 20, query = "", filters = "" } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  const { users: initUsers } = db.data;
  let users: Users = initUsers;

  if (filters) {
    const parsedFilters = JSON.parse(filters.toString());
    const filteredUsers = getFilteredUsers(initUsers, parsedFilters);
    users = filteredUsers.length ? filteredUsers : initUsers;
  }

  if (query) {
    users = getUserByName(initUsers, String(query));
  }

  res.json({
    users: getBatchedUsers(users, offset, Number(limit)),
    filters: {
      nationalities: getNationalities(initUsers),
      topHobbies: getTopHobbies(initUsers),
    },
    nextPage: Number(page) + 1,
  });
}
