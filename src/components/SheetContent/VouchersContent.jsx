import React, { useState } from 'react';
import Button from '../UI/Button';
import InputField from '../Forms/InputField';
import Modal from '../UI/Modal';
import './VouchersContent.css';
import voucherImage from '../../assets/images/couplestherapy.jpg'; // Reusing an existing image
import { API_BASE } from '../../apiConfig';

const VouchersContent = ({ showModal }) => {
  const [mode, setMode] = useState('purchase'); // 'purchase' or 'redeem'
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
=======
>>>>>>> backend-production
  const [purchaseForm, setPurchaseForm] = useState({
    yourName: '',
    yourEmail: '',
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
    setPurchaseForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRedeemInputChange = (e) => {
    const { name, value } = e.target;
    setRedeemForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVoucherSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'purchase') {
      const amountValue = parseFloat(purchaseForm.amount);
      if (!purchaseForm.yourName || !purchaseForm.yourEmail || !purchaseForm.recipientEmail || isNaN(amountValue)) {
        showModal('Missing Info', 'Please fill in all required fields.', 'error');
        return;
      }

      try {
<<<<<<< HEAD
        const response = await fetch(`${API_BASE}/api/create-voucher`, {
=======
        const response = await fetch('/api/create-voucher', {
>>>>>>> backend-production
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
      if (!redeemForm.yourName || !redeemForm.yourEmail || !redeemForm.yourPhone || !redeemForm.voucherCode) {
        showModal('Missing Info', 'Please fill in all fields.', 'error');
        return;
      }

      try {
<<<<<<< HEAD
        const response = await fetch(`${API_BASE}/api/redeem-voucher`, {
=======
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
    }
  };
<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> backend-production

  return (
    <div className="vouchers-content-wrapper">
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
    </div>
  );
};

export default VouchersContent;
