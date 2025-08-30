"use client";

import css from "./NoteForm.module.css";
import { useId } from "react";
import { createNote, CreateNoteDto } from "@/lib/api/clientApi";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useNoteDraft } from "@/lib/store/noteStore";
import type { Tag } from "@/types/note";

export default function NoteForm() {
  const fieldId = useId();
  const router = useRouter();
  const { draft, updateDraft, clearDraft } = useNoteDraft();

  const { mutate, isPending } = useMutation({
    mutationFn: (newNote: CreateNoteDto) => createNote(newNote),
    onSuccess: () => {
      clearDraft();
      router.push("/notes/filter/all");
      router.refresh();
    },
    onError: (err) => {
      console.error("Failed to create note", err);
      alert("Failed to create note");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    updateDraft({ [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values: CreateNoteDto = {
      title: (formData.get("title") as string) || "",
      content: (formData.get("content") as string) || "",
      tag: (formData.get("tag") as Tag) || "Todo",
    };

    mutate(values);
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/notes/filter/all");
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}>Title</label>
        <input
          id={`${fieldId}-title`}
          name="title"
          type="text"
          value={draft.title}
          onChange={handleChange}
          className={css.input}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>Content</label>
        <textarea
          id={`${fieldId}-content`}
          name="content"
          rows={8}
          value={draft.content}
          onChange={handleChange}
          className={css.textarea}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <select
          id={`${fieldId}-tag`}
          name="tag"
          value={draft.tag}
          onChange={handleChange}
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          onClick={handleCancel}
          className={css.cancelButton}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          {isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
