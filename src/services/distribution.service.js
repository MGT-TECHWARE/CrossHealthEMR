// Distribution service — PDF generation and email sending
// In production, these would call Supabase Edge Functions

export async function generateNotePDF(noteId) {
  // TODO: Implement via Supabase Edge Function
  // Would use a library like jsPDF or call a server-side PDF generator
  throw new Error('PDF generation requires Supabase Edge Function setup')
}

export async function sendNoteEmail({ noteId, recipientEmail, recipientName, senderName }) {
  // TODO: Implement via Supabase Edge Function
  // Would generate PDF and send via email service (SendGrid, Resend, etc.)
  throw new Error('Email sending requires Supabase Edge Function setup')
}
