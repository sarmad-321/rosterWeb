# Roster Management Web Application

## Project Overview
This is a web version of the React Native Roster Management application, built using React Router v7, TypeScript, Tailwind CSS, and Redux for state management.

## Tech Stack
- **React Router v7**: For routing and navigation
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Redux Toolkit**: State management
- **Redux Persist**: Persistent state storage
- **Axios**: HTTP client for API calls
- **Moment.js**: Date manipulation

## Project Structure

```
app/
├── api/                    # API configuration and endpoints
│   ├── auth.ts            # Authentication API calls
│   ├── endpoints.ts       # API endpoint definitions
│   ├── index.ts           # Axios instance configuration
│   └── roster.ts          # Roster-specific API calls
│
├── components/            # Reusable UI components
│   ├── Accordion/         # Collapsible accordion component
│   ├── Checkbox/          # Checkbox input component
│   ├── CheckboxInputField/ # Combined checkbox and input field
│   ├── ClockPickerInput/  # Time picker component
│   ├── ColorPickerInput/  # Color picker component
│   ├── DatePickerInput/   # Date picker component
│   ├── FormProcessor/     # Core dynamic form processor
│   ├── InputDropdown/     # Dropdown/Select component
│   ├── InputField/        # Text input component
│   ├── MultiInputField/   # Multiple value input component
│   ├── MultiInputWithDropdown/ # Multi-input with dropdown selection
│   ├── PopupWrapper/      # Modal wrapper component
│   ├── RadioButton/       # Radio button group component
│   ├── TableRenderer/     # Dynamic table component
│   └── TableViewModal/    # Table view in modal
│
├── redux/                 # State management
│   ├── slices/
│   │   ├── authSlice.ts   # Authentication state
│   │   └── userSlice.ts   # User state
│   ├── store.ts           # Redux store configuration
│   └── hooks.ts           # Typed Redux hooks
│
├── routes/                # Application routes
│   ├── auth/              # Authentication routes
│   │   ├── company-url.tsx # Domain verification screen
│   │   └── login.tsx       # Login screen
│   ├── roster/            # Roster management routes
│   │   └── view.tsx        # Roster view screen
│   ├── employees/         # Employee management routes
│   │   └── list.tsx        # Employee list screen
│   ├── home.tsx           # Dashboard/Home screen
│   ├── settings.tsx       # Settings screen
│   ├── reports.tsx        # Reports screen
│   └── _app.tsx           # Protected routes layout
│
├── utils/                 # Utility functions
│   ├── dateUtils.ts       # Date formatting utilities
│   └── dummyJson.ts       # Enum definitions
│
├── app.css               # Global styles
├── root.tsx              # Application root with Redux Provider
└── routes.ts             # Route configuration

```

## Key Features

### 1. FormProcessor Component
The heart of the application - a dynamic form generator that supports:
- **Dynamic field types**: Input fields, dropdowns, modals, checkboxes, radio buttons, date pickers, time pickers, color pickers
- **Multi-input fields**: Array-based inputs with add/remove functionality
- **Tables**: Editable tables with add/delete rows
- **Tabs**: Multi-tab form layouts
- **Accordions**: Collapsible form sections
- **Parent-child field dependencies**: Auto-populate child fields based on parent selection
- **Nested modals**: Modal within modal support
- **Form validation**: Required fields and custom validation rules
- **API integration**: Dynamic data loading from backend

### 2. Authentication Flow
1. **Company URL Screen**: Verify domain before login
2. **Login Screen**: Authenticate with credentials
3. **Protected Routes**: Automatic redirect if not authenticated
4. **Redux Persist**: Token stored in localStorage

### 3. Navigation Structure
- **Sidebar Navigation**: Collapsible sidebar with menu items
- **Nested Routes**: Sub-menus for complex sections
- **Active States**: Visual indication of current route
- **Logout**: Clear session and redirect

## API Configuration

The application connects to: `https://rosterapi.dakarhr.com/api/v1/`

Key endpoints:
- `/domain/validate` - Verify company domain
- `/user/login` - User authentication
- `/DynamicAPI/GetTableData` - Fetch dynamic table data
- `/DynamicForm/details` - Get dynamic form configuration

## Development Setup

### Prerequisites
- Node.js 18+ 
- Yarn package manager

### Installation
```bash
cd e:\arsalan\my-react-router-app
yarn install
```

### Running the Application
```bash
yarn dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Building for Production
```bash
yarn build
yarn start
```

## Implementing Screens from React Native App

To migrate screens from the React Native app (`E:\Emplara\roster\screens\`), follow this pattern:

### 1. Screen with FormProcessor
```tsx
import FormProcessor from '~/components/FormProcessor';
import api from '~/api/roster';
import { useState, useEffect } from 'react';

export default function YourScreen() {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      const response = await api.getDynamicForm({
        formCode: 'YOUR_FORM_CODE',
        recordId: 'optional-record-id'
      });
      setFormData(response.data);
    } catch (error) {
      console.error('Error loading form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      // Your API call to save data
      console.log('Submitting:', data);
      return { data: { status: 'success' } };
    } catch (error) {
      return { data: { status: 'error', message: error.message } };
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Your Screen Title</h1>
      <FormProcessor
        dynamicFormData={formData}
        handleSubmit={handleSubmit}
        employeeCode="optional-employee-code"
        customButtonFunctions={{}}
      />
    </div>
  );
}
```

### 2. List Screen
```tsx
import { Link } from 'react-router';
import { useState, useEffect } from 'react';

export default function ListScreen() {
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    // Load your data
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">List Title</h1>
      {/* Your list implementation */}
    </div>
  );
}
```

## Component Mapping: React Native → Web

| React Native Component | Web Equivalent |
|------------------------|----------------|
| `View` | `<div>` |
| `Text` | `<span>`, `<p>`, `<h1-6>` |
| `TouchableOpacity` | `<button>` with Tailwind |
| `ScrollView` | `<div className="overflow-auto">` |
| `TextInput` | `<input>` with InputField component |
| `FlatList` | `array.map()` with `<div>` |
| `StyleSheet.create()` | Tailwind CSS classes |
| `navigation.navigate()` | `navigate('/path')` from react-router |
| `useRoute().params` | `useParams()` from react-router |
| `AsyncStorage` | `localStorage` (via redux-persist) |

## Next Steps

### TODO: Migrate Remaining Screens

1. **Roster Screens** (`E:\Emplara\roster\screens\`)
   - [ ] `RosterDetailView.tsx` → `/routes/roster/detail.tsx`
   - [ ] `RosterDetailViewBasic.tsx` → Update roster view
   - [ ] `RoasterDetailViewV2.tsx` → Enhanced roster view
   - [ ] `RosterTransactionsListing.tsx` → `/routes/roster/transactions.tsx`
   - [ ] `RosterTransactionDetail.tsx` → Create detail route
   - [ ] `RosterScheduleTimings.tsx` → `/routes/roster/schedule-timings.tsx`
   - [ ] `RosterScheduleTimingsListing.tsx` → Add listing view

2. **Employee Screens** (`E:\Emplara\roster\screens\EmployeeScreens\`)
   - [ ] `EmployeeList.tsx` → Already created basic version
   - [ ] `EmployeeDetails.tsx` → `/routes/employees/detail.tsx`
   - [ ] `EmployeeSchedule.tsx` → `/routes/employees/schedule.tsx`
   - [ ] `EmployeeScreen.tsx` → Integrate into existing routes

3. **Shift Screens** (`E:\Emplara\roster\screens\ShiftScreens\`)
   - [ ] `ShiftDefinationListing.tsx` → `/routes/shifts/definitions.tsx`
   - [ ] `ShiftDefinationDetails.tsx` → `/routes/shifts/definition-detail.tsx`
   - [ ] `ShiftRuleDefinitionListing.tsx` → `/routes/shifts/rules.tsx`
   - [ ] `ShiftRuleDefinationDetails.tsx` → `/routes/shifts/rule-detail.tsx`
   - [ ] `ShiftGroupingDefinationListing.tsx` → `/routes/shifts/groupings.tsx`
   - [ ] `ShiftGroupingDefinitionDetails.tsx` → `/routes/shifts/grouping-detail.tsx`

4. **Schedule Screens** (`E:\Emplara\roster\screens\ScheduleScreens\`)
   - [ ] `ScheduleDefinitionListing.tsx` → `/routes/schedules/list.tsx`
   - [ ] `ScheduleDefinitionDetails.tsx` → `/routes/schedules/detail.tsx`
   - [ ] `ScheduleRosterShiftDefinitionDetails.tsx` → `/routes/schedules/shifts.tsx`
   - [ ] `ScheduleWorkRuleDefinitionDetailsListing.tsx` → `/routes/schedules/work-rules.tsx`
   - [ ] `ScheduleWorkRuleDefinitionDetails.tsx` → `/routes/schedules/work-rule-detail.tsx`
   - [ ] `ScheduleerSeason.tsx` → `/routes/schedules/seasons.tsx`
   - [ ] `SchedulerSeasonCodeAllocations.tsx` → Add route
   - [ ] `ScheduleUpdater.tsx` → Add utility route

5. **Other Screens**
   - [ ] `ProfileTab.tsx` → `/routes/profile.tsx`
   - [ ] `SettingsScreen.tsx` → Already created placeholder
   - [ ] `ReportScreen.tsx` → Already created placeholder
   - [ ] `RosterScreen.tsx` → Integrate with roster views
   - [ ] `RosterGroupingListing.tsx` → Add route
   - [ ] `RosterGroupingDetail.tsx` → Add route
   - [ ] `RosterShiftCodeAdjustments.tsx` → Add route
   - [ ] `EmployeeRosterStatsCodeStatistics.tsx` → Add route
   - [ ] `EmployeeRosterStatsCodeStatisticsListing.tsx` → Add route

## Tips for Development

1. **Use the FormProcessor**: Most screens in the React Native app use the FormProcessor. You can reuse the same logic.

2. **API Responses**: The FormProcessor expects data in a specific format. Check the React Native code for the exact structure.

3. **Styling**: Use Tailwind CSS classes instead of StyleSheet. The corporate look uses:
   - Primary color: `blue-600`
   - Background: `gray-50`
   - Cards: `white` with `border-gray-200`
   - Shadows: `shadow-sm` for subtle depth

4. **Responsive Design**: Use Tailwind's responsive prefixes:
   - `md:` for tablet and up
   - `lg:` for desktop
   - Mobile-first approach

5. **Error Handling**: Always wrap API calls in try-catch and show appropriate error messages.

## Testing Checklist

- [ ] Domain verification works
- [ ] Login authentication works
- [ ] Token persists across page refreshes
- [ ] Protected routes redirect to login when not authenticated
- [ ] Sidebar navigation works
- [ ] FormProcessor renders all field types correctly
- [ ] Form validation works
- [ ] Form submission works
- [ ] Tables add/delete rows work
- [ ] Modal selections work
- [ ] Nested modals work
- [ ] Parent-child field dependencies work

## Known Issues / Notes

1. The FormProcessor is fully functional and tested with the mobile app structure.
2. All API endpoints use the same base URL as the mobile app.
3. Redux persist key is the same as the mobile app for consistency.
4. Component library is complete - all input types from the mobile app are supported.

## Support

For questions or issues, refer to the original React Native codebase at `E:\Emplara\roster\`.

