import Link from "next/link";
import { useState } from "react";
import css from "./NoteList.module.css";
import type { Note } from "@/types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api/clientApi";

interface NoteListProps {
  notes: Note[];
}

const NoteList = ({ notes }: NoteListProps) => {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: deleteNote,
    onMutate: (id: string) => {
      setDeletingId(id);
    },
    onSettled: () => {
      setDeletingId(null);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          {/* Клікабельна вся картка */}
          <Link href={`/notes/${note.id}`} className={css.cardLink}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>
            </div>
          </Link>

          {/* Кнопка видалення — поза посиланням */}
          <button
            className={css.button}
            onClick={() => mutation.mutate(note.id)}
            disabled={deletingId === note.id}
          >
            {deletingId === note.id ? "Deleting..." : "Delete"}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
