import { X } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Notify } from "notiflix";
import ForgotPasswordModal from "./ForgotPasswordModel"; 
import { useNavigate, useLocation } from "react-router-dom";

type AuthModalProps = {
  onClose: () => void;
  onSwitchToSignup: () => void;
};

const LoginModal = ({ onClose, onSwitchToSignup }: AuthModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Close modal automatically when route changes
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/user/signin",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, user } = res.data;

      console.log("🔎 Backend user response:", user);

      // ✅ Save user data in localStorage safely
      if (user) {
        if (user.userRole) {
          localStorage.setItem("userRole", user.userRole.toLowerCase()); // normalize
        } else {
          console.warn("⚠️ No userRole found in response, defaulting to 'user'");
          localStorage.setItem("userRole", "user");
        }
        localStorage.setItem("userId", user.id || user._id || "");
        localStorage.setItem("userName", user.username || "");
      }
      if (token) {
        localStorage.setItem("authToken", token);
      }

      // ✅ Close the modal immediately after successful login
      onClose();

      Notify.success(`Welcome back, ${user?.username || "User"}!`);

      // ✅ Use role directly instead of re-fetching from localStorage
      const role = user?.userRole?.toLowerCase();
      if (role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }

    } catch (err: any) {
      console.error("Login error:", err);

      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Login failed. Please check your connection and try again.");
      }

      Notify.failure("Login failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign in to Kapee Dashboard
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <p
            className="text-right text-sm text-blue-600 hover:underline cursor-pointer"
            onClick={() => setShowForgotPassword(true)}
          >
            Forgot Password?
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <button
            onClick={onSwitchToSignup}
            className="text-blue-600 hover:underline"
          >
            Sign Up
          </button>
        </p>

        {showForgotPassword && (
          <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
        )}
      </div>
    </div>
  );
};

export default LoginModal;
