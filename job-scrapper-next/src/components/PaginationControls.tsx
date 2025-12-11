"use client";

import React from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

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
        className="px-4 py-2 border rounded-full text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span className="text-white">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border rounded-full text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default React.memo(PaginationControls);
