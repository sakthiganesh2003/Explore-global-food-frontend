import React, { useState } from 'react';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [error, setError] = useState('');

  // Form validation function
  const validateForm = () => {
    if (paymentMethod === 'credit-card') {
      if (!cardNumber || !expiryDate || !cvv) {
        setError('Please fill in all credit card fields');
        return false;
      }
      if (cardNumber.length !== 16) {
        setError('Card number must be 16 digits');
        return false;
      }
      if (cvv.length !== 3) {
        setError('CVV must be 3 digits');
        return false;
      }
    } else if (paymentMethod === 'paypal') {
      if (!paypalEmail) {
        setError('Please enter your PayPal email');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      alert(`Payment method: ${paymentMethod}\nPayment details submitted successfully!`);
      // Proceed to the next step or submit payment
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Payment Information</h3>
      <p className='text-gray-800'>Choose a payment method and enter your payment details.</p>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700" htmlFor="payment-method">
          Choose Payment Method
        </label>
        <div className="flex items-center space-x-4">
          <div>
            <input
              type="radio"
              id="credit-card"
              name="payment-method"
              value="credit-card"
              checked={paymentMethod === 'credit-card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            <label htmlFor="credit-card" className="text-sm text-gray-700">Credit Card</label>
          </div>
          <div>
            <input
              type="radio"
              id="paypal"
              name="payment-method"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            <label htmlFor="paypal" className="text-sm text-gray-700">PayPal</label>
          </div>
        </div>
      </div>

      {/* Credit Card Payment Form */}
      {paymentMethod === 'credit-card' && (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="card-number">
              Card Number
            </label>
            <input
              type="text"
              id="card-number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your card number"
              maxLength="16"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700" htmlFor="expiry-date">
                Expiry Date
              </label>
              <input
                type="month"
                id="expiry-date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700" htmlFor="cvv">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength="3"
                placeholder="Enter CVV"
              />
            </div>
          </div>
        </div>
      )}

      {/* PayPal Payment Form */}
      {paymentMethod === 'paypal' && (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="paypal-email">
              PayPal Email
            </label>
            <input
              type="email"
              id="paypal-email"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your PayPal email"
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {/* Submit Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Submit Payment
        </button>
      </div>
    </div>
  );
};

export default Payment;
