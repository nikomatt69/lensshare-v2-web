import type { FC } from 'react';

interface ErrorMessageProps {
  title?: string;
  error?: Error;
  className?: string;
}

export const ErrorMessage: FC<ErrorMessageProps> = ({
  title,
  error,
  className = ''
}) => {
  if (!error) {
    return null;
  }

  return (
    <div
      className={`space-y-1 rounded-xl border-2 border-red-500/50 bg-red-50 p-4 dark:bg-red-900/10 ${className}`}
    >
      {title ? (
        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
          {title}
        </h3>
      ) : null}
      <div className="text-sm text-red-700 dark:text-red-200">
        {error?.message}
      </div>
    </div>
  );
};
