import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import api from "~/api/roster";
import { dynamicTableEnum } from "~/utils/dummyJson";

interface Company {
  code: string;
  description: string;
}

export default function ScheduleSeasons() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const data = {
        tableDataEnum: dynamicTableEnum.CompanyCode,
        apiParams: "",
      };
      const response = await api.getDynamicTableData(data);
      console.log("Company codes response:", response);
      if (response?.data && Array.isArray(response.data)) {
        setCompanies(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching company codes:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to load company codes";
      setLoadError(errorMessage);
      setIsLoading(false);
    }
  };

  const filteredCompanies = companies.filter((company: Company) => {
    const searchLower = searchTerm.toLowerCase();
    return company.code.toLowerCase().includes(searchLower) || company.description.toLowerCase().includes(searchLower);
  });

  const handleItemPress = (item: Company) => {
    navigate(`/schedules/seasons/${item.code}`);
  };

  const getInitials = (code: string) => {
    return code.substring(0, 2).toUpperCase();
  };

  if (loadError && !isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px] bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-lg font-semibold text-red-600 mb-2">{loadError}</p>
            <button type="button" onClick={fetchCompanies} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px] bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <p className="mt-6 text-lg text-gray-600 font-medium">Loading schedule seasons...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Schedule Seasons</h1>
        <p className="text-gray-600">Manage schedule season code allocations by company</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input type="text" placeholder="Search by code or description..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {searchTerm && (
            <button type="button" onClick={() => setSearchTerm("")} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {filteredCompanies.length > 0 ? (
        <div className="grid gap-3">
          {filteredCompanies.map((item) => (
            <button key={item.code} type="button" onClick={() => handleItemPress(item)} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 text-left w-full">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-base mr-3">{getInitials(item.code)}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.description}</h3>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600 font-medium">Company Code: </span>
                    <span className="text-gray-700 ml-1">{item.code}</span>
                  </div>
                </div>
                <div className="pl-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4 opacity-30">🏢</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-600">{searchTerm ? "Try adjusting your search criteria" : "No companies are available"}</p>
        </div>
      )}
    </div>
  );
}
