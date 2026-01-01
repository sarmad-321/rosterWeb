import { useParams } from 'react-router';

export default function RosterDetail() {
  const { id } = useParams();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Roster Detail - {id}</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500">Roster detail view - To be implemented with FormProcessor</p>
      </div>
    </div>
  );
}

