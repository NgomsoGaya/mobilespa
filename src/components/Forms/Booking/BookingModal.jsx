import React, { useState } from 'react';
import Button from '../../UI/Button';
import InputField from '../InputField';
import './BookingModal.css';

const WHATSAPP_NUMBER = '+27774478258'; // TODO: Move to a global config/environment variable

const BookingModal = ({ isOpen, onClose, bookingDetails, onRemoveService, onResetBooking, selectedServices }) => { // NEW PROP
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

  const validateStep1 = () => {
    const { name, email, phone } = customerDetails;
    if (!name.trim() || !email.trim() || !phone.trim()) {
      alert('Please fill in all required customer details (Name, Email, Phone).');
      return false;
    }
    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const { address } = customerDetails;
    if (!address.trim()) {
      alert('Please provide your address or share your location.');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  const handleShareLocation = () => { // NEW FUNCTION
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const googleMapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
          setCustomerDetails((prevDetails) => ({ ...prevDetails, address: googleMapsUrl }));
          alert('Location shared successfully!');
        },
        (error) => {
          console.error('Error getting location:', error);
          setCustomerDetails((prevDetails) => ({ ...prevDetails, address: 'Unable to retrieve location. Please enter manually.' }));
          alert('Unable to retrieve your location. Please enter your address manually.');
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setCustomerDetails((prevDetails) => ({ ...prevDetails, address: 'Geolocation not supported by this browser. Please enter manually.' }));
      alert('Geolocation is not supported by your browser. Please enter your address manually.');
    }
  };

  const handleConfirmBooking = () => {
    if (!validateStep2()) { // Validation for step 2
      return;
    }
    const { selectedDay, selectedTime } = bookingDetails; // bookingDetails still used for day/time

    // Helper to parse duration string to minutes
    const parseDuration = (durationStr) => {
      if (!durationStr) return 0;
      let totalMinutes = 0;
      const parts = durationStr.split('/').map(s => s.trim());
      const mainPart = parts[0].toLowerCase();

      if (mainPart.includes('hr')) {
        const hrMatch = mainPart.match(/(\d+)\s*hr/);
        if (hrMatch) {
          totalMinutes += parseInt(hrMatch[1]) * 60;
        }
        const minMatch = mainPart.match(/(\d+)\s*min/);
        if (minMatch) {
          totalMinutes += parseInt(minMatch[1]);
        }
      } else if (mainPart.includes('min')) {
        totalMinutes += parseInt(mainPart.match(/(\d+)/)[1]) || 0;
      }
      return totalMinutes;
    };

    // Helper to parse price string to number
    const parsePrice = (priceStr) => {
      if (!priceStr) return 0;
      const parts = priceStr.split('/').map(s => s.trim());
      const mainPart = parts[0].replace('R', '').trim();
      return parseFloat(mainPart) || 0;
    };

    let totalBookingDuration = 0;
    let totalBookingCost = 0;

    const servicesList = selectedServices.map(service => { // Use selectedServices prop
      const durationMinutes = parseDuration(service.duration);
      const priceValue = parsePrice(service.price);

      totalBookingDuration += durationMinutes;
      totalBookingCost += priceValue;

      const formattedDuration = service.duration ? `(${service.duration})` : '';
      return `1x ${service.name} ${formattedDuration} ${service.price}`;
    }).join('\n');

    const message = `
Client: ${customerDetails.name} (${customerDetails.email}) (${customerDetails.phone})
Services: ${servicesList}
Total Duration: ${totalBookingDuration} minutes
Total Cost: R${totalBookingCost.toFixed(2)}
Date/Time: ${selectedDay?.toISOString().split('T')[0]} @ ${selectedTime}
Location: ${customerDetails.address}
    `;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
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
              {selectedServices.map(service => ( // Use selectedServices prop
                <li key={service.id}>
                  {service.name} - {service.price}
                  <button
                    className="remove-service-button"
                    onClick={() => onRemoveService(service.id)}
                  >
                    -
                  </button>
                </li>
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
            <Button type="secondary" onClick={handleShareLocation}>Share Location</Button>
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