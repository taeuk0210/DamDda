import React from 'react';
import { Box, Button } from '@mui/material';
import styles from '../css/PaginationComponent.module.css'; // CSS 모듈 가져오기

export const PaginationComponent = ({
  currentPage,
  setCurrentPage,
}) => {
  const totalPages = 9;
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handleFirstPage = () => setCurrentPage(1);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleEndPage = () => setCurrentPage(totalPages);

  return (
    <Box className={styles.paginationContainer}>
      {/* 왼쪽 화살표 버튼 */}
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className={styles.arrowButton}
      >
        &lt;
      </button>

      {/* 페이지 번호 버튼 */}
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => setCurrentPage(pageNumber)}
          className={currentPage === pageNumber ? styles.pageNumberButtonActive : styles.pageNumberButton}
        >
          {pageNumber}
        </button>
      ))}

      {/* 오른쪽 화살표 버튼 */}
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={styles.arrowButton}
      >
        &gt;
      </button>
    </Box>
  );
};
