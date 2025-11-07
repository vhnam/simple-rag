export const getVisiblePages = (
  currentPageIndex: number,
  totalPages: number,
  maxVisible: number = 5
): Array<number | 'ellipsis'> => {
  if (totalPages <= 0 || currentPageIndex < 0 || currentPageIndex >= totalPages)
    return [];

  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, index) => index);
  }

  const firstPage = 0;
  const lastPage = totalPages - 1;
  const leftBoundary = maxVisible - 2;
  const rightBoundary = totalPages - (maxVisible - 2);

  if (currentPageIndex < leftBoundary) {
    return [
      ...Array.from({ length: leftBoundary }, (_, index) => index),
      'ellipsis',
      lastPage,
    ];
  }

  if (currentPageIndex >= rightBoundary) {
    const start = Math.max(firstPage + 1, totalPages - (maxVisible - 2));
    return [
      firstPage,
      'ellipsis',
      ...Array.from(
        { length: totalPages - start },
        (_, index) => start + index
      ),
    ];
  }

  const sidePages = Math.floor((maxVisible - 3) / 2);
  const startMiddle = Math.max(firstPage + 1, currentPageIndex - sidePages);
  const endMiddle = Math.min(lastPage - 1, currentPageIndex + sidePages);

  return [
    firstPage,
    'ellipsis',
    ...Array.from(
      { length: endMiddle - startMiddle + 1 },
      (_, index) => startMiddle + index
    ),
    'ellipsis',
    lastPage,
  ];
};
