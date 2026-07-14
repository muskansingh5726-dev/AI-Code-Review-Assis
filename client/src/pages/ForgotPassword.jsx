import "../styles/ForgotPassword.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

function ForgotPassword() {

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

   if(email.trim()===""){
    toast.error("Please enter your email.");
    return;
}

   toast.success("Password reset link sent successfully! 📧");

    setEmail("");
  };

  return (

    <div className="forgot-container">

      <div className="forgot-card">

        <h2>Forgot Password?</h2>

        <p>
          Enter your registered email address and we'll send you a password reset link.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <button type="submit">
            Send Reset Link
          </button>

        </form>

        <Link to="/login" className="back-login">
          ← Back to Login
        </Link>

      </div>

    </div>

  );
}

export default ForgotPassword;