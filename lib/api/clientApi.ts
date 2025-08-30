import { Note, NoteTag } from "@/types/note";
import { api } from "./api";
import { User, UserInfo } from "@/types/user";
import { AxiosError } from "axios";

// ==== Types ====

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
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

// ==== Auth/Reg/Log ====

export const checkServerSession = async (
  cookieHeader?: string
): Promise<User | null> => {
  try {
    const { data } = await api.get("/auth/session", {
      headers: { Cookie: cookieHeader || "" },
      withCredentials: true,
    });
    return data || null;
  } catch {
    return null;
  }
};

export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  try {
    const { data } = await api.post<User>("/auth/login", { email, password });
    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      throw new AuthError(401, "Неверный email или пароль");
    }
    handleAxiosError(error, "Ошибка входа");
  }
}

export async function register(email: string, password: string): Promise<User> {
  try {
    const { data } = await api.post<User>("/auth/register", { email, password });
    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.status === 409) {
      throw new AuthError(409, "Пользователь с таким email уже существует");
    }
    handleAxiosError(error, "Ошибка регистрации");
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await api.post("/auth/logout", {}, { withCredentials: true });
  } catch (error: unknown) {
    handleAxiosError(error, "Ошибка выхода из аккаунта");
  }
}

export async function checkSession(): Promise<UserInfo> {
  try {
    const { data } = await api.get<UserInfo>("/auth/session");
    return data;
  } catch (error: unknown) {
    handleAxiosError(error, "Сессия недействительна");
  }
}

export async function getProfile(): Promise<User> {
  try {
    const { data } = await api.get<User>("/users/me");
    return data;
  } catch (error: unknown) {
    handleAxiosError(error, "Не удалось загрузить профиль");
  }
}

export async function updateUserProfile(payload: Partial<User>): Promise<User> {
  try {
    const { data } = await api.patch<User>("/users/me", payload);
    return data;
  } catch (error: unknown) {
    handleAxiosError(error, "Ошибка обновления профиля");
  }
}

// ==== API Methods ====

export const createNote = async (note: CreateNoteDto): Promise<Note> => {
  try {
    const { data } = await api.post<Note>("/notes", note); 
    return data;
  } catch (error: unknown) {
    handleAxiosError(error, "Не удалось создать заметку");
  }
};

export const deleteNote = async (id: string) => {
  try {
    const response = await api.delete<{ success: boolean }>(`/notes/${id}`);
    return response.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Не удалось удалить заметку");
  }
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  try {
    const { data } = await api.get<Note>(`/${id}`);
    return data;
  } catch (error: unknown) {
    handleAxiosError(error, "Не удалось загрузить заметку");
  }
};

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = "",
  tag,
}: FetchNotesParams = {}): Promise<FetchNotesResponse> => {
  try {
    const params: Record<string, string | number> = {
      page,
      perPage,
      ...(search.trim() && { search }),
      ...(tag && (tag as string) !== "All" && { tag }),
    };

    const { data } = await api.get<FetchNotesResponse>("/notes", { params });
    return data;
  } catch (error: unknown) {
    handleAxiosError(error, "Не удалось загрузить список заметок");
  }
};
