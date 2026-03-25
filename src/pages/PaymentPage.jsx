import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const PaymentPage = () => {
  const { checkoutId } = useParams();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Credit Card Form State
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  // Easypaisa Form State
  const [easypaisaDetails, setEasypaisaDetails] = useState({
    phoneNumber: "",
    accountNumber: "",
  });

  useEffect(() => {
    // Redirect if no checkout ID
    if (!checkoutId) {
      navigate("/checkout");
    }
  }, [checkoutId, navigate]);

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setError(null);
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === "cardNumber") {
      formattedValue = value.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
      if (formattedValue.length > 19) return; // Max 16 digits + 3 spaces
    }

    // Format expiry date (MM/YY)
    if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.substring(0, 2) + "/" + formattedValue.substring(2, 4);
      }
      if (formattedValue.length > 5) return;
    }

    // Limit CVV to 3-4 digits
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length > 4) return;
    }

    setCardDetails((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleEasypaisaInputChange = (e) => {
    const { name, value } = e.target;
    setEasypaisaDetails((prev) => ({
      ...prev,
      [name]: value.replace(/\D/g, ""), // Only numbers
    }));
  };

  const processPayment = async () => {
    if (!selectedPaymentMethod) {
      setError("Please select a payment method");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let paymentDetails = {};

      if (selectedPaymentMethod === "credit-card") {
        // Validate credit card details
        if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvv) {
          setError("Please fill all credit card details");
          setLoading(false);
          return;
        }
        paymentDetails = {
          method: "Credit Card",
          cardNumber: cardDetails.cardNumber.replace(/\s/g, ""),
          cardName: cardDetails.cardName,
          expiryDate: cardDetails.expiryDate,
          cvv: cardDetails.cvv,
        };
      } else if (selectedPaymentMethod === "easypaisa") {
        // Validate Easypaisa details
        if (!easypaisaDetails.phoneNumber || !easypaisaDetails.accountNumber) {
          setError("Please fill all Easypaisa details");
          setLoading(false);
          return;
        }
        paymentDetails = {
          method: "Easypaisa",
          phoneNumber: easypaisaDetails.phoneNumber,
          accountNumber: easypaisaDetails.accountNumber,
        };
      } else if (selectedPaymentMethod === "cash-on-delivery") {
        paymentDetails = {
          method: "Cash on Delivery",
        };
      }

      // Update checkout with payment method and mark as paid
      const paymentResponse = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "paid",
          paymentDetails: paymentDetails,
          paymentMethod: paymentDetails.method,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      // Finalize checkout and create order
      const finalizeResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      // Store order ID in localStorage for order confirmation page
      if (finalizeResponse.data && finalizeResponse.data._id) {
        localStorage.setItem("lastOrderId", finalizeResponse.data._id);
      }

      // Navigate to order confirmation
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.response?.data?.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  if (!checkoutId) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Payment</h1>

      {/* Order Summary */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cart && cart.products && (
          <>
            <div className="space-y-4 mb-4">
              {cart.products.map((product, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded mr-4"
                    />
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500">
                        Size: {product.size} | Color: {product.color}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">Rs: {product.price?.toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center text-lg font-semibold pt-4 border-t">
              <p>Total</p>
              <p>Rs: {cart.totalPrice?.toLocaleString()}</p>
            </div>
          </>
        )}
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-6">Select Payment Method</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Payment Method Options */}
        <div className="space-y-4 mb-6">
          {/* Credit Card Option */}
          <div
            className={`border-2 rounded-lg p-4 cursor-pointer transition ${
              selectedPaymentMethod === "credit-card"
                ? "border-black bg-gray-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onClick={() => handlePaymentMethodSelect("credit-card")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedPaymentMethod === "credit-card"}
                  onChange={() => handlePaymentMethodSelect("credit-card")}
                  className="mr-3"
                />
                <label className="text-lg font-medium cursor-pointer">Credit Card</label>
              </div>
              <div className="text-2xl">💳</div>
            </div>
          </div>

          {/* Easypaisa Option */}
          <div
            className={`border-2 rounded-lg p-4 cursor-pointer transition ${
              selectedPaymentMethod === "easypaisa"
                ? "border-black bg-gray-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onClick={() => handlePaymentMethodSelect("easypaisa")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedPaymentMethod === "easypaisa"}
                  onChange={() => handlePaymentMethodSelect("easypaisa")}
                  className="mr-3"
                />
                <label className="text-lg font-medium cursor-pointer">Easypaisa</label>
              </div>
              <div className="text-2xl">📱</div>
            </div>
          </div>

          {/* Cash on Delivery Option */}
          <div
            className={`border-2 rounded-lg p-4 cursor-pointer transition ${
              selectedPaymentMethod === "cash-on-delivery"
                ? "border-black bg-gray-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onClick={() => handlePaymentMethodSelect("cash-on-delivery")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={selectedPaymentMethod === "cash-on-delivery"}
                  onChange={() => handlePaymentMethodSelect("cash-on-delivery")}
                  className="mr-3"
                />
                <label className="text-lg font-medium cursor-pointer">Cash on Delivery</label>
              </div>
              <div className="text-2xl">💰</div>
            </div>
          </div>
        </div>

        {/* Credit Card Form */}
        {selectedPaymentMethod === "credit-card" && (
          <div className="border border-gray-300 rounded-lg p-6 mb-6 bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Credit Card Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardInputChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-3 border border-gray-300 rounded"
                  maxLength={19}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  name="cardName"
                  value={cardDetails.cardName}
                  onChange={handleCardInputChange}
                  placeholder="John Doe"
                  className="w-full p-3 border border-gray-300 rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleCardInputChange}
                    placeholder="MM/YY"
                    className="w-full p-3 border border-gray-300 rounded"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCardInputChange}
                    placeholder="123"
                    className="w-full p-3 border border-gray-300 rounded"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Easypaisa Form */}
        {selectedPaymentMethod === "easypaisa" && (
          <div className="border border-gray-300 rounded-lg p-6 mb-6 bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Easypaisa Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={easypaisaDetails.phoneNumber}
                  onChange={handleEasypaisaInputChange}
                  placeholder="03XX-XXXXXXX"
                  className="w-full p-3 border border-gray-300 rounded"
                  maxLength={11}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={easypaisaDetails.accountNumber}
                  onChange={handleEasypaisaInputChange}
                  placeholder="Account Number"
                  className="w-full p-3 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* Cash on Delivery Info */}
        {selectedPaymentMethod === "cash-on-delivery" && (
          <div className="border border-gray-300 rounded-lg p-6 mb-6 bg-gray-50">
            <p className="text-gray-600">
              You will pay in cash when your order is delivered. No payment is required now.
            </p>
          </div>
        )}

        {/* Pay Button */}
        <button
          onClick={processPayment}
          disabled={loading || !selectedPaymentMethod}
          className={`w-full py-3 rounded text-white font-semibold transition ${
            loading || !selectedPaymentMethod
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800"
          }`}
        >
          {loading ? "Processing..." : "Complete Payment"}
        </button>

        {/* Back Button */}
        <button
          onClick={() => navigate("/checkout")}
          className="w-full mt-4 py-3 rounded border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
        >
          Back to Checkout
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;

