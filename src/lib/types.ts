export type UserRole = "super-admin" | "school-head" | "teacher" | "sub-region-admin" | "student";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  schoolId: string | null;
  displayName: string;
}
