import { useNavigate, useSearchParams } from "react-router";
import { useState } from "react";
import { useAppSelector } from "~/redux/hooks";
import { selectEmployees } from "~/redux/slices/authSlice";

export default function EmployeeSelect() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const screenName = searchParams.get("screenName") || "detail";

  const [searchTerm, setSearchTerm] = useState("");
  const employeesFromRedux = useAppSelector(selectEmployees);

  const filteredEmployees = employeesFromRedux.filter((employee: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      employee?.code?.toLowerCase().includes(searchLower) ||
      employee?.name?.toLowerCase().includes(searchLower) ||
      employee?.surName?.toLowerCase().includes(searchLower) ||
      employee?.idCard?.toLowerCase().includes(searchLower)
    );
  });

  const handleEmployeeClick = (code: string) => {
    console.log("Employee clicked:", code);
    console.log("Screen name:", screenName);
    // Navigate to the appropriate screen based on screenName
    switch (screenName) {
      case "employeeDetails":
        console.log("Navigating to:", `/employees/${code}`);
        navigate(`/employees/${code}/details`);
        break;
      case "employeeCareer":
        console.log("Navigating to:", `/employees/${code}/career`);
        navigate(`/employees/${code}/career`);
        break;
      case "employeeSchedule":
        console.log("Navigating to:", `/employees/${code}/schedule`);
        navigate(`/employees/${code}/schedule`);
        break;
      default:
        console.log("Navigating to (default):", `/employees/${code}`);
        navigate(`/employees/${code}`);
    }
  };

  const getInitials = (name: string, surName: string) => {
    const firstInitial = name?.charAt(0) || "";
    const lastInitial = surName?.charAt(0) || "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getScreenTitle = () => {
    switch (screenName) {
      case "employeeDetails":
        return "Select Employee for Details";
      case "employeeCareer":
        return "Select Employee for Career";
      case "employeeSchedule":
        return "Select Employee for Schedule";
      default:
        return "Select Employee";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/employees/list")}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {getScreenTitle()}
        </h1>
        <p className="text-gray-600">Click on an employee to continue</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by name, code or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Employee Cards */}
      {filteredEmployees.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4 opacity-30">👥</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No employees found
          </h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredEmployees.map((employee: any) => (
            <button
              key={employee.code}
              type="button"
              onClick={() => handleEmployeeClick(employee.code)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 text-left w-full"
            >
              <div className="flex items-center">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-base mr-3">
                  {getInitials(employee.name, employee.surName || "")}
                </div>

                {/* Info */}
                <div className="flex-1">
                  {/* Header Row */}
                  <div className="flex items-center mb-1">
                    <h3 className="font-semibold text-gray-900 flex-1">
                      {employee.name} {employee.surName || ""}
                    </h3>
                    {employee.current && (
                      <div
                        className={`w-2 h-2 rounded-full ml-2 ${
                          employee.current === "Yes"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                    )}
                  </div>

                  {/* Details Row */}
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium">Code: </span>
                      <span className="text-gray-700 ml-1">
                        {employee.code}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 font-medium">ID: </span>
                      <span className="text-gray-700 ml-1">
                        {employee.idCard || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* DOB Row */}
                  {employee.dateOfBirth && (
                    <div className="text-sm">
                      <span className="text-gray-600 font-medium">DOB: </span>
                      <span className="text-gray-700">
                        {formatDate(employee.dateOfBirth)}
                        {employee.age && ` || Age: ${employee.age}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
