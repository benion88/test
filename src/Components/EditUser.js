import React, { useEffect, useState } from "react";
import { initMain } from "../js/main";
import logo1 from "./img/logo1.png";
import penetralia from "./img/penetralia.jpg";
import admin from "./img/figure/admin.jpg";
import student12 from "./img/figure/student12.png";
import student13 from "./img/figure/student13.png";
import student11 from "./img/figure/student11.png";
import user1 from "./img/figure/user1.jpg";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const EditUser = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [middlename, setMiddleName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [religion, setReligion] = useState("");
  const [idno, setIdNo] = useState("");
  const [dateofbirth, setDateOfBirth] = useState("");
  const [joiningdate, setJoiningDate] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isParent, setIsParent] = useState(false);

  const { userId } = useParams();

    const defaultRoleName = "defaultRoleName";
   

  const roles = {
    1: "STUDENT",
    2: "PARENT",
    3: "ADMIN",
    4: "TEACHER",
  };

  const ReSet = () => {
    setAddress("");
    setDateOfBirth("");
    setEmail("");
    setError("");
    setFirstName("");
    setGender("");
    setIdNo("");
    setJoiningDate("");
    setLastName("");
    setMessage("");
    setMiddleName("");
    setPhone("");
    setReligion("");
    setSelectedRole("");
    setEmailError("");
    setErrorMessage("");
  };

  useEffect(() => {
    setSelectedUserId(userId);
  }, [userId, setSelectedUserId]);

  const handleLogout = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("userInfo");
    const userAuthToken = JSON.parse(authToken);
    const refresh_token = userAuthToken.data.refresh_token;
    const token = userAuthToken.data.access_token;
    console.log("refresh_token :" + refresh_token);
    console.log("token :" + token);

    try {
      const response = await fetch(
        "https://sms-penetralia.azurewebsites.net/api/auth/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            meta: {
              source: "web",
            },
            data: {
              refresh_token: refresh_token,
            },
          }),
        }
      );

      if (response.ok) {
        // Perform any cleanup tasks (e.g., removing tokens from local storage)
        localStorage.removeItem("userInfo");
        // Redirect to the login page
        navigate("/");
      } else {
        // Handle logout error
        console.error("Logout failed");
        // Display a user-friendly error message
        alert("Logout failed. Please try again later.");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
      // Display a user-friendly error message
      alert("An error occurred during logout. Please try again later.");
    }
  };

  // const isFormValid = () => {
  //   return (
  //     firstname.trim() !== "" &&
  //     lastname.trim() !== "" &&
  //     phone.trim() !== "" &&
  //     address.trim() !== "" &&
  //     email.trim() !== "" &&
  //     gender.trim() !== "" &&
  //     religion.trim() !== "" &&
  //     idno.trim() !== "" &&
  //     dateofbirth.trim() !== "" &&
  //     joiningdate.trim() !== "" &&
  //     selectedRole.trim() !== ""
  //   );
  // };

  const handleInputChange = (e) => {
    const enteredValue = e.target.value;
    if (!isNaN(enteredValue) || enteredValue === "") {
      setPhone(enteredValue);
      setErrorMessage("");
    } else {
      setErrorMessage("Only numbers are allowed.");
    }
  };

  const handleEmailInputChange = (e) => {
    const enteredValue = e.target.value;
    setEmail(enteredValue);
    if (!isValidEmail(enteredValue)) {
      setEmailError("Not a valid email");
    } else {
      setEmailError("");
    }
  };

  const isValidEmail = (email) => {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const authToken = localStorage.getItem("userInfo");
    const userAuthToken = JSON.parse(authToken);
    const roles = userAuthToken.data.roles;

    // Check if 'ADMIN' role exists in the roles array
    setIsAdmin(roles.includes("ADMIN"));

    // Check if 'STUDENT' role exists in the roles array
    setIsStudent(roles.includes("STUDENT"));

    // Check if 'TEACHER' role exists in the roles array
    setIsTeacher(roles.includes("TEACHER"));

    // Check if 'PARENT' role exists in the roles array
    setIsParent(roles.includes("PARENT"));
  }, []);

  const disable = () => {
    const authToken = localStorage.getItem("userInfo");
    const userAuthToken = JSON.parse(authToken);
    const role = userAuthToken.data.roles;

    switch (role) {
      case "admin":
        return true;
      case "student":
        return true;
      case "parent":
        return true;
      case "teacher":
        return true;
      default:
        return false;
    }
  };

  useEffect(() => {
    if (isAdmin) {
      initMain();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isStudent) {
      initMain();
    }
  }, [isStudent]);

  useEffect(() => {
    if (isParent) {
      initMain();
    }
  }, [isParent]);

  useEffect(() => {
    if (isTeacher) {
      initMain();
    }
  }, [isTeacher]);



  useEffect(() => {
    if (selectedUserId !== null && selectedUserId !== undefined) {
      console.log("Current id:", selectedUserId);

      const fetchData = async () => {
        try {
          const authToken = localStorage.getItem("userInfo");

          if (authToken) {
            try {
              const userAuthToken = JSON.parse(authToken);

              // Check if userAuthToken, userAuthToken.data, and userAuthToken.data.access_token are defined
              if (userAuthToken && userAuthToken.data) {
                const token = userAuthToken.data.access_token;

                const response = await fetch(
                  `https://sms-penetralia.azurewebsites.net/api/user/user/${selectedUserId}`,
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                if (!response.ok) {
                  console.log(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                console.log(result);
                if (result && result.data && typeof result.data === "object") {
                  setUser(result.data);
                  console.log(user);
                } else {
                  console.log("Invalid data structure:", result);
                }
              } else {
                setError("User authentication data is missing or invalid.");
              }
            } catch (parseError) {
              setError("Error parsing user authentication data:", parseError);
            }
          }
        } catch (error) {
          setError("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [selectedUserId]);



  useEffect(() => {
    if (user) {
      setFirstName(user.firstname || "");
      setLastName(user.lastname || "");
      setMiddleName(user.middlename || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setEmail(user.email || "");
      setGender(user.gender || "");
      setReligion(user.religion || "");
      setIdNo(user.idno || "");
      setDateOfBirth(user.dateofbirth || "");
      setJoiningDate(user.joiningdate || "");
      setSelectedRole(
        Array.isArray(user.roles) && user.roles.length > 0
          ? user.roles.map((role) => role.name)
          : [defaultRoleName]
      );
    }
  }, [user, defaultRoleName]);

   


const updatedUser = {
  firstname,
  lastname,
  middlename,
  phone,
  address,
  email,
  gender,
  religion,
  idno,
  dateofbirth,
  joiningdate,
  roles: [roles[selectedRole]],
};

// Set the initial updatedUser state to the current user data

const requestE = {
  meta: {
    action: "0",
    source: "web",
  },
  data: updatedUser,
};


  
  const UpdateUser = async (e) => {
    e.preventDefault();
    console.log(updatedUser);

    try {
      const authToken = localStorage.getItem("userInfo");

      if (!authToken) {
        setError("User authentication data is missing.");
        return;
      }

      try {
        const userAuthToken = JSON.parse(authToken);

        if (
          !userAuthToken ||
          !userAuthToken.data ||
          !userAuthToken.data.access_token
        ) {
          setError("Invalid user authentication data format.");
          return;
        }

        const token = userAuthToken.data.access_token;
        console.log(token);

        // Ensure that request is defined before using it

        const response = await fetch(
          `https://sms-penetralia.azurewebsites.net/api/user/update/${selectedUserId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestE),

          }
        );

        if (!response.ok) {
          console.error(`HTTP error! Status: ${response.status}`);
        } else {
          setMessage(
            `User with ID ${selectedUserId} has been updated successfully.`
          );
          // Update UI or state after a successful update
        }
      } catch (parseError) {
        setError("Error parsing user authentication data:", parseError);
      }
    } catch (error) {
      setError("Error updating user:", error);
      // Handle errors or display a message to the user
    }
  };

 

  // Updated User Data state
 

    useEffect(()=>{
    console.log(updatedUser);
  
    })


  return (
    <div>
      {/* <div id="preloader"></div> */}
      <div id="wrapper" class="wrapper bg-ash">
        <div class="navbar navbar-expand-md header-menu-one bg-light">
          <div class="nav-bar-header-one">
            <div class="header-logo">
              <a href="index.html">
                <img src={penetralia} alt="logo" width="70px" height="70px" />
              </a>
            </div>
            <div class="toggle-button sidebar-toggle">
              <button type="button" class="item-link">
                <span class="btn-icon-wrap">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>
            </div>
          </div>
          <div class="d-md-none mobile-nav-bar">
            <button
              class="navbar-toggler pulse-animation"
              type="button"
              data-toggle="collapse"
              data-target="#mobile-navbar"
              aria-expanded="false"
            >
              <i class="far fa-arrow-alt-circle-down"></i>
            </button>
            <button type="button" class="navbar-toggler sidebar-toggle-mobile">
              <i class="fas fa-bars"></i>
            </button>
          </div>
          <div
            class="header-main-menu collapse navbar-collapse"
            id="mobile-navbar"
          >
            <ul class="navbar-nav">
              <li class="navbar-item header-search-bar">
                <div class="input-group stylish-input-group">
                  <span class="input-group-addon">
                    <button type="submit">
                      <span class="flaticon-search" aria-hidden="true"></span>
                    </button>
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Find Something . . ."
                  />
                </div>
              </li>
            </ul>
            <ul class="navbar-nav">
              <li class="navbar-item dropdown header-admin">
                <a
                  class="navbar-nav-link dropdown-toggle"
                  href="/#"
                  role="button"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div class="admin-title">
                    <h5 class="item-title">Stevne Zone</h5>
                    <span>Admin</span>
                  </div>
                  <div class="admin-img">
                    <img src={admin} alt="Admin" />
                  </div>
                </a>
                <div class="dropdown-menu dropdown-menu-right">
                  <div class="item-header">
                    <h6 class="item-title">Steven Zone</h6>
                  </div>
                  <div class="item-content">
                    <ul class="settings-list">
                      <li>
                        <a href="/#">
                          <i class="flaticon-user"></i>My Profile
                        </a>
                      </li>
                      <li>
                        <a href="/#">
                          <i class="flaticon-list"></i>Task
                        </a>
                      </li>
                      <li>
                        <a href="/#">
                          <i class="flaticon-chat-comment-oval-speech-bubble-with-text-lines"></i>
                          Message
                        </a>
                      </li>
                      <li>
                        <a href="/#">
                          <i class="flaticon-gear-loading"></i>Account Settings
                        </a>
                      </li>
                      <li>
                        <a href="" onClick={handleLogout}>
                          <i class="flaticon-turn-off"></i>Log Out
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
              <li class="navbar-item dropdown header-message">
                <a
                  class="navbar-nav-link dropdown-toggle"
                  href="/#"
                  role="button"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i class="far fa-envelope"></i>
                  <div class="item-title d-md-none text-16 mg-l-10">
                    Message
                  </div>
                  <span>5</span>
                </a>

                <div class="dropdown-menu dropdown-menu-right">
                  <div class="item-header">
                    <h6 class="item-title">05 Message</h6>
                  </div>
                  <div class="item-content">
                    <div class="media">
                      <div class="item-img bg-skyblue author-online">
                        <img src={student11} alt="img" />
                      </div>
                      <div class="media-body space-sm">
                        <div class="item-title">
                          <a href="/#">
                            <span class="item-name">Maria Zaman</span>
                            <span class="item-time">18:30</span>
                          </a>
                        </div>
                        <p>
                          What is the reason of buy this item. Is it usefull for
                          me.....
                        </p>
                      </div>
                    </div>
                    <div class="media">
                      <div class="item-img bg-yellow author-online">
                        <img src={student12} alt="img" />
                      </div>
                      <div class="media-body space-sm">
                        <div class="item-title">
                          <a href="/#">
                            <span class="item-name">Benny Roy</span>
                            <span class="item-time">10:35</span>
                          </a>
                        </div>
                        <p>
                          What is the reason of buy this item. Is it usefull for
                          me.....
                        </p>
                      </div>
                    </div>
                    <div class="media">
                      <div class="item-img bg-pink">
                        <img src={student13} alt="img" />
                      </div>
                      <div class="media-body space-sm">
                        <div class="item-title">
                          <a href="/#">
                            <span class="item-name">Steven</span>
                            <span class="item-time">02:35</span>
                          </a>
                        </div>
                        <p>
                          What is the reason of buy this item. Is it usefull for
                          me.....
                        </p>
                      </div>
                    </div>
                    <div class="media">
                      <div class="item-img bg-violet-blue">
                        <img src={student11} alt="img" />
                      </div>
                      <div class="media-body space-sm">
                        <div class="item-title">
                          <a href="/#">
                            <span class="item-name">Joshep Joe</span>
                            <span class="item-time">12:35</span>
                          </a>
                        </div>
                        <p>
                          What is the reason of buy this item. Is it usefull for
                          me.....
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li class="navbar-item dropdown header-notification">
                <a
                  class="navbar-nav-link dropdown-toggle"
                  href="/#"
                  role="button"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i class="far fa-bell"></i>
                  <div class="item-title d-md-none text-16 mg-l-10">
                    Notification
                  </div>
                  <span>8</span>
                </a>

                <div class="dropdown-menu dropdown-menu-right">
                  <div class="item-header">
                    <h6 class="item-title">03 Notifiacations</h6>
                  </div>
                  <div class="item-content">
                    <div class="media">
                      <div class="item-icon bg-skyblue">
                        <i class="fas fa-check"></i>
                      </div>
                      <div class="media-body space-sm">
                        <div class="post-title">Complete Today Task</div>
                        <span>1 Mins ago</span>
                      </div>
                    </div>
                    <div class="media">
                      <div class="item-icon bg-orange">
                        <i class="fas fa-calendar-alt"></i>
                      </div>
                      <div class="media-body space-sm">
                        <div class="post-title">Director Metting</div>
                        <span>20 Mins ago</span>
                      </div>
                    </div>
                    <div class="media">
                      <div class="item-icon bg-violet-blue">
                        <i class="fas fa-cogs"></i>
                      </div>
                      <div class="media-body space-sm">
                        <div class="post-title">Update Password</div>
                        <span>45 Mins ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li class="navbar-item dropdown header-language">
                <a
                  class="navbar-nav-link dropdown-toggle"
                  href="/#"
                  role="button"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i class="fas fa-globe-americas"></i>EN
                </a>
                <div class="dropdown-menu dropdown-menu-right">
                  <a class="dropdown-item" href="/#">
                    English
                  </a>
                  <a class="dropdown-item" href="/#">
                    Spanish
                  </a>
                  <a class="dropdown-item" href="/#">
                    Franchis
                  </a>
                  <a class="dropdown-item" href="/#">
                    Chiness
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="dashboard-page-one">
          <div class="sidebar-main sidebar-menu-one sidebar-expand-md sidebar-color">
            <div class="mobile-sidebar-header d-md-none">
              <div class="header-logo">
                <a href="index.html">
                  <img src={logo1} alt="logo" />
                </a>
              </div>
            </div>
            {isAdmin ? (
              <>
                {/* Elements to render if user is admin */}
                <div
                  className="sidebar-menu-content"
                  style={{ backgroundColor: "black" }}
                >
                  <ul
                    className="nav nav-sidebar-menu sidebar-toggle-view"
                    style={{ backgroundColor: "black" }}
                  >
                    <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link ">
                        <i className="flaticon-dashboard"></i>
                        <span>Dashboard</span>
                      </a>
                      <ul className="nav sub-group-menu">
                        <li className="nav-item">
                          <a href="/admin" className="nav-link menu-active">
                            <i className="fas fa-angle-right"></i>Admin
                          </a>
                        </li>
                        {disable() && (
                          <>
                            <li className="nav-item">
                              <a href="/studentDashboard" className="nav-link">
                                <i className="fas fa-angle-right"></i>Students
                              </a>
                            </li>
                            <li className="nav-item">
                              <a href="/parentDashboard" className="nav-link">
                                <i className="fas fa-angle-right"></i>Parents
                              </a>
                            </li>
                            <li className="nav-item">
                              <a href="/teacherDashboard" className="nav-link">
                                <i className="fas fa-angle-right"></i>Teachers
                              </a>
                            </li>
                          </>
                        )}
                      </ul>
                    </li>
                    <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-classmates"></i>
                        <span>Students</span>
                      </a>
                      <ul className="nav sub-group-menu">
                        <li className="nav-item">
                          <a href="/allStudent" className="nav-link">
                            <i className="fas fa-angle-right"></i>All Students
                          </a>
                        </li>
                        {disable() && (
                          <li className="nav-item">
                            <a href="/studentDetails" className="nav-link">
                              <i className="fas fa-angle-right"></i>Student
                              Details
                            </a>
                          </li>
                        )}
                        <li className="nav-item">
                          <a href="/admissionForm" className="nav-link">
                            <i className="fas fa-angle-right"></i>Admission Form
                          </a>
                        </li>
                        <li className="nav-item">
                          <a href="/studentPromotion" className="nav-link">
                            <i className="fas fa-angle-right"></i>Student
                            Promotion
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-multiple-users-silhouette"></i>
                        <span>Teachers</span>
                      </a>
                      <ul className="nav sub-group-menu">
                        <li className="nav-item">
                          <a href="/allTeacher" className="nav-link">
                            <i className="fas fa-angle-right"></i>All Teachers
                          </a>
                        </li>
                        {disable() && (
                          <li className="nav-item">
                            <a href="/teacherDetails/{id}" className="nav-link">
                              <i className="fas fa-angle-right"></i>Teacher
                              Details
                            </a>
                          </li>
                        )}
                        <li className="nav-item">
                          <a href="/addTeacher" className="nav-link">
                            <i className="fas fa-angle-right"></i>Add Teacher
                          </a>
                        </li>
                        <li className="nav-item">
                          <a href="/teacherPayment" className="nav-link">
                            <i className="fas fa-angle-right"></i>Teacher
                            Payment
                          </a>
                        </li>
                        <li class="nav-item">
                          <a href="/addTeacherPayment" class="nav-link">
                            <i class="fas fa-angle-right"></i>Add Payment
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-couple"></i>
                        <span>Parents</span>
                      </a>
                      <ul className="nav sub-group-menu">
                        <li className="nav-item">
                          <a href="/allParent" className="nav-link">
                            <i className="fas fa-angle-right"></i>All Parents
                          </a>
                        </li>
                        {disable() && (
                          <li className="nav-item">
                            <a href="/parentDetails/{id}" className="nav-link">
                              <i className="fas fa-angle-right"></i>Parents
                              Details
                            </a>
                          </li>
                        )}
                        <li className="nav-item">
                          <a href="/addParent" className="nav-link">
                            <i className="fas fa-angle-right"></i>Add Parent
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-books"></i>
                        <span>Library</span>
                      </a>
                      <ul className="nav sub-group-menu">
                        <li className="nav-item">
                          <a href="/allBook" className="nav-link">
                            <i className="fas fa-angle-right"></i>All Book
                          </a>
                        </li>
                        <li className="nav-item">
                          <a href="/addBook" className="nav-link">
                            <i className="fas fa-angle-right"></i>Add New Book
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-technological"></i>
                        <span>Payment</span>
                      </a>
                      <ul className="nav sub-group-menu">
                        <li className="nav-item">
                          <a href="/allFeesCollection" className="nav-link">
                            <i className="fas fa-angle-right"></i>All Fees
                            Collection
                          </a>
                        </li>
                        <li class="nav-item">
                          <a href="/addFees" class="nav-link">
                            <i class="fas fa-angle-right"></i>Add Fees
                            Collection
                          </a>
                        </li>
                        <li className="nav-item">
                          <a href="/allExpense" className="nav-link">
                            <i className="fas fa-angle-right"></i>All Expenses
                          </a>
                        </li>
                        <li className="nav-item">
                          <a href="/addExpense" className="nav-link">
                            <i className="fas fa-angle-right"></i>Add Expenses
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-maths-class-materials-cross-of-a-pencil-and-a-ruler"></i>
                        <span>Class</span>
                      </a>
                      <ul className="nav sub-group-menu">
                        <li className="nav-item">
                          <a href="/allClass" className="nav-link">
                            <i className="fas fa-angle-right"></i>All Class
                          </a>
                        </li>
                        <li className="nav-item">
                          <a href="/addClass" className="nav-link">
                            <i className="fas fa-angle-right"></i>Add New Class
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li
                      className="nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="/subject" className="nav-link">
                        <i className="flaticon-open-book"></i>
                        <span>Subject</span>
                      </a>
                    </li>
                    <li
                      className="nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="/classRoutine" className="nav-link">
                        <i className="flaticon-calendar"></i>
                        <span>Class Routine</span>
                      </a>
                    </li>
                    <li
                      className="nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="/attendence" className="nav-link">
                        <i className="flaticon-checklist"></i>
                        <span>Attendence</span>
                      </a>
                    </li>
                    <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-shopping-list"></i>
                        <span>Exam</span>
                      </a>
                      <ul className="nav sub-group-menu">
                        <li className="nav-item">
                          <a href="/exam-schedule" className="nav-link">
                            <i className="fas fa-angle-right"></i>Exam Schedule
                          </a>
                        </li>
                        <li className="nav-item">
                          <a href="/exam-grade" className="nav-link">
                            <i className="fas fa-angle-right"></i>Exam Grades
                          </a>
                        </li>
                        <li class="nav-item">
                          <a href="/exam-result" class="nav-link">
                            <i class="fas fa-angle-right"></i>Exam Result
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li
                      className="nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="/transport" className="nav-link">
                        <i className="flaticon-bus-side-view"></i>
                        <span>Transport</span>
                      </a>
                    </li>
                    <li
                      className="nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="/hostel" className="nav-link">
                        <i className="flaticon-bed"></i>
                        <span>Hostel</span>
                      </a>
                    </li>
                    <li
                      className="nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="/notice" className="nav-link">
                        <i className="flaticon-script"></i>
                        <span>Notice</span>
                      </a>
                    </li>
                    <li
                      className="nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="/messaging" className="nav-link">
                        <i className="flaticon-chat"></i>
                        <span>Messeage</span>
                      </a>
                    </li>
                    <li
                      className="nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="/map.html" className="nav-link">
                        <i className="flaticon-planet-earth"></i>
                        <span>Map</span>
                      </a>
                    </li>
                    <li
                      className="nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="/setting" className="nav-link">
                        <i className="flaticon-settings"></i>
                        <span>Users Setting</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </>
            ) : isStudent ? (
              <>
                {/* Elements to render if user is student */}
                <div className="sidebar-menu-content">
                  <ul className="nav nav-sidebar-menu sidebar-toggle-view">
                    <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-dashboard"></i>
                        <span>Dashboard</span>
                      </a>
                      <ul className="nav sub-group-menu sub-group-active">
                        <li className="nav-item">
                          <a
                            href="/studentDashboard"
                            className="nav-link menu-active"
                          >
                            <i className="fas fa-angle-right"></i>Students
                          </a>
                        </li>
                        {disable() && (
                          <>
                            <li className="nav-item">
                              <a href="/admin" className="nav-link">
                                <i className="fas fa-angle-right"></i>Admin
                              </a>
                            </li>
                            <li className="nav-item">
                              <a href="/parentDashboard" className="nav-link">
                                <i className="fas fa-angle-right"></i>Parents
                              </a>
                            </li>
                            <li className="nav-item">
                              <a href="/teacherDashboard" className="nav-link">
                                <i className="fas fa-angle-right"></i>Teachers
                              </a>
                            </li>
                          </>
                        )}
                      </ul>
                    </li>
                    {/* <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-classmates"></i>
                        <span>Students</span>
                      </a>
                      {disable() && (
                        <ul className="nav sub-group-menu">
                          <li className="nav-item">
                            <a href="/allStudent" className="nav-link">
                              <i className="fas fa-angle-right"></i>All Students
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/studentDetails" className="nav-link">
                              <i className="fas fa-angle-right"></i>Student
                              Details
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/admissionForm" className="nav-link">
                              <i className="fas fa-angle-right"></i>Admission
                              Form
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/studentPromotion" className="nav-link">
                              <i className="fas fa-angle-right"></i>Student
                              Promotion
                            </a>
                          </li>
                        </ul>
                      )}
                    </li> */}
                    {/* <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-multiple-users-silhouette"></i>
                        <span>Teachers</span>
                      </a>
                      {disable() && (
                        <ul className="nav sub-group-menu">
                          <li className="nav-item">
                            <a href="/allTeacher" className="nav-link">
                              <i className="fas fa-angle-right"></i>All Teachers
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/teacherDetails/{id}" className="nav-link">
                              <i className="fas fa-angle-right"></i>Teacher
                              Details
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/addTeacher" className="nav-link">
                              <i className="fas fa-angle-right"></i>Add Teacher
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/teacherPayment" className="nav-link">
                              <i className="fas fa-angle-right"></i>Teacher
                              Payment
                            </a>
                          </li>
                          <li class="nav-item">
                            <a href="/addTeacherPayment" class="nav-link">
                              <i class="fas fa-angle-right"></i>Add Payment
                            </a>
                          </li>
                        </ul>
                      )}
                    </li> */}
                    {/* <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-couple"></i>
                        <span>Parents</span>
                      </a>
                      {disable() && (
                        <ul className="nav sub-group-menu">
                          <li className="nav-item">
                            <a href="/allParent" className="nav-link">
                              <i className="fas fa-angle-right"></i>All Parents
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/parentDetails/{id}" className="nav-link">
                              <i className="fas fa-angle-right"></i>Parents
                              Details
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/addParent" className="nav-link">
                              <i className="fas fa-angle-right"></i>Add Parent
                            </a>
                          </li>
                        </ul>
                      )}
                    </li> */}
                    <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-books"></i>
                        <span>Library</span>
                      </a>
                      <ul className="nav sub-group-menu">
                        <li className="nav-item">
                          <a href="/allBook" className="nav-link">
                            <i className="fas fa-angle-right"></i>All Book
                          </a>
                        </li>
                        {disable() && (
                          <li className="nav-item">
                            <a href="/addBook" className="nav-link">
                              <i className="fas fa-angle-right"></i>Add New Book
                            </a>
                          </li>
                        )}
                      </ul>
                    </li>
                    <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-technological"></i>
                        <span>Payment</span>
                      </a>
                      <ul className="nav sub-group-menu">
                        <li className="nav-item">
                          <a href="/allFeesCollection" className="nav-link">
                            <i className="fas fa-angle-right"></i>All Fees
                            Collection
                          </a>
                        </li>
                        {disable() && (
                          <li class="nav-item">
                            <a href="/addFees" class="nav-link">
                              <i class="fas fa-angle-right"></i>Add Fees
                              Collection
                            </a>
                          </li>
                        )}
                        {disable() && (
                          <li className="nav-item">
                            <a href="/allExpense" className="nav-link">
                              <i className="fas fa-angle-right"></i>All Expenses
                            </a>
                          </li>
                        )}
                        {disable() && (
                          <li className="nav-item">
                            <a href="/addExpense" className="nav-link">
                              <i className="fas fa-angle-right"></i>Add Expenses
                            </a>
                          </li>
                        )}
                      </ul>
                    </li>
                    <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-maths-class-materials-cross-of-a-pencil-and-a-ruler"></i>
                        <span>class</span>
                      </a>
                      <ul className="nav sub-group-menu">
                        <li className="nav-item">
                          <a href="/allClass" className="nav-link">
                            <i className="fas fa-angle-right"></i>All class
                          </a>
                        </li>
                        {disable() && (
                          <li className="nav-item">
                            <a href="/addClass" className="nav-link">
                              <i className="fas fa-angle-right"></i>Add New
                              class
                            </a>
                          </li>
                        )}
                      </ul>
                    </li>
                    <li
                      className="nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="/subject" className="nav-link">
                        <i className="flaticon-open-book"></i>
                        <span>Subject</span>
                      </a>
                    </li>
                    <li
                      className="nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="/classRoutine" className="nav-link">
                        <i className="flaticon-calendar"></i>
                        <span>class Routine</span>
                      </a>
                    </li>
                    <li
                      className="nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="/attendence" className="nav-link">
                        <i className="flaticon-checklist"></i>
                        <span>Attendence</span>
                      </a>
                    </li>
                    <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-shopping-list"></i>
                        <span>Exam</span>
                      </a>
                      <ul className="nav sub-group-menu">
                        <li className="nav-item">
                          <a href="/exam-schedule" className="nav-link">
                            <i className="fas fa-angle-right"></i>Exam Schedule
                          </a>
                        </li>
                        {disable() && (
                          <li className="nav-item">
                            <a href="/exam-grade" className="nav-link">
                              <i className="fas fa-angle-right"></i>Exam Grades
                            </a>
                          </li>
                        )}
                        {disable() && (
                          <li class="nav-item">
                            <a href="/exam-result" class="nav-link">
                              <i class="fas fa-angle-right"></i>Exam Result
                            </a>
                          </li>
                        )}
                      </ul>
                    </li>
                    <li
                      className="nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="/transport" className="nav-link">
                        <i className="flaticon-bus-side-view"></i>
                        <span>Transport</span>
                      </a>
                    </li>
                    <li
                      className="nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="/hostel" className="nav-link">
                        <i className="flaticon-bed"></i>
                        <span>Hostel</span>
                      </a>
                    </li>
                    {disable() && (
                      <li
                        className="nav-item"
                        style={{ backgroundColor: "black" }}
                      >
                        <a href="/notice" className="nav-link">
                          <i className="flaticon-script"></i>
                          <span>Notice</span>
                        </a>
                      </li>
                    )}
                    <li
                      className="nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="/messaging" className="nav-link">
                        <i className="flaticon-chat"></i>
                        <span>Messeage</span>
                      </a>
                    </li>
                    {/* <li
                      className="nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="/map.html" className="nav-link">
                        <i className="flaticon-planet-earth"></i>
                        <span>Map</span>
                      </a>
                    </li> */}
                    {disable() && (
                      // <li
                      //   className="nav-item"
                      //   style={{ backgroundColor: "black" }}
                      // >
                      //   <a href="/setting" className="nav-link">
                      //     <i className="flaticon-settings"></i>
                      //     <span>User Settings</span>
                      //   </a>
                      // </li>
                      <a href=""></a>
                    )}
                  </ul>
                </div>
              </>
            ) : isParent ? (
              <>
                {/* Elements to render if user is parent */}
                <div className="sidebar-menu-content">
                  <ul className="nav nav-sidebar-menu sidebar-toggle-view">
                    <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-dashboard"></i>
                        <span>Dashboard</span>
                      </a>
                      <ul className="nav sub-group-menu sub-group-active">
                        <li className="nav-item">
                          <a
                            href="/parentDashboard"
                            className="nav-link menu-active"
                          >
                            <i className="fas fa-angle-right"></i>Parents
                          </a>
                        </li>
                        {disable() && (
                          <>
                            <li className="nav-item">
                              <a href="/admin" className="nav-link">
                                <i className="fas fa-angle-right"></i>Admin
                              </a>
                            </li>
                            <li className="nav-item">
                              <a href="/studentDashboard" className="nav-link">
                                <i className="fas fa-angle-right"></i>Students
                              </a>
                            </li>
                            <li className="nav-item">
                              <a href="/teacherDashboard" className="nav-link">
                                <i className="fas fa-angle-right"></i>Teachers
                              </a>
                            </li>
                          </>
                        )}
                      </ul>
                    </li>
                    <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-classmates"></i>
                        <span>Students</span>
                      </a>
                      {disable() && (
                        <ul className="nav sub-group-menu">
                          <li className="nav-item">
                            <a href="/allStudent" className="nav-link">
                              <i className="fas fa-angle-right"></i>All Students
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/studentDetails" className="nav-link">
                              <i className="fas fa-angle-right"></i>Student
                              Details
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/admissionForm" className="nav-link">
                              <i className="fas fa-angle-right"></i>Admission
                              Form
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/studentPromotion" className="nav-link">
                              <i className="fas fa-angle-right"></i>Student
                              Promotion
                            </a>
                          </li>
                        </ul>
                      )}
                    </li>
                    {/* <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-multiple-users-silhouette"></i>
                        <span>Teachers</span>
                      </a>
                      {disable() && (
                        <ul className="nav sub-group-menu">
                          <li className="nav-item">
                            <a href="/allTeacher" className="nav-link">
                              <i className="fas fa-angle-right"></i>All Teachers
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/teacherDetails/{id}" className="nav-link">
                              <i className="fas fa-angle-right"></i>Teacher
                              Details
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/addTeacher" className="nav-link">
                              <i className="fas fa-angle-right"></i>Add Teacher
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/teacherPayment" className="nav-link">
                              <i className="fas fa-angle-right"></i>Teacher
                              Payment
                            </a>
                          </li>
                          <li class="nav-item">
                            <a href="/addTeacherPayment" class="nav-link">
                              <i class="fas fa-angle-right"></i>Add Payment
                            </a>
                          </li>
                        </ul>
                      )}
                    </li> */}
                    {/* <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-couple"></i>
                        <span>Parents</span>
                      </a>
                      {disable() && (
                        <ul className="nav sub-group-menu">
                          <li className="nav-item">
                            <a href="/allParent" className="nav-link">
                              <i className="fas fa-angle-right"></i>All Parents
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/parentDetails/{id}" className="nav-link">
                              <i className="fas fa-angle-right"></i>Parents
                              Details
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/addParent" className="nav-link">
                              <i className="fas fa-angle-right"></i>Add Parent
                            </a>
                          </li>
                        </ul>
                      )}
                    </li> */}
                    {/* <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-books"></i>
                        <span>Library</span>
                      </a>
                      {disable() && (
                        <ul className="nav sub-group-menu">
                          <li className="nav-item">
                            <a href="/allBook" className="nav-link">
                              <i className="fas fa-angle-right"></i>All Book
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/addBook" className="nav-link">
                              <i className="fas fa-angle-right"></i>Add New Book
                            </a>
                          </li>
                        </ul>
                      )}
                    </li> */}
                    {/* <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-technological"></i>
                        <span>Payment</span>
                      </a>
                      {disable() && (
                        <ul className="nav sub-group-menu">
                          <li className="nav-item">
                            <a href="/allFeesCollection" className="nav-link">
                              <i className="fas fa-angle-right"></i>All Fees
                              Collection
                            </a>
                          </li>
                          <li class="nav-item">
                            <a href="/addFees" class="nav-link">
                              <i class="fas fa-angle-right"></i>Add Fees
                              Collection
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/allExpense" className="nav-link">
                              <i className="fas fa-angle-right"></i>All Expenses
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/addExpense" className="nav-link">
                              <i className="fas fa-angle-right"></i>Add Expenses
                            </a>
                          </li>
                        </ul>
                      )}
                    </li> */}
                    {/* <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-maths-class-materials-cross-of-a-pencil-and-a-ruler"></i>
                        <span>class</span>
                      </a>
                      {disable() && (
                        <ul className="nav sub-group-menu">
                          <li className="nav-item">
                            <a href="/allClass" className="nav-link">
                              <i className="fas fa-angle-right"></i>All class
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/addClass" className="nav-link">
                              <i className="fas fa-angle-right"></i>Add New
                              class
                            </a>
                          </li>
                        </ul>
                      )}
                    </li> */}
                    {/* {disable() && (
                      <li
                        className="nav-item"
                        style={{ backgroundColor: "black" }}
                      >
                        <a href="/subject" className="nav-link">
                          <i className="flaticon-open-book"></i>
                          <span>Subject</span>
                        </a>
                      </li>
                    )} */}
                    {/* {disable() && (
                      <li
                        className="nav-item"
                        style={{ backgroundColor: "black" }}
                      >
                        <a href="/classRoutine" className="nav-link">
                          <i className="flaticon-calendar"></i>
                          <span>class Routine</span>
                        </a>
                      </li>
                    )} */}
                    {/* {disable() && (
                      <li
                        className="nav-item"
                        style={{ backgroundColor: "black" }}
                      >
                        <a href="/attendence" className="nav-link">
                          <i className="flaticon-checklist"></i>
                          <span>Attendence</span>
                        </a>
                      </li>
                    )} */}
                    {/* <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-shopping-list"></i>
                        <span>Exam</span>
                      </a>
                      {disable() && (
                        <ul className="nav sub-group-menu">
                          <li className="nav-item">
                            <a href="/exam-schedule" className="nav-link">
                              <i className="fas fa-angle-right"></i>Exam
                              Schedule
                            </a>
                          </li>
                          <li className="nav-item">
                            <a href="/exam-grade" className="nav-link">
                              <i className="fas fa-angle-right"></i>Exam Grades
                            </a>
                          </li>
                          <li class="nav-item">
                            <a href="/exam-result" class="nav-link">
                              <i class="fas fa-angle-right"></i>Exam Result
                            </a>
                          </li>
                        </ul>
                      )}
                    </li> */}
                    {/* {disable() && (
                      <li
                        className="nav-item"
                        style={{ backgroundColor: "black" }}
                      >
                        <a href="/transport" className="nav-link">
                          <i className="flaticon-bus-side-view"></i>
                          <span>Transport</span>
                        </a>
                      </li>
                    )} */}
                    {/* {disable() && (
                      <li
                        className="nav-item"
                        style={{ backgroundColor: "black" }}
                      >
                        <a href="/hostel" className="nav-link">
                          <i className="flaticon-bed"></i>
                          <span>Hostel</span>
                        </a>
                      </li>
                    )} */}
                    {/* {disable() && (
                      <li
                        className="nav-item"
                        style={{ backgroundColor: "black" }}
                      >
                        <a href="/notice" className="nav-link">
                          <i className="flaticon-script"></i>
                          <span>Notice</span>
                        </a>
                      </li>
                    )} */}
                    {/* <li
                      className="nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="/messaging" className="nav-link">
                        <i className="flaticon-chat"></i>
                        <span>Messeage</span>
                      </a>
                    </li> */}
                    {/* {disable() && (
                      <li
                        className="nav-item"
                        style={{ backgroundColor: "black" }}
                      >
                        <a href="/map.html" className="nav-link">
                          <i className="flaticon-planet-earth"></i>
                          <span>Map</span>
                        </a>
                      </li>
                    )} */}
                    {/* {disable() && (
                      <li
                        className="nav-item"
                        style={{ backgroundColor: "black" }}
                      >
                        <a href="/setting" className="nav-link">
                          <i className="flaticon-settings"></i>
                          <span>User Settings</span>
                        </a>
                      </li>
                    )} */}
                  </ul>
                </div>
              </>
            ) : isTeacher ? (
              <>
                {/* Elements to render if user is teacher */}
                <div className="sidebar-menu-content">
                  <ul className="nav nav-sidebar-menu sidebar-toggle-view">
                    <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-dashboard"></i>
                        <span>Dashboard</span>
                      </a>
                      <ul className="nav sub-group-menu sub-group-active">
                        <li className="nav-item">
                          <a
                            href="/teacherDashboard"
                            className="nav-link menu-active"
                          >
                            <i className="fas fa-angle-right"></i>Teachers
                          </a>
                        </li>
                        {disable() && (
                          <>
                            <li className="nav-item">
                              <a href="/admin" className="nav-link">
                                <i className="fas fa-angle-right"></i>Admin
                              </a>
                            </li>
                            <li className="nav-item">
                              <a href="/studentDashboard" className="nav-link">
                                <i className="fas fa-angle-right"></i>Students
                              </a>
                            </li>
                            <li className="nav-item">
                              <a href="/parentDashboard" className="nav-link">
                                <i className="fas fa-angle-right"></i>Parents
                              </a>
                            </li>
                          </>
                        )}
                      </ul>
                    </li>
                    <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-classmates"></i>
                        <span>Students</span>
                      </a>
                      <ul className="nav sub-group-menu">
                        <li className="nav-item">
                          <a href="/allStudent" className="nav-link">
                            <i className="fas fa-angle-right"></i>All Students
                          </a>
                        </li>
                        {/* {disable() && (
                          <li className="nav-item">
                            <a href="/studentDetails" className="nav-link">
                              <i className="fas fa-angle-right"></i>Student
                              Details
                            </a>
                          </li>
                        )} */}
                        {/* {disable() && (
                          <li className="nav-item">
                            <a href="/admissionForm" className="nav-link">
                              <i className="fas fa-angle-right"></i>Admission
                              Form
                            </a>
                          </li>
                        )} */}
                        <li className="nav-item">
                          <a href="/studentPromotion" className="nav-link">
                            <i className="fas fa-angle-right"></i>Student
                            Promotion
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-multiple-users-silhouette"></i>
                        <span>Teachers</span>
                      </a>
                      <ul className="nav sub-group-menu">
                        <li className="nav-item">
                          <a href="/allTeacher" className="nav-link">
                            <i className="fas fa-angle-right"></i>All Teachers
                          </a>
                        </li>
                        {/* {disable() && (
                          <li className="nav-item">
                            <a href="/teacherDetails/{id}" className="nav-link">
                              <i className="fas fa-angle-right"></i>Teacher
                              Details
                            </a>
                          </li>
                        )} */}
                        {/* {disable() && (
                          <li className="nav-item">
                            <a href="/addTeacher" className="nav-link">
                              <i className="fas fa-angle-right"></i>Add Teacher
                            </a>
                          </li>
                        )} */}
                        <li className="nav-item">
                          <a href="/teacherPayment" className="nav-link">
                            <i className="fas fa-angle-right"></i>Teacher
                            Payment
                          </a>
                        </li>
                        {/* {disable() && (
                          <li className="nav-item">
                            <a href="/addTeacherPayment" className="nav-link">
                              <i class="fas fa-angle-right"></i>Add Payment
                            </a>
                          </li>
                        )} */}
                      </ul>
                    </li>
                    <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-couple"></i>
                        <span>Parents</span>
                      </a>
                      <ul className="nav sub-group-menu">
                        <li className="nav-item">
                          <a href="/allParent" className="nav-link">
                            <i className="fas fa-angle-right"></i>All Parents
                          </a>
                        </li>
                        {/* {disable() && (
                          <li className="nav-item">
                            <a href="/parentDetails/{id}" className="nav-link">
                              <i className="fas fa-angle-right"></i>Parents
                              Details
                            </a>
                          </li>
                        )} */}
                        {/* {disable() && (
                          <li className="nav-item">
                            <a href="/addParent" className="nav-link">
                              <i className="fas fa-angle-right"></i>Add Parent
                            </a>
                          </li>
                        )} */}
                      </ul>
                    </li>
                    <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-books"></i>
                        <span>Library</span>
                      </a>
                      <ul className="nav sub-group-menu">
                        <li className="nav-item">
                          <a href="/allBook" className="nav-link">
                            <i className="fas fa-angle-right"></i>All Book
                          </a>
                        </li>
                        <li className="nav-item">
                          <a href="/addBook" className="nav-link">
                            <i className="fas fa-angle-right"></i>Add New Book
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-technological"></i>
                        <span>Payment</span>
                      </a>
                      <ul className="nav sub-group-menu">
                        <li className="nav-item">
                          <a href="/allFeesCollection" className="nav-link">
                            <i className="fas fa-angle-right"></i>All Fees
                            Collection
                          </a>
                        </li>
                        {/* {disable() && (
                          <li class="nav-item">
                            <a href="/addFees" class="nav-link">
                              <i class="fas fa-angle-right"></i>Add Fees
                              Collection
                            </a>
                          </li>
                        )} */}
                        <li className="nav-item">
                          <a href="/allExpense" className="nav-link">
                            <i className="fas fa-angle-right"></i>All Expenses
                          </a>
                        </li>
                        {/* {disable() && (
                          <li className="nav-item">
                            <a href="/addExpense" className="nav-link">
                              <i className="fas fa-angle-right"></i>Add Expenses
                            </a>
                          </li>
                        )} */}
                      </ul>
                    </li>
                    <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-maths-class-materials-cross-of-a-pencil-and-a-ruler"></i>
                        <span>class</span>
                      </a>
                      <ul className="nav sub-group-menu">
                        <li className="nav-item">
                          <a href="/allClass" className="nav-link">
                            <i className="fas fa-angle-right"></i>All class
                          </a>
                        </li>
                        {/* {disable() && (
                          <li className="nav-item">
                            <a href="/addClass" className="nav-link">
                              <i className="fas fa-angle-right"></i>Add New
                              class
                            </a>
                          </li>
                        )} */}
                      </ul>
                    </li>
                    <li
                      className="nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="/subject" className="nav-link">
                        <i className="flaticon-open-book"></i>
                        <span>Subject</span>
                      </a>
                    </li>
                    <li
                      className="nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="/classRoutine" className="nav-link">
                        <i className="flaticon-calendar"></i>
                        <span>class Routine</span>
                      </a>
                    </li>
                    <li
                      className="nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="/attendence" className="nav-link">
                        <i className="flaticon-checklist"></i>
                        <span>Attendence</span>
                      </a>
                    </li>
                    <li
                      className="nav-item sidebar-nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="#" className="nav-link">
                        <i className="flaticon-shopping-list"></i>
                        <span>Exam</span>
                      </a>
                      <ul className="nav sub-group-menu">
                        <li className="nav-item">
                          <a href="/exam-schedule" className="nav-link">
                            <i className="fas fa-angle-right"></i>Exam Schedule
                          </a>
                        </li>
                        <li className="nav-item">
                          <a href="/exam-grade" className="nav-link">
                            <i className="fas fa-angle-right"></i>Exam Grades
                          </a>
                        </li>
                        <li class="nav-item">
                          <a href="/exam-result" class="nav-link">
                            <i class="fas fa-angle-right"></i>Exam Result
                          </a>
                        </li>
                      </ul>
                    </li>
                    {/* {disable() && (
                      <li
                        className="nav-item"
                        style={{ backgroundColor: "black" }}
                      >
                        <a href="/transport" className="nav-link">
                          <i className="flaticon-bus-side-view"></i>
                          <span>Transport</span>
                        </a>
                      </li>
                    )} */}
                    <li
                      className="nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="/hostel" className="nav-link">
                        <i className="flaticon-bed"></i>
                        <span>Hostel</span>
                      </a>
                    </li>
                    <li
                      className="nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="/notice" className="nav-link">
                        <i className="flaticon-script"></i>
                        <span>Notice</span>
                      </a>
                    </li>
                    <li
                      className="nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="/messaging" className="nav-link">
                        <i className="flaticon-chat"></i>
                        <span>Messeage</span>
                      </a>
                    </li>

                    {/* <li
                      className="nav-item"
                      style={{ backgroundColor: "black" }}
                    >
                      <a href="/map.html" className="nav-link">
                        <i className="flaticon-planet-earth"></i>
                        <span>Map</span>
                      </a>
                    </li> */}
                    {/* {disable() && (
                      <li
                        className="nav-item"
                        style={{ backgroundColor: "black" }}
                      >
                        <a href="/setting" className="nav-link">
                          <i className="flaticon-settings"></i>
                          <span>User Settings</span>
                        </a>
                      </li>
                    )} */}
                  </ul>
                </div>
              </>
            ) : null}
          </div>
          <div class="dashboard-content-one">
            <div class="breadcrumbs-area">
              <h3>Edit User</h3>
              <ul>
                <li>
                  <a href="/setting">Setting</a>
                </li>
                {message ? (
                  <div class="ui-alart-box">
                    <div class="icon-color-alart">
                      <div
                        class="alert icon-alart bg-light-green2"
                        role="alert"
                      >
                        <i class="far fa-hand-point-right bg-light-green3"></i>
                        {message}
                      </div>
                    </div>
                  </div>
                ) : null}
                {error ? (
                  <div class="ui-alart-box">
                    <div class="icon-color-alart">
                      <div class="alert icon-alart bg-pink2" role="alert">
                        <i class="fas fa-times bg-pink3"></i>
                        {error}
                      </div>
                    </div>
                  </div>
                ) : null}
              </ul>
            </div>
            <div class="row">
              <div class="col-12">
                <div class="card">
                  <div class="card-body">
                    <div class="heading-layout1">
                      <div class="item-title">
                        <h3>Edit User</h3>
                      </div>
                    </div>
                    <form>
                      <div class="row">
                        <div class="col-xl-3 col-lg-6 col-12 form-group">
                          <label>First Name *</label>
                          <input
                            type="text"
                            placeholder=""
                            class="form-control"
                            value={firstname}
                            onChange={(e) => {
                              setFirstName(e.target.value);
                            }}
                          />
                        </div>
                        <div class="col-xl-3 col-lg-6 col-12 form-group">
                          <label>Last Name *</label>
                          <input
                            type="text"
                            placeholder=""
                            class="form-control"
                            value={lastname}
                            onChange={(e) => {
                              setLastName(e.target.value);
                            }}
                          />
                        </div>
                        <div class="col-xl-3 col-lg-6 col-12 form-group">
                          <label>Middle Name </label>
                          <input
                            type="text"
                            placeholder=""
                            class="form-control"
                            value={middlename}
                            onChange={(e) => {
                              setMiddleName(e.target.value);
                            }}
                          />
                        </div>
                        <div class="col-xl-3 col-lg-6 col-12 form-group">
                          <label htmlFor="role">Select Role *</label>
                          <select
                            id="role"
                            name="role"
                            className="form-control"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                          >
                            <option value="">Select a role</option>
                            {Object.entries(roles).map(([roleId, roleName]) => (
                              <option key={roleId} value={roleId}>
                                {roleName}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="col-xl-3 col-lg-6 col-12 form-group">
                          <label htmlFor="userRoles">Gender *</label>
                          <select
                            id="gender"
                            className="form-control"
                            value={gender}
                            onChange={(e) => {
                              setGender(e.target.value);
                            }}
                          >
                            <option value="">Select a gender</option>
                            <option value="MALE">MALE</option>
                            <option value="FEMALE">FEMALE</option>
                            <option value="OTHERS">OTHERS</option>
                          </select>
                        </div>
                        <div className="col-xl-3 col-lg-6 col-12 form-group">
                          <label>Date of birth *</label>
                          <input
                            type="date"
                            placeholder=""
                            className="form-control air-datepicker"
                            value={dateofbirth}
                            onChange={(e) => {
                              const selectedDate = new Date(e.target.value);
                              const formattedDate = selectedDate
                                .toLocaleDateString("en-CA", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                })
                                .split("/")
                                .join("-"); // Ensure the format is yyyy-mm-dd

                              setDateOfBirth(formattedDate);
                            }}
                          />
                        </div>
                        <div class="col-xl-3 col-lg-6 col-12 form-group">
                          <label>Religion *</label>
                          <input
                            type="text"
                            placeholder=""
                            class="form-control"
                            value={religion}
                            onChange={(e) => {
                              setReligion(e.target.value);
                            }}
                          />
                        </div>
                        <div className="col-xl-3 col-lg-6 col-12 form-group">
                          <label>Register Date *</label>
                          <input
                            type="date"
                            placeholder=""
                            className="form-control air-datepicker"
                            value={joiningdate}
                            onChange={(e) => {
                              const selectedDate = new Date(e.target.value);
                              const formattedDate = selectedDate
                                .toLocaleDateString("en-CA", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                })
                                .split("/")
                                .join("-"); // Ensure the format is yyyy-mm-dd

                              setJoiningDate(formattedDate);
                            }}
                          />
                        </div>
                        <div className="col-xl-3 col-lg-6 col-12 form-group">
                          <label>E-Mail *</label>
                          <input
                            type="email"
                            placeholder=""
                            className="form-control"
                            value={email}
                            onChange={handleEmailInputChange}
                          />
                          {emailError && (
                            <p style={{ color: "red" }}>{emailError}</p>
                          )}
                        </div>
                        <div class="col-xl-3 col-lg-6 col-12 form-group">
                          <label>ID No *</label>
                          <input
                            type="text"
                            placeholder=""
                            class="form-control"
                            value={idno}
                            onChange={(e) => {
                              setIdNo(e.target.value);
                            }}
                          />
                        </div>
                        <div className="col-xl-3 col-lg-6 col-12 form-group">
                          <label>Phone *</label>
                          <input
                            type="text"
                            placeholder=""
                            className="form-control"
                            value={phone}
                            onChange={handleInputChange}
                            pattern="[0-9]*"
                          />
                          {errorMessage && (
                            <p style={{ color: "red" }}>{errorMessage}</p>
                          )}
                        </div>
                        <div class="col-lg-6 col-12 form-group">
                          <label>Adress *</label>
                          <textarea
                            class="textarea form-control"
                            name="message"
                            id="form-message"
                            cols="10"
                            rows="4"
                            value={address}
                            onChange={(e) => {
                              setAddress(e.target.value);
                            }}
                          ></textarea>
                        </div>
                        <div class="col-12 form-group mg-t-8">
                          <button
                            type="submit"
                            class="btn-fill-lg btn-gradient-yellow btn-hover-bluedark"
                            onClick={UpdateUser}
                          >
                            Save
                          </button>
                          <button
                            type="reset"
                            class="btn-fill-lg bg-blue-dark btn-hover-yellow"
                            onClick={ReSet}
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <footer classNameName="footer-wrap-layout1">
              <div classNameName="copyright">
                © Copyrights <a href="/#">Penetralia Hub</a> 2023. All rights
                reserved. Designed by{" "}
                <a href="/#" style={{ color: "red" }}>
                  Egr Rotimi
                </a>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
