import { useState, useEffect } from 'react';

export function ErrorDisplay({
  error,
  onClose,
}: {
  error: string | null;
  onClose: () => void;
}) {
  const [isVisible, setIsVisible] = useState(!!error);

  useEffect(() => {
    setIsVisible(!!error);
  }, [error]);

  if (!error || !isVisible) return null;

  return (
    <div className="relative p-4 mb-4 text-red-700 bg-white border border-red-300 rounded-lg shadow-sm">
      <div className="flex items-start">
        <span className="mr-2">⚠️</span>
        <div className="flex-1">
          <span className="font-medium"></span> {error}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
          aria-label="Close error message"
        >
          <span className="text-lg">&times;</span>
        </button>
      </div>
    </div>
  );
}
