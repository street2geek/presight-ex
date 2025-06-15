import { faker } from "@faker-js/faker";
import age from "@fakerjs/age";

import { PHYSICAL_HOBBIES, NATIONALITIES } from "../utils/constants.ts";

export type Users = Array<ReturnType<typeof createRandomUser>>;

function createRandomUser() {
  return {
    avatarUrl: faker.image.avatar(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: age(),
    nationality: faker.helpers.arrayElement(NATIONALITIES),
    hobbies: faker.helpers.arrayElements(PHYSICAL_HOBBIES, { min: 0, max: 10 }),
  };
}

export function generateUserData() {
  const users = faker.helpers.multiple(createRandomUser, {
    count: 1000,
  });
  return users;
}
