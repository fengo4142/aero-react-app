export type UserType = {
  firstName: string;
  lastName: string;
  middleName: string | null;
  profilePicture: string;
  title: string;
  userId: string;
};

export type SearchResult = Pick<
  UserType,
  "firstName" | "lastName" | "userId" | "title" | "profilePicture"
>;

export type UsersList = {
  airportId: string;
  limit: number;
  nextToken: null;
};

export interface FormValues {
  name: string;
  privacy: string;
  content: string;
  invitedPeople: string | null;
}
