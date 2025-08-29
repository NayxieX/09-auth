"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import { Note } from "@/types/note";
import css from "./NotePreview.module.css";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

export default function NotePreviewClient() {
  const params = useParams();
  const id = String(params.id);

  const router = useRouter();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery<Note, unknown>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => router.back();

  useEffect(() => {
    if (isLoading) {
      toast.loading("Loading...", { id: "note-loading" });
    } else {
      toast.dismiss("note-loading");
    }
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong.");
    }
  }, [error]);

  if (isLoading) {
    return (
      <Modal onClose={handleClose}>
        <div className={css.container}>
          <p className={css.content}>Loading...</p>
        </div>
      </Modal>
    );
  }

  if (!note) {
    return (
      <Modal onClose={handleClose}>
        <div className={css.container}>
          <p className={css.content}>No data available</p>
        </div>
      </Modal>
    );
  }

  const formattedDate = note.updatedAt
    ? `Updated at: ${new Date(note.updatedAt).toLocaleString()}`
    : `Created at: ${new Date(note.createdAt).toLocaleString()}`;

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        <div className={css.item}>
          <button className={css.backBtn} onClick={handleClose}>
            Back
          </button>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.tag}>{note.tag}</p>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{formattedDate}</p>
        </div>
      </div>
    </Modal>
  );
}
