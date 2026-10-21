import "../styles/Profile.css";
import { useEffect, useState } from "react";
import API from "../api/api";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Profile() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {

        fetchProfile();

    }, []);

    const fetchProfile = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await API.get("/profile", {

                headers: {
                    Authorization: `Bearer ${token}`,
                },

            });

            setName(response.data.user.name);
            setEmail(response.data.user.email);

        } catch (error) {

            console.log(error);

        }

    };

    const updateProfile = async () => {

        try {

            const token = localStorage.getItem("token");

            await API.put(
                "/profile",
                {
                    name,
                    email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

           toast.success("Profile updated successfully!");

        } catch (error) {

            toast.error(
  error.response?.data?.message || "Something went wrong. Please try again."
);
        }

    };

    const changePassword = async () => {

        try {

            const token = localStorage.getItem("token");

            await API.put(
                "/profile/password",
                {
                    currentPassword,
                    newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Password updated successfully!");

            setCurrentPassword("");
            setNewPassword("");

        } catch (error) {

           toast.error(
  error.response?.data?.message || "Something went wrong. Please try again."
);

        }

    };

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");

    };

    return (
  <div className="profile-layout">
    <Sidebar />

    <main className="profile-page">
            <h1>My Profile</h1>

            <div className="profile-card">

                <h2>Personal Information</h2>

                <input
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    placeholder="Name"
                />

                <input
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    placeholder="Email"
                />

                <button onClick={updateProfile}>
                    Save Changes
                </button>

            </div>

            <div className="profile-card">

                <h2>Change Password</h2>

                <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) =>
                        setCurrentPassword(e.target.value)
                    }
                />

                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) =>
                        setNewPassword(e.target.value)
                    }
                />

                <button onClick={changePassword}>
                    Update Password
                </button>

            </div>

            <button
                className="logout-btn"
                onClick={logout}
            >
                Logout
            </button>

                    </main>
  </div>
);

}

export default Profile;