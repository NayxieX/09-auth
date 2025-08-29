import { create } from "zustand";

import { persist } from "zustand/middleware";

interface DraftNote {
  title: string;
  content: string;
  tag: "Todo" | string;
}

type NoteDraftStore = {
  draft: DraftNote;
  setDraft: (note: DraftNote) => void;
  updateDraft: (partial: Partial<DraftNote>) => void;
  clearDraft: () => void;
};

const initialDraft: DraftNote = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteDraft = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (newData: DraftNote) => set({ draft: newData }),
      updateDraft: (partial) =>
        set((state) => ({ draft: { ...state.draft, ...partial } })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft",
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
