import React, { useEffect, useRef } from 'react';
import './ServiceModal.css';
import Button from './UI/Button'; // Import Button component

const WHATSAPP_NUMBER = '+27774478258'; // TODO: Move to a global config/environment variable

const ServiceModal = ({ isOpen, onClose, service }) => {
  const modalContentRef = useRef(null); // Ref for modal content

  useEffect(() => {
    if (!isOpen) return;

    // Focus management
    modalContentRef.current?.focus();

    // Escape key handling
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);


  if (!isOpen) return null;

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div
        className="service-modal-content"
        role="dialog" // ARIA role
        aria-modal="true" // ARIA modal
        tabIndex="-1" // Make content focusable
        ref={modalContentRef} // Attach ref
        onClick={(e) => e.stopPropagation()}
      >
        <button className="service-modal-close" onClick={onClose}>&times;</button>
        {service && (
          <div className="service-modal-body">
            <h3>{service.title}</h3>
            {service.modalContent && (
              <>
                <p>{service.modalContent.description}</p>
                {service.modalContent.listItems && (
                  <ul>
                    {service.modalContent.listItems.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
                {service.modalContent.images && service.modalContent.images.length > 0 && (
                  <div className="modal-image-gallery">
                    {service.modalContent.images.map((image, index) => (
                      <img key={index} src={image.src} alt={image.alt} className="modal-gallery-image" />
                    ))}
                  </div>
                )}
                {(service.modalContent.action || service.modalContent.cta) && (
                  <div className="modal-actions">
                    {service.modalContent.action && service.modalContent.action.type === 'link' && (
                      <a
                        href={service.modalContent.action.target}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modal-action-button"
                      >
                        {service.modalContent.action.text}
                      </a>
                    )}
                    {service.modalContent.action && service.modalContent.action.type === 'button' && (
                      <a // Change to <a> for WhatsApp link
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('I am interested in ' + service.title + ' services.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modal-action-button"
                      >
                        {service.modalContent.action.text}
                      </a>
                    )}
                    {service.modalContent.cta && service.modalContent.cta.type === 'button' && (
                      <a // Change to <a> for WhatsApp link
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('I am interested in ' + service.title + ' services.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modal-action-button"
                      >
                        {service.modalContent.cta.text}
                      </a>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceModal;