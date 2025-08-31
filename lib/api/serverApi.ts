import { api } from "./api";
import { Note, NoteTag } from "@/types/note";
import { User } from "@/types/user";
import { cookies } from "next/headers";
import { AxiosError } from "axios";

// ==== Types ====

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag | "All";
}

export interface CreateNoteDto {
  title: string;
  content: string;
  tag: NoteTag;
}

// ==== Custom Error ====

export class AuthError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = "AuthError";
  }
}

// ==== Helpers ====

function handleAxiosError(error: unknown, defaultMessage: string): never {
  if (error instanceof AxiosError) {
    const code = error.response?.status || 500;
    const message = error.response?.data?.message || defaultMessage;
    throw new AuthError(code, message);
  }
  throw new AuthError(500, defaultMessage);
}

// ==== Sign Up/In/Out ====

export async function withAuthHeaders() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const headers: Record<string, string> = {};

  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  if (refreshToken) headers["x-refresh-token"] = refreshToken;

  return { headers };
}

export async function signUp(payload: { username: string; password: string }) {
  const { data } = await api.post(
    "/auth/register",
    payload,
    await withAuthHeaders()
  );

  return data;
}

export async function signIn(payload: { username: string; password: string }) {
  const { data } = await api.post(
    "/auth/login",
    payload,
    await withAuthHeaders()
  );

  return data;
}

export async function signOut() {
  const { data } = await api.post("/auth/logout", await withAuthHeaders());

  return data;
}

export async function refreshSession(refreshToken: string) {
  const { data } = await api.post("/auth/refresh", { refreshToken });
  return data;
}

export async function checkSession() {
  return api.get<{ isAuth: boolean }>("/auth/session", await withAuthHeaders());
}

export async function getProfile(): Promise<User> {
  const { data } = await api.get<User>("/users/me", await withAuthHeaders());
  return data;
}

export async function updateUserProfile(payload: {
  username: string;
}): Promise<User> {
  const { data } = await api.patch<User>(
    "/users/me",
    payload,
    await withAuthHeaders()
  );
  return data;
}

// ==== API Methods ====

export const createNote = async (note: CreateNoteDto): Promise<Note> => {
  try {
    const { data } = await api.post<Note>(
      "/notes",
      note,
      await withAuthHeaders()
    );
    return data;
  } catch (error: unknown) {
    handleAxiosError(error, "Не удалось создать заметку");
  }
};

export const deleteNote = async (id: string): Promise<Note> => {
  try {
    const { data } = await api.delete<Note>(
      `/notes/${id}`,
      await withAuthHeaders()
    );
    return data;
  } catch (error: unknown) {
    handleAxiosError(error, "Не удалось удалить заметку");
  }
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  try {
    const { data } = await api.get<Note>(
      `/notes/${id}`,
      await withAuthHeaders()
    );
    return data;
  } catch (error: unknown) {
    handleAxiosError(error, "Не удалось загрузить заметку");
  }
};

export const fetchNotes = async (
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> => {
  const { page = 1, perPage = 12, search, tag } = params;

  const queryParams: Record<string, string | number> = {
    page: Math.max(Number(page), 1),
    perPage,
    ...(search?.trim() && { search }),
    ...(tag && tag !== "All" && { tag }),
  };

  const response = await api.get<FetchNotesResponse>("/notes", {
    params: queryParams,
    ...(await withAuthHeaders()),
  });

  return response.data;
};
