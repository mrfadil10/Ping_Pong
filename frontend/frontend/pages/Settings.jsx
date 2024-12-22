import React, { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../style/Settings.css";

function Settings() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [userInfo, setUserInfo] = useState({ username: "", email: "" });
    const [isDeleting, setIsDeleting] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);

    const handleUpdate = () => {
        if (newPassword !== confirmNewPassword) {
            toast.error("New password and confirmation password do not match");
            return;
        }

        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("new_password", newPassword);
        if (profileImage) {
            formData.append("profile_image", profileImage);
        }

        api.put(`https://${window.location.hostname}/api/user/settings/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((res) => {
                toast.success("Profile updated successfully");
                setUsername("");
                setPassword("");
                setEmail("");
                setNewPassword("");
                setConfirmNewPassword("");
                setProfileImage(null);
            })
            .catch((err) => {
                // console.error(err);
                toast.error("Error updating profile");
            });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleUpdate();
        }
    };

    const requestAnonymization = () => {
        if (window.confirm("Are you sure you want to Anonymize your data? This action cannot be reversed.")) {
            api.post(`https://${window.location.hostname}/api/user/anonymize-data/`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                toast.success('Your data has been anonymized.');
                navigate("/");
            })
            .catch((err) => {
                toast.error('There was an error processing your request.');
            });
        }
    };

    const fetchUserInfo = () => {
        api.get(`https://${window.location.hostname}/api/user/UserInfo/`)
            .then((res) => {
                setUserInfo({
                    username: res.data.username,
                    email: res.data.email,
                });
            })
            .catch((err) => {
                // console.error(err);
                toast.error("Error fetching user info");
            });
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be reversed.")) {
            api.delete(`https://${window.location.hostname}/api/user/UserDelete/`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                toast.success('Your account has been deleted.');
                navigate("/");
            })
            .catch((err) => {
                toast.error('There was an error deleting your account.');
            });
        }
    };

    const handlePermanentDeleteAccount = () => {
        if (window.confirm("Are you sure you want to permanently delete your account? This action cannot be reversed.")) {
            api.post(`https://${window.location.hostname}/api/user/permanent-delete/`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                toast.success('Your account has been permanently deleted.');
                navigate("/");
            })
            .catch((err) => {
                toast.error('There was an error deleting your account.');
                // console.error(err);
            });
        }
    };

    useEffect(() => {
        getUserProfile();
    }, []);

    const getUserProfile = () => {
        api
            .get(`https://${window.location.hostname}/api/user/profile/`)
            .then((res) => {
                setProfile(res.data);
            })
            .catch((err) => toast.error(err));
    };

    if (!profile) {
        return <div></div>;
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setProfile({ ...profile, profile_image: URL.createObjectURL(file) });
        }
    };

    const checkUSername = (username) => {
        const newUsername = username.replace(/[^a-zA-Z0-9]/g, "");
        setUsername(newUsername);
    };

    return (
        <div className="settings_all">
            <div className="scontent">
                <div className="title"><h2>Settings</h2></div>

                <div className="line1">
                    <div>
                        <img src={`https://${window.location.hostname}${profile.profile_image}`} alt="Profile" className="images" onClick={() => document.getElementById('fileInput').click()} style={{ cursor: "pointer" }}/>
                        <div className="image">
                        <input
                                type="file"
                                id="fileInput"
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    </div>
                    <div className="contents">
                        <h1>Username</h1>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => checkUSername(e.target.value)}
                            placeholder="New Username"
                            className="input"
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>

                <div className="line2">
                    <div>
                        <h1>Email</h1>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="input"
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <div>
                        <h1>New Password</h1>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Password"
                            className="input"
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>

                <div className="line3">
                    <div>
                        <h1>Current Password</h1>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Current Password"
                            className="input"
                            onKeyDown={handleKeyDown}
                        />
                        <Link to="/PrivacyPolicy" className="policy" style={{ textDecoration: 'none' }}>Privacy Policy</Link>
                    </div>
                    <div>
                        <h1>Confirm Password</h1>
                        <input
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            placeholder="Confirm New Password"
                            className="input"
                            onKeyDown={handleKeyDown}
                        />
                        <div>
                            <label className="fa">
                                <input
                                    type="checkbox"
                                    className="checkbox-input"
                                />
                                2FA
                            </label>
                        </div>
                    </div>
                </div>
                
                <div className="last">
                    <div className="save">
                        <button onClick={handleUpdate}>Save</button><br></br>
                        <div className="line"></div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
}

export default Settings;
