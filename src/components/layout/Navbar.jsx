// Aik kaam kro.Search chala do.Search me wo sary links daal do jitni navigations possible ha.Or layout acha sa rekhna

"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { FaBell, FaUser, FaUsers, FaSearch, FaLanguage, FaMoon, FaSun, FaBook, FaUniversity, FaHome, FaUserAlt, FaList, FaUserPlus, FaSignOutAlt, FaUserCircle, FaBox, FaShoppingCart, FaChartLine, FaCog, FaTags, FaStore, FaFileInvoice } from "react-icons/fa"
import { RiArrowDropDownLine } from "react-icons/ri";

import { MdOutlinePending } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import { logout as logoutAction } from "@/redux/slices/User"
import { useRouter } from "next/navigation"
import Image from "next/image";
import BRAND from "@/utils/brandConstants";
// import ThemeToggleButton from "../ToggleThemeButton";

const navigations = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: <FaHome className="text-gray-600 dark:text-gray-300" />
  },
  {
    name: "Products",
    href: "/admin/products/list",
    icon: <FaBox className="text-gray-600 dark:text-gray-300" />,
    subItems: [
      {
        name: "All Products",
        href: "/admin/products/list",
        icon: <FaList className="text-gray-600 dark:text-gray-300" />
      },
      {
        name: "Add Product",
        href: "/admin/products/add",
        icon: <FaUserPlus className="text-gray-600 dark:text-gray-300" />
      },
      {
        name: "Categories",
        href: "/admin/products/categories",
        icon: <FaTags className="text-gray-600 dark:text-gray-300" />
      },
      {
        name: "Inventory",
        href: "/admin/products/inventory",
        icon: <FaStore className="text-gray-600 dark:text-gray-300" />
      }
    ]
  },
  {
    name: "Orders",
    href: "/admin/orders/list",
    icon: <FaShoppingCart className="text-gray-600 dark:text-gray-300" />,
    subItems: [
      {
        name: "All Orders",
        href: "/admin/orders/list",
        icon: <FaList className="text-gray-600 dark:text-gray-300" />
      },
      {
        name: "Pending Orders",
        href: "/admin/orders/pending",
        icon: <MdOutlinePending className="text-gray-600 dark:text-gray-300" />
      },
      {
        name: "Shipped Orders",
        href: "/admin/orders/shipped",
        icon: <FaFileInvoice className="text-gray-600 dark:text-gray-300" />
      },
      {
        name: "Returns",
        href: "/admin/orders/returns",
        icon: <FaList className="text-gray-600 dark:text-gray-300" />
      }
    ]
  },
  {
    name: "Customers",
    href: "/admin/customers/list",
    icon: <FaUsers className="text-gray-600 dark:text-gray-300" />,
    subItems: [
      {
        name: "All Customers",
        href: "/admin/customers/list",
        icon: <FaList className="text-gray-600 dark:text-gray-300" />
      },
      {
        name: "Customer Analytics",
        href: "/admin/customers/analytics",
        icon: <FaChartLine className="text-gray-600 dark:text-gray-300" />
      },
      {
        name: "Customer Segments",
        href: "/admin/customers/segments",
        icon: <FaUserAlt className="text-gray-600 dark:text-gray-300" />
      }
    ]
  },
  {
    name: "Analytics",
    href: "/admin/analytics/sales",
    icon: <FaChartLine className="text-gray-600 dark:text-gray-300" />,
    subItems: [
      {
        name: "Sales Analytics",
        href: "/admin/analytics/sales",
        icon: <FaChartLine className="text-gray-600 dark:text-gray-300" />
      },
      {
        name: "Product Analytics",
        href: "/admin/analytics/products",
        icon: <FaBox className="text-gray-600 dark:text-gray-300" />
      },
      {
        name: "Customer Analytics",
        href: "/admin/analytics/customers",
        icon: <FaUser className="text-gray-600 dark:text-gray-300" />
      },
      {
        name: "Reports",
        href: "/admin/analytics/reports",
        icon: <FaFileInvoice className="text-gray-600 dark:text-gray-300" />
      }
    ]
  },
  {
    name: "Marketing",
    href: "/admin/marketing/coupons",
    icon: <FaTags className="text-gray-600 dark:text-gray-300" />,
    subItems: [
      {
        name: "Coupons",
        href: "/admin/marketing/coupons",
        icon: <FaTags className="text-gray-600 dark:text-gray-300" />
      },
      {
        name: "Promotions",
        href: "/admin/marketing/promotions",
        icon: <FaList className="text-gray-600 dark:text-gray-300" />
      },
      {
        name: "Email Campaigns",
        href: "/admin/marketing/email",
        icon: <FaUserAlt className="text-gray-600 dark:text-gray-300" />
      }
    ]
  },
  {
    name: "Settings",
    href: "/admin/settings/general",
    icon: <FaCog className="text-gray-600 dark:text-gray-300" />
  }
];


const notifications = [
  {
    id: 1,
    title: "New Order",
    description: "Order #ORD-001 has been placed by Ahmed Khan",
    icon: <FaShoppingCart className="text-gray-600 dark:text-gray-300" />,
    isRead: false
  },
  {
    id: 2,
    title: "Low Stock Alert",
    description: "Wireless Headphones stock is running low (5 items left)",
    icon: <FaBox className="text-gray-600 dark:text-gray-300" />,
    isRead: false
  },
  {
    id: 3,
    title: "Order Shipped",
    description: "Order #ORD-002 has been shipped successfully",
    icon: <FaFileInvoice className="text-gray-600 dark:text-gray-300" />,
    isRead: true
  },
  {
    id: 4,
    title: "New Customer",
    description: "Sara Ali has registered as a new customer",
    icon: <FaUsers className="text-gray-600 dark:text-gray-300" />,
    isRead: true
  },
  {
    id: 5,
    title: "Payment Received",
    description: "Payment of $299.00 received for Order #ORD-003",
    icon: <FaChartLine className="text-gray-600 dark:text-gray-300" />,
    isRead: true
  },
]

export default function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    notification.isRead = true;
    // Here you can add API call to mark notification as read
  };

  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  const router = useRouter();

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setSelectedIndex(-1);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    // Search through main items and subitems
    const results = [];
    navigations.forEach(item => {
      if (item.name.toLowerCase().includes(query.toLowerCase())) {
        results.push(item);
      }
      if (item.subItems) {
        item.subItems.forEach(subItem => {
          if (subItem.name.toLowerCase().includes(query.toLowerCase())) {
            results.push({ ...subItem, isSubItem: true });
          }
        });
      }
    });
    setSearchResults(results);
  }, []);

  const handleKeyDown = (e) => {
    if (searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          router.push(searchResults[selectedIndex].href);
          setSearchQuery('');
          setSearchResults([]);
          setSelectedIndex(-1);
        }
        break;
      case 'Escape':
        setSearchResults([]);
        setSelectedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    if (selectedIndex >= 0) {
      const selectedElement = document.getElementById(`search-result-${selectedIndex}`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  const toggleSidebar = useCallback(() => {
    document.querySelector(".sidebar")?.classList.toggle("max-md:-left-full")
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-primary text-primaryForeground p-4 sticky top-0 z-50 shadow-md"
    >
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="mr-4 md:hidden"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </motion.button>
          <Link href="/" className="h-8">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`inline-block text-2xl pl-2 font-semibold`}
            >
              {BRAND.name}
              {/* <Image
                width={150}
                height={150}
                src="/assets/images/logo4.png"
                alt="Logo"
                className="w-fit h-8 object-contain"
              /> */}
            </motion.span>
          </Link>
        </motion.div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <motion.div
            className="relative w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <FaSearch className="absolute left-4 top-3 text-mutedForeground opacity-50" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ringColor transition-all duration-300 bg-inputBackground text-inputForeground"
              onFocus={() => handleSearch(searchQuery)}
              // onFocus={() => !searchQuery && setSearchResults(navigations)}
              onBlur={() => {
                // Small delay to allow click events to fire
                setTimeout(() => {
                  setSearchResults([]);
                  setSelectedIndex(-1);
                }, 200);
              }}
            />
          </motion.div>

          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 w-full bg-popoverBackground shadow-lg rounded-md mt-2 z-50 max-h-[250px] overflow-y-auto"
              >
                {searchResults.map((result, index) => (
                  <motion.div
                    key={result.name}
                    id={`search-result-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={result.href}>
                      <div
                        className={`p-3 cursor-pointer transition-colors duration-150 flex items-center gap-3
                      ${selectedIndex === index ? 'bg-mutedBackground bg-opacity-20' : ''}
                      hover:bg-mutedBackground hover:bg-opacity-10`}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        <span className="text-lg">{result.icon}</span>
                        <span className="text-popoverForeground">{result.name}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center space-x-4"
        >
          {/* <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 bg-mutedForeground rounded-md hover:bg-opacity-80 transition-colors"
          >
            {isDarkMode ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
          </motion.button> */}

          {/* <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-mutedForeground rounded-md hover:bg-opacity-80 transition-colors"
          >
            <FaLanguage className="text-lg" />
          </motion.button> */}

          {/* <ThemeToggleButton /> */}


          <div className="relative max-md:hidden -mr-2.5" ref={notificationRef}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 bg-transparent rounded-md hover:bg-opacity-80 transition-colors relative"
            >
              <FaBell className="text-lg text-primaryForeground" />
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-1 right-1 bg-red-500 text-white text-[8px] rounded-full w-3 h-3 flex items-center justify-center"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 w-72 bg-popoverBackground shadow-lg rounded-md mt-2 z-50 max-h-[350px] overflow-y-auto"
                >
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleNotificationClick(notification)}
                        className={`flex items-center gap-3 p-3 cursor-pointer transition-colors duration-150 hover:bg-mutedBackground hover:bg-opacity-10
                    ${!notification.isRead ? 'bg-mutedBackground bg-opacity-5' : ''}`}
                      >
                        <span className="flex-shrink-0">
                          {notification.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-popoverForeground">{notification.title}</h4>
                          <p className="text-xs text-popoverForeground opacity-70 truncate">
                            {notification.description}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-popoverForeground opacity-70">
                      No notifications
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="p-1 rounded-lg hover:bg-opacity-80 transition-all duration-200 flex items-center outline-none"
            >
              <div className="bg-blue-100 p-1 rounded-full">
                <FaUser size={10} className="text-lg text-primaryHover" />
              </div>
              <span className="hidden md:inline text-sm ml-1.5">{user?.username}</span>
              <RiArrowDropDownLine />
            </motion.button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-60 bg-popoverBackground rounded-lg overflow-hidden shadow-lg"
                >
                  <div className="p-4 border-b border-purple-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <FaUser className="text-xl text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-popoverForeground">{user?.username}</h4>
                        <p className="text-sm text-popoverForeground opacity-60">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <motion.ul className="py-2">
                    <Link href="/profile">
                      <motion.li
                        whileHover={{ backgroundColor: "var(--primary-light)" }}
                        className="px-4 py-2.5 cursor-pointer flex items-center gap-3 text-popoverForeground"
                      >
                        <FaUserCircle className="text-lg opacity-70" />
                        <span>Profile Settings</span>
                      </motion.li>
                    </Link>

                    <button
                      disabled={isLoading}
                      onClick={async () => {
                        try {
                          setIsLoading(true);
                          dispatch(logoutAction());
                          router.push("/auth/login");
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      className="w-full text-left"
                    >
                      <motion.li
                        whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                        className="px-4 py-2.5 cursor-pointer flex items-center gap-3 text-red-500 disabled:opacity-50"
                      >
                        <FaSignOutAlt className="text-lg" />
                        <span className="flex items-center gap-2">
                          Logout
                          {isLoading && (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full"
                            />
                          )}
                        </span>
                      </motion.li>
                    </button>
                  </motion.ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
