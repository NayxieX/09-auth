export type Tag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export const tagOptions: Tag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: Tag;
  createdAt: string;
  updatedAt: string;
}

export interface NewNote {
  title: string;
  content: string;
  tag: Tag;
}

export type NoteTag = Note["tag"];
