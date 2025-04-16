import React, { useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
// import axios from 'axios';
import axiosInstance from '../config/axiosInstance';

const CaptchaPopup = ({ onVerified }) => {
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleVerify = async (token) => {
    try {
      // 将 hCaptcha token 发送到后端进行验证
      console.log('Token:', token);
      const response = await axiosInstance.post('/api/verify-captcha', { token });
      if (response.status === 200) {
        console.log('Captcha verified successfully:', response.data);
        // 验证成功，通知父组件
        onVerified(true);
        setShowCaptcha(false); // 关闭弹窗
      } else {
        setErrorMessage(response.data.message || 'Captcha verification failed');
      }
    } catch (error) {
      console.error('Error during captcha verification:', error);
      setErrorMessage('An error occurred during captcha verification');
    }
  };

  const handleError = (err) => {
    console.error('Captcha error:', err);
    setErrorMessage('Captcha error occurred');
  };

  return (
    <>
      {showCaptcha && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <h2>Complete CAPTCHA</h2>
            <HCaptcha
              sitekey={'6442267e-f5c6-4c8e-87a4-135a2da4fd3c'} // 替换为您的 hCaptcha site key
              onVerify={handleVerify}
              onError={handleError}
            />
            {errorMessage && <p style={styles.error}>{errorMessage}</p>}
          </div>
        </div>
      )}
      <button onClick={() => setShowCaptcha(true)} style={styles.button}>
        Verify CAPTCHA
      </button>
    </>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};

export default CaptchaPopup;