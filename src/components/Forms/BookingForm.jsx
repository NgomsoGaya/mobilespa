import React from 'react';
import InputField from './InputField';
import Button from '../UI/Button';
import './BookingForm.css';

const BookingForm = () => {
  return (
    <form className="booking-form">
      <InputField label="Name" type="text" placeholder="Your Name" />
      <InputField label="Email" type="email" placeholder="Your Email" />
      <InputField label="Preferred Date" type="date" />
      <Button type="primary" size="large">Request Booking</Button>
    </form>
  );
};

export default BookingForm;
