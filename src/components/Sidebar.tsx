import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { hasPermission } from '../utils/permissions';
import {
  Home,
  Building2,
  FileText,
  Calendar,
  //DollarSign,
  TrendingUp,
  FolderOpen,
  Gift,
  User,
  Settings,
  BarChart3,
  Shield,
  Calculator,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  screen: string;
  children?: NavigationSubItem[];
}

interface NavigationSubItem {
  name: string;
  href: string;
  screen: string;
}

const allowedScreens = [
  'dashboard',
  'governance',
  'documents',
  'financial',
  'meetings',
  'profile',
  'settings'
];

const allowedSubScreens: { [key: string]: string[] } = {
  governance: ['Role Management', 'Document Workflows'],
  financial: ['Bookkeeping', 'Expenses']
};

const allNavigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, screen: 'dashboard' },
  { 
    name: 'Governance', 
    href: '/governance', 
    icon: Shield, 
    screen: 'governance',
    children: [
      { name: 'Role Management', href: '/governance?tab=roles', screen: 'governance' },
      { name: 'Document Workflows', href: '/governance?tab=workflows', screen: 'governance' },
      { name: 'Compliance Tracking', href: '/governance?tab=compliance', screen: 'governance' },
      { name: 'Meeting Governance', href: '/governance?tab=meetings', screen: 'governance' }
    ]
  },
  { name: 'Documents', href: '/documents', icon: FileText, screen: 'documents' },
  { 
    name: 'Financial', 
    href: '/financial', 
    icon: Calculator, 
    screen: 'financial',
    children: [
      { name: 'Bookkeeping', href: '/financial?tab=bookkeeping', screen: 'financial' },
      { name: 'Invoicing', href: '/financial?tab=invoicing', screen: 'financial' },
      { name: 'Supplier Invoices', href: '/financial?tab=supplier-invoices', screen: 'financial' },
      { name: 'Payroll', href: '/financial?tab=payroll', screen: 'financial' },
      { name: 'Bank Integration', href: '/financial?tab=bank-integration', screen: 'financial' },
      { name: 'BankID Auth', href: '/financial?tab=bankid', screen: 'financial' },
      { name: 'Expenses', href: '/expenses', screen: 'expenses' },
    ]
  },
  { name: 'Meetings', href: '/meetings', icon: Calendar, screen: 'meetings' },
  { name: 'Investments', href: '/investments', icon: TrendingUp, screen: 'investments' },
  { name: 'Projects', href: '/projects', icon: FolderOpen, screen: 'projects' },
  { name: 'Grants', href: '/grants', icon: Gift, screen: 'grants' },
  { name: 'Reports', href: '/reports', icon: BarChart3, screen: 'reports' },
  { name: 'Profile', href: '/profile', icon: User, screen: 'profile' },
  { name: 'Settings', href: '/settings', icon: Settings, screen: 'settings' },
];

export const Sidebar: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();
  
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const userRole = userData.role || 'member';

  const toggleExpanded = (e: React.MouseEvent, itemName: string) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isExpanded = (itemName: string) => expandedItems.includes(itemName);

  const isMainScreenAccessible = (screen: string) => {
    return allowedScreens.includes(screen) && hasPermission(userRole, screen);
  };

  const isSubScreenAccessible = (parentName: string, childName: string) => {
    return allowedSubScreens[parentName.toLowerCase()]?.includes(childName) && 
           hasPermission(userRole, parentName.toLowerCase());
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Building2 className="w-8 h-8 text-primary-600" />
          <span className="text-lg xl:text-xl font-bold text-gray-900">FoundationMS</span>
        </div>
        {userRole && (
          <div className="mt-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              userRole === 'admin' ? 'bg-red-100 text-red-800' :
              userRole === 'foundation_owner' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {userRole.replace('_', ' ')}
            </span>
          </div>
        )}
      </div>
      
      <nav className="px-3 pb-6 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {allNavigation.map((item) => (
            <li key={item.name}>
              {item.children ? (
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <NavLink
                      to={isMainScreenAccessible(item.screen) ? item.href : '#'}
                      className={({ isActive }) =>
                        `flex items-center flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                          isActive && !location.search && isMainScreenAccessible(item.screen)
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </NavLink>
                    <button
                      onClick={(e) => toggleExpanded(e, item.name)}
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      {isExpanded(item.name) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {isExpanded(item.name) && (
                    <ul className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <NavLink
                            to={isSubScreenAccessible(item.name, child.name) ? child.href : '#'}
                            className={({ isActive }) => {
                              const urlParams = new URLSearchParams(location.search);
                              const currentTab = urlParams.get('tab');
                              const childTab = new URLSearchParams(child.href.split('?')[1] || '').get('tab');
                              const isChildActive = isActive && currentTab === childTab && isSubScreenAccessible(item.name, child.name);
                              
                              return `flex items-center px-3 py-1 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                isChildActive
                                  ? 'bg-primary-100 text-primary-700'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                              }`;
                            }}
                          >
                            <span className="truncate">{child.name}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <NavLink
                  to={isMainScreenAccessible(item.screen) ? item.href : '#'}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive && isMainScreenAccessible(item.screen)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};