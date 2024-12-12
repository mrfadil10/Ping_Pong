import { useState, useEffect } from "react"
import api from "../api"
import { Navigate, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../style/RestoreAccount.css"
import DashUser from "../components/DashUser";

function RestoreAccount()
{
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();


    const handleRestoreRequest = () => {
        if (window.confirm("Are you sure you want to restore your account? This action will undo the previous deletion request.")) {
          setLoading(true);
          try {
            api.post(`https://${window.location.hostname}/api/user/restore/`, {}, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
            setSuccess('Your account has been restored.');
            navigate("/");
          } catch (err) {
            setError('There was an error restoring your account.');
          } finally {
            setLoading(false);
          }
        }
    }

    const [profile, setProfile] = useState(null); 

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
    return (
      <div className="Restore_all">
        <div className="Restore">
          <div className="rdash">
            <DashUser profile={profile}/>
          </div>

          <div className="message">
            <div>
              <div className="title">Account Activation</div>
              <div className="text">
                Your account has been deactivated. If you wish to reactivate your account and <br/>
                regain access to your personal data, please click the button below:
              </div>
            </div>

            <div>
              <button onClick={handleRestoreRequest} disabled={loading}>
                  {loading ? 'Processing...' : 'Reactivate My Account'}
              </button>
                {success && <p>{success}</p>}
                {error && <p>{error}</p>}
            </div>
            
          </div>
            <ToastContainer />
        </div>
      </div>
    );
}

export default RestoreAccount