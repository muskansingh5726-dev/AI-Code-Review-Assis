// Validate Email
export const validateEmail = (email) => {
  if (email.trim() === "") {
    return "Email is required";
  }

  const emailRegex =
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  if (!emailRegex.test(email)) {
    return "Enter a valid email address";
  }

  return "";
};

// Validate Password
export const validatePassword = (password) => {
  if (password.trim() === "") {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  return "";
};