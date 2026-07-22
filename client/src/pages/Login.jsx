import "../styles/Login.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const handleLogin = async (e) => {

    e.preventDefault();

    let validationErrors = {};

    if(email.trim() === ""){
        validationErrors.email="Email is required";
    }

    if(password.trim()===""){
        validationErrors.password="Password is required";
    }

    else if(password.length<8){
        validationErrors.password="Password must be at least 8 characters";
    }

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
    toast.error("Please fix the errors before continuing.");
    return;
}

    if(Object.keys(validationErrors).length===0){

        try {

    const response = await API.post("/auth/login", {
        email, password });
        localStorage.setItem("token", response.data.token);

localStorage.setItem(
    "user",
    JSON.stringify(response.data.user)
);
window.dispatchEvent(new Event("storage"));
toast.success(response.data.message);

navigate("/dashboard");

   
} catch (error) {

    console.log(error.response.data);    // ✅ Console
    toast.error(error.response?.data?.message || "Login failed");
}
    }

}
  return (
    <div className="auth-container">

      <div className="auth-left">
        <h1>Welcome Back 👋</h1>

        <p>
          Login to access your AI Code Review Dashboard,
          review your projects and improve your code quality.
        </p>

        
      </div>

      <div className="auth-right">

        <div className="auth-card">

          <h2>Login</h2>

          <form onSubmit={handleLogin}>

            <label>Email</label>

            <input 
            type="email" placeholder="Enter your email" value={email}
            onChange={(e) => setEmail(e.target.value)} />
            {errors.email && (
                <p className="error">{errors.email}</p> )}

            <label>Password</label>
          <div className="password-box">
            <input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password}
            onChange={(e) => setPassword(e.target.value)} />
            
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)} >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
        </div>
            {errors.password && (
                <p className="error">{errors.password}</p> )}

            <div className="forgot-password">
                <Link to="/forgot-password"> Forgot Password? </Link>
                </div>

            <button type="submit">
              🚀 Login
            </button>

          </form>

          <p className="auth-link">
            Don't have an account?

            <Link to="/signup"> Sign Up </Link>
            </p>
        </div>

      </div>

    </div>
  );
}

export default Login;