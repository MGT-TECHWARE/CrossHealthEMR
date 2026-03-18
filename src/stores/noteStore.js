import { create } from 'zustand'

export const useNoteStore = create((set) => ({
  draft: {
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  },
  setField: (field, value) =>
    set((state) => ({
      draft: { ...state.draft, [field]: value },
    })),
  updateDraft: (field, value) =>
    set((state) => ({
      draft: { ...state.draft, [field]: value },
    })),
  setDraft: (draft) => set({ draft }),
  clearDraft: () =>
    set({
      draft: {
        subjective: '',
        objective: '',
        assessment: '',
        plan: '',
      },
    }),
}))
