import React, { useState } from 'react';
import classNames from 'classnames';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultOpen = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={classNames('border border-gray-200 rounded-lg mb-4 overflow-hidden', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={classNames(
          'w-full px-5 py-4 flex items-center justify-between',
          'bg-gray-50 hover:bg-gray-100 transition-colors duration-200',
          'text-left font-semibold text-gray-800'
        )}
      >
        <span className="text-base">{title}</span>
        <svg
          className={classNames(
            'w-5 h-5 text-gray-600 transition-transform duration-300',
            { 'rotate-180': isOpen }
          )}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      <div
        className={classNames(
          'transition-all duration-300 ease-in-out',
          {
            'max-h-0 opacity-0': !isOpen,
            'max-h-[5000px] opacity-100': isOpen,
          }
        )}
      >
        <div className="p-5 bg-white border-t border-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;

