import React, { useState } from 'react';
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import "../style/policy.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import gdpr from "../assets/gdpr.png";

const PrivacyPolicy = () => {
    const [userInfo, setUserInfo] = useState({ username: "", email: "" });
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    const confirmToast = (message, onConfirm) => {
        toast.info(
            <div>
                <p>{message}</p>
                <button
                    onClick={() => {
                        onConfirm();
                        toast.dismiss();
                    }}
                    style={{ marginRight: '10px', backgroundColor: '#d33', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px' }}
                >
                    Yes
                </button>
                <button
                    onClick={() => toast.dismiss()}
                    style={{ backgroundColor: '#3085d6', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px' }}
                >
                    Cancel
                </button>
            </div>,
            { autoClose: false, closeOnClick: false }
        );
    };

    const requestAnonymization = () => {
        confirmToast("Are you sure you want to anonymize your data? This action cannot be reversed.", () => {
            api.post(`https://${window.location.hostname}/api/user/anonymize-data/`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(() => {
                toast.success('Your data has been anonymized.');
                navigate("/");
            })
            .catch(() => {
                toast.error('There was an error processing your request.');
            });
        });
    };

    const fetchUserInfo = () => {
        api.get(`https://${window.location.hostname}/api/user/UserInfo/`)
            .then((res) => {
                setUserInfo({
                    username: res.data.username,
                    email: res.data.email,
                });
                setShow(!show);
            })
            .catch(() => {
                toast.error("Error fetching user info");
            });
    };

    const handleDeleteAccount = () => {
        confirmToast("Are you sure you want to delete your account? This action cannot be reversed.", () => {
            api.delete(`https://${window.location.hostname}/api/user/UserDelete/`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(() => {
                toast.success('Your account has been deleted.');
                navigate("/");
            })
            .catch(() => {
                toast.error('There was an error deleting your account.');
            });
        });
    };

    const handlePermanentDeleteAccount = () => {
        confirmToast("Are you sure you want to permanently delete your account? This action cannot be reversed.", () => {
            api.post(`https://${window.location.hostname}/api/user/permanent-delete/`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(() => {
                toast.success('Your account has been permanently deleted.');
                navigate("/");
            })
            .catch(() => {
                toast.error('There was an error deleting your account.');
            });
        });
    };

    return (
        <div className="policy_all">
            <div className="text">
                <div className="title">
                    <h1>Privacy Policy (GDPR)</h1>
                    <div><img src={gdpr} alt="flag" style={{ width: "250px", height: "150px" }}/></div>
                </div>
                <div className="pcontents">
                    <div><h2>1. Information Collection</h2><br/>
                        <p>We collect the following information when you register and use our site:</p>
                        <ul>
                            <li>Username</li>
                            <li>Email address</li>
                            <li>Profile image</li>
                            <li>Game data (level, percentage, etc.)</li>
                        </ul>
                    </div><br/>
                    
                    <h2>2. Data Usage</h2><br/>
                    <p>The data we collect is used to:</p>
                    <ul>
                        <li>Provide and personalize your experience on our site.</li>
                        <li>Improve our site and services.</li>
                        <li>Communicate with you about updates, notifications, or relevant information.</li>
                    </ul><br/>

                    <h2>3. Your Rights</h2><br/>
                    <p>Under the GDPR, you have the following rights regarding your personal data:</p>
                    <ul>
                        <div className="link">
                            <li><strong><div className="subtitle" onClick={fetchUserInfo}>Access to your data:</div></strong> You can request a copy of the information we hold about you.</li>
                            {show && userInfo && (
                                <div>
                                    <p>Username: {userInfo.username}</p>
                                    <p>Email: {userInfo.email}</p>
                                </div>
                            )}
                            <li><strong><div className="subtitle"><Link to="/Settings">Data rectification:</Link></div></strong> You can correct or update your personal information.</li>
                            <li><strong><div className="subtitle" onClick={handleDeleteAccount}>Data deletion:</div></strong> You have the right to request the deletion of your account and all your personal data.</li>
                            <li><strong><div className="subtitle" onClick={handlePermanentDeleteAccount}>Data permanent deletion:</div></strong> You may request to have your account and personal data permanently deleted. This deletion can be reversed upon request, allowing your account and data to be restored.</li>
                            <li><strong><div className="subtitle" onClick={requestAnonymization}>Data anonymization:</div></strong> You can request the anonymization of your personal data to protect your identity.</li>
                        </div>
                    </ul><br/>

                    <h2>4. Data Security</h2><br/>
                    <p>We use advanced security measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction.</p>
                    <br/>
                    <h2>5. Changes to the Privacy Policy</h2><br/>
                    <p>We reserve the right to modify this privacy policy at any time. Changes will be posted on this page, and we will notify you by email if significant changes are made.</p>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default PrivacyPolicy;
