import { Link } from "react-router";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import { updateEmployees, selectEmployees } from "~/redux/slices/authSlice";
import api from "~/api/roster";
import { dynamicTableEnum } from "~/utils/dummyJson";

export default function EmployeesList() {
  const dispatch = useAppDispatch();
  const [dataFetching, setDataFetching] = useState(false);

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      setDataFetching(true);
      const object = {
        tableDataEnum: dynamicTableEnum.Employees,
        apiParams: "",
      };
      const response = await api.getDynamicTableData(object);
      dispatch(updateEmployees(response?.data || []));
    } catch (error) {
      console.log("Error fetching employee data:", error);
    } finally {
      setDataFetching(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Employees</h1>
          <p className="text-gray-600">
            Manage employee records and information
          </p>
        </div>
        <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
          + Add Employee
        </button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link
          to="/employees/select?screenName=employeeDetails"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Employee Details</h3>
              <p className="text-sm text-gray-600">View employee information</p>
            </div>
          </div>
        </Link>

        <Link
          to="/employees/select?screenName=employeeCareer"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Employee Career</h3>
              <p className="text-sm text-gray-600">View career history</p>
            </div>
          </div>
        </Link>

        <Link
          to="/employees/select?screenName=employeeSchedule"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Employee Schedule</h3>
              <p className="text-sm text-gray-600">View schedule details</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Loading State */}
      {dataFetching && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employees...</p>
        </div>
      )}
    </div>
  );
}
