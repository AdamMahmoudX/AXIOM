/** DTOs for future backend integration. */

export interface AuthLoginRequest {
  identifier: string;
  password: string;
}

export interface AuthUserDto {
  id: string;
  username: string;
  email: string;
  role: string;
  fullName?: string;
  phone?: string;
  authStatus?: string;
}

export interface AuthLoginResponse {
  token: string;
  user: AuthUserDto;
}
