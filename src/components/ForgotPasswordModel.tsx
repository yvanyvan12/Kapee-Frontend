import { useState } from "react";
import axios from "axios";
import { Notify } from "notiflix";

type ForgotPasswordModalProps = {
  onClose: () => void;
};

const ForgotPasswordModal = ({ onClose }: ForgotPasswordModalProps) => {
  const [step, setStep] = useState<"request" | "verify">("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Step 1: Request OTP
  const handleRequestOTP = async () => {
    try {
      await axios.post("http://localhost:3000/user/forgot-password", { email });
      Notify.success("OTP sent to your email!");
      setStep("verify");
    } catch (err) {
      Notify.failure("Error sending OTP. Please try again.");
    }
  };

  // Step 2: Verify OTP & Reset
  const handleVerifyOTP = async () => {
    try {
      await axios.post("http://localhost:3000/user/reset-password", {
        email,
        otp,
        newPassword,
      });
      Notify.success("Password reset successfully! You can now log in.");
      onClose();
    } catch (err) {
      Notify.failure("Invalid OTP or expired. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white max-w-md w-full p-6 rounded-xl shadow-lg">
        {step === "request" && (
          <>
            <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              className="w-full border p-2 mb-4 rounded"
            />
            <button
              onClick={handleRequestOTP}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Send OTP
            </button>
          </>
        )}

        {step === "verify" && (
          <>
            <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full border p-2 mb-3 rounded"
            />
            <button
              onClick={handleVerifyOTP}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Reset Password
            </button>
          </>
        )}

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-600 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
