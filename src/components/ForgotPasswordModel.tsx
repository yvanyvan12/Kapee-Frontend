
import { X } from "lucide-react";
import { Link} from "react-router-dom";

type AuthModalProps = {
  onClose: () => void;
};

const ForgotPasswordModal = ({ onClose }: AuthModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>

        <p className="text-gray-600 text-sm mb-4 text-center">
          Enter your email and we’ll send you reset instructions.
        </p>

        {/* Email */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Submit */}
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
          Send Reset Link
        </button>

        {/* Back to login */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Remembered your password?{" "}
          <Link to="/LoginForm" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
