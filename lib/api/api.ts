import axios from "axios";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
});

// import axios from "axios";
// import type { Note, NoteTag } from "@/types/note";

// // ==== Config ====
// const BASE_URL = "https://notehub-public.goit.study/api/notes";
// const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

// // ==== Axios instance ====
// const api = axios.create({
//   baseURL: BASE_URL,
// });

// api.interceptors.request.use((config) => {
//   if (TOKEN) {
//     config.headers.Authorization = `Bearer ${TOKEN}`;
//   }
//   return config;
// });

// //(429 retry)
// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     if (error.response?.status === 429) {
//       console.warn("⏳ Too many requests – retrying in 3s...");
//       await new Promise((resolve) => setTimeout(resolve, 3000));
//       return api.request(error.config);
//     }
//     return Promise.reject(error);
//   }
// );

// // ==== Types ====
// export interface FetchNotesParams {
//   page?: number;
//   perPage?: number;
//   search?: string;
//   tag?: NoteTag;
// }

// export interface FetchNotesResponse {
//   notes: Note[];
//   totalPages: number;
// }

// export interface CreateNoteDto {
//   title: string;
//   content: string;
//   tag: NoteTag;
// }

// export interface UpdateNoteDto {
//   title?: string;
//   content?: string;
//   tag?: NoteTag;
// }

// // ==== API Methods ====
// export const fetchNotes = async ({
//   page = 1,
//   perPage = 12,
//   search = "",
//   tag,
// }: FetchNotesParams = {}): Promise<FetchNotesResponse> => {
//   const params = {
//     page,
//     perPage,
//     ...(search.trim() && { search }),
//     ...(tag && { tag }),
//   };

//   const { data } = await api.get<FetchNotesResponse>("/", { params });
//   return data;
// };

// export const fetchNoteById = async (id: string): Promise<Note> => {
//   const { data } = await api.get<Note>(`/${id}`);
//   return data;
// };

// export const createNote = async (note: CreateNoteDto): Promise<Note> => {
//   const { data } = await api.post<Note>("/", note);
//   return data;
// };

// export const updateNote = async (
//   id: string,
//   note: UpdateNoteDto
// ): Promise<Note> => {
//   const { data } = await api.patch<Note>(`/${id}`, note);
//   return data;
// };

// export const deleteNote = async (id: string): Promise<void> => {
//   await api.delete(`/${id}`);
// };

// // ==== Export as service ====
// const noteService = {
//   fetchNotes,
//   fetchNoteById,
//   createNote,
//   updateNote,
//   deleteNote,
// };

// export default noteService;
