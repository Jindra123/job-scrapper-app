"use client";

import React, { useCallback } from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  if (totalPages <= 1) {
    return null; // Don't render controls if there's only one page
  }

  return (
    <div className="flex justify-center items-center space-x-4 my-8">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm font-medium text-primary bg-white border border-primary rounded-md hover:bg-primary hover:text-white transition-colors disabled:bg-secondary disabled:text-text-light disabled:cursor-not-allowed dark:bg-gray-800 dark:text-white dark:border-primary dark:hover:bg-primary dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
      >
        Previous
      </button>
      <span className="text-text-light dark:text-gray-300">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm font-medium text-primary bg-white border border-primary rounded-md hover:bg-primary hover:text-white transition-colors disabled:bg-secondary disabled:text-text-light disabled:cursor-not-allowed dark:bg-gray-800 dark:text-white dark:border-primary dark:hover:bg-primary dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
      >
        Next
      </button>
    </div>
  );
};

export default React.memo(PaginationControls);
