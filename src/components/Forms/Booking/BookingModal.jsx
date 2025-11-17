import React, { useState } from 'react';
import Button from '../../UI/Button';
import InputField from '../InputField';
import './BookingModal.css';

const BookingModal = ({ isOpen, onClose, bookingDetails }) => {
  const [step, setStep] = useState(1);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  const handleConfirmBooking = () => {
    // Here you would integrate with WhatsApp
    const { selectedDay, selectedTime, selectedServices } = bookingDetails;
    const servicesList = selectedServices.map(service => `- ${service.name} (${service.price})`).join('\\n');

    const message = `
      Hello, I'd like to book a service with the following details:
      *Selected Services:*\\n${servicesList}
      *Date:* ${selectedDay.toDateString()}
      *Time:* ${selectedTime}
      *Customer Name:* ${customerDetails.name}
      *Customer Email:* ${customerDetails.email}
      *Customer Phone:* ${customerDetails.phone}
      *Address:* ${customerDetails.address}
    `;
    const whatsappUrl = `https://wa.me/+27774478258?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Confirm Your Booking</h2>

        {step === 1 && (
          <div className="modal-step-1">
            <h3>Booking Summary</h3>
            <p><strong>Date:</strong> {bookingDetails.selectedDay?.toDateString()}</p>
            <p><strong>Time:</strong> {bookingDetails.selectedTime}</p>
            <p><strong>Services:</strong></p>
            <ul className="modal-services-list">
              {bookingDetails.selectedServices.map(service => (
                <li key={service.id}>{service.name} - {service.price}</li>
              ))}
            </ul>

            <h3>Your Details</h3>
            <InputField
              label="Name"
              type="text"
              name="name"
              value={customerDetails.name}
              onChange={handleInputChange}
              placeholder="Your Full Name"
            />
            <InputField
              label="Email"
              type="email"
              name="email"
              value={customerDetails.email}
              onChange={handleInputChange}
              placeholder="Your Email Address"
            />
            <InputField
              label="Phone"
              type="tel"
              name="phone"
              value={customerDetails.phone}
              onChange={handleInputChange}
              placeholder="Your Phone Number"
            />
            <Button type="primary" onClick={handleNextStep}>Continue</Button>
          </div>
        )}

        {step === 2 && (
          <div className="modal-step-2">
            <h3>Location Details</h3>
            <InputField
              label="Address"
              type="textarea"
              name="address"
              value={customerDetails.address}
              onChange={handleInputChange}
              placeholder="Enter your full address"
            />
            <p className="share-location-text">Or share your current location:</p>
            <Button type="secondary" onClick={() => alert('Location sharing not implemented yet!')}>Share Location</Button>
            <div className="modal-navigation">
              <Button type="secondary" onClick={handlePreviousStep}>Back</Button>
              <Button type="primary" onClick={handleConfirmBooking}>Confirm Booking</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
