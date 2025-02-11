export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  role: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}


export interface Order {

}

export interface DecodedToken {
  email: string;
  name: string;
  sub: string;
  role: string;
  iat: number;
  exp: number;
}