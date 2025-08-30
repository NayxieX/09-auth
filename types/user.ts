export interface User {
  email: string;
  username: string;
  avatar: string;
}

export interface UserInfo {
  isAuth: boolean;
  user?: User;
}