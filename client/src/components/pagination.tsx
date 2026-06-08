// components/Pagination.tsx

import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: React.Dispatch<React.SetStateAction<number>>;
}

export default function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: PaginationProps) {
  if (total <= limit) return null;

  return (
    <div className="flex gap-2 mt-4 items-center w-full justify-center">
      <button
        disabled={page === 1}
        onClick={() => onPageChange((p) => p - 1)}
        className="border border-gray-400 text-white py-3 px-2 rounded-md flex gap-1 items-center disabled:opacity-50"
      >
        <MdNavigateBefore className="w-6 h-6 text-gray-400" />
      </button>

      <span>
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange((p) => p + 1)}
        className="border border-gray-400 text-white py-3 px-2 rounded-md flex gap-1 items-center disabled:opacity-50"
      >
        <MdNavigateNext className="w-6 h-6 text-gray-400" />
      </button>
    </div>
  );
}