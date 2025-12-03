import React, { useState } from 'react';
import FadeInOnScroll from '../components/Transitions/FadeInOnScroll';
import Button from '../components/UI/Button';
import InputField from '../components/Forms/InputField';
import './VouchersSection.css';
import voucherImage from '../assets/images/couplestherapy.jpg'; // Reusing an existing image

const WHATSAPP_NUMBER = '+27774478258'; // TODO: Move to a global config/environment variable

const VouchersSection = () => {
  const [mode, setMode] = useState('purchase'); // 'purchase' or 'redeem'
  const [purchaseForm, setPurchaseForm] = useState({
    yourName: '',
    recipientName: '',
    recipientEmail: '',
    amount: '',
    personalMessage: '',
  });
  const [redeemForm, setRedeemForm] = useState({
    yourName: '', // Assuming 'Your Name' from purchase form applies here too for customer details
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
    const { yourName, recipientName, recipientEmail, amount } = purchaseForm;
    if (!yourName.trim() || !recipientName.trim() || !recipientEmail.trim() || !amount) {
      alert('Please fill in all required fields for voucher purchase (Your Name, Recipient Name, Recipient Email, Amount).');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(recipientEmail)) {
      alert('Please enter a valid recipient email address.');
      return false;
    }
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount for the voucher.');
      return false;
    }
    return true;
  };

  const validateRedeemForm = () => {
    const { yourName, voucherCode } = redeemForm;
    if (!yourName.trim() || !voucherCode.trim()) {
      alert('Please fill in all required fields for voucher redemption (Your Name, Voucher Code).');
      return false;
    }
    return true;
  };

  const handleVoucherSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    let message = '';
    let whatsappUrl = '';
    const transactionType = mode === 'purchase' ? 'Voucher Purchase' : 'Voucher Redemption';

    if (mode === 'purchase') {
      if (!validatePurchaseForm()) {
        return;
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

    whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Optionally reset form after submission
    if (mode === 'purchase') {
      setPurchaseForm({ yourName: '', recipientName: '', recipientEmail: '', amount: '', personalMessage: '' });
    } else {
      setRedeemForm({ yourName: '', voucherCode: '' });
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
                    required // HTML5 required attribute
                  />
                  <InputField
                    label="Recipient's Name"
                    type="text"
                    name="recipientName"
                    value={purchaseForm.recipientName}
                    onChange={handlePurchaseInputChange}
                    placeholder="Enter recipient's name"
                    required
                  />
                  <InputField
                    label="Recipient's Email"
                    type="email"
                    name="recipientEmail"
                    value={purchaseForm.recipientEmail}
                    onChange={handlePurchaseInputChange}
                    placeholder="Enter recipient's email"
                    required
                  />
                  <InputField
                    label="Amount"
                    type="number"
                    name="amount"
                    value={purchaseForm.amount}
                    onChange={handlePurchaseInputChange}
                    placeholder="Enter amount"
                    min="1" // Minimum amount
                    required
                  />
                  <InputField
                    label="Personal Message"
                    type="textarea"
                    name="personalMessage"
                    value={purchaseForm.personalMessage}
                    onChange={handlePurchaseInputChange}
                    placeholder="Enter a personal message"
                  />
                  <Button type="primary" type="submit">Purchase via Whatsapp</Button>
                </form>
              </div>
            ) : (
              <div>
                <h3>Redeem a Voucher</h3>
                <form className="voucher-form" onSubmit={handleVoucherSubmit}>
                  <InputField
                    label="Your Name" // Added for customer details in redemption
                    type="text"
                    name="yourName"
                    value={redeemForm.yourName}
                    onChange={handleRedeemInputChange}
                    placeholder="Enter your name"
                    required
                  />
                  <InputField
                    label="Voucher Code"
                    type="text"
                    name="voucherCode"
                    value={redeemForm.voucherCode}
                    onChange={handleRedeemInputChange}
                    placeholder="Enter your voucher code"
                    required
                  />
                  <Button type="primary" type="submit">Redeem via Whatsapp</Button>
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
