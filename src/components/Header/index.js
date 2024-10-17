import React, { useEffect } from 'react';
import './styles.css';
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';

function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user data is correctly being fetched
    console.log('User Object:', user);
    
    if (user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  function logoutFnc() {
    try {
      signOut(auth)
        .then(() => {
          toast.success('Logged Out Successfully!');
          navigate('/');
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="navbar">
      <p className="logo">SpendSmart.</p>
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Check if photoURL exists, otherwise fall back to the icon */}
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="User"
              style={{ borderRadius: '50%', height: '2rem', width: '2rem' }}
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-user"
              style={{ color: '#fff' }}
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          )}

          {/* Logout Link */}
          <p onClick={logoutFnc} className="logo link" style={{ cursor: 'pointer' }}>
            Logout
          </p>
        </div>
      )}
    </div>
  );
}

export default Header;
