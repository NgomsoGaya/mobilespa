import React from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children, type = 'info' }) => {
  if (!isOpen) return null;

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${type}`} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close-icon" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <Button type="primary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
