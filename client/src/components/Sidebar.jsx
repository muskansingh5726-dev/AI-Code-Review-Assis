import {
    FaHome,
    FaCode,
    FaHistory,
    FaUser,
    FaSignOutAlt
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");

    };

    return (

        <div className="sidebar">

            <h2>🤖 AI Review</h2>

            <NavLink to="/dashboard">
                <FaHome />
                Dashboard
            </NavLink>

            <NavLink to="/review">
                <FaCode />
                New Review
            </NavLink>

            <NavLink to="/history">
                <FaHistory />
                History
            </NavLink>

            <NavLink to="/profile">
                <FaUser />
                Profile
            </NavLink>

            <button onClick={logout}>
                <FaSignOutAlt />
                Logout
            </button>

        </div>

    );

}

export default Sidebar;