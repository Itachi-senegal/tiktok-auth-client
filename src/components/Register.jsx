import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

export default function Register() {
  // Changé: showModal par défaut à true pour ouvrir automatiquement
  const [showModal, setShowModal] = useState(true);
  const [activeMethod, setActiveMethod] = useState('');

  const connexionTelEmail = `Utiliser le téléphone/l'e-mail/le nom d'utilisateur`;

  // États pour les différentes méthodes
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [phonePassword, setPhonePassword] = useState('');
  const [phoneConfirmPassword, setPhoneConfirmPassword] = useState('');
  const [showPhoneCode, setShowPhoneCode] = useState(false);
  const [phoneTimer, setPhoneTimer] = useState(0);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Timer pour téléphone
  useEffect(() => {
    let timer;
    if (phoneTimer > 0) {
      timer = setTimeout(() => setPhoneTimer(phoneTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [phoneTimer]);

  const handleMethodSelect = (method) => {
    setActiveMethod(method);
  };

  const handleEmailRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/auth/register', { username, email, password });
      alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneRequest = async () => {
    if (!phone || phone.length < 10) {
      alert('Veuillez entrer un numéro de téléphone valide');
      return;
    }

    if (!username || !phonePassword || !phoneConfirmPassword) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (phonePassword !== phoneConfirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    if (phonePassword.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/auth/send-phone-code', { phone });
      setShowPhoneCode(true);
      setPhoneTimer(60);
      alert('Code envoyé par SMS !');
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur envoi SMS');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneRegister = async () => {
    if (!phoneCode) {
      alert('Veuillez entrer le code de vérification');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/auth/register-phone', {
        username,
        phone,
        password: phonePassword,
        code: phoneCode
      });
      alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Code invalide ou inscription échouée');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    window.location.href = `http://localhost:5000/auth/${provider}`;
  };

  // Ajouté: fonction pour gérer la fermeture du modal
  const handleCloseModal = () => {
    setShowModal(false);
    setActiveMethod('');
    setShowPhoneCode(false);
    // Optionnel: rediriger vers la page de connexion quand on ferme
    navigate('/login');
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

      {/* Supprimé: le bouton "S'inscrire à TikTok" n'est plus nécessaire */}

      {/* Modal d'inscription - maintenant affiché par défaut */}
      {showModal && (
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

            {/* Header du modal avec bouton fermer */}
            <div style={{
              paddingTop: '20px',
              paddingBottom: '20px',
              textAlign: 'center',
              position: 'relative',
              flexShrink: 0
            }}>
              {/* Bouton fermer - modifié pour utiliser la nouvelle fonction */}
              <button
                onClick={handleCloseModal}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '5px',
                  zIndex: 1001
                }}
              >
                <div style={{height: '35px' , width:'35px' , borderRadius: '50%', display: 'flex' ,justifyContent: 'center' , alignItems: 'center' ,background: '#1B1B1B'}}>
                    <svg className="css-1bucbi6-5e6d46e3--StyledIcon em9wld5" width="1.5em" data-e2e="" height="1.5em" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M21.1718 23.9999L10.2931 13.1212C9.90261 12.7307 9.90261 12.0975 10.2931 11.707L11.7074 10.2928C12.0979 9.90228 12.731 9.90228 13.1216 10.2928L24.0002 21.1715L34.8789 10.2928C35.2694 9.90228 35.9026 9.90228 36.2931 10.2928L37.7073 11.707C38.0979 12.0975 38.0979 12.7307 37.7073 13.1212L26.8287 23.9999L37.7073 34.8786C38.0979 35.2691 38.0979 35.9023 37.7073 36.2928L36.2931 37.707C35.9026 38.0975 35.2694 38.0975 34.8789 37.707L24.0002 26.8283L13.1216 37.707C12.731 38.0975 12.0979 38.0975 11.7074 37.707L10.2931 36.2928C9.90261 35.9023 9.90261 35.2691 10.2931 34.8786L21.1718 23.9999Z"></path></svg>
                </div>
              </button>

              <h2 style={{
                color: 'white',
                margin: '50px 0 0 0',
                fontSize: '32px',
                fontWeight: '700'
              }}>
                Inscris-toi à TikTok
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
                  {/* Utiliser le téléphone/email/nom d'utilisateur */}
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
                    onClick={() => handleSocialRegister('facebook')}
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
                    onClick={() => handleSocialRegister('google')}
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

                  {/* Onglets Email/Téléphone */}
                  <div style={{
                    display: 'flex',
                    marginBottom: '20px',
                    borderBottom: '1px solid #2f2f2f'
                  }}>
                    <button
                      onClick={() => setShowPhoneCode(false)}
                      style={{
                        flex: 1,
                        background: 'none',
                        border: 'none',
                        color: !showPhoneCode ? '#fe2c55' : '#888',
                        padding: '10px',
                        borderBottom: !showPhoneCode ? '2px solid #fe2c55' : 'none',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Email
                    </button>
                    <button
                      onClick={() => {
                        setShowPhoneCode(true);
                        // Reset phone verification state when switching to phone tab
                        setPhoneCode('');
                        setPhoneTimer(0);
                      }}
                      style={{
                        flex: 1,
                        background: 'none',
                        border: 'none',
                        color: showPhoneCode ? '#fe2c55' : '#888',
                        padding: '10px',
                        borderBottom: showPhoneCode ? '2px solid #fe2c55' : 'none',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Téléphone
                    </button>
                  </div>

                  {/* Inscription Email */}
                  {!showPhoneCode && (
                    <div>
                      <input
                        placeholder="Nom d'utilisateur"
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        style={inputDarkStyle}
                      />
                      <input
                        placeholder="Email"
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
                      <input
                        placeholder="Confirmer le mot de passe"
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        style={inputDarkStyle}
                      />
                      <button
                        onClick={handleEmailRegister}
                        disabled={loading}
                        style={submitButtonStyle}
                      >
                        {loading ? 'Inscription...' : 'S\'inscrire'}
                      </button>
                    </div>
                  )}

                  {/* Inscription Téléphone */}
                  {showPhoneCode && (
                    <div>
                      {phoneCode === '' ? (
                        <>
                          <input
                            placeholder="Nom d'utilisateur"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            style={inputDarkStyle}
                          />
                          <input
                            placeholder="Numéro de téléphone"
                            type="tel"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            style={inputDarkStyle}
                          />
                          <input
                            placeholder="Mot de passe"
                            type="password"
                            value={phonePassword}
                            onChange={e => setPhonePassword(e.target.value)}
                            style={inputDarkStyle}
                          />
                          <input
                            placeholder="Confirmer le mot de passe"
                            type="password"
                            value={phoneConfirmPassword}
                            onChange={e => setPhoneConfirmPassword(e.target.value)}
                            style={inputDarkStyle}
                          />
                          <button
                            onClick={handlePhoneRequest}
                            disabled={loading}
                            style={submitButtonStyle}
                          >
                            {loading ? 'Envoi...' : 'Envoyer le code'}
                          </button>
                        </>
                      ) : (
                        <>
                          <div style={{
                            background: '#2a2a2a',
                            padding: '10px',
                            borderRadius: '4px',
                            marginBottom: '15px',
                            fontSize: '12px',
                            color: '#ccc'
                          }}>
                            Code envoyé au {phone}
                          </div>
                          <input
                            placeholder="Code de vérification"
                            type="text"
                            maxLength="6"
                            value={phoneCode}
                            onChange={e => setPhoneCode(e.target.value.replace(/\D/g, ''))}
                            style={inputDarkStyle}
                          />
                          <button
                            onClick={handlePhoneRegister}
                            disabled={loading}
                            style={submitButtonStyle}
                          >
                            {loading ? 'Vérification...' : 'Finaliser l\'inscription'}
                          </button>
                        </>
                      )}
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

              {/* Lien connexion */}
              <div style={{
                textAlign: 'center',
                marginBottom: '15px'
              }}>
                <span style={{ color: '#888', fontSize: '14px' }}>
                  Tu as déjà un compte ?{' '}
                </span>
                <Link
                  to="/login"
                  onClick={() => setShowModal(false)}
                  style={{
                    color: '#fe2c55',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                  onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                >
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

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