import backgroundImage from "./img/log.jpg";
import { initMain } from "../js/main";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import "./login.css";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const login = async () => {
    console.warn(email, password);
    let item = { email, password };
    let request = {
      meta: {
        action: "0",
        source: "web",
      },
      data: item,
    };

    try {
      let result = await fetch(
        "https://sms-penetralia.azurewebsites.net/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(request),
        }
      );

      if (!result.ok) {
        setError("Unable to authenticate your email and password.");
        return;
      }

      result = await result.json();
      const userInfo = result;
      localStorage.setItem("userInfo", JSON.stringify(result));
      console.log(userInfo);
      const getUserInfo = localStorage.getItem("userInfo");
      console.log(getUserInfo);
      if (getUserInfo) {
        try {
          if (
            userInfo &&
            userInfo.data &&
            userInfo.data.roles &&
            userInfo.data.roles.length > 0
          ) {
            const userRole = userInfo.data.roles[0];

            if (userRole) {
              switch (userRole) {
                case "ADMIN":
                  navigate("/admin");
                  break;
                case "TEACHER":
                  navigate("/teacherDashboard");
                  break;
                case "PARENT":
                  navigate("/parentDashboard");
                  break;
                case "STUDENT":
                  navigate("/studentDashboard");
                  break;
                default:
                  console.error("Invalid role:", userRole);
                  break;
              }
            } else {
              console.error("Invalid role:", userRole);
            }
          } else {
            console.error("Invalid user data:", userInfo);
          }
        } catch (error) {
          console.error("Error parsing user information:", error);
        }
      } else {
        console.error("User information not found in local storage");
      }
    } catch (error) {
      setError("An error occurred during sign in. Please try again.");
    }
  };

  useEffect(() => {
    setEmail("");
    setPassword("");
    setError("");
  }, []);

  useEffect(() => {
    initMain();
  }, []);

  const handleTogglePassword = (inputId, eyeId, eyeSlashId) => {
    const input = document.getElementById(inputId);
    const eye = document.getElementById(eyeId);
    const eyeSlash = document.getElementById(eyeSlashId);

    if (input.type === "password") {
      input.type = "text";
      eye.style.opacity = "0";
      eyeSlash.style.opacity = "1";
    } else {
      input.type = "password";
      eye.style.opacity = "1";
      eyeSlash.style.opacity = "0";
    }
  };

  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div>
      <div style={containerStyle}>
        <div className="box">
          <div className="box-login">
            <div className="top-header">
              <h3>SMS</h3>
              {error ? (
                <small>{error}</small>
              ) : (
                <small>Innovation for Education</small>
              )}
            </div>
            <div className="input-group">
              <div className="input-field">
                <input
                  type="text"
                  className="input-box"
                  id="logEmail"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="logEmail">Email address</label>
              </div>
              <div className="input-field">
                <input
                  type="password"
                  className="input-box"
                  id="logPassword"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="logPassword">Password</label>
                <div className="eye-area">
                  <div
                    className="eye-box"
                    onClick={() =>
                      handleTogglePassword(
                        "logPassword",
                        "eye-2",
                        "eye-slash-2"
                      )
                    }
                  >
                    <FontAwesomeIcon icon={faEye} id="eye-2" />
                    <FontAwesomeIcon icon={faEyeSlash} id="eye-slash-2" />
                  </div>
                </div>
              </div>
              <div className="remember">
                <input type="checkbox" id="formCheck" className="check" />
                <label htmlFor="formCheck">Remember Me</label>
              </div>
              <div className="input-field">
                <input
                  type="submit"
                  className="input-submit"
                  value="Sign In"
                  onClick={login}
                />
              </div>
              {/* <div className="forgot">
                <a href="/#">Forgot password?</a>
              </div> */}
            </div>
          </div>
          {/* <div className={isLoginActive ? 'box-register' : ''}>
            <div className="top-header">
              <h3>Sign Up</h3>
              <small>We are happy to have you sign up.</small>
            </div>
            <div className="input-group">
              <div className="input-field">
                <input type="text" className="input-box" id="regUser" required />
                <label htmlFor="regUser">Username</label>
              </div>
              <div className="input-field">
                <input type="text" className="input-box" id="regmail" required />
                <label htmlFor="regEmail">Email address</label>
              </div>
              <div className="input-field">
                <input type="password" className="input-box" id="regPassword" required />
                <label htmlFor="regEmail">Password</label>
                <div className="eye-area">
                  <div className="eye-box" onClick={() => handleTogglePassword('regPassword', 'eye', 'eye-slash')}>
                    <FontAwesomeIcon icon={faEye} id="eye" />
                    <FontAwesomeIcon icon={faEyeSlash} id="eye-slash" />
                  </div>
                </div>
              </div>
              <div className="remember">
                <input type="checkbox" id="formcheck-2" className="check" />
                <label htmlFor="formcheck-2">Remember Me</label>
              </div>
              <div className="input-field">
                <input type="submit" className="input-submit" value="Sign Up" />
              </div>
            </div>
          </div> */}
          <div class="switch">
            <a href="/login" class="login">
              Login
            </a>
            <a href="/forgetPassword" class="register">
              Forget Password
            </a>
            <div class="btn-active" id="btn"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
