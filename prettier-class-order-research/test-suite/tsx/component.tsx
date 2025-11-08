import React, { FC } from 'react';

interface CardProps {
  title: string;
  description: string;
  variant?: 'primary' | 'secondary';
}

// Test 1: TypeScript component with variants
export const Card: FC<CardProps> = ({ title, description, variant = 'primary' }) => {
  const baseClasses = "rounded-lg shadow-md p-6";
  const variantClasses = variant === 'primary'
    ? "bg-blue-500 text-white"
    : "bg-gray-100 text-gray-900";

  return (
    <div className={`${baseClasses} ${variantClasses} hover:shadow-lg transition-shadow`}>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};

// Test 2: Generic component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

export function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul className="space-y-2 p-4 bg-white rounded border border-gray-200">
      {items.map((item, index) => (
        <li key={index} className="p-2 hover:bg-gray-50 rounded">
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

// Test 3: Complex responsive layout with TypeScript
interface LayoutProps {
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

export const Layout: FC<LayoutProps> = ({ sidebar, children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {sidebar && (
        <aside className="w-full md:w-64 bg-gray-800 text-white p-4">
          {sidebar}
        </aside>
      )}
      <main className="flex-1 p-6 bg-gray-50">
        {children}
      </main>
    </div>
  );
};

// Test 4: Button variants
type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}) => {
  const baseClasses = "font-semibold rounded transition-colors";

  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

// Test 5: Table component
interface Column<T> {
  key: keyof T;
  header: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export function Table<T extends Record<string, any>>({ data, columns }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
