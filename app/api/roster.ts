import axiosInstance from './index';
import { API_ENDPOINTS } from './endpoints';

interface GetTableDataParams {
  tableDataEnum: number;
  apiParams: string;
}

interface GetDynamicFormParams {
  FormName: string;
  Operation: string;
  Parameters: {
    EmployeeCode?: string;
    SeqNo?: string;
    EffectiveDate?: string;
    [key: string]: any;
  };
}

const getDynamicTableData = (data: GetTableDataParams) => {
  return axiosInstance.post(API_ENDPOINTS.TABLE_DATA, data);
};

const getRosterEmployees = () => {
  return axiosInstance.get(API_ENDPOINTS.GET_ROSTER_EMPLOYEES);
};

const getRosterSchedules = (params: any) => {
  return axiosInstance.post(API_ENDPOINTS.GET_ROSTER_SCHEDULES, params);
};

const getDynamicForm = (params: GetDynamicFormParams, cancelToken?: any) => {
  return axiosInstance.post(API_ENDPOINTS.GET_DYNAMIC_FORM, params, {
    cancelToken: cancelToken?.token,
  });
};

const saveEmployeeDetailsForm = (formData: any) => {
  // This endpoint might need to be updated based on your API
  return axiosInstance.post(API_ENDPOINTS.SAVE_EMPLOYEE_DETAILS_FORM, formData);
};

const saveEmployeeCareerForm = (formData: any) => {
  return axiosInstance.post(API_ENDPOINTS.SAVE_EMPLOYEE_CAREER_FORM, formData);
};

const saveEmployeeScheduleForm = (formData: any) => {
  return axiosInstance.post(API_ENDPOINTS.SAVE_EMPLOYEE_SCHEDULE_FORM, formData);
};

const saveShiftDefinitionForm = (formData: any) => {
  return axiosInstance.post('DynamicForm/save', formData);
};

const saveShiftRuleDefinitionForm = (formData: any) => {
  return axiosInstance.post('DynamicForm/save', formData);
};

const saveShiftGroupingForm = (formData: any) => {
  return axiosInstance.post('DynamicForm/save', formData);
};

const saveScheduleDefinitionForm = (formData: any) => {
  return axiosInstance.post('DynamicForm/save', formData);
};

const saveScheduleWorkRuleDefinitionForm = (formData: any) => {
  return axiosInstance.post('DynamicForm/save', formData);
};

const saveScheduleSeasonForm = (formData: any) => {
  return axiosInstance.post('DynamicForm/save', formData);
};

const saveRosterScheduleTimingsForm = (formData: any) => {
  return axiosInstance.post('DynamicForm/save', formData);
};

const api = {
  getDynamicTableData,
  getRosterEmployees,
  getRosterSchedules,
  getDynamicForm,
  saveEmployeeDetailsForm,
  saveEmployeeCareerForm,
  saveEmployeeScheduleForm,
  saveShiftDefinitionForm,
  saveShiftRuleDefinitionForm,
  saveShiftGroupingForm,
  saveScheduleDefinitionForm,
  saveScheduleWorkRuleDefinitionForm,
  saveScheduleSeasonForm,
  saveRosterScheduleTimingsForm,
};

export default api;

