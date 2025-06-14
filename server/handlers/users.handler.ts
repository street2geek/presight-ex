import type { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import age from "@fakerjs/age";

import { PHYSICAL_HOBBIES, NATIONALITIES } from "../utils/constants.ts";

type Users = Array<ReturnType<typeof createRandomUser>>;

function createRandomUser() {
  return {
    avatarUrl: faker.image.avatar(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: age(),
    nationality: faker.helpers.arrayElement(NATIONALITIES),
    hobbies: faker.helpers.arrayElements(PHYSICAL_HOBBIES, { min: 2, max: 5 }),
  };
}

function getBatchedUsers(users: Users, offset: number, limit: number) {
  return users.slice(offset, offset + limit);
}

function getNationalities(users: Users) {
  return [...new Set(users.map((user) => user.nationality))];
}

function getTopHobbies(users: Users) {}

export function usersHandler(req: Request, res: Response) {
  const { limit = 50, query = "", filters = "" } = req.query;
  const users = faker.helpers.multiple(createRandomUser, {
    count: Number(limit),
  });

  console.log(users);

  res.json({
    users,
    filters: { nationalities: getNationalities(users), topHobbies: [] },
  });
}
