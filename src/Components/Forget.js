import React , {useEffect} from 'react';
import { initMain } from "../js/main";
import backgroundImage from './img/log.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';

const Forget = () => {


  
  useEffect(() => {
    initMain();
  }, []);


 const handleTogglePassword = (inputId, eyeId, eyeSlashId) => {
  const input = document.getElementById(inputId);
  const eye = document.getElementById(eyeId);
  const eyeSlash = document.getElementById(eyeSlashId);

  if (input.type === 'password') {
   input.type = 'text';
   eye.style.opacity = '0';
   eyeSlash.style.opacity = '1';
  } else {
   input.type = 'password';
   eye.style.opacity = '1';
   eyeSlash.style.opacity = '0';
  }
 };

 const containerStyle = {
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
 };

 return (
  <div>
   <div style={containerStyle}>
    <div className="box">
     <div className="box-login">
      <div className="top-header">
       <h3>SMS</h3>
       <small>We are happy to help you recover your password</small>
      </div>
      <div className="input-group">
       {/* <div className="input-field">
                <input type="text" className="input-box" id="regmail" required />
                <label htmlFor="regEmail">Email address</label>
              </div> */}
       <div className="input-field">
        <input type="password" className="input-box" id="regPassword" required />
        <label htmlFor="regEmail">Old Password</label>
        <div className="eye-area">
         <div className="eye-box" onClick={() => handleTogglePassword('regPassword', 'eye', 'eye-slash')}>
          <FontAwesomeIcon icon={faEye} id="eye" />
          <FontAwesomeIcon icon={faEyeSlash} id="eye-slash" />
         </div>
        </div>
       </div>
       <div className="input-field">
        <input type="password" className="input-box" id="regPassword" required />
        <label htmlFor="regEmail">New Password</label>
        <div className="eye-area">
         <div className="eye-box" onClick={() => handleTogglePassword('regPassword', 'eye', 'eye-slash')}>
          <FontAwesomeIcon icon={faEye} id="eye" />
          <FontAwesomeIcon icon={faEyeSlash} id="eye-slash" />
         </div>
        </div>
       </div>
       <div className="input-field">
        <input type="password" className="input-box" id="regUser" required />
        <label htmlFor="regUser">Confirm Password</label>
        <div className="eye-area">
         <div className="eye-box" onClick={() => handleTogglePassword('regPassword', 'eye', 'eye-slash')}>
          <FontAwesomeIcon icon={faEye} id="eye" />
          <FontAwesomeIcon icon={faEyeSlash} id="eye-slash" />
         </div>
        </div>
       </div>
       <div className="input-field">
        <input type="submit" className="input-submit" value="Recover Password" />
       </div>
      </div>
     </div>
     <div class="switch">
      <a href="/" class="login" >Login</a>
      <a href="/forgetPassword" class="register">Forget Password</a>
      <div class="btn-active" id="btn"></div>
     </div>
    </div>
   </div>
  </div>
 );
};

export default Forget;
