"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  itemsPerPage = 10,
  totalItems = 0,
  showJumpTo = true,
}) => {
  const [jumpPage, setJumpPage] = useState("");

  if (totalPages <= 1) return null;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      onPageChange(newPage);
    }
  };

  const handleJumpToPage = (e) => {
    e.preventDefault();
    const page = parseInt(jumpPage);
    if (page >= 1 && page <= totalPages) {
      handlePageChange(page);
      setJumpPage("");
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Show max 5 page numbers

    if (totalPages <= maxVisible) {
      // Show all pages if total pages is less than maxVisible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the start
      if (currentPage <= 3) {
        endPage = 4;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push("...");
      }

      // Add pages in range
      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2">
      {/* Items info */}
      <div className="text-sm text-mutedForeground">
        Showing {startItem} to {endItem} of {totalItems} items
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {/* Previous button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-primary text-primaryForeground hover:bg-primary/90"
            }`}
        >
          <FaChevronLeft className="w-4 h-4" />
        </motion.button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1 text-mutedForeground"
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;

            return (
              <motion.button
                key={page}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                    ? "bg-primary text-primaryForeground"
                    : "bg-card text-cardForeground hover:bg-cardHover"
                  }`}
              >
                {page}
              </motion.button>
            );
          })}
        </div>

        {/* Next button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-primary text-primaryForeground hover:bg-primary/90"
            }`}
        >
          <FaChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Jump to page */}
      {showJumpTo && (
        <form onSubmit={handleJumpToPage} className="flex items-center gap-2">
          <span className="text-sm text-mutedForeground">Jump to:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            placeholder="Page"
            className="w-20 px-2 py-1 rounded-md border border-borderColor bg-inputBackground text-inputForeground text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ringColor focus-visible:ring-offset-2"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!jumpPage || parseInt(jumpPage) < 1 || parseInt(jumpPage) > totalPages}
            className="px-3 py-1 rounded-md bg-primary text-primaryForeground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Go
          </motion.button>
        </form>
      )}
    </div>
  );
};

export default Pagination;

