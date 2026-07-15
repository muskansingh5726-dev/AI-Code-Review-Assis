import "./Navbar.css";
import { FaRobot } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);

    return (

        <nav className="navbar">

            <div className="logo">

                <FaRobot />

                <span>CodeReview AI</span>

            </div>

            <ul className={menuOpen ? "nav-links active" : "nav-links"}>

    <li>
        <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
    </li>

    <li>
        <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
    </li>

    <li>
        <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
    </li>

</ul>

            <div className="buttons">

                <Link to="/login" className="login-btn">
                Login
                </Link>

                <Link to="/signup" className="signup-btn">
                Sign Up 
                </Link>

            </div>

            <div
                className="menu-icon"
                onClick={() => setMenuOpen(!menuOpen)}
            >

                {menuOpen ? <HiX /> : <HiMenu />}

            </div>

        </nav>

    );

}

export default Navbar;