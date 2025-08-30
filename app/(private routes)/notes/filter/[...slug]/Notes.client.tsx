"use client";

import React, { useState, useEffect } from "react";
import css from "./Notes.client.module.css";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes } from "@/lib/api/clientApi";
import { Note } from "@/types/note";
import Link from "next/link";
import { toast } from "react-hot-toast";
import type { Tag } from "@/types/note";

interface NotesClientProps {
  initialData: {
    totalPages: number;
    notes: Note[];
  };
  initialTag: string | null;
}

export default function NotesClient({
  initialData,
  initialTag,
}: NotesClientProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageQuery, setCurrentPage] = useState<number>(1);
  const [debouncedSearch] = useDebounce(searchQuery, 300);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", debouncedSearch, pageQuery, initialTag],
    queryFn: () =>
      fetchNotes({
        ...(debouncedSearch.trim() ? { search: debouncedSearch } : {}),
        page: pageQuery,
        ...(initialTag ? { tag: initialTag as Tag } : {}),
      }),
    placeholderData: initialData,
  });

  const totalPages = data?.totalPages ?? 0;

  useEffect(() => {
    if (isLoading) {
      toast.loading("Loading notes...", { id: "notes-loading" });
    } else {
      toast.dismiss("notes-loading");
    }

    if (isError) {
      let message: string;
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { status?: number } }).response ===
          "object" &&
        (error as { response?: { status?: number } }).response?.status === 429
      ) {
        message = "Too many requests. Please wait a few seconds ⏳";
      } else {
        message = (error as Error)?.message ?? "Something went wrong.";
      }
      toast.error(message);
    }
  }, [isLoading, isError, error]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <div className={css.left}>
          <SearchBox
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className={css.right}>
          <Link href="/notes/action/create">
            <button className={css.button} type="button">
              Create note +
            </button>
          </Link>
        </div>
      </header>

      {data?.notes && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        <p>No notes found.</p>
      )}

      {totalPages > 1 && (
        <Pagination
          pageCount={totalPages}
          currentPage={pageQuery}
          onPageChange={({ selected }) => setCurrentPage(selected)}
        />
      )}
    </div>
  );
}
