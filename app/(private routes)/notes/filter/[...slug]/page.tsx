import { fetchNotes } from "@/lib/api/serverApi";
import NotesClient from "./Notes.client";
import { tagOptions, Tag } from "@/types/note";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  let tag = slug[0].toUpperCase() === "ALL" ? null : slug[0];

  if (tag === null) {
    tag = "ALL";
  }

  return {
    title: `Note ${tag}`,
    description: `Note tag is ${tag}`,
    openGraph: {
      title: `Note ${tag}`,
      description: `Note tag is ${tag}`,
      url: `https://notehub.com/notes/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `Note ${tag}`,
        },
      ],
    },
  };
}

export default async function NotesPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  const maybeTag = slug?.[0];
  const tag: Tag | undefined = tagOptions.includes(maybeTag as Tag)
    ? (maybeTag as Tag)
    : undefined;

  const data = await fetchNotes({
    page: 1,
    search: "",
    ...(tag ? { tag } : {}),
  });

  return <NotesClient initialData={data} initialTag={tag ?? null} />;
}
