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

export function usersHandler(req: Request, res: Response) {
  const { limit = 50, query = "", filters = "" } = req.query;
  const users = faker.helpers.multiple(createRandomUser, {
    count: Number(limit),
  });

  res.json({
    users,
    filters: {
      nationalities: getNationalities(users),
      topHobbies: getTopHobbies(users),
    },
  });
}
