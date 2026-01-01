import { useParams, useSearchParams } from "react-router";
import { useEffect, useState, useRef } from "react";
// import FormProcessor from "~/components/FormProcessor";
import api from "~/api/roster";
import FormProcessor from "~/components/FormProcessor";

export default function EmployeeDetail() {
  const { code } = useParams();
  const [searchParams] = useSearchParams();
  const employeeCodeFromUrl =
    code || searchParams.get("employeeCode") || "00125886M";

  console.log("EmployeeDetail loaded - code from params:", code);
  console.log(
    "EmployeeDetail loaded - employeeCodeFromUrl:",
    employeeCodeFromUrl
  );

  const [currentEmployeeCode, setCurrentEmployeeCode] =
    useState(employeeCodeFromUrl);
  const [dynamicFormData, setDynamicFormData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const cancelTokenSourceRef = useRef<any>(null);

  const loadingMessages = [
    "Fetching data...",
    "Gathering information...",
    "Almost there...",
    "Thanks for your patience...",
  ];

  const customButtonFunctions = {
    afterLoadBtnCick: (selectedItem: any, currentField: any) => {
      console.log(
        "afterLoadBtnCick - After modal selection",
        selectedItem,
        currentField
      );
      if (currentField?.jquerySelectorID === "EmployeeCode") {
        fetchDynamicForm(selectedItem?.code);
        setCurrentEmployeeCode(selectedItem?.code);
      }

      if (currentField?.jquerySelectorID === "HistoryRecordSelect") {
        fetchDynamicForm(currentEmployeeCode, selectedItem?.pageNo);
      }
    },
    onFieldPress: async (currentField: any, pageIndex: any) => {
      console.log(
        "onFieldPress - Before opening field",
        currentField,
        pageIndex
      );

      // This is called BEFORE opening a dropdown/modal that has apiUrl
      // Load data via API if the field has apiUrl
      if (currentField?.apiUrl) {
        try {
          console.log("Loading data from API:", currentField.apiUrl);
          // For now, returning null will use existing fieldData
          return null;
        } catch (error) {
          console.error("Error loading field data:", error);
          return null;
        }
      }

      return null;
    },
  };

  useEffect(() => {
    if (employeeCodeFromUrl) {
      console.log("Fetching data for employee code:", employeeCodeFromUrl);
      fetchDynamicForm(employeeCodeFromUrl);
    } else {
      // No employee code provided, just fetch the form without employee data
      fetchDynamicForm("");
    }

    return () => {
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel("Operation canceled on unmount.");
      }
    };
  }, [employeeCodeFromUrl]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const fetchDynamicForm = async (employeeCode = "", sequenceNumber = "") => {
    try {
      setIsLoading(true);
      setLoadError(null);

      // Create cancel token similar to mobile version
      if (typeof window !== "undefined" && (window as any).axios) {
        cancelTokenSourceRef.current = (
          window as any
        ).axios.CancelToken.source();
      }

      const data = {
        FormName: "EmployeeDetails",
        Operation: "read",
        Parameters: {
          EmployeeCode: employeeCode,
          SeqNo: sequenceNumber ? sequenceNumber : "",
          EffectiveDate: "",
        },
      };

      console.log("Request data for dynamic form:", data);
      const response = await api.getDynamicForm(
        data,
        cancelTokenSourceRef.current
      );
      console.log("Dynamic form data fetched successfully:", response);
      setDynamicFormData(response);
      setIsLoading(false);
    } catch (error: any) {
      if ((window as any).axios?.isCancel?.(error)) {
        console.log("Request canceled:", error.message);
      } else {
        console.log("Error fetching dynamic form data:", error);
        setLoadError(error?.message || "Failed to load form data");
      }
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      console.log("Form submission started with data:", formData);

      // Call your API here to submit the form
      const response = await api.saveEmployeeDetailsForm(formData);
      // Return response so FormProcessor can handle success/error display
      return response;
    } catch (error) {
      console.error("Error submitting form:", error);
      // Throw error so FormProcessor can handle error display
      throw error;
    }
  };

  // Show error state if loading failed
  if (loadError && !isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px] bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold text-red-600 mb-2">
              {loadError}
            </p>
            <p className="text-gray-600">Please try again later</p>
            <button
              onClick={() => fetchDynamicForm(currentEmployeeCode)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while fetching data or if data hasn't loaded yet
  if (isLoading || !dynamicFormData) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px] bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <p className="mt-6 text-lg text-gray-600 font-medium">
              {loadingMessages[loadingMessageIndex]}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Employee Details
        </h1>
        {currentEmployeeCode && (
          <p className="text-gray-600">Employee Code: {currentEmployeeCode}</p>
        )}
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <FormProcessor
          dynamicFormData={dynamicFormData}
          customButtonFunctions={customButtonFunctions}
          handleSubmit={handleFormSubmit}
          employeeCode={currentEmployeeCode}
        />
      </div>
    </div>
  );
}
