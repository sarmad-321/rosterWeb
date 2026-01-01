// Common type definitions for the application

export interface Employee {
  code?: string;
  description?: string;
  name?: string;
  email?: string;
  department?: string;
  position?: string;
  [key: string]: any;
}

export interface DynamicField {
  jquerySelectorID: string;
  displayName: string;
  placeholder?: string;
  fieldType: string;
  fieldDataType?: string;
  defaultValue?: any;
  isRequired?: boolean;
  isReadOnly?: boolean;
  isPost?: boolean;
  isHeader?: boolean;
  jsonDataKeyName?: string;
  parentTabID?: number;
  parentAccordionID?: number;
  parentJsonDataKeyName?: string;
  displaySeqNo?: number;
  layoutClass?: number;
  validationMessage?: string;
  customRegexPattern?: string;
  postDateFormat?: string;
  tableDataEnum?: number;
  onClickFuncName?: string;
  isMultiSelect?: boolean;
  childModalID?: string;
  fieldData?: any[];
}

export interface DynamicFormData {
  dynamicFields?: DynamicField[];
  formInputCheckbox?: DynamicField[];
  tabs?: TabDefinition[];
  formTables?: TableDefinition[];
  formTablesColumns?: TableColumn[];
  accordions?: AccordionDefinition[];
  pageTableModals?: ModalDefinition[];
  data?: { [key: string]: any };
}

export interface TabDefinition {
  tabId: number;
  displayName: string;
}

export interface TableDefinition {
  id: number;
  tableID: string;
  tableHeaderName: string;
  jsonDataKeyName?: string;
  parentTabID: number;
  parentAccordionID: number;
  isPost?: boolean;
  isAddNewRowEnabled?: boolean;
  isDeleteRowBtnEnabled?: boolean;
  tableData?: any[];
}

export interface TableColumn {
  propertyCode: string;
  columnName: string;
  displayName: string;
  fieldType: string;
  fieldDataType: string;
  isRequired?: boolean;
  placeholder?: string;
  modalID?: string;
  childModalID?: string;
  tableDataEnum?: number;
  jsonDataKeyName?: string;
  isPost?: boolean;
  fieldData?: any[];
  columnTableID: number;
}

export interface AccordionDefinition {
  accordionId: number;
  displayName: string;
  parentTabID: number;
}

export interface ModalDefinition {
  modalID?: string;
  configurationKey?: string;
  modalTitle?: string;
  displayName?: string;
  onClickFuncName?: string;
  isMultiSelect?: boolean;
  isPost?: boolean;
  jsonDataKeyName?: string;
  fieldData?: any[];
  tableDataEnum?: number;
  apiParams?: string;
}

export interface APIResponse<T = any> {
  data?: T;
  status?: string;
  message?: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

