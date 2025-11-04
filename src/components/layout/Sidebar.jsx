"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TbLayoutDashboard } from "react-icons/tb";
import {
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaUserEdit,
  FaCog,
  FaEnvelope
} from "react-icons/fa";
import { usePathname } from "next/navigation";

// Accordion navigation configuration in a single array for easier management
const accordionMenus = [
  {
    title: "Products",
    id: "products",
    icon: <FaBox />,
    items: [
      { href: "/admin/products/list", label: "All Products" },
      // { href: "/admin/products/add", label: "Add Product" },
      { href: "/admin/products/categories", label: "Categories" }
    ]
  },
  {
    title: "Orders",
    id: "orders",
    icon: <FaShoppingCart />,
    items: [
      { href: "/admin/orders/list", label: "All Orders" }
    ]
  },
  {
    title: "Customers",
    id: "customers",
    icon: <FaUsers />,
    items: [
      { href: "/admin/customers/list", label: "All Customers" }
    ]
  }
];

// Sidebar component
export default function Sidebar() {
  const pathname = usePathname();
  const [activeAccordion, setActiveAccordion] = useState(null);

  // Better toggle handler with useCallback
  const handleAccordionToggle = useCallback(
    id => setActiveAccordion(prev => (prev === id ? null : id)),
    []
  );

  // Expand the active accordion if the pathname matches one of its items
  useEffect(() => {
    for (const menu of accordionMenus) {
      if (menu.items.some(item => item.href === pathname)) {
        setActiveAccordion(menu.id);
        break;
      }
    }
  }, [pathname]);

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="sidebar rounded-lg fixed left-0 top-0 md:left-2.5 max-md:-left-full md:top-20 bottom-0 md:bottom-2.5 w-64 bg-cardBackground pt-20 md:pt-2.5 z-40 shadow max-md:transition-all max-md:duration-300 flex flex-col gap-1"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-4"
      >
        <motion.h2
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-xs font-semibold mb-2 uppercase text-gray-500"
        >
          Menu
        </motion.h2>
        <nav>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/admin"
              className={`py-2 px-2 rounded transition-colors duration-200 flex items-center gap-x-1 ${pathname === "/admin" ? "text-primary bg-blue-50" : ""
                }`}
            >
              <TbLayoutDashboard />
              Dashboard
            </Link>
          </motion.div>
        </nav>
      </motion.div>

      {accordionMenus.map(menu => (
        <AccordionMenu
          key={menu.id}
          {...menu}
          active={activeAccordion === menu.id}
          onToggle={() => handleAccordionToggle(menu.id)}
        />
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="px-4 space-y-1"
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/admin/newsletter"
            className={`py-2 px-2 rounded transition-colors duration-200 flex items-center gap-x-1 ${pathname === "/admin/newsletter" ? "bg-blue-50 text-primary" : ""
              }`}
          >
            <FaEnvelope />
            Newsletter
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/admin/settings"
            className={`py-2 px-2 rounded transition-colors duration-200 flex items-center gap-x-1 ${pathname === "/admin/settings" ? "bg-blue-50 text-primary" : ""
              }`}
          >
            <FaCog />
            Settings
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/admin/profile"
            className={`py-2 px-2 rounded transition-colors duration-200 flex items-center gap-x-1 ${pathname === "/admin/profile" ? "bg-blue-50 text-primary" : ""
              }`}
          >
            <FaUserEdit />
            Profile Settings
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Accordion menu for sidebar
function AccordionMenu({ title, id, active, onToggle, items, icon }) {
  const pathname = usePathname();

  // Memo: active state or current link matches for highlighting menu
  const isCurrentPathInItems = useMemo(
    () => items.some(item => item.href === pathname),
    [items, pathname]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className={`px-4 ${isCurrentPathInItems ? "bg-blue-50" : ""}`}
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onToggle}
        className={`flex justify-between items-center w-full py-2 px-2 ${isCurrentPathInItems ? "bg-blue-50" : ""} rounded transition-colors duration-200 ${active ? "bg-blue-50" : ""}`}
        aria-expanded={active}
        aria-controls={`accordion-items-${id}`}
      >
        <div className="flex gap-x-1 items-center">
          {icon}
          <span>{title}</span>
        </div>
        <motion.span
          animate={{ rotate: active ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {active && (
          <motion.div
            id={`accordion-items-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="ml-3 mb-2">
              {items.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={item.href}
                    className={`block py-2 px-4 rounded transition-colors duration-200 ${item.href === pathname ? "text-primary" : ""
                      }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
