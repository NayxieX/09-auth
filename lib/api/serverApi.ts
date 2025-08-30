import { api } from "./api";
import { Note, NoteTag } from "@/types/note";
import { User } from "@/types/user";
import { cookies } from "next/headers";

// ==== Types ====

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  tag: NoteTag;
}

// ==== Sign Up/In/Out ====

export async function withAuthHeaders() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  return {
    headers: {
      Cookie: cookieHeader,
    },
  };
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

export async function checkSession(): Promise<{ isAuth: boolean }> {
  const { data } = await api.get<{ isAuth: boolean }>(
    "/auth/session",
    await withAuthHeaders()
  );
  return data;
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
  const { data } = await api.post<Note>("/", note);
  return data;
};

export const deleteNote = async (id: string) => {
  const response = await api.delete<{ success: boolean }>(`/notes/${id}`);
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/${id}`);
  return data;
};

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = "",
  tag,
}: FetchNotesParams = {}): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    page,
    perPage,
    ...(search.trim() && { search }),
    ...(tag && (tag as string) !== "All" && { tag }),
  };

  const headers = await withAuthHeaders();

  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params,
    ...headers,
  });

  return data;
};
