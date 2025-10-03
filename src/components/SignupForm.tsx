import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Notify } from "notiflix";
import axios from "axios";

interface FormData {
  username: string;
  email: string;
  password: string;
  userRole: "user" | "admin";
}

const SignupModal = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      userRole: "user" // Set default role to user
    }
  });

  const onRegister = async (data: FormData) => {
    console.log("Form submitted:", data); // 🔍 debug
    try {
      const { username, email, password, userRole } = data;

      const response = await axios.post(
        `http://localhost:3000/user/signup`, // ✅ fixed URL
        { username, email, password, userRole },  // ✅ include userRole
        { headers: { "Content-Type": "application/json" } }
      );

      // ✅ Check response and store auth info
      if (response.data && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userRole", response.data.user?.userRole || "user");
        localStorage.setItem("userId", response.data.user?.id || response.data.user?._id);
        localStorage.setItem("userName", response.data.user?.username || username);

        Notify.success(`Registration successful as ${response.data.user?.userRole || 'user'} 🎉`);
        reset();
        navigate("/dashboard"); // Redirect to dashboard directly
      } else {
        Notify.failure("Signup succeeded but no token received. Try logging in.");
        navigate("/loginform");
      }

    } catch (error) {
      console.error("Signup error:", error);
      Notify.failure("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit(onRegister)}
        className="w-full max-w-xs p-6 bg-white rounded shadow-md"
      >
        <h2 className="mb-6 text-2xl font-bold text-center">Register</h2>

        {/* Username */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 mb-1 border rounded"
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-1 border rounded"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-1 border rounded"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" }
            })}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* User Role Selection */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Account Type
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="user"
                className="mr-2 text-blue-500"
                {...register("userRole", { required: "Please select an account type" })}
              />
              <span className="text-sm">Regular User</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="admin"
                className="mr-2 text-blue-500"
                {...register("userRole", { required: "Please select an account type" })}
              />
              <span className="text-sm">Administrator</span>
            </label>
          </div>
          {errors.userRole && (
            <p className="text-sm text-red-500 mt-1">{errors.userRole.message}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Register
        </button>

        {/* Login link */}
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/loginform" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupModal;