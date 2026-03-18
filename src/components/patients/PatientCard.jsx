import Card from '@/components/ui/Card';
import { formatDate } from '@/utils/formatDate';

function getInitials(firstName, lastName) {
  const first = firstName?.[0]?.toUpperCase() || '';
  const last = lastName?.[0]?.toUpperCase() || '';
  return `${first}${last}`;
}

export default function PatientCard({ patient, onClick }) {
  const {
    first_name,
    last_name,
    date_of_birth,
    last_visit,
  } = patient;

  const initials = getInitials(first_name, last_name);

  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-md transition-shadow border border-gray-200 rounded-lg"
      onClick={() => onClick?.(patient)}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-11 w-11 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 truncate">
            {first_name} {last_name}
          </h4>
          {date_of_birth && (
            <p className="text-xs text-gray-500">
              DOB: {formatDate(date_of_birth)}
            </p>
          )}
          {last_visit && (
            <p className="text-xs text-gray-400">
              Last visit: {formatDate(last_visit)}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
