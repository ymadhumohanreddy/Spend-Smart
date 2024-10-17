import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import SignupSigninComponent from '../components/SignupSignin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

function Signup() {
  const [message, setMessage] = useState("Make it Happen!");

  const messages = [
    "Make it Happen!",                    // English
    "Fais-le arriver!",                   // French
    "¡Hazlo suceder!",                    // Spanish
    "Mach es geschehen!",                 // German
    "Faça acontecer!"                     // Portuguese
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage((prev) => {
        const currentIndex = messages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div className='wrapper' style={{ flex: '1', marginBottom: '0' }}>
        <SignupSigninComponent />
      </div>
      {/* Footer section */}
      <footer style={{ textAlign: 'center', padding: '10px', margin: '0', fontSize: '14px', color: '#555' }}>
        <p>{message}</p>
        <p>
          <a href="https://www.linkedin.com/in/madhu-yeddula-469583274/" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px' }}>
            <FontAwesomeIcon icon={faLinkedin} size="lg" color="#31d37d" />
          </a>
          <a href="https://github.com/ymadhumohanreddy" target="_blank" rel="noopener noreferrer" style={{ margin: '0 10px' }}>
            <FontAwesomeIcon icon={faGithub} size="lg" color="#31d37d" />
          </a>
        </p>
      </footer>
    </div>
  );
}

export default Signup;
