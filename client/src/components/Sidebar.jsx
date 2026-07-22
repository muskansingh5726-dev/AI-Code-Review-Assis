import "./Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="sidebar">

      <div className="logo">

        <div className="logo-icon">AI</div>

        <div>
          <h2>CodeReview</h2>
          <span>Assistant</span>
        </div>

      </div>

      <nav>

        <NavLink to="/dashboard" className="nav-item">
          🏠 Dashboard
        </NavLink>

        <NavLink to="/review" className="nav-item">
          💻 Review
        </NavLink>

        <NavLink to="/history" className="nav-item">
          📜 History
        </NavLink>

        <NavLink to="/profile" className="nav-item">
          👤 Profile
        </NavLink>

      </nav>

      <button className="logout-btn" onClick={logout}>
        🚪 Logout
      </button>

    </aside>
  );
}

export default Sidebar;