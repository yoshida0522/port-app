import React, { useState } from "react";
import styles from "../Pagination/page.module.css";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const [page, setPage] = useState(currentPage);

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
      onPageChange(page + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
      onPageChange(page - 1);
    }
  };

  const handlePageClick = (pageNum: number) => {
    setPage(pageNum);
    onPageChange(pageNum);
  };

  return (
    <div className={styles.pagination}>
      <button onClick={handlePrev} disabled={page === 1}>
        前へ
      </button>
      {[...Array(totalPages)].map((_, index) => {
        const pageNum = index + 1;
        return (
          <button
            key={pageNum}
            onClick={() => handlePageClick(pageNum)}
            className={page === pageNum ? styles.active : ""}
          >
            {pageNum}
          </button>
        );
      })}
      <button onClick={handleNext} disabled={page === totalPages}>
        次へ
      </button>
    </div>
  );
};

export default Pagination;
