import { create } from 'zustand'

export const useAppointmentStore = create((set) => ({
  selectedAppointment: null,
  setSelectedAppointment: (appointment) => set({ selectedAppointment: appointment }),
  clearSelectedAppointment: () => set({ selectedAppointment: null }),
}))
