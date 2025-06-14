// TODO: get url from env variable
const API_URL = "http://localhost:3001";

export type UserEntity = {
  firstName: string;
  lastName: string;
  age: number;
  avatarUrl: string;
  nationality: string;
  hobbies: string[];
};

export type GetUsersResponse = {
  users: Array<UserEntity>;
  filters: { nationalities: string[]; topHobbies: string[] };
};

export async function getUsers(request: Request) {
  const url = new URL(request.url);
  const params = url.searchParams.getAll;

  console.log("hit");

  const res = await fetch(`${API_URL}/users?${params}`);
  const users = await res.json();
  console.log(users);
  return users as GetUsersResponse;
}
