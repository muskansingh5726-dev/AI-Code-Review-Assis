import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      <h2>🤖 AI Review</h2>

      <nav>

        <Link to="/dashboard">Dashboard</Link>

        <Link to="/review">New Review</Link>

        <Link to="/history">History</Link>

        <Link to="/profile">Profile</Link>

        <button className="logout-btn"
          onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";

    }}>  Logout
</button>

      </nav>

    </aside>
  );
}

export default Sidebar;