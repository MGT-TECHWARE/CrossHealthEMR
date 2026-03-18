import { create } from 'zustand'

export const useExercisePlanStore = create((set) => ({
  approvedExercises: [],
  pendingExercises: [],

  addApproved: (exercise) =>
    set((state) => ({
      approvedExercises: [...state.approvedExercises, exercise],
    })),

  removeApproved: (exerciseId) =>
    set((state) => ({
      approvedExercises: state.approvedExercises.filter((e) => e.id !== exerciseId),
    })),

  reorderApproved: (fromIndex, toIndex) =>
    set((state) => {
      const updated = [...state.approvedExercises]
      const [moved] = updated.splice(fromIndex, 1)
      updated.splice(toIndex, 0, moved)
      return { approvedExercises: updated }
    }),

  setPending: (exercises) => set({ pendingExercises: exercises }),

  clearAll: () => set({ approvedExercises: [], pendingExercises: [] }),
}))
