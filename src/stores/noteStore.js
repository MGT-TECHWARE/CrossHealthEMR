import { create } from 'zustand'

const EMPTY_DRAFT = {
  // Legacy text fields (backward compat)
  subjective: '',
  objective: '',
  assessment: '',
  plan: '',
  // Structured data
  subjective_data: {},
  objective_data: {},
  assessment_data: {},
  plan_data: {},
  // Metadata
  note_type: 'daily_note',
  status: 'draft',
  complexity: null,
}

export const useNoteStore = create((set) => ({
  draft: { ...EMPTY_DRAFT },
  setField: (field, value) =>
    set((state) => ({
      draft: { ...state.draft, [field]: value },
    })),
  updateDraft: (field, value) =>
    set((state) => ({
      draft: { ...state.draft, [field]: value },
    })),
  setDraft: (draft) => set({ draft: { ...EMPTY_DRAFT, ...draft } }),
  clearDraft: () =>
    set({
      draft: { ...EMPTY_DRAFT },
    }),
}))
