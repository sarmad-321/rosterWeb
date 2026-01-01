import React, { forwardRef, useImperativeHandle, useState } from "react";
import classNames from "classnames";

interface PopupWrapperProps {
  children: React.ReactNode;
}

export interface PopupWrapperRef {
  show: () => void;
  hide: () => void;
}

const PopupWrapper = forwardRef<PopupWrapperRef, PopupWrapperProps>(
  ({ children }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      show: () => setIsVisible(true),
      hide: () => setIsVisible(false),
    }));

    if (!isVisible) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={() => setIsVisible(false)}
        />

        {/* Modal Content */}
        <div className="relative z-10 w-full max-w-2xl max-h-[90vh] m-4 bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
          {children}
        </div>
      </div>
    );
  }
);

PopupWrapper.displayName = "PopupWrapper";

export default PopupWrapper;
