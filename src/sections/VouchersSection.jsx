import React, { useState } from 'react';
import FadeInOnScroll from '../components/Transitions/FadeInOnScroll';
import Button from '../components/UI/Button';
import InputField from '../components/Forms/InputField';
import Modal from '../components/UI/Modal';
import './VouchersSection.css';
import voucherImage from '../assets/images/couplestherapy.jpg'; // Reusing an existing image
<<<<<<< Updated upstream


<<<<<<< HEAD
const VouchersSection = () => {
=======
import { API_BASE } from '../apiConfig';

const VouchersSection = ({ showModal }) => {
>>>>>>> Stashed changes
=======




const VouchersSection = ({ showModal }) => {
>>>>>>> backend-production
  const [mode, setMode] = useState('purchase'); // 'purchase' or 'redeem'
  const [purchaseForm, setPurchaseForm] = useState({
    yourName: '',
    yourEmail: '', // New field for purchaser's email
    recipientName: '',
    recipientEmail: '',
    amount: '',
    personalMessage: '',
  });
  const [redeemForm, setRedeemForm] = useState({
    yourName: '',
    yourEmail: '',
    yourPhone: '',
    voucherCode: '',
  });

  const handlePurchaseInputChange = (e) => {
    const { name, value } = e.target;
    setPurchaseForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleRedeemInputChange = (e) => {
    const { name, value } = e.target;
    setRedeemForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const validatePurchaseForm = () => {
    const { yourName, yourEmail, recipientName, recipientEmail, amount } = purchaseForm;
    if (!yourName.trim() || !yourEmail.trim() || !recipientName.trim() || !recipientEmail.trim() || !amount) {
      showModal('Missing Info', 'Please fill in all required fields for voucher purchase.', 'error');
      return false;
    }
    return true;
  };

  const validateRedeemForm = () => {
    const { yourName, yourEmail, yourPhone, voucherCode } = redeemForm;
    if (!yourName.trim() || !yourEmail.trim() || !yourPhone.trim() || !voucherCode.trim()) {
      showModal('Missing Info', 'Please fill in all required fields for voucher redemption (Name, Email, Phone, and Code).', 'error');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(yourEmail)) {
      showModal('Invalid Email', 'Please enter a valid email address.', 'error');
      return false;
    }
    return true;
  };

  const handleVoucherSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'purchase') {
<<<<<<< HEAD
<<<<<<< Updated upstream
      if (!validatePurchaseForm()) {
        return;
=======
      if (!validatePurchaseForm()) return;

      const amountValue = parseFloat(purchaseForm.amount);
      try {
        const response = await fetch(`${API_BASE}/api/create-voucher`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            purchase_name: purchaseForm.yourName,
            purchase_email: purchaseForm.yourEmail,
            recipient_name: purchaseForm.recipientName,
            recipient_email: purchaseForm.recipientEmail,
            amount: Math.round(amountValue * 100),
            currency: 'ZAR',
            metadata: { personalMessage: purchaseForm.personalMessage },
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to create voucher');
        window.location.href = data.checkoutUrl;
      } catch (err) {
        showModal('Error', err.message, 'error');
>>>>>>> Stashed changes
      }
      message = `
Transaction Type: ${transactionType}
Customer Name: ${purchaseForm.yourName}
Recipient Name: ${purchaseForm.recipientName}
Recipient Email: ${purchaseForm.recipientEmail}
Amount: R${purchaseForm.amount}
Personal Message: ${purchaseForm.personalMessage}
      `;
    } else { // redeem
      if (!validateRedeemForm()) {
        return;
      }
      message = `
Transaction Type: ${transactionType}
Customer Name: ${redeemForm.yourName}
Voucher Code: ${redeemForm.voucherCode}
      `;
    }
=======
      if (!validatePurchaseForm()) return;
>>>>>>> backend-production

      const amountValue = parseFloat(purchaseForm.amount);
      try {
        const response = await fetch('/api/create-voucher', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            purchase_name: purchaseForm.yourName,
            purchase_email: purchaseForm.yourEmail,
            recipient_name: purchaseForm.recipientName,
            recipient_email: purchaseForm.recipientEmail,
            amount: Math.round(amountValue * 100),
            currency: 'ZAR',
            metadata: { personalMessage: purchaseForm.personalMessage },
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to create voucher');
        window.location.href = data.checkoutUrl;
      } catch (err) {
        showModal('Error', err.message, 'error');
      }
    } else {
<<<<<<< HEAD
<<<<<<< Updated upstream
      setRedeemForm({ yourName: '', voucherCode: '' });
=======
      if (!validateRedeemForm()) return;

      try {
        const response = await fetch(`${API_BASE}/api/redeem-voucher`, {
=======
      if (!validateRedeemForm()) return;

      try {
        const response = await fetch('/api/redeem-voucher', {
>>>>>>> backend-production
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            voucher_code: redeemForm.voucherCode,
            redeemer_name: redeemForm.yourName,
            redeemer_email: redeemForm.yourEmail,
            redeemer_phone: redeemForm.yourPhone,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          showModal('Success!', 'Voucher successfully redeemed! Our team has been notified, and will contact you shortly.', 'success');
          setRedeemForm({ yourName: '', yourEmail: '', yourPhone: '', voucherCode: '' });
        } else {
          showModal('Redemption Failed', data.error || 'Failed to redeem voucher.', 'error');
        }
      } catch (err) {
        showModal('System Error', 'Unable to process redemption. Please try again later.', 'error');
      }
<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> backend-production
    }
  };

  return (
    <section className="vouchers-section" id="vouchers-section">
      <FadeInOnScroll>
        <h2 className="section-title">Gift or Redeem a Voucher</h2>
        <p className="section-subtitle">
          Purchase a gift voucher for your loved ones or redeem one you have received.
        </p>
        <div className="vouchers-content">
          <div className="vouchers-image-container">
            <img src={voucherImage} alt="Gift Voucher" className="vouchers-image" />
          </div>
          <div className="vouchers-form-container card">
            <div className="voucher-toggle">
              <Button type={mode === 'purchase' ? 'primary' : 'secondary'} onClick={() => setMode('purchase')}>Purchase</Button>
              <Button type={mode === 'redeem' ? 'primary' : 'secondary'} onClick={() => setMode('redeem')}>Redeem</Button>
            </div>

            {mode === 'purchase' ? (
              <div>
                <h3>Purchase a Voucher</h3>
                <form className="voucher-form" onSubmit={handleVoucherSubmit}>
                  <InputField
                    label="Your Name"
                    type="text"
                    name="yourName"
                    value={purchaseForm.yourName}
                    onChange={handlePurchaseInputChange}
                    placeholder="Enter your name"
                  />
                  <InputField
                    label="Your Email"
                    type="email"
                    name="yourEmail"
                    value={purchaseForm.yourEmail}
                    onChange={handlePurchaseInputChange}
                    placeholder="Enter your email"
                  />
                  <InputField
                    label="Recipient's Name"
                    type="text"
                    name="recipientName"
                    value={purchaseForm.recipientName}
                    onChange={handlePurchaseInputChange}
                    placeholder="Enter recipient's name"
                  />
                  <InputField
                    label="Recipient's Email"
                    type="email"
                    name="recipientEmail"
                    value={purchaseForm.recipientEmail}
                    onChange={handlePurchaseInputChange}
                    placeholder="Enter recipient's email"
                  />
                  <InputField
                    label="Amount"
                    type="number"
                    name="amount"
                    value={purchaseForm.amount}
                    onChange={handlePurchaseInputChange}
                    placeholder="Enter amount"
                    min="1"
                  />
                  <InputField
                    label="Personal Message"
                    type="textarea"
                    name="personalMessage"
                    value={purchaseForm.personalMessage}
                    onChange={handlePurchaseInputChange}
                    placeholder="Enter a personal message"
                  />
                  <Button type="primary" htmlType="submit">Pay with Yoco</Button>
                </form>
              </div>
            ) : (
              <div>
                <h3>Redeem a Voucher</h3>
                <form className="voucher-form" onSubmit={handleVoucherSubmit}>
                  <InputField
                    label="Your Name"
                    type="text"
                    name="yourName"
                    value={redeemForm.yourName}
                    onChange={handleRedeemInputChange}
                    placeholder="Enter your name"
                  />
                  <InputField
                    label="Your Email"
                    type="email"
                    name="yourEmail"
                    value={redeemForm.yourEmail}
                    onChange={handleRedeemInputChange}
                    placeholder="Enter your email"
                  />
                  <InputField
                    label="Your Phone Number"
                    type="tel"
                    name="yourPhone"
                    value={redeemForm.yourPhone}
                    onChange={handleRedeemInputChange}
                    placeholder="Enter your phone number"
                  />
                  <InputField
                    label="Voucher Code"
                    type="text"
                    name="voucherCode"
                    value={redeemForm.voucherCode}
                    onChange={handleRedeemInputChange}
                    placeholder="Enter your voucher code"
                  />
                  <Button type="primary" htmlType="submit">Redeem Voucher</Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  );
};

export default VouchersSection;
