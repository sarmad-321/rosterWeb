import { useParams } from "react-router";

export default function ScheduleShifts() {
  const { code } = useParams();
  
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Schedule Shifts</h1>
        {code && <p className="text-gray-600">Schedule Code: {code}</p>}
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Under Construction</h3>
        <p className="text-gray-600">This feature is coming soon</p>
      </div>
    </div>
  );
}
