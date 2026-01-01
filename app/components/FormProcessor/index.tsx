import api from "~/api/roster";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { dynamicTableEnum } from "~/utils/dummyJson";
import { formatDateForAPI } from "~/utils/dateUtils";
import Accordion from "../Accordion";
import CheckboxComponent from "../Checkbox";
import CheckboxInputField from "../CheckboxInputField";
import ClockPickerInput from "../ClockPickerInput";
import ColorPickerInput from "../ColorPickerInput";
import DatePickerInput from "../DatePickerInput";
import InputDropdown from "../InputDropdown";
import InputField from "../InputField";
import MultiInputField from "../MultiInputField";
import MultiInputWithDropdown from "../MultiInputWithDropdown";
import PopupWrapper, { type PopupWrapperRef } from "../PopupWrapper";
import RadioButton from "../RadioButton";
import TableRenderer from "../TableRenderer";
import TableViewModal from "../TableViewModal";
import classNames from "classnames";
import { useAppSelector } from "~/redux/hooks";
import { selectEmployees } from "~/redux/slices/authSlice";

interface FormProcessorProps {
  dynamicFormData: any;
  handleSubmit: (formData: any) => Promise<any>;
  employeeCode?: string;
  customButtonFunctions?: any;
}

const getDisplayValue = (value: any): string => {
  if (Array.isArray(value)) {
    return value.map((item: any) => getDisplayValue(item)).join(", ");
  }
  return value?.code || value?.description || value?.Value || value || "";
};

const FormProcessor: React.FC<FormProcessorProps> = ({
  dynamicFormData,
  handleSubmit,
  employeeCode,
  customButtonFunctions,
}) => {
  const [tabs, setTabs] = useState<any[]>([]);
  const [tabForm, setTabForm] = useState<any[]>([]);
  const [generalForm, setGeneralForm] = useState<any[]>([]);
  const [headerForm, setHeaderForm] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [tableData, setTableData] = useState<any[]>([]);
  const [currentActiveField, setCurrentActiveField] = useState<any>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState<any>(null);
  const [modalTitle, setModalTitle] = useState("Select an option");
  const [isModalDataLoading, setIsModalDataLoading] = useState(false);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [parentModalSelection, setParentModalSelection] = useState<any>(null);
  const [isChildModal, setIsChildModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [isFormLoading, setIsFormLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading form...");

  const allEmployees = useAppSelector(selectEmployees);

  // New state for tables and accordions
  const [formTables, setFormTables] = useState<any[]>([]);
  const [formTablesData, setFormTablesData] = useState<{
    [key: string]: any[];
  }>({});
  const [tableColumns, setTableColumns] = useState<{ [key: number]: any[] }>(
    {}
  );
  const [accordions, setAccordions] = useState<any[]>([]);
  const [accordionFields, setAccordionFields] = useState<{
    [key: number]: any[];
  }>({});

  const popupRef = useRef<PopupWrapperRef>(null);

  const loadingMessages = [
    "Loading form...",
    "Preparing fields...",
    "Setting up form...",
    "Almost ready...",
  ];

  useEffect(() => {
    if (dynamicFormData) {
      setIsFormLoading(true);
      setLoadingText("Processing form data...");
      setTimeout(() => {
        sortAndProcessData(dynamicFormData);
        setIsFormLoading(false);
      }, 300);
    }
  }, [dynamicFormData]);

  // Cycle through loading messages
  useEffect(() => {
    if (isFormLoading) {
      const interval = setInterval(() => {
        setLoadingText((prev) => {
          const currentIndex = loadingMessages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isFormLoading]);

  // Toast auto-hide
  useEffect(() => {
    if (toastVisible) {
      const timer = setTimeout(() => {
        setToastVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastVisible]);

  const sortAndProcessData = (data: any) => {
    // Merge formInputCheckbox fields with dynamicFields (exclude clockpickercheckbox)
    let allFields = (data.dynamicFields || []).filter(
      (field: any) => field.fieldType !== "clockpickercheckbox"
    );

    // Process formInputCheckbox if they exist
    if (data.formInputCheckbox && data.formInputCheckbox.length > 0) {
      const checkboxInputFields = data.formInputCheckbox
        .filter(
          (field: any) =>
            field.fieldType !== "EmptyDiv" &&
            field.fieldType !== "clockpickercheckbox"
        )
        .map((field: any) => ({
          ...field,
          isFormInputCheckbox: true,
          displaySeqNo: 1,
        }));

      allFields = allFields.map((field: any) => ({
        ...field,
        displaySeqNo: field.displaySeqNo + 1000,
      }));

      allFields = [...checkboxInputFields, ...allFields];
    }

    // Enrich dynamicFields with onClickFuncName and isMultiSelect from pageTableModals
    const enrichedDynamicFields = allFields.map((field: any) => {
      const matchingModal = data.pageTableModals?.find(
        (modal: any) => modal.configurationKey === field.jquerySelectorID
      );

      if (matchingModal) {
        return {
          ...field,
          onClickFuncName: matchingModal.onClickFuncName,
          isMultiSelect: matchingModal.isMultiSelect,
          isPost: matchingModal.isPost,
          jsonDataKeyName: matchingModal.jsonDataKeyName,
          fieldData: matchingModal.fieldData,
          tableDataEnum: field.tableDataEnum || matchingModal.tableDataEnum,
        };
      }

      return field;
    });

    // Process tabs if they exist
    if (data.tabs && Array.isArray(data.tabs) && data.tabs.length > 0) {
      const sortedTabs = data.tabs.sort((a: any, b: any) => a.tabId - b.tabId);
      let tabArray: any[] = [];

      for (let i = 0; i < sortedTabs.length; i++) {
        const fieldData = enrichedDynamicFields.filter(
          (item: any) =>
            item.parentTabID === i + 1 &&
            item.parentAccordionID === 0 &&
            item.fieldType !== "clockpickercheckbox"
        );
        tabArray.push(
          fieldData.sort((a: any, b: any) => a.displaySeqNo - b.displaySeqNo)
        );
      }

      setTabs(sortedTabs);
      setTabForm(tabArray);
    } else {
      setTabs([]);
      setTabForm([]);
    }

    // Process general fields
    const generalFields = enrichedDynamicFields.filter(
      (item: any) =>
        item.parentTabID === 0 &&
        !item.isHeader &&
        item?.parentAccordionID === 0 &&
        item.fieldType !== "clockpickercheckbox"
    );

    // Process header fields
    const headerFields = enrichedDynamicFields.filter(
      (item: any) => item.isHeader && item.fieldType !== "clockpickercheckbox"
    );

    setHeaderForm(
      headerFields.sort((a: any, b: any) => a.displaySeqNo - b.displaySeqNo)
    );
    setGeneralForm(
      generalFields.sort((a: any, b: any) => a.displaySeqNo - b.displaySeqNo)
    );

    // Process tables if they exist
    if (data.formTables && data.formTables.length > 0) {
      setFormTables(data.formTables);

      // Enrich columns with modal information
      const enrichedColumns = (data.formTablesColumns || []).map((col: any) => {
        if (col.modalID) {
          const matchingModal = data.pageTableModals?.find(
            (modal: any) => modal.modalID === col.modalID
          );

          if (matchingModal) {
            return {
              ...col,
              fieldData: matchingModal.fieldData || col.fieldData,
              tableDataEnum: col.tableDataEnum || matchingModal.tableDataEnum,
              isMultiSelect: matchingModal.isMultiSelect,
            };
          }
        }
        return col;
      });

      // Group columns by table ID
      const columnsMap: { [key: number]: any[] } = {};
      enrichedColumns.forEach((col: any) => {
        if (!columnsMap[col.columnTableID]) {
          columnsMap[col.columnTableID] = [];
        }
        columnsMap[col.columnTableID].push(col);
      });
      setTableColumns(columnsMap);

      // Initialize table data from response
      const initialTableData: { [key: string]: any[] } = {};
      data.formTables.forEach((table: any) => {
        const tableKey = table.jsonDataKeyName || table.tableID;
        if (data.data && data.data[tableKey]) {
          initialTableData[tableKey] = data.data[tableKey];
        } else if (table.tableData && Array.isArray(table.tableData)) {
          initialTableData[tableKey] = table.tableData;
        } else {
          initialTableData[tableKey] = [];
        }
      });
      setFormTablesData(initialTableData);
    }

    // Process accordions if they exist
    if (data.accordions && data.accordions.length > 0) {
      setAccordions(data.accordions);

      const accordionFieldsMap: { [key: number]: any[] } = {};
      enrichedDynamicFields.forEach((field: any) => {
        if (
          field.parentAccordionID > 0 &&
          field.fieldType !== "clockpickercheckbox"
        ) {
          if (!accordionFieldsMap[field.parentAccordionID]) {
            accordionFieldsMap[field.parentAccordionID] = [];
          }
          accordionFieldsMap[field.parentAccordionID].push(field);
        }
      });

      // Sort accordion fields by displaySeqNo
      Object.keys(accordionFieldsMap).forEach((accordionId) => {
        accordionFieldsMap[Number(accordionId)].sort(
          (a, b) => a.displaySeqNo - b.displaySeqNo
        );
      });

      setAccordionFields(accordionFieldsMap);
    }
  };

  // Continued in next part...
  const handlePopupPress = async (
    fieldData: any,
    currentField: any,
    pageIndex: any
  ) => {
    console.log(fieldData, "field Data popup press");

    // Reset nested modal states
    setIsChildModal(false);
    setParentModalSelection(null);

    let title = "Select an option";
    if (dynamicFormData?.pageTableModals && currentField?.jquerySelectorID) {
      const matchingModal = dynamicFormData.pageTableModals.find(
        (modal: any) => modal.configurationKey === currentField.jquerySelectorID
      );
      if (matchingModal?.modalTitle) {
        title = matchingModal.modalTitle;
      }
    }

    if (!title || title === "Select an option") {
      title =
        currentField?.displayName ||
        currentField?.placeholder ||
        "Select an option";
    }

    setModalTitle(title);
    setIsMultiSelect(currentField?.isMultiSelect ?? false);
    setIsModalDataLoading(true);
    popupRef?.current?.show();

    if (currentField?.tableDataEnum && !currentField?.fieldData?.length) {
      console.log(
        "Field has tableDataEnum, fetching data:",
        currentField.tableDataEnum
      );
      try {
        const updatedFieldData = await fetchFormdata(
          currentField?.tableDataEnum
        );

        if (updatedFieldData && updatedFieldData.length > 0) {
          // Update field data in the form state
          updateFieldData(currentField, updatedFieldData, pageIndex);
        }

        const dataToShow = updatedFieldData || fieldData;
        setTableData(dataToShow);
        setCurrentPageIndex(pageIndex);
        setCurrentActiveField(currentField);
      } catch (error) {
        console.error("Error loading field data:", error);
        setTableData(fieldData);
        setCurrentPageIndex(pageIndex);
        setCurrentActiveField(currentField);
      }
    } else {
      setTableData(fieldData);
      setCurrentPageIndex(pageIndex);
      setCurrentActiveField(currentField);
    }
    setIsModalDataLoading(false);
  };

  const updateFieldData = (field: any, data: any[], pageIndex: any) => {
    if (pageIndex === "general") {
      const updatedGeneralForm = [...generalForm];
      const fieldObject = updatedGeneralForm.find(
        (f: any) => f.jquerySelectorID === field.jquerySelectorID
      );
      if (fieldObject) {
        fieldObject.fieldData = data;
        setGeneralForm(updatedGeneralForm);
      } else {
        // Check accordion fields
        updateAccordionFieldData(field, data, 0);
      }
    } else {
      const updatedTabForm = [...tabForm];
      const currentPage = updatedTabForm[pageIndex];
      const fieldObject = currentPage?.find(
        (f: any) => f.jquerySelectorID === field.jquerySelectorID
      );
      if (fieldObject) {
        fieldObject.fieldData = data;
        setTabForm(updatedTabForm);
      } else {
        // Check accordion fields
        updateAccordionFieldData(field, data, pageIndex + 1);
      }
    }
  };

  const updateAccordionFieldData = (
    field: any,
    data: any[],
    parentTabID: number
  ) => {
    const updatedAccordionFields = { ...accordionFields };
    let found = false;
    Object.keys(updatedAccordionFields).forEach((accordionId) => {
      const fields = updatedAccordionFields[Number(accordionId)];
      const fieldIndex = fields.findIndex(
        (f: any) =>
          f.jquerySelectorID === field.jquerySelectorID &&
          f.parentTabID === parentTabID
      );
      if (fieldIndex !== -1) {
        const updatedFields = [...fields];
        updatedFields[fieldIndex] = {
          ...updatedFields[fieldIndex],
          fieldData: data,
        };
        updatedAccordionFields[Number(accordionId)] = updatedFields;
        found = true;
      }
    });
    if (found) {
      setAccordionFields(updatedAccordionFields);
    }
  };

  const updateChildFieldsFromParent = (
    parentField: any,
    parentValue: any,
    pageIndex: any,
    isGeneral: boolean
  ) => {
    const isModalType =
      parentField?.fieldType === "modal" ||
      parentField?.fieldType === "selectdropdown" ||
      parentField?.fieldType === "modalinput";

    if (!parentField?.jsonDataKeyName || !isModalType) {
      return;
    }

    let descriptionValue = "";
    if (typeof parentValue === "object" && parentValue?.description) {
      descriptionValue = parentValue.description;
    } else {
      return;
    }

    const parentJsonKey = parentField.jsonDataKeyName;

    const updateIfChildField = (field: any) => {
      return (
        field.parentJsonDataKeyName === parentJsonKey &&
        field.parentJsonDataKeyName !== null
      );
    };

    if (isGeneral) {
      let updatedGeneralForm = [...generalForm];
      let generalUpdated = false;
      updatedGeneralForm = updatedGeneralForm.map((field) => {
        if (updateIfChildField(field)) {
          generalUpdated = true;
          return { ...field, defaultValue: descriptionValue };
        }
        return field;
      });
      if (generalUpdated) {
        setGeneralForm(updatedGeneralForm);
      }

      // Check accordion fields in general section
      const updatedAccordionFields = { ...accordionFields };
      let accordionUpdated = false;
      Object.keys(updatedAccordionFields).forEach((accordionId) => {
        const fields = updatedAccordionFields[Number(accordionId)];
        updatedAccordionFields[Number(accordionId)] = fields.map(
          (field: any) => {
            if (field.parentTabID === 0 && updateIfChildField(field)) {
              accordionUpdated = true;
              return { ...field, defaultValue: descriptionValue };
            }
            return field;
          }
        );
      });
      if (accordionUpdated) {
        setAccordionFields(updatedAccordionFields);
      }
    } else {
      let updatedTabForm = [...tabForm];
      let tabUpdated = false;
      if (updatedTabForm[pageIndex]) {
        updatedTabForm[pageIndex] = updatedTabForm[pageIndex].map(
          (field: any) => {
            if (updateIfChildField(field)) {
              tabUpdated = true;
              return { ...field, defaultValue: descriptionValue };
            }
            return field;
          }
        );
        if (tabUpdated) {
          setTabForm(updatedTabForm);
        }
      }

      // Check accordion fields in this tab
      const updatedAccordionFields = { ...accordionFields };
      let accordionUpdated = false;
      Object.keys(updatedAccordionFields).forEach((accordionId) => {
        const fields = updatedAccordionFields[Number(accordionId)];
        updatedAccordionFields[Number(accordionId)] = fields.map(
          (field: any) => {
            if (
              field.parentTabID === pageIndex + 1 &&
              updateIfChildField(field)
            ) {
              accordionUpdated = true;
              return { ...field, defaultValue: descriptionValue };
            }
            return field;
          }
        );
      });
      if (accordionUpdated) {
        setAccordionFields(updatedAccordionFields);
      }
    }
  };

  const openChildModal = async (parentField: any, _parentSelection: any) => {
    const childModalConfig = dynamicFormData?.pageTableModals?.find(
      (modal: any) => modal.modalID === parentField.childModalID
    );

    if (!childModalConfig) {
      console.error("[Nested Modal] Child modal configuration not found");
      popupRef.current?.hide();
      return;
    }

    setTableData([]);
    setModalTitle(
      childModalConfig.modalTitle ||
        childModalConfig.displayName ||
        "Select an option"
    );
    setIsMultiSelect(childModalConfig.isMultiSelect ?? false);
    setIsChildModal(true);
    setIsModalDataLoading(true);

    try {
      if (childModalConfig.tableDataEnum) {
        const parentCode =
          _parentSelection?.code ||
          _parentSelection?.Code ||
          _parentSelection?.value ||
          _parentSelection?.Value ||
          "";

        const apiParamsKey = childModalConfig.apiParams || "apiParams";
        const apiParamsValue = apiParamsKey
          ? `${apiParamsKey}=${parentCode}`
          : "";

        const childModalData = await fetchFormdataWithParams(
          childModalConfig.tableDataEnum,
          apiParamsValue
        );

        if (childModalData && childModalData.length > 0) {
          setTableData(childModalData);
        } else {
          setTableData([]);
        }
      } else {
        setTableData(childModalConfig.fieldData || []);
      }
    } catch (error) {
      console.error("[Nested Modal] Error loading child modal data:", error);
      setTableData([]);
    }

    setIsModalDataLoading(false);
  };

  const handleTableSelection = (selectedItems: any[]) => {
    const currentItems = currentActiveField?.isMultiSelect
      ? selectedItems
      : selectedItems[0];

    // Check if we need to open a child modal
    if (!isChildModal && currentActiveField?.childModalID) {
      setParentModalSelection(currentItems);
      openChildModal(currentActiveField, currentItems);
      return;
    }

    if (isChildModal) {
      setParentModalSelection(null);
      setIsChildModal(false);
    }

    // Handle table cell modal responses
    if (currentPageIndex === "table" && currentActiveField?.tableKey) {
      const tableKey = currentActiveField.tableKey;
      const rowIndex = currentActiveField.rowIndex;
      const columnName = currentActiveField.columnName;

      const updatedTableData = { ...formTablesData };
      const tableRows = [...(updatedTableData[tableKey] || [])];
      if (tableRows[rowIndex]) {
        tableRows[rowIndex] = {
          ...tableRows[rowIndex],
          [columnName]: currentItems,
        };

        // Find the table to get its columns
        const table = formTables.find(
          (t: any) => (t.jsonDataKeyName || t.tableID) === tableKey
        );

        if (table) {
          const columns = tableColumns[table.id] || [];
          const currentColumnIndex = columns.findIndex(
            (col: any) => col.columnName === columnName
          );

          // Check if the next column is a Display field and auto-populate it
          if (
            currentColumnIndex >= 0 &&
            currentColumnIndex < columns.length - 1
          ) {
            const nextColumn = columns[currentColumnIndex + 1];

            if (
              nextColumn.fieldType === "Display" &&
              currentItems?.description &&
              (nextColumn.displayName === "Description" ||
                nextColumn.displayName === "description")
            ) {
              tableRows[rowIndex][nextColumn.columnName] =
                currentItems.description;
            } else if (
              nextColumn.fieldType === "Display" &&
              nextColumn.propertyCode
            ) {
              const propertyKey = nextColumn.propertyCode.toLowerCase();
              const displayValue =
                currentItems?.[propertyKey] ||
                currentItems?.[nextColumn.propertyCode] ||
                "";

              tableRows[rowIndex][nextColumn.columnName] = displayValue;
            }
          }
        }

        updatedTableData[tableKey] = tableRows;
        setFormTablesData(updatedTableData);
      }
    } else if (currentPageIndex === "general") {
      let updatedGeneralForm = [...generalForm];
      const fieldObject = updatedGeneralForm.find(
        (field: any) =>
          field.jquerySelectorID === currentActiveField.jquerySelectorID
      );
      if (fieldObject) {
        fieldObject.defaultValue = currentItems;
        setGeneralForm(updatedGeneralForm);
        updateChildFieldsFromParent(fieldObject, currentItems, 0, true);
      } else {
        // Check accordion fields
        updateFieldInAccordion(currentActiveField, currentItems, 0, true);
      }
    } else {
      let updatedTabForm = [...tabForm];
      const currentPage = updatedTabForm[currentPageIndex];
      const fieldObject = currentPage?.find(
        (field: any) =>
          field.jquerySelectorID === currentActiveField.jquerySelectorID
      );
      if (fieldObject) {
        fieldObject.defaultValue = currentItems;
        setTabForm(updatedTabForm);
        updateChildFieldsFromParent(
          fieldObject,
          currentItems,
          currentPageIndex,
          false
        );
      } else {
        // Check accordion fields
        updateFieldInAccordion(
          currentActiveField,
          currentItems,
          currentPageIndex,
          false
        );
      }
    }

    popupRef.current?.hide();

    // Call custom button function if onClickFuncName exists
    if (currentActiveField?.onClickFuncName && customButtonFunctions) {
      const funcName = currentActiveField.onClickFuncName;
      if (typeof customButtonFunctions[funcName] === "function") {
        customButtonFunctions[funcName](currentItems, currentActiveField);
      }
    }
  };

  const updateFieldInAccordion = (
    field: any,
    value: any,
    pageIndex: number,
    isGeneral: boolean
  ) => {
    const updatedAccordionFields = { ...accordionFields };
    let found = false;

    Object.keys(updatedAccordionFields).forEach((accordionId) => {
      const fields = updatedAccordionFields[Number(accordionId)];
      const fieldIndex = fields.findIndex(
        (f: any) =>
          f.jquerySelectorID === field.jquerySelectorID &&
          f.parentTabID === (isGeneral ? 0 : pageIndex + 1)
      );

      if (fieldIndex !== -1) {
        const updatedFields = [...fields];
        updatedFields[fieldIndex] = {
          ...updatedFields[fieldIndex],
          defaultValue: value,
        };
        updatedAccordionFields[Number(accordionId)] = updatedFields;
        found = true;
        updateChildFieldsFromParent(
          updatedFields[fieldIndex],
          value,
          pageIndex,
          isGeneral
        );
      }
    });

    if (found) {
      setAccordionFields(updatedAccordionFields);
    }
  };

  const handleGeneralFormChange = (currentField: any, value: any) => {
    let updatedGeneralForm = [...generalForm];
    let fieldObject = updatedGeneralForm.find(
      (field: any) => field.jquerySelectorID === currentField.jquerySelectorID
    );

    if (fieldObject) {
      fieldObject.defaultValue = value;
      setGeneralForm(updatedGeneralForm);
      updateChildFieldsFromParent(fieldObject, value, 0, true);
    } else {
      updateFieldValueInAccordion(currentField, value, 0, true);
    }

    // Clear validation error
    if (validationErrors[currentField.jquerySelectorID]) {
      const newErrors = { ...validationErrors };
      delete newErrors[currentField.jquerySelectorID];
      setValidationErrors(newErrors);
    }
  };

  const handleTabFormChange = (
    currentField: any,
    value: any,
    pageIndex: number
  ) => {
    let updatedTabForm = [...tabForm];
    const currentPage = updatedTabForm[pageIndex];
    const fieldObject = currentPage?.find(
      (field: any) => field.jquerySelectorID === currentField.jquerySelectorID
    );

    if (fieldObject) {
      fieldObject.defaultValue = value;
      setTabForm(updatedTabForm);
      updateChildFieldsFromParent(fieldObject, value, pageIndex, false);
    } else {
      updateFieldValueInAccordion(currentField, value, pageIndex, false);
    }

    // Clear validation error
    if (validationErrors[currentField.jquerySelectorID]) {
      const newErrors = { ...validationErrors };
      delete newErrors[currentField.jquerySelectorID];
      setValidationErrors(newErrors);
    }
  };

  const updateFieldValueInAccordion = (
    field: any,
    value: any,
    pageIndex: number,
    isGeneral: boolean
  ) => {
    const updatedAccordionFields = { ...accordionFields };
    let found = false;

    Object.keys(updatedAccordionFields).forEach((accordionId) => {
      const fields = updatedAccordionFields[Number(accordionId)];
      const fieldIndex = fields.findIndex(
        (f: any) =>
          f.jquerySelectorID === field.jquerySelectorID &&
          f.parentTabID === (isGeneral ? 0 : pageIndex + 1)
      );

      if (fieldIndex !== -1) {
        const updatedFields = [...fields];
        updatedFields[fieldIndex] = {
          ...updatedFields[fieldIndex],
          defaultValue: value,
        };
        updatedAccordionFields[Number(accordionId)] = updatedFields;
        found = true;
        updateChildFieldsFromParent(
          updatedFields[fieldIndex],
          value,
          pageIndex,
          isGeneral
        );
      }
    });

    if (found) {
      setAccordionFields(updatedAccordionFields);
    }
  };

  const collectFormData = () => {
    const formData: any = {};

    if (employeeCode) {
      formData.employeeCode = employeeCode;
    }

    const processFieldValue = (field: any) => {
      if (field.isFormInputCheckbox) {
        if (field.checkboxJsonDataKeyName) {
          formData[field.checkboxJsonDataKeyName] =
            field.defaultCheckboxValue || false;
        }
        if (field.inputJsonDataKeyName) {
          formData[field.inputJsonDataKeyName] = field.defaultInputValue || "";
        }
        return null;
      }

      let value = field.defaultValue;

      if (
        field.fieldType.toLowerCase() === "modal" ||
        field.fieldType.toLowerCase() === "selectdropdown" ||
        field.fieldType.toLowerCase() === "modalinput"
      ) {
        if (field.isMultiSelect) {
          value = field.defaultValue.map((item: any) => getDisplayValue(item));
        } else {
          value = getDisplayValue(field.defaultValue) || "";
        }
      } else if (field.fieldType === "checkbox") {
        value = field.defaultValue || false;
      } else if (field.fieldType === "datepickersingle") {
        if (field.defaultValue) {
          const dateFormat = field.postDateFormat || "DD-MM-YYYY";
          value = formatDateForAPI(field.defaultValue, dateFormat);
        } else {
          value = "";
        }
      } else if (field.fieldType === "multiselectwithinputdiv") {
        value = Array.isArray(field.defaultValue) ? field.defaultValue : [];
      } else if (field.fieldType === "multiselectwithdropdowninputdiv") {
        value = Array.isArray(field.defaultValue) ? field.defaultValue : [];
      } else if (field.fieldType === "clockpicker") {
        value = field.defaultValue || "";
      } else if (field.fieldType.toLowerCase() === "colorpicker") {
        value = field.defaultValue
          ? String(field.defaultValue).replace("#", "")
          : "";
      } else if (typeof value === "object" && value !== null) {
        value = value.code || "";
      } else if (field.fieldType === "inputfield") {
        value = field.defaultValue || "";
      } else {
        value = value || "";
      }

      return value;
    };

    // Collect header form data
    headerForm.forEach((field) => {
      if (field.isPost) {
        if (field.isFormInputCheckbox) {
          processFieldValue(field);
        } else if (field.jsonDataKeyName) {
          formData[field.jsonDataKeyName] = processFieldValue(field);
        }
      }
    });

    // Collect general form data
    generalForm.forEach((field) => {
      if (field.isPost) {
        if (field.isFormInputCheckbox) {
          processFieldValue(field);
        } else if (field.jsonDataKeyName) {
          formData[field.jsonDataKeyName] = processFieldValue(field);
        }
      }
    });

    // Collect tab form data
    tabForm.forEach((tab) => {
      tab.forEach((field: any) => {
        if (field.isPost) {
          if (field.isFormInputCheckbox) {
            processFieldValue(field);
          } else if (field.jsonDataKeyName) {
            formData[field.jsonDataKeyName] = processFieldValue(field);
          }
        }
      });
    });

    // Collect accordion fields data
    Object.keys(accordionFields).forEach((accordionId) => {
      const fields = accordionFields[Number(accordionId)] || [];
      fields.forEach((field) => {
        if (field.isPost) {
          if (field.isFormInputCheckbox) {
            processFieldValue(field);
          } else if (field.jsonDataKeyName) {
            formData[field.jsonDataKeyName] = processFieldValue(field);
          }
        }
      });
    });

    // Collect table data
    formTables.forEach((table: any) => {
      if (table.isPost && table.jsonDataKeyName) {
        const tableKey = table.jsonDataKeyName;
        const tableRows = formTablesData[tableKey] || [];
        const columns = tableColumns[table.id] || [];

        const processedRows = tableRows.map((row: any) => {
          const rowData: any = {};
          columns.forEach((col: any) => {
            if (col.isPost && col.jsonDataKeyName) {
              let value = row[col.columnName];

              if (
                col.fieldType.toLowerCase() === "modal" ||
                col.fieldType.toLowerCase() === "selectdropdown" ||
                col.fieldType.toLowerCase() === "modalinput"
              ) {
                if (Array.isArray(value) && value.length > 0) {
                  value = value.map((item: any) => getDisplayValue(item));
                } else {
                  value = getDisplayValue(value) || "";
                }
              }

              rowData[col.jsonDataKeyName] = value || "";
            }
          });
          return rowData;
        });

        formData[tableKey] = processedRows;
      }
    });

    console.log(formData, "formData in processor");
    return formData;
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    const isFieldEmpty = (field: any) => {
      const value = field.defaultValue;

      if (value === null || value === undefined || value === "") {
        return true;
      }

      if (field.fieldType === "modal" || field.fieldType === "selectdropdown") {
        return !value || !value.code;
      }

      if (field.fieldType === "multiselectwithinputdiv") {
        return !Array.isArray(value) || value.length === 0;
      }

      if (field.fieldType === "multiselectwithdropdowninputdiv") {
        return !Array.isArray(value) || value.length === 0;
      }

      return false;
    };

    const validateField = (field: any) => {
      if (field.isRequired && isFieldEmpty(field)) {
        errors[field.jquerySelectorID] =
          field.validationMessage || "This field is required";
        return;
      }
    };

    headerForm.forEach((field) => validateField(field));
    generalForm.forEach((field) => validateField(field));
    tabForm.forEach((tab) => {
      tab.forEach((field: any) => validateField(field));
    });

    Object.keys(accordionFields).forEach((accordionId) => {
      const fields = accordionFields[Number(accordionId)] || [];
      fields.forEach((field) => validateField(field));
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleSaveChanges = async () => {
    try {
      const isValid = validateForm();

      if (!isValid) {
        showToast("Please fill in all required fields.", "error");
        return;
      }

      setIsSaving(true);
      const formData = collectFormData();
      console.log("Submitting form data:", formData);
      const response = await handleSubmit(formData);
      setIsSaving(false);

      if (response?.data?.status === "error") {
        showToast(response?.data?.message || "An error occurred", "error");
      } else {
        showToast("Changes saved successfully!", "success");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setIsSaving(false);
      const errorMessage =
        error?.message ||
        error?.data?.message ||
        "Failed to save changes. Please try again.";
      showToast(errorMessage, "error");
    }
  };

  const handleTabPress = (index: number) => {
    setActiveTab(index);
  };

  const fetchFormdata = async (tableDataEnum: number) => {
    try {
      if (tableDataEnum === dynamicTableEnum.Employees) {
        return allEmployees;
      }

      let data = {
        tableDataEnum: tableDataEnum,
        apiParams: "",
      };
      console.log("Fetching form data:", data);
      const response = await api.getDynamicTableData(data);
      console.log("Form data fetched:", response?.data);
      return response?.data;
    } catch (error) {
      console.error("Error fetching form data:", error);
      return [];
    }
  };

  const fetchFormdataWithParams = async (
    tableDataEnum: number,
    apiParams: string
  ) => {
    try {
      if (tableDataEnum === dynamicTableEnum.Employees) {
        return allEmployees;
      }

      let data = {
        tableDataEnum: tableDataEnum,
        apiParams: apiParams,
      };
      console.log("[Nested Modal] Fetching form data with params:", data);
      const response = await api.getDynamicTableData(data);
      console.log("[Nested Modal] Form data fetched:", response?.data);
      return response?.data;
    } catch (error) {
      console.error("[Nested Modal] Error fetching form data:", error);
      return [];
    }
  };

  const handleDropdownPress = async (
    field: any,
    pageIndex: any,
    isGeneral: boolean = false
  ) => {
    if (field?.tableDataEnum) {
      try {
        const updatedFieldData = await fetchFormdata(field?.tableDataEnum);

        if (updatedFieldData) {
          updateFieldData(
            field,
            updatedFieldData,
            isGeneral ? "general" : pageIndex
          );
        }
      } catch (error) {
        console.error("Error loading dropdown data:", error);
      }
    }
  };

  const handleTableCellModalPress = async (
    tableKey: string,
    column: any,
    rowIndex: number,
    currentValue: any
  ) => {
    const modal = dynamicFormData?.pageTableModals?.find(
      (m: any) => m.modalID === column.modalID
    );

    if (!modal) return;

    setIsChildModal(false);
    setParentModalSelection(null);

    setModalTitle(modal.modalTitle || column.displayName);
    setIsMultiSelect(modal.isMultiSelect || false);
    setCurrentActiveField({
      ...column,
      tableKey,
      rowIndex,
      childModalID: column.childModalID,
    });
    setCurrentPageIndex("table");

    setIsModalDataLoading(true);
    popupRef?.current?.show();

    const hasValidData =
      column.fieldData &&
      (Array.isArray(column.fieldData)
        ? column.fieldData.length > 0
        : Object.keys(column.fieldData).length > 0);

    if (column.tableDataEnum && !hasValidData) {
      try {
        const data = await fetchFormdata(column.tableDataEnum);

        if (data && data.length > 0) {
          const updatedTableColumns = { ...tableColumns };
          const tableId = Object.keys(updatedTableColumns).find((id) => {
            return updatedTableColumns[Number(id)].some(
              (col: any) => col.columnName === column.columnName
            );
          });

          if (tableId) {
            updatedTableColumns[Number(tableId)] = updatedTableColumns[
              Number(tableId)
            ].map((col: any) => {
              if (col.columnName === column.columnName) {
                return { ...col, fieldData: data };
              }
              return col;
            });
            setTableColumns(updatedTableColumns);
          }
        }

        setTableData(data || []);
      } catch (error) {
        console.error("Error fetching table column data:", error);
        setTableData(column.fieldData || []);
      }
    } else {
      setTableData(column.fieldData || []);
    }

    setIsModalDataLoading(false);
  };

  const renderTablesForLocation = (
    parentTabID: number,
    parentAccordionID: number = 0
  ) => {
    const tables = formTables.filter(
      (table: any) =>
        table.parentTabID === parentTabID &&
        table.parentAccordionID === parentAccordionID
    );

    return tables.map((table: any, idx: number) => {
      const tableKey = table.jsonDataKeyName || table.tableID;
      const tableDataArray = formTablesData[tableKey] || [];
      const columns = tableColumns[table.id] || [];

      return (
        <TableRenderer
          key={`table-${table.id}-${idx}`}
          tableId={table.tableID}
          tableHeaderName={table.tableHeaderName}
          columns={columns}
          data={tableDataArray}
          onChange={(newData) => {
            setFormTablesData({
              ...formTablesData,
              [tableKey]: newData,
            });
          }}
          onModalPress={(column, rowIndex, currentValue) => {
            handleTableCellModalPress(tableKey, column, rowIndex, currentValue);
          }}
          isAddNewRowEnabled={table.isAddNewRowEnabled}
          isDeleteRowBtnEnabled={table.isDeleteRowBtnEnabled}
          validationErrors={validationErrors}
        />
      );
    });
  };

  const getRadioButtonOptions = (field: any) => {
    let fieldData = field.fieldData;

    if (typeof fieldData === "string" && fieldData.trim().startsWith("[")) {
      try {
        fieldData = JSON.parse(fieldData);
      } catch (error) {
        console.error("Error parsing fieldData JSON:", error);
      }
    }

    if (fieldData && Array.isArray(fieldData) && fieldData.length > 0) {
      return fieldData.map((item: any) => ({
        label:
          item.id ||
          item.Value ||
          item.ID ||
          item.value ||
          item.label ||
          item.Label ||
          "",
        value:
          item.ID ||
          item.value ||
          item.Value ||
          item.id ||
          item.label ||
          item.Label ||
          "",
      }));
    }
    return [];
  };

  const renderField = (
    field: any,
    fieldIndex: number,
    pageIndex: any,
    isGeneral: boolean = false
  ) => {
    const fieldError = validationErrors[field.jquerySelectorID];

    // Skip accordion fields
    if (field.fieldType === "accordion") {
      return null;
    }

    if (field.fieldType === "heading") {
      return (
        <div key={fieldIndex} className="w-full flex items-center mb-4">
          <div className="w-1 h-5 bg-blue-600 rounded mr-3"></div>
          <h3 className="text-base font-bold text-gray-800">{field.heading}</h3>
        </div>
      );
    }

    if (field.isFormInputCheckbox) {
      return (
        <CheckboxInputField
          key={fieldIndex}
          label={field.displayName}
          checkboxValue={field.defaultCheckboxValue || false}
          inputValue={field.defaultInputValue || ""}
          onCheckboxChange={(value) =>
            handleFormInputCheckboxChange(field, "checkbox", value)
          }
          onInputChange={(value) =>
            handleFormInputCheckboxChange(field, "input", value)
          }
          editable={!field.isReadOnly}
          layoutClass={field.layoutClass}
          className={getFieldWidthClass(field.layoutClass)}
        />
      );
    }

    if (field.fieldType === "emptydiv") {
      return (
        <div
          key={fieldIndex}
          className={getFieldWidthClass(field.layoutClass)}
        />
      );
    }

    if (field.fieldType === "selectdropdown") {
      return (
        <InputDropdown
          key={fieldIndex}
          label={field.displayName}
          placeholder={field.placeholder}
          className={getFieldWidthClass(field.layoutClass)}
          dropdownData={field.fieldData || []}
          value={field.defaultValue?.description || field.defaultValue}
          dropdown={true}
          error={fieldError}
          onPress={
            field.tableDataEnum
              ? () => handleDropdownPress(field, pageIndex, isGeneral)
              : undefined
          }
          onChange={(item) =>
            isGeneral
              ? handleGeneralFormChange(field, item)
              : handleTabFormChange(field, item, pageIndex)
          }
          required={field.isRequired}
        />
      );
    }

    if (field.fieldType === "modal" || field.fieldType === "modalinput") {
      return (
        <InputDropdown
          key={fieldIndex}
          label={field.displayName}
          placeholder={field.placeholder}
          className={getFieldWidthClass(field.layoutClass)}
          value={getDisplayValue(field.defaultValue)?.toString() || ""}
          ismodal={true}
          dropdown={false}
          error={fieldError}
          onPress={() => {
            if (field.fieldData?.length > 0 || field.tableDataEnum) {
              handlePopupPress(
                field.fieldData || [],
                field,
                isGeneral ? "general" : pageIndex
              );
            }
          }}
          required={field.isRequired}
        />
      );
    }

    if (field.fieldType === "checkbox") {
      return (
        <div key={fieldIndex} className={getFieldWidthClass(field.layoutClass)}>
          <CheckboxComponent
            label={field.displayName}
            value={field.defaultValue || false}
            onValueChange={(value) =>
              isGeneral
                ? handleGeneralFormChange(field, value)
                : handleTabFormChange(field, value, pageIndex)
            }
            disabled={field.isReadOnly}
            error={fieldError}
          />
        </div>
      );
    }

    if (field.fieldType === "radiobutton") {
      const options = getRadioButtonOptions(field);
      return (
        <RadioButton
          key={fieldIndex}
          label={field.displayName}
          options={options}
          value={field.defaultValue || ""}
          disabled={field.isReadOnly}
          error={fieldError}
          onChange={(value) =>
            isGeneral
              ? handleGeneralFormChange(field, value)
              : handleTabFormChange(field, value, pageIndex)
          }
          className={getFieldWidthClass(field.layoutClass)}
        />
      );
    }

    if (field.fieldType === "datepickersingle") {
      return (
        <DatePickerInput
          key={fieldIndex}
          field={field}
          className={getFieldWidthClass(field.layoutClass)}
          disabled={field.isReadOnly}
          onChange={(value) =>
            isGeneral
              ? handleGeneralFormChange(field, value)
              : handleTabFormChange(field, value, pageIndex)
          }
          error={fieldError}
        />
      );
    }

    if (field.fieldType.toLowerCase() === "clockpicker") {
      return (
        <ClockPickerInput
          key={fieldIndex}
          field={field}
          className={getFieldWidthClass(field.layoutClass)}
          onChange={(value) =>
            isGeneral
              ? handleGeneralFormChange(field, value)
              : handleTabFormChange(field, value, pageIndex)
          }
          error={fieldError}
        />
      );
    }

    if (field.fieldType.toLowerCase() === "colorpicker") {
      return (
        <ColorPickerInput
          key={fieldIndex}
          field={field}
          className={getFieldWidthClass(field.layoutClass)}
          onChange={(value) =>
            isGeneral
              ? handleGeneralFormChange(field, value)
              : handleTabFormChange(field, value, pageIndex)
          }
          error={fieldError}
        />
      );
    }

    if (field.fieldType === "multiselectwithinputdiv") {
      return (
        <MultiInputField
          key={fieldIndex}
          label={field.displayName}
          placeholder={field.placeholder}
          value={field.defaultValue}
          error={fieldError}
          keyboardType={field.fieldDataType === "Int" ? "numeric" : "default"}
          editable={!field.isReadOnly}
          onChange={(values) =>
            isGeneral
              ? handleGeneralFormChange(field, values)
              : handleTabFormChange(field, values, pageIndex)
          }
          className={getFieldWidthClass(field.layoutClass)}
        />
      );
    }

    if (field.fieldType === "multiselectwithdropdowninputdiv") {
      return (
        <MultiInputWithDropdown
          key={fieldIndex}
          label={field.displayName}
          placeholder={field.placeholder}
          value={field.defaultValue}
          error={fieldError}
          editable={!field.isReadOnly}
          childJsonDataKeyName={field.childJsonDataKeyName}
          dropdownData={field.fieldData || []}
          dropdownTitle={field.displayName || "Select an option"}
          onChange={(values) =>
            isGeneral
              ? handleGeneralFormChange(field, values)
              : handleTabFormChange(field, values, pageIndex)
          }
          onDropdownPress={
            field.tableDataEnum
              ? async () => {
                  const data = await fetchFormdata(field.tableDataEnum);
                  if (data && data.length > 0) {
                    updateFieldData(
                      field,
                      data,
                      isGeneral ? "general" : pageIndex
                    );
                  }
                  return data;
                }
              : undefined
          }
          className={getFieldWidthClass(field.layoutClass)}
        />
      );
    }

    if (field.fieldType === "textarea") {
      return (
        <div key={fieldIndex} className="w-full">
          <InputField
            label={field.displayName}
            placeholder={field.placeholder}
            value={field?.defaultValue}
            multiline={true}
            numberOfLines={4}
            disabled={field.isReadOnly}
            error={fieldError}
            keyboardType={field.fieldDataType === "Int" ? "numeric" : "default"}
            onChangeText={(value) =>
              isGeneral
                ? handleGeneralFormChange(field, value)
                : handleTabFormChange(field, value, pageIndex)
            }
            required={field.isRequired}
          />
        </div>
      );
    }

    return (
      <InputField
        key={fieldIndex}
        label={field.displayName}
        placeholder={field.placeholder}
        value={field?.defaultValue}
        disabled={field.isReadOnly}
        className={getFieldWidthClass(field.layoutClass)}
        error={fieldError}
        keyboardType={field.fieldDataType === "Int" ? "numeric" : "default"}
        onChangeText={(value) =>
          isGeneral
            ? handleGeneralFormChange(field, value)
            : handleTabFormChange(field, value, pageIndex)
        }
        required={field.isRequired}
      />
    );
  };

  const getFieldWidthClass = (layoutClass: number) => {
    if (layoutClass === 12) return "w-full";
    if (layoutClass === 6) return "w-full md:w-[48%]";
    if (layoutClass === 4) return "w-full md:w-[32%]";
    if (layoutClass === 3) return "w-full md:w-[24%]";
    return "w-full md:w-[48%]";
  };

  const handleFormInputCheckboxChange = (
    field: any,
    type: "checkbox" | "input",
    value: boolean | string
  ) => {
    if (type === "checkbox") {
      field.defaultCheckboxValue = value;
    } else {
      field.defaultInputValue = value;
    }

    // Update the field in the appropriate state
    if (field.parentAccordionID > 0) {
      const updatedAccordionFields = { ...accordionFields };
      const fieldsArray = updatedAccordionFields[field.parentAccordionID];
      if (fieldsArray) {
        const fieldToUpdate = fieldsArray.find(
          (f: any) => f.jquerySelectorID === field.jquerySelectorID
        );
        if (fieldToUpdate) {
          if (type === "checkbox") {
            fieldToUpdate.defaultCheckboxValue = value;
          } else {
            fieldToUpdate.defaultInputValue = value;
          }
        }
      }
      setAccordionFields(updatedAccordionFields);
    } else if (field.parentTabID > 0) {
      const updatedTabForm = [...tabForm];
      const tabIndex = field.parentTabID - 1;
      if (updatedTabForm[tabIndex]) {
        const fieldToUpdate = updatedTabForm[tabIndex].find(
          (f: any) => f.jquerySelectorID === field.jquerySelectorID
        );
        if (fieldToUpdate) {
          if (type === "checkbox") {
            fieldToUpdate.defaultCheckboxValue = value;
          } else {
            fieldToUpdate.defaultInputValue = value;
          }
        }
      }
      setTabForm(updatedTabForm);
    } else {
      const updatedGeneralForm = [...generalForm];
      const fieldToUpdate = updatedGeneralForm.find(
        (f: any) => f.jquerySelectorID === field.jquerySelectorID
      );
      if (fieldToUpdate) {
        if (type === "checkbox") {
          fieldToUpdate.defaultCheckboxValue = value;
        } else {
          fieldToUpdate.defaultInputValue = value;
        }
      }
      setGeneralForm(updatedGeneralForm);
    }
  };

  // Show loading state
  if (isFormLoading || !dynamicFormData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-base text-gray-600 font-medium">{loadingText}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto pb-8">
        {/* Header Form */}
        {headerForm.length > 0 && (
          <div className="bg-white p-6 mb-2 border-b border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-1 h-5 bg-blue-600 rounded mr-3"></div>
              <h2 className="text-base font-bold text-gray-800">
                Basic Information
              </h2>
            </div>
            <div className="flex flex-wrap gap-4">
              {headerForm.map((field, index) =>
                renderField(field, index, 0, true)
              )}
            </div>
          </div>
        )}

        {/* General Form */}
        {generalForm.length > 0 && (
          <div className="bg-white p-6">
            <div className="flex flex-wrap gap-4">
              {generalForm.map((field, index) =>
                renderField(field, index, 0, true)
              )}
            </div>
          </div>
        )}

        {/* Accordions in General Section */}
        {accordions
          .filter((acc: any) => acc.parentTabID === 0)
          .map((accordion: any, accIndex: number) => (
            <Accordion
              key={`accordion-general-${accordion.accordionId || accIndex}`}
              title={accordion.displayName}
            >
              <div className="flex flex-wrap gap-4">
                {(accordionFields[accordion.accordionId] || [])
                  .filter((field: any) => field.parentTabID === 0)
                  .map((field: any, fieldIndex: number) =>
                    renderField(field, fieldIndex, 0, true)
                  )}
              </div>
              {renderTablesForLocation(0, accordion.accordionId)}
            </Accordion>
          ))}

        {/* Tables in General Section */}
        {renderTablesForLocation(0, 0)}

        {/* Tab Pills */}
        {tabs.length > 0 && (
          <div className="bg-gray-50 border-b border-gray-200 overflow-x-auto">
            <div className="flex gap-2 p-4">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => handleTabPress(index)}
                  className={classNames(
                    "px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 whitespace-nowrap",
                    {
                      "bg-blue-600 text-white shadow-md": activeTab === index,
                      "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300":
                        activeTab !== index,
                    }
                  )}
                >
                  {tab.displayName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tabs Content */}
        {tabs.length > 0 && (
          <div className="bg-white">
            {tabForm.map((formFields, pageIndex) =>
              activeTab === pageIndex ? (
                <div key={pageIndex} className="p-6 animate-fade-in-up">
                  <div className="flex flex-wrap gap-4">
                    {formFields.map((field: any, fieldIndex: number) =>
                      renderField(field, fieldIndex, pageIndex, false)
                    )}
                  </div>

                  {/* Accordions in this tab */}
                  {accordions
                    .filter((acc: any) => acc.parentTabID === pageIndex + 1)
                    .map((accordion: any, accIndex: number) => (
                      <Accordion
                        key={`accordion-${accordion.accordionId || accIndex}`}
                        title={accordion.displayName}
                      >
                        <div className="flex flex-wrap gap-4">
                          {(accordionFields[accordion.accordionId] || [])
                            .filter(
                              (field: any) =>
                                field.parentTabID === pageIndex + 1
                            )
                            .map((field: any, fieldIndex: number) =>
                              renderField(field, fieldIndex, pageIndex, false)
                            )}
                        </div>
                        {renderTablesForLocation(
                          pageIndex + 1,
                          accordion.accordionId
                        )}
                      </Accordion>
                    ))}

                  {/* Tables in this tab */}
                  {renderTablesForLocation(pageIndex + 1, 0)}
                </div>
              ) : null
            )}
          </div>
        )}

        {/* Save Button */}
        <div className="px-6 py-4">
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className={classNames(
              "w-full md:w-auto px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200",
              "flex items-center justify-center gap-2 shadow-lg",
              {
                "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300":
                  !isSaving,
                "bg-gray-400 cursor-not-allowed": isSaving,
              }
            )}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastVisible && (
        <div
          className={classNames(
            "fixed top-5 right-5 z-50 px-6 py-4 rounded-lg shadow-2xl animate-fade-in-up",
            "flex items-center gap-3 min-w-[300px]",
            {
              "bg-green-500 text-white": toastType === "success",
              "bg-red-500 text-white": toastType === "error",
            }
          )}
        >
          <div className="flex-shrink-0">
            {toastType === "success" ? (
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            )}
          </div>
          <p className="font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Popup Modal */}
      <PopupWrapper ref={popupRef}>
        <TableViewModal
          key={isChildModal ? "child-modal" : "parent-modal"}
          onChange={(item) => handleTableSelection(item)}
          onClose={() => popupRef.current?.hide()}
          tableData={tableData}
          title={modalTitle}
          isMultiSelect={isMultiSelect}
          isLoading={isModalDataLoading}
        />
      </PopupWrapper>
    </div>
  );
};

export default FormProcessor;
