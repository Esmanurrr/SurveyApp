import styled from "styled-components";

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 1.5rem 0;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  padding: 0.4rem 0.8rem;
  border: 1px solid ${(props) => (props.active ? "#4a9dec" : "#d1d5db")};
  background-color: ${(props) => (props.active ? "#4a9dec" : "white")};
  color: ${(props) => (props.active ? "white" : "#374151")};
  border-radius: 0.25rem;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  font-size: 0.875rem;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) =>
      props.active || props.disabled ? "" : "#f3f4f6"};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(74, 157, 236, 0.3);
  }
`;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageButtons = () => {
    const buttons = [];
    const maxPageButtons = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

    if (endPage - startPage < maxPageButtons - 1) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    if (startPage > 1) {
      buttons.push(
        <PageButton key={1} onClick={() => onPageChange(1)}>
          1
        </PageButton>
      );
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <PageButton
          key={i}
          active={i === currentPage}
          onClick={() => i !== currentPage && onPageChange(i)}
        >
          {i}
        </PageButton>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="ellipsis2">...</span>);
      }
      buttons.push(
        <PageButton key={totalPages} onClick={() => onPageChange(totalPages)}>
          {totalPages}
        </PageButton>
      );
    }

    return buttons;
  };

  return (
    <PaginationContainer>
      <PageButton onClick={handlePrevious} disabled={currentPage === 1}>
        &larr;
      </PageButton>
      {renderPageButtons()}
      <PageButton onClick={handleNext} disabled={currentPage === totalPages}>
        &rarr;
      </PageButton>
    </PaginationContainer>
  );
};

export default Pagination;
