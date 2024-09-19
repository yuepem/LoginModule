"use client";
import React, { useState } from "react";

const OtpPage: React.FC = () => {
  const [contactInfo, setContactInfo] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("email");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateContactInfo = (info: string): boolean => {
    if (deliveryMethod === "email") {
      // Regular expression for email validation
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(info);
    } else if (deliveryMethod === "sms") {
      // Regular expression for phone number validation
      const re = /^\+?[1-9]\d{1,14}$/;
      return re.test(info);
    }
    return false;
  };

  const handleGenerateOtp = async () => {
    if (!contactInfo) {
      setMessage("Contact information is required");
      setIsSuccess(false);
      return;
    }
    if (!validateContactInfo(contactInfo)) {
      setMessage(
        deliveryMethod === "email"
          ? "Invalid email format"
          : "Invalid phone number format"
      );
      setIsSuccess(false);
      return;
    }
    const res = await fetch("/api/auth/otp/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: deliveryMethod === "email" ? contactInfo : undefined,
        phoneNumber: deliveryMethod === "sms" ? contactInfo : undefined,
        deliveryMethod,
      }),
    });
    const result = await res.json();
    setMessage(result.message);
    if (res.status === 200) {
      setIsOtpSent(true);
      setIsSuccess(true);
    } else {
      setIsSuccess(false);
    }
  };

  const handleVerifyOtp = async () => {
    const res = await fetch("/api/auth/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: deliveryMethod === "email" ? contactInfo : undefined,
        phoneNumber: deliveryMethod === "sms" ? contactInfo : undefined,
        otp,
      }),
    });
    const result = await res.json();
    setMessage(result.message);
    if (res.status === 200) {
      setIsOtpVerified(true);
      setIsSuccess(true);
    } else {
      setIsSuccess(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          OTP Authentication
        </h1>
        {!isOtpSent ? (
          <>
            <div className="mb-4">
              <label className="block text-gray-800">OTP Delivery Method</label>
              <select
                value={deliveryMethod}
                onChange={(e) => setDeliveryMethod(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded"
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
              </select>
            </div>
            <input
              type={deliveryMethod === "email" ? "email" : "text"}
              placeholder={
                deliveryMethod === "email"
                  ? "Enter your email"
                  : "Enter your phone number"
              }
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded mb-4"
            />
            <button
              onClick={handleGenerateOtp}
              className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
            >
              Generate OTP
            </button>
          </>
        ) : (
          <div>
            {!isOtpVerified ? (
              <div>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded mb-4"
                />
                <button
                  onClick={handleVerifyOtp}
                  className="w-full bg-blue-500 text-white p-3 rounded"
                >
                  Verify OTP
                </button>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-xl font-semibold">Welcome</h2>
              </div>
            )}
          </div>
        )}
        {message && (
          <p
            className={`text-center mt-4 ${
              isSuccess ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};
export default OtpPage;
