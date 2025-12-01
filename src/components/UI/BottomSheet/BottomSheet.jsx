import React, { useEffect, useRef } from 'react';
import './BottomSheet.css';

const BottomSheet = ({ isOpen, onClose, title, children, triggerRef }) => {
  const sheetRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      sheetRef.current?.focus();
      document.body.style.overflow = 'hidden'; // Lock body scroll
      document.documentElement.style.overflow = 'hidden'; // Lock html scroll
    } else {
      triggerRef.current?.focus();
      document.body.style.overflow = ''; // Unlock body scroll
      document.documentElement.style.overflow = ''; // Unlock html scroll
    }
  }, [isOpen, triggerRef]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div id="bottom-sheet-container" className={isOpen ? 'sheet-visible' : 'sheet-hidden'} aria-hidden={!isOpen}>
      <div className="sheet-backdrop" id="sheet-backdrop" onClick={onClose}></div>

      <div className="sheet-content" role="dialog" aria-modal="true" ref={sheetRef} tabIndex={-1}>
        <div className="sheet-handle-area" onClick={onClose}>
          <div className="sheet-handle-bar"></div>
        </div>

        <div className="sheet-body">
          <h2 className="sheet-title">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;