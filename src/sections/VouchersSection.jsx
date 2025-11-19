import React from 'react';
import FadeInOnScroll from '../components/Transitions/FadeInOnScroll';
import Button from '../components/UI/Button';
import InputField from '../components/Forms/InputField';
import './VouchersSection.css';
import voucherImage from '../assets/images/couplestherapy.jpg'; // Reusing an existing image

const VouchersSection = () => {
  return (
    <section className="vouchers-section" id="vouchers-section">
      <FadeInOnScroll>
        <h2 className="section-title">Gift a Moment of Bliss</h2>
        <p className="section-subtitle">
          Purchase a gift voucher for your loved ones and give them the gift of relaxation.
        </p>
        <div className="vouchers-content">
          <div className="vouchers-image-container">
            <img src={voucherImage} alt="Gift Voucher" className="vouchers-image" />
          </div>
          <div className="vouchers-form-container card">
            <h3>Purchase a Voucher</h3>
            <form className="voucher-form">
              <InputField label="Your Name" type="text" placeholder="Enter your name" />
              <InputField label="Recipient's Name" type="text" placeholder="Enter recipient's name" />
              <InputField label="Recipient's Email" type="email" placeholder="Enter recipient's email" />
              <InputField label="Amount" type="number" placeholder="Enter amount" />
              <InputField label="Personal Message" type="textarea" placeholder="Enter a personal message" />
              <Button type="primary" onClick={() => alert('Voucher purchased!')}>Purchase Now</Button>
            </form>
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  );
};

export default VouchersSection;
