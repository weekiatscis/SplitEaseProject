export interface LoginRequest {
  Email: string;
  Password: string;
}

export interface LoginResponse {
  IsSuccess: boolean;
  UserID: number;
  Name: string;
  Email: string;
}

export interface CreateUserRequest {
  Name: string;
  Email: string;
  Password: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/Login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Email: email, Password: password } satisfies LoginRequest),
  });

  if (!res.ok) {
    throw new Error(`Login request failed with status ${res.status}`);
  }

  return res.json();
}

export async function createUser(name: string, email: string, password: string): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/users/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Name: name, Email: email, Password: password } satisfies CreateUserRequest),
  });

  if (!res.ok) {
    throw new Error(`Sign up failed with status ${res.status}`);
  }

  return res.json();
}
