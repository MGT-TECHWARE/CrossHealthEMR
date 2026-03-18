import { useState, useMemo } from 'react';
import { Clock } from 'lucide-react';

function generateSlots(selectedDate) {
  const slots = [];
  const base = new Date(selectedDate);
  for (let hour = 8; hour < 17; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const slot = new Date(base);
      slot.setHours(hour, min, 0, 0);
      slots.push(slot);
    }
  }
  return slots;
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function TimeSlotPicker({
  selectedDate,
  existingAppointments = [],
  onSelectSlot,
}) {
  const [selected, setSelected] = useState(null);

  const bookedTimes = useMemo(() => {
    return new Set(
      existingAppointments.map((appt) =>
        new Date(appt.date).toISOString()
      )
    );
  }, [existingAppointments]);

  const slots = useMemo(() => {
    if (!selectedDate) return [];
    return generateSlots(selectedDate);
  }, [selectedDate]);

  const handleSelect = (slot) => {
    setSelected(slot.toISOString());
    onSelectSlot?.(slot);
  };

  if (!selectedDate) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">Select a date to view available slots.</p>
      </div>
    );
  }

  const availableSlots = slots.filter(
    (slot) => !bookedTimes.has(slot.toISOString())
  );

  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm font-medium">No available slots for this date.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Available Time Slots
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {availableSlots.map((slot) => {
          const iso = slot.toISOString();
          const isSelected = selected === iso;
          return (
            <button
              key={iso}
              type="button"
              onClick={() => handleSelect(slot)}
              className={`px-3 py-2 text-sm rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400'
              }`}
            >
              {formatTime(slot)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
