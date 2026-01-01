import { Outlet, useNavigate, Link, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '~/redux/hooks';
import { selectToken } from '~/redux/slices/userSlice';
import { logout } from '~/redux/slices/authSlice';
import { clearUser } from '~/redux/slices/userSlice';
import classNames from 'classnames';

export default function AppLayout() {
  const token = useAppSelector(selectToken);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/auth/company-url');
    }
  }, [token, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUser());
    navigate('/auth/company-url');
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
      ),
    },
    {
      name: 'Roster',
      icon: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      ),
      children: [
        { name: 'Roster View', href: '/roster/view' },
        { name: 'Transactions', href: '/roster/transactions' },
      ],
    },
    {
      name: 'Employees',
      href: '/employees/list',
      icon: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      ),
    },
    {
      name: 'Shifts',
      icon: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      children: [
        { name: 'Definitions', href: '/shifts/definitions' },
        { name: 'Rules', href: '/shifts/rules' },
        { name: 'Groupings', href: '/shifts/groupings' },
      ],
    },
    {
      name: 'Schedules',
      icon: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
        </svg>
      ),
      children: [
        { name: 'Schedule List', href: '/schedules' },
        { name: 'Work Rules', href: '/schedules/work-rules' },
        { name: 'Seasons', href: '/schedules/seasons' },
        { name: 'Schedule Timings', href: '/roster/schedule-timings' },
      ],
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      ),
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      ),
    },
  ];

  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={classNames(
          'bg-white border-r border-gray-200 transition-all duration-300',
          {
            'w-64': sidebarOpen,
            'w-20': !sidebarOpen,
          }
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                R
              </div>
              {sidebarOpen && (
                <span className="text-xl font-bold text-gray-900">Roster</span>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className={classNames(
                          'w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors duration-200',
                          'hover:bg-gray-100 text-gray-700 font-medium'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          {sidebarOpen && <span>{item.name}</span>}
                        </div>
                        {sidebarOpen && (
                          <svg
                            className={classNames('w-4 h-4 transition-transform', {
                              'rotate-180': openMenus[item.name],
                            })}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M19 9l-7 7-7-7"></path>
                          </svg>
                        )}
                      </button>
                      {sidebarOpen && openMenus[item.name] && (
                        <ul className="mt-2 ml-4 space-y-1">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                to={child.href}
                                className={classNames(
                                  'block px-3 py-2 rounded-lg text-sm transition-colors duration-200',
                                  {
                                    'bg-blue-50 text-blue-700 font-semibold': isActive(child.href),
                                    'text-gray-600 hover:bg-gray-100': !isActive(child.href),
                                  }
                                )}
                              >
                                {child.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href!}
                      className={classNames(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 font-medium',
                        {
                          'bg-blue-50 text-blue-700': isActive(item.href!),
                          'text-gray-700 hover:bg-gray-100': !isActive(item.href!),
                        }
                      )}
                    >
                      {item.icon}
                      {sidebarOpen && <span>{item.name}</span>}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className={classNames(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200',
                'text-red-600 hover:bg-red-50 font-medium'
              )}
            >
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

