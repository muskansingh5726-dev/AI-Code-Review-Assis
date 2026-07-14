import "../styles/Signup.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
function Signup() {
  const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [errors, setErrors] = useState({});
    const handleSignup = async (e) => {
  e.preventDefault();
  console.log("BUTTON CLICKED");

  let validationErrors = {};

  if (name.trim() === "") {
    validationErrors.name = "Name is required";
  }

  if (email.trim() === "") {
    validationErrors.email = "Email is required";
  }

  if (password.trim() === "") {
    validationErrors.password = "Password is required";
  } else if (password.length < 8) {
    validationErrors.password = "Password must be at least 8 characters";
  }

  if (confirmPassword.trim() === "") {
    validationErrors.confirmPassword = "Confirm your password";
  } else if (password !== confirmPassword) {
    validationErrors.confirmPassword = "Passwords do not match";
  }

  setErrors(validationErrors);

  if (Object.keys(validationErrors).length === 0) {

  try {
    console.log("ABOUT TO SEND REQUEST");

    const response = await API.post("/auth/signup", {
      name,
      email,
      password,
    });

    toast.success(response.data.message);

setTimeout(() => {
    navigate("/login");
}, 1500);

  } catch (error) {

    console.log(error.response?.data);

    toast.error(error.response?.data?.message || "Something went wrong");

  }

}
};
  return (
    <div className="signup-container">

      <div className="signup-left">

        <h1>Create Account 🚀</h1>

        <p>
          Join AI Code Review Assistant and start improving
          your coding skills with AI-powered analysis.
        </p>

      </div>

      <div className="signup-right">

        <div className="signup-card">

          <h2>Sign Up</h2>

          <form onSubmit={handleSignup}>

            <label>Full Name</label>
            <input type="text" placeholder="Enter your full name" value={name}
            onChange={(e) => setName(e.target.value)} />
            {errors.name && <p className="error">{errors.name}</p>}

            <label>Email</label>
            <input type="email" placeholder="Enter your email" value={email}
            onChange={(e) => setEmail(e.target.value)} />
            {errors.email && <p className="error">{errors.email}</p>}

            <label>Password</label>
            <input type="password" placeholder="Create a password" value={password}
            onChange={(e) => setPassword(e.target.value)} />
            
            {errors.password && <p className="error">{errors.password}</p>}

            <label>Confirm Password</label>
            <input type="password" placeholder="Confirm password" value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} />
            
            {errors.confirmPassword && (
                <p className="error">{errors.confirmPassword}</p> )}

            <button type="submit">
              Create Account
            </button>

          </form>

          <p className="signup-link">

            Already have an account?

            <Link to="/login">
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Signup;