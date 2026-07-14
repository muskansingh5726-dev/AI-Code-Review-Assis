import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Review from "./pages/Review";
import Result from "./pages/Result";
import History from "./pages/History";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={
        <ProtectedRoute> <Dashboard /></ProtectedRoute>}/>
      <Route path="/review" element={
        <ProtectedRoute> <Review /> </ProtectedRoute>} />
      <Route path="/result" element={
        <ProtectedRoute> <Result /> </ProtectedRoute>} />
     <Route path="/history" element={
        <ProtectedRoute> <History /> </ProtectedRoute>} />
      <Route path="/profile" element={
        <ProtectedRoute><Profile /> </ProtectedRoute>} />
    </Routes>
  );
}

export default App;