# Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd e:\arsalan\my-react-router-app
yarn install
```

### 2. Run Development Server
```bash
yarn dev
```

Open your browser to `http://localhost:5173` (or the port shown in terminal)

### 3. Test the Application

#### Login Flow
1. Go to the Company URL screen (should be the default)
2. Enter a domain (e.g., `testcompany.com`)
3. Click "Continue" - this will verify the domain via API
4. On the Login screen, enter credentials
5. Upon successful login, you'll be redirected to the Dashboard

#### Test Credentials
- **Domain**: Use any domain that's registered in your API
- **Username/Email**: Your API credentials
- **Password**: Your API password

## 📁 Project Structure Quick Reference

```
app/
├── api/              → API calls & configuration
├── components/       → Reusable UI components (all FormProcessor components)
├── redux/            → State management
├── routes/           → Page routes
│   ├── auth/        → Login & company URL
│   ├── roster/      → Roster screens
│   ├── employees/   → Employee screens
│   └── _app.tsx     → Main layout with sidebar
└── utils/           → Helper functions
```

## 🔧 Key Components

### FormProcessor
The main component for dynamic forms. Used in most screens:

```tsx
<FormProcessor
  dynamicFormData={formData}        // Form configuration from API
  handleSubmit={handleSubmit}       // Submit handler
  employeeCode="EMP001"             // Optional employee code
  customButtonFunctions={{}}        // Custom button handlers
/>
```

### InputField
```tsx
<InputField
  label="Name"
  placeholder="Enter name"
  value={value}
  onChangeText={(text) => setValue(text)}
  error={error}
  required
/>
```

### InputDropdown
```tsx
<InputDropdown
  label="Select Option"
  dropdownData={options}
  value={selected}
  onChange={(item) => setSelected(item)}
  dropdown={true}  // or ismodal={true} for modal
/>
```

## 🎨 Styling Guidelines

### Colors
- **Primary**: `bg-blue-600`, `text-blue-600`
- **Success**: `bg-green-500`
- **Error**: `bg-red-500`
- **Background**: `bg-gray-50`
- **Cards**: `bg-white`

### Common Patterns

#### Card Container
```tsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  {/* Content */}
</div>
```

#### Button
```tsx
<button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
  Button Text
</button>
```

#### Input Field
```tsx
<input className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
```

## 🔌 API Integration

### Making API Calls
```tsx
import api from '~/api/roster';

// Get dynamic form
const response = await api.getDynamicForm({
  formCode: 'FORM_CODE',
  recordId: 'optional-id'
});

// Get table data
const data = await api.getDynamicTableData({
  tableDataEnum: 1,
  apiParams: ''
});
```

### Authentication
```tsx
import { verifyLogin } from '~/api/auth';

const response = await verifyLogin({
  username: 'user',
  password: 'pass',
  domain: 'company.com'
});
```

## 🛣️ Navigation

### Using Links
```tsx
import { Link } from 'react-router';

<Link to="/employees/EMP001">View Employee</Link>
```

### Programmatic Navigation
```tsx
import { useNavigate } from 'react-router';

const navigate = useNavigate();
navigate('/roster/view');
```

### With Parameters
```tsx
navigate(`/employees/${employeeCode}`);
```

## 💾 State Management

### Using Redux
```tsx
import { useAppSelector, useAppDispatch } from '~/redux/hooks';
import { selectToken } from '~/redux/slices/userSlice';

// Get state
const token = useAppSelector(selectToken);

// Dispatch action
const dispatch = useAppDispatch();
dispatch(login({ token: 'xxx' }));
```

## 🐛 Debugging Tips

### Check API Calls
Open Browser DevTools → Network tab to see API requests/responses

### Check Redux State
Install Redux DevTools extension for Chrome/Firefox

### Common Issues

**Issue**: "Module not found"
**Solution**: Check import paths use `~/` prefix (not relative paths)

**Issue**: "Cannot read property of undefined"
**Solution**: Add optional chaining `data?.field` or null checks

**Issue**: Styling not working
**Solution**: Ensure Tailwind classes are correct, check `app.css` is imported

## 📝 Creating a New Screen

### 1. Create the route file
```tsx
// app/routes/yourmodule/screen.tsx
export default function YourScreen() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Your Screen</h1>
      {/* Content */}
    </div>
  );
}
```

### 2. Add to routes.ts
```tsx
route("yourmodule/screen", "routes/yourmodule/screen.tsx"),
```

### 3. Add to navigation (if needed)
Edit `app/routes/_app.tsx` to add sidebar link

## 🔒 Protected Routes

All routes under `_app.tsx` layout are automatically protected. Users without a token are redirected to `/auth/company-url`.

## 📦 Building for Production

```bash
yarn build
yarn start
```

## 🆘 Need Help?

1. Check `PROJECT_SUMMARY.md` for detailed documentation
2. Refer to the React Native codebase at `E:\Emplara\roster\`
3. Check the FormProcessor component for form-related issues
4. Look at existing screens for patterns and examples

## ✅ Verification Checklist

- [ ] `yarn install` completed successfully
- [ ] `yarn dev` starts without errors
- [ ] Can access the application in browser
- [ ] Can navigate to company URL screen
- [ ] Can attempt login (may fail if backend not available)
- [ ] Sidebar navigation works
- [ ] Can navigate between screens
- [ ] Redux DevTools shows state

---

**Happy Coding! 🎉**

