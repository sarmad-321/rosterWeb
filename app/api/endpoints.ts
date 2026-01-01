export const BASE_URL = 'https://rosterapi.dakarhr.com/api/v1/';

const API_ENDPOINTS = {
  VALIDATE_DOMAIN: 'domain/validate',
  LOGIN: 'user/login',
  LOGOUT: 'auth/logout',
  TABLE_DATA: 'DynamicAPI/GetTableData',
  GET_ROSTER_EMPLOYEES: 'EmployeeSetupAPI/GetEmployees',
  GET_ROSTER_SCHEDULES: 'RoasterAPI/GetRosterEntriesData',
  GET_DYNAMIC_FORM: 'DynamicForm/details',
  SAVE_EMPLOYEE_CAREER_FORM: 'EmployeeSetupAPI/PostEmployeeCareerData',
  SAVE_EMPLOYEE_SCHEDULE_FORM: 'EmployeeSetupAPI/PostEmployeeScheduleData',
  SAVE_EMPLOYEE_DETAILS_FORM: 'EmployeeSetupAPI/PostEmployeeDetailsData',
  SAVE_SHIFT_GROUPING_FORM:
    'ConfigurationAPI/PostShiftGroupingDefinitionDetailsData',
  SAVE_SHIFT_RULE_DEFINATION_FORM:
    'ConfigurationAPI/PostShiftRuleDefinitionDetailsData',
  SAVE_SHIFT_DEFINITION_FORM: 'ConfigurationAPI/PostShiftDefinitionDetailsData',
  SAVE_SCHEDULE_ROSTER_SHIFT_DEFINATION_FORM:
    'ConfigurationAPI/PostScheduleRosterDefinitionDetailsData',
  SAVE_SCHEDULE_DEFINITION_FORM:
    'ConfigurationAPI/PostScheduleDefinitionDetailsData',
  SAVE_ROSTER_SCHEDULE_TIMINGS_FORM:
    'ConfigurationAPI/PostRosterScheduleTimingsData',
  SAVE_SCHEDULE_WORK_RULE_DEFINITION_FORM:
    'ConfigurationAPI/PostScheduleWorkRuleDefinitionDetailsData',
  SAVE_EMPLOYEE_ROSTER_STATS_CODE_STATISTICS_FORM:
    'RoasterAPI/PostEmployeeRosterStatsCodeStatisticsDetailData',
  SAVE_ROSTER_SHIFT_CODE_ADJUSTMENTS_FORM:
    'RoasterAPI/PostRosterShiftCodeAdjustmentsDetailData',
  SAVE_ROSTER_TRANSACTION_FORM: 'RoasterAPI/PostRosterTransactionDetailsData',
  SAVE_ROSTER_GROUPING_DETAIL_FORM: 'RoasterAPI/PostRosterGroupingDetailData',
  POST_ROSTER_ENTRIES: 'RoasterAPI/PostRosterEntries',
};

export { API_ENDPOINTS };

