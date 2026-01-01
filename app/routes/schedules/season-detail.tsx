import { useParams } from "react-router";
import { useEffect, useState, useRef } from "react";
import FormProcessor from "~/components/FormProcessor";
import api from "~/api/roster";

export default function ScheduleSeasonDetail() {
  const { code } = useParams();
  const companyCode = code || "";
  const [dynamicFormData, setDynamicFormData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const cancelTokenSourceRef = useRef<any>(null);

  const loadingMessages = ["Fetching data...", "Gathering information...", "Almost there...", "Thanks for your patience..."];

  const customButtonFunctions = {
    afterLoadBtnCick: (selectedItem: any, currentField: any) => {
      console.log("afterLoadBtnCick - After modal selection", selectedItem, currentField);
    },
    onFieldPress: async (currentField: any, pageIndex: any) => {
      console.log("onFieldPress - Before opening field", currentField, pageIndex);
      if (currentField?.apiUrl) {
        try {
          console.log("Loading data from API:", currentField.apiUrl);
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
    fetchDynamicForm();
    return () => {
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel("Operation canceled on unmount.");
      }
    };
  }, [companyCode]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const fetchDynamicForm = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      if (typeof window !== "undefined" && (window as any).axios) {
        cancelTokenSourceRef.current = (window as any).axios.CancelToken.source();
      }
      const data = {
        FormName: "SchedulerSeasonCodeAllocations",
        Operation: "read",
        Parameters: { CompanyCode: companyCode },
      };
      console.log("Request data for dynamic form:", data);
      const response = await api.getDynamicForm(data, cancelTokenSourceRef.current);
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
      const response = await api.saveScheduleSeasonForm(formData);
      console.log("Form submitted successfully:", response);
      return response;
    } catch (error) {
      console.error("Error submitting form:", error);
      throw error;
    }
  };

  if (loadError && !isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px] bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-red-600 mb-2">{loadError}</p>
            <p className="text-gray-600 mb-4">Please try again later</p>
            <button type="button" onClick={fetchDynamicForm} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !dynamicFormData) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px] bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <p className="mt-6 text-lg text-gray-600 font-medium">{loadingMessages[loadingMessageIndex]}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Schedule Season Code Allocations</h1>
        {companyCode && <p className="text-gray-600">Company Code: {companyCode}</p>}
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <FormProcessor dynamicFormData={dynamicFormData} customButtonFunctions={customButtonFunctions} handleSubmit={handleFormSubmit} />
      </div>
    </div>
  );
}


