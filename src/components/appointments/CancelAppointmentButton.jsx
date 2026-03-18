import { useState } from 'react';
import { XCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

export default function CancelAppointmentButton({
  appointmentId,
  onCancelled,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await onCancelled?.(appointmentId);
    } finally {
      setIsCancelling(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-300 text-sm px-3 py-1.5 rounded-md transition-colors"
      >
        <XCircle className="h-4 w-4" />
        Cancel Appointment
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-6 max-w-sm mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Cancel Appointment
            </h3>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to cancel this appointment? This action
            cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setIsOpen(false)}
              disabled={isCancelling}
              className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-sm px-4 py-2 rounded-md"
            >
              Keep Appointment
            </Button>
            <Button
              onClick={handleCancel}
              disabled={isCancelling}
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md disabled:opacity-50"
            >
              {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
