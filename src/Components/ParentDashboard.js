import React, { useEffect, useState } from "react";
import { initMain } from "../js/main";
import { useNavigate } from "react-router-dom";
import logo1 from "./img/logo1.png";
import student11 from "./img/figure/student11.png";
import penetralia from "./img/penetralia.jpg";
import admin from "./img/figure/admin.jpg";
import student12 from "./img/figure/student12.png";
import student13 from "./img/figure/student13.png";
import student from "./img/figure/student.png";
import student1 from "./img/figure/student1.png";
import { FaCalendarAlt, FaUserClock, FaUser } from "react-icons/fa";

const ParentDashboard = () => {
  const [notices, setNotices] = useState("");
  const [parentDashboard, setParentDashboard] = useState(() => {
    const storage = localStorage.getItem("parentAdminData");
    return storage ? JSON.stringify(storage) : "";
  });
  const [totalDueFees, setTotalDueFees] = useState(0);
  const [totalNotification, setTotalNotification] = useState(0);
  const [totalResult, setTotalResult] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [students, setStudents] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [keywordResult, setKeywordResult] = useState("");
  const [searchActiveResult, setSearchActiveResult] = useState(false);
  const navigate = useNavigate();



  useEffect(() => {
    const authToken = localStorage.getItem("userInfo");
    const userIfo = JSON.parse(authToken);
    const email = userIfo.data.email;
    console.log(email);
    if (authToken) {
      const userAuthToken = JSON.parse(authToken);
      const token = userAuthToken.data.access_token;

      fetch(
        `https://sms-penetralia.azurewebsites.net/api/parent_admin/parent_admin/${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((result) => {
          // Assuming the data structure is like { meta: {...}, data: [...] }
          if (result && result.data) {
            setParentDashboard(result.data);
            localStorage.setItem(
              "parentAdminData",
              JSON.stringify(result.data)
            );
          } else {
            console.error("Invalid data structure:", result);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, []);

  useEffect(() => {
    if (parentDashboard) {
      const intervalId = setInterval(() => {
        setTotalDueFees((prevCount) =>
          parentDashboard.due_fees
            ? Math.min(prevCount + 1, parentDashboard.due_fees)
            : prevCount
        );
        setTotalExpense((prevCount) =>
          parentDashboard.expenses
            ? Math.min(prevCount + 1, parentDashboard.expenses)
            : prevCount
        );
        setTotalNotification((prevCount) =>
          parentDashboard.notifications
            ? Math.min(prevCount + 1, parentDashboard.notifications)
            : prevCount
        );
        setTotalResult((prevCount) =>
          parentDashboard.result
            ? Math.min(prevCount + 1, parentDashboard.result)
            : prevCount
        );
      }, 200); // Update every 200 milliseconds

      return () => clearInterval(intervalId);
    }
  }, [parentDashboard]);



  useEffect(() => {
    const authToken = localStorage.getItem("userInfo");

    if (authToken) {
      const userAuthToken = JSON.parse(authToken);
      const email = userAuthToken.data.email;
      const token = userAuthToken.data.access_token;

      fetch(
        `https://sms-penetralia.azurewebsites.net/api/student/numberOfStudent/${email}`,
        {
          // Use backticks (`) instead of double quotes (") for string interpolation
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((result) => {
          // Assuming the data structure is like { meta: {...}, data: [...] }
          if (result && result.data && Array.isArray(result.data)) {
            setStudents(result.data);
            console.log(result.data);
            localStorage.setItem("notice", JSON.stringify(result.data));
          } else {
            console.error("Invalid data structure:", result);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, []);



  useEffect(() => {
    const authToken = localStorage.getItem("userInfo");

    if (authToken) {
      const userAuthToken = JSON.parse(authToken);
      const token = userAuthToken.data.access_token;

      fetch(`https://sms-penetralia.azurewebsites.net/api/notice/notice_list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((result) => {
          // Assuming the data structure is like { meta: {...}, data: [...] }
          if (result && result.data && Array.isArray(result.data)) {
            setNotices(result.data);
          } else {
            console.error("Invalid data structure:", result);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, []);



  useEffect(() => {
    const authToken = localStorage.getItem("userInfo");

    if (authToken) {
      const userAuthToken = JSON.parse(authToken);
      const email = userAuthToken.data.email;
      const token = userAuthToken.data.access_token;

      fetch(
        `https://sms-penetralia.azurewebsites.net/api/account/expense/${email}`,
        {
          // Use backticks (`) instead of double quotes (") for string interpolation
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((result) => {
          // Assuming the data structure is like { meta: {...}, data: [...] }
          if (result && result.data && Array.isArray(result.data)) {
            setExpenses(result.data);
          } else {
            console.error("Invalid data structure:", result);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, []);



  const handleSearch = (event) => {
    event.preventDefault();

    const authToken = localStorage.getItem("userInfo");
    const userAuthToken = JSON.parse(authToken);
    const token = userAuthToken.data.access_token;

    // Combine search options into a single string
    const searchOptions = [keyword]
      .filter((value) => value !== null && value !== undefined)
      .join(" ");

    // Construct the URL with the combined search options
    const searchUrl = new URL(
      "https://sms-penetralia.azurewebsites.net/api/account/expense_search"
    );
    // Append the combined search options only if they are not empty
    if (searchOptions.trim() !== "") {
      searchUrl.searchParams.append(
        "keyword",
        encodeURIComponent(searchOptions)
      );
    }

    // Fetch data using the constructed URL
    fetch(searchUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        setSearchActive(true);
        // Assuming the data structure is like { meta: {...}, data: [...] }
        if (result && result.data) {
          setFilteredExpenses(result.data);
        } else {
          console.error("Invalid data structure:", result);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };



  const resetSearchResult = () => {
    // Clear the search results and set searchActive to false
    setFilteredExpenses([]);
    setSearchActive(false);
  };



  useEffect(() => {
    const authToken = localStorage.getItem("userInfo");

    if (authToken) {
      const userAuthToken = JSON.parse(authToken);
      const email = userAuthToken.data.email;
      const token = userAuthToken.data.access_token;

      fetch(
        `https://sms-penetralia.azurewebsites.net/api/exam_result/student_result/${email}`,
        {
          // Use backticks (`) instead of double quotes (") for string interpolation
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((result) => {
          // Assuming the data structure is like { meta: {...}, data: [...] }
          if (result && result.data && Array.isArray(result.data)) {
            setResults(result.data);
          } else {
            console.error("Invalid data structure:", result);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, []);



  const handleSearchResult = (event) => {
    event.preventDefault();

    const authToken = localStorage.getItem("userInfo");
    const userAuthToken = JSON.parse(authToken);
    const token = userAuthToken.data.access_token;

    // Combine search options into a single string
    const searchOptions = [keywordResult]
      .filter((value) => value !== null && value !== undefined)
      .join(" ");

    // Construct the URL with the combined search options
    const searchUrl = new URL(
      `https://sms-penetralia.azurewebsites.net/api/exam_result/search`
    );
    // Append the combined search options only if they are not empty
    if (searchOptions.trim() !== "") {
      searchUrl.searchParams.append(
        "keywordResult",
        encodeURIComponent(searchOptions)
      );
    }

    // Fetch data using the constructed URL
    fetch(searchUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      }).then((result) => {
        setSearchActiveResult(true);
        // Assuming the data structure is like { meta: {...}, data: [...] }
        if (result && result.data) {
          setFilteredResults(result.data);
        } else {
          console.error("Invalid data structure:", result);
        }
      }).catch((error) => {
        console.error("Error fetching data:", error);
      });
  };


const resetSearch = () => {
  // Clear the search results and set searchActive to false
  setFilteredExpenses([]);
  setSearchActive(false);
};


  useEffect(() => {
    initMain();
  }, []);


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


    const disable = () => {
      const authToken = localStorage.getItem("userInfo");
      const userAuthToken = JSON.parse(authToken);
      const role = userAuthToken.data.role;

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





  return (
    <div>
      {/* <div id="preloader"></div> */}
      <div id="wrapper" className="wrapper bg-ash">
        <div className="navbar navbar-expand-md header-menu-one bg-light">
          <div className="nav-bar-header-one">
            <div className="header-logo">
              <a href="/index.html">
                <img src={penetralia} alt="logo" width="70px" height="70px" />
              </a>
            </div>
            <div className="toggle-button sidebar-toggle">
              <button type="button" className="item-link">
                <span className="btn-icon-wrap">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>
            </div>
          </div>
          <div className="d-md-none mobile-nav-bar">
            <button
              className="navbar-toggler pulse-animation"
              type="button"
              data-toggle="collapse"
              data-target="#mobile-navbar"
              aria-expanded="false"
            >
              <i className="far fa-arrow-alt-circle-down"></i>
            </button>
            <button
              type="button"
              className="navbar-toggler sidebar-toggle-mobile"
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
          <div
            className="header-main-menu collapse navbar-collapse"
            id="mobile-navbar"
          >
            <ul className="navbar-nav">
              <li className="navbar-item header-search-bar">
                <div className="input-group stylish-input-group">
                  <span className="input-group-addon">
                    <button type="submit">
                      <span
                        className="flaticon-search"
                        aria-hidden="true"
                      ></span>
                    </button>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Find Something . . ."
                  />
                </div>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="navbar-item dropdown header-admin">
                <a
                  className="navbar-nav-link dropdown-toggle"
                  href="/#"
                  role="button"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div className="admin-title">
                    <h5 className="item-title">Stevne Zone</h5>
                    <span>Admin</span>
                  </div>
                  <div className="admin-img">
                    <img src={admin} alt="Admin" />
                  </div>
                </a>
                <div className="dropdown-menu dropdown-menu-right">
                  <div className="item-header">
                    <h6 className="item-title">Steven Zone</h6>
                  </div>
                  <div className="item-content">
                    <ul className="settings-list">
                      <li>
                        <a href="/#">
                          <i className="flaticon-user"></i>My Profile
                        </a>
                      </li>
                      <li>
                        <a href="/#">
                          <i className="flaticon-list"></i>Task
                        </a>
                      </li>
                      <li>
                        <a href="/#">
                          <i className="flaticon-chat-comment-oval-speech-bubble-with-text-lines"></i>
                          Message
                        </a>
                      </li>
                      <li>
                        <a href="/#">
                          <i className="flaticon-gear-loading"></i>Account
                          Settings
                        </a>
                      </li>
                      <li>
                        <a href="" onClick={handleLogout}>
                          <i className="flaticon-turn-off"></i>Log Out
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
              <li className="navbar-item dropdown header-message">
                <a
                  className="navbar-nav-link dropdown-toggle"
                  href="/#"
                  role="button"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="far fa-envelope"></i>
                  <div className="item-title d-md-none text-16 mg-l-10">
                    Message
                  </div>
                  <span>5</span>
                </a>

                <div className="dropdown-menu dropdown-menu-right">
                  <div className="item-header">
                    <h6 className="item-title">05 Message</h6>
                  </div>
                  <div className="item-content">
                    <div className="media">
                      <div className="item-img bg-skyblue author-online">
                        <img src={student11} alt="img" />
                      </div>
                      <div className="media-body space-sm">
                        <div className="item-title">
                          <a href="/#">
                            <span className="item-name">Maria Zaman</span>
                            <span className="item-time">18:30</span>
                          </a>
                        </div>
                        <p>
                          What is the reason of buy this item. Is it usefull for
                          me.....
                        </p>
                      </div>
                    </div>
                    <div className="media">
                      <div className="item-img bg-yellow author-online">
                        <img src={student12} alt="img" />
                      </div>
                      <div className="media-body space-sm">
                        <div className="item-title">
                          <a href="/#">
                            <span className="item-name">Benny Roy</span>
                            <span className="item-time">10:35</span>
                          </a>
                        </div>
                        <p>
                          What is the reason of buy this item. Is it usefull for
                          me.....
                        </p>
                      </div>
                    </div>
                    <div className="media">
                      <div className="item-img bg-pink">
                        <img src={student13} alt="img" />
                      </div>
                      <div className="media-body space-sm">
                        <div className="item-title">
                          <a href="/#">
                            <span className="item-name">Steven</span>
                            <span className="item-time">02:35</span>
                          </a>
                        </div>
                        <p>
                          What is the reason of buy this item. Is it usefull for
                          me.....
                        </p>
                      </div>
                    </div>
                    <div className="media">
                      <div className="item-img bg-violet-blue">
                        <img src={student11} alt="img" />
                      </div>
                      <div className="media-body space-sm">
                        <div className="item-title">
                          <a href="/#">
                            <span className="item-name">Joshep Joe</span>
                            <span className="item-time">12:35</span>
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
              <li className="navbar-item dropdown header-notification">
                <a
                  className="navbar-nav-link dropdown-toggle"
                  href="/#"
                  role="button"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="far fa-bell"></i>
                  <div className="item-title d-md-none text-16 mg-l-10">
                    Notification
                  </div>
                  <span>8</span>
                </a>

                <div className="dropdown-menu dropdown-menu-right">
                  <div className="item-header">
                    <h6 className="item-title">03 Notifiacations</h6>
                  </div>
                  <div className="item-content">
                    <div className="media">
                      <div className="item-icon bg-skyblue">
                        <i className="fas fa-check"></i>
                      </div>
                      <div className="media-body space-sm">
                        <div className="post-title">Complete Today Task</div>
                        <span>1 Mins ago</span>
                      </div>
                    </div>
                    <div className="media">
                      <div className="item-icon bg-orange">
                        <i className="fas fa-calendar-alt"></i>
                      </div>
                      <div className="media-body space-sm">
                        <div className="post-title">Director Metting</div>
                        <span>20 Mins ago</span>
                      </div>
                    </div>
                    <div className="media">
                      <div className="item-icon bg-violet-blue">
                        <i className="fas fa-cogs"></i>
                      </div>
                      <div className="media-body space-sm">
                        <div className="post-title">Update Password</div>
                        <span>45 Mins ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="navbar-item dropdown header-language">
                <a
                  className="navbar-nav-link dropdown-toggle"
                  href="/#"
                  role="button"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-globe-americas"></i>EN
                </a>
                <div className="dropdown-menu dropdown-menu-right">
                  <a className="dropdown-item" href="/#">
                    English
                  </a>
                  <a className="dropdown-item" href="/#">
                    Spanish
                  </a>
                  <a className="dropdown-item" href="/#">
                    Franchis
                  </a>
                  <a className="dropdown-item" href="/#">
                    Chiness
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="dashboard-page-one">
          <div className="sidebar-main sidebar-menu-one sidebar-expand-md sidebar-color">
            <div className="mobile-sidebar-header d-md-none">
              <div className="header-logo">
                <a href="/index.html">
                  <img src={logo1} alt="logo" />
                </a>
              </div>
            </div>
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
                        <i className="fas fa-angle-right"></i>Student Details
                      </a>
                    </li>
                    <li className="nav-item">
                      <a href="/admissionForm" className="nav-link">
                        <i className="fas fa-angle-right"></i>Admission Form
                      </a>
                    </li>
                    <li className="nav-item">
                      <a href="/studentPromotion" className="nav-link">
                        <i className="fas fa-angle-right"></i>Student Promotion
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
                        <i className="fas fa-angle-right"></i>Teacher Details
                      </a>
                    </li>
                    <li className="nav-item">
                      <a href="/addTeacher" className="nav-link">
                        <i className="fas fa-angle-right"></i>Add Teacher
                      </a>
                    </li>
                    <li className="nav-item">
                      <a href="/teacherPayment" className="nav-link">
                        <i className="fas fa-angle-right"></i>Teacher Payment
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
                        <i className="fas fa-angle-right"></i>Parents Details
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
                        <i class="fas fa-angle-right"></i>Add Fees Collection
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
                        <i className="fas fa-angle-right"></i>Add New class
                      </a>
                    </li>
                  </ul>
                  )}
                </li>
                {disable() && (
                <li className="nav-item" style={{ backgroundColor: "black" }}>
                  <a href="/subject" className="nav-link">
                    <i className="flaticon-open-book"></i>
                    <span>Subject</span>
                  </a>
                </li>
                )} */}
                {/* {disable() && (
                <li className="nav-item" style={{ backgroundColor: "black" }}>
                  <a href="/classRoutine" className="nav-link">
                    <i className="flaticon-calendar"></i>
                    <span>class Routine</span>
                  </a>
                </li>
                )}
                {disable() && (
                <li className="nav-item" style={{ backgroundColor: "black" }}>
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
                  )}
                </li>
                {disable() && (
                <li className="nav-item" style={{ backgroundColor: "black" }}>
                  <a href="/transport" className="nav-link">
                    <i className="flaticon-bus-side-view"></i>
                    <span>Transport</span>
                  </a>
                </li>
                )}
                {disable() && (
                <li className="nav-item" style={{ backgroundColor: "black" }}>
                  <a href="/hostel" className="nav-link">
                    <i className="flaticon-bed"></i>
                    <span>Hostel</span>
                  </a>
                </li>
                )}
                {disable() && (
                <li className="nav-item" style={{ backgroundColor: "black" }}>
                  <a href="/notice" className="nav-link">
                    <i className="flaticon-script"></i>
                    <span>Notice</span>
                  </a>
                </li>
                )} */}
                <li className="nav-item" style={{ backgroundColor: "black" }}>
                  <a href="/messaging" className="nav-link">
                    <i className="flaticon-chat"></i>
                    <span>Messeage</span>
                  </a>
                </li>
                {/* {disable() && (
                <li className="nav-item" style={{ backgroundColor: "black" }}>
                  <a href="/map.html" className="nav-link">
                    <i className="flaticon-planet-earth"></i>
                    <span>Map</span>
                  </a>
                </li>
                )}
                {disable() && (
                <li className="nav-item" style={{ backgroundColor: "black" }}>
                  <a href="/setting" className="nav-link">
                    <i className="flaticon-settings"></i>
                    <span>User Settings</span>
                  </a>
                </li>
                )} */}
              </ul>
            </div>
          </div>
          <div className="dashboard-content-one">
            <div className="breadcrumbs-area">
              <h3>Parent Dashboard</h3>
              <ul>
                <li>{/* <a href="index.html">Home</a> */}</li>
                <li>Parents</li>
              </ul>
            </div>
            <div className="row">
              <div className="col-3-xxxl col-sm-6 col-12">
                <div className="dashboard-summery-one">
                  <div className="row">
                    <div className="col-6">
                      <div className="item-icon bg-light-red">
                        <i className="flaticon-money text-red"></i>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="item-content">
                        <div className="item-title">Due Fees</div>
                        <div className="item-number">
                          <span>₦</span>
                          <span className="" data-num="">
                            {totalDueFees}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-3-xxxl col-sm-6 col-12">
                <div className="dashboard-summery-one">
                  <div className="row">
                    <div className="col-6">
                      <div className="item-icon bg-light-magenta">
                        <i className="flaticon-shopping-list text-magenta"></i>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="item-content">
                        <div className="item-title">Notifications</div>
                        <div className="item-number">
                          <span className="" data-num="">
                            {totalNotification}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-3-xxxl col-sm-6 col-12">
                <div className="dashboard-summery-one">
                  <div className="row">
                    <div className="col-6">
                      <div className="item-icon bg-light-yellow">
                        <i className="flaticon-mortarboard text-orange"></i>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="item-content">
                        <div className="item-title">Result</div>
                        <div className="item-number">
                          <span className="" data-num="">
                            {totalResult}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-3-xxxl col-sm-6 col-12">
                <div className="dashboard-summery-one">
                  <div className="row">
                    <div className="col-6">
                      <div className="item-icon bg-light-blue">
                        <i className="flaticon-money text-blue"></i>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="item-content">
                        <div className="item-title">Expenses</div>
                        <div className="item-number">
                          <span>₦</span>
                          <span className="" data-num="">
                            {totalExpense}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-5-xxxl col-12">
                <div className="card dashboard-card-twelve">
                  <div className="card-body">
                    <div className="heading-layout1">
                      <div className="item-title">
                        <h3>My Kids</h3>
                      </div>
                      <div className="dropdown">
                        <a
                          className="dropdown-toggle"
                          href="/#"
                          role="button"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        >
                          ...
                        </a>

                        <div className="dropdown-menu dropdown-menu-right">
                          <a className="dropdown-item" href="/#">
                            <i className="fas fa-times text-orange-red"></i>
                            Close
                          </a>
                          <a className="dropdown-item" href="/#">
                            <i className="fas fa-cogs text-dark-pastel-green"></i>
                            Edit
                          </a>
                          <a className="dropdown-item" href="/#">
                            <i className="fas fa-redo-alt text-orange-peel"></i>
                            Refresh
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="kids-details-wrap">
                      <div className="row">
                        <div className="col-12-xxxl col-xl-6 col-12">
                          {students.map((student) => (
                            <div
                              key={student.id}
                              className="kids-details-box mb-5"
                            >
                              <div className="item-img">
                                <img src={student1} alt="kids" />
                              </div>
                              <div className="item-content table-responsive">
                                <table className="table text-nowrap">
                                  <tbody>
                                    <tr>
                                      <td>Name:</td>
                                      <td>
                                        {student.first_name} {student.last_name}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Gender:</td>
                                      <td>{student.gender}</td>
                                    </tr>
                                    <tr>
                                      <td>Class:</td>
                                      <td>{student.class_name}</td>
                                    </tr>
                                    <tr>
                                      <td>Email:</td>
                                      <td>{student.email}</td>
                                    </tr>
                                    <tr>
                                      <td>Section:</td>
                                      <td>{student.section}</td>
                                    </tr>
                                    <tr>
                                      <td>Admission Date:</td>
                                      <td>{student.admission_date}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* <div className="col-12-xxxl col-xl-6 col-12">
                          <div className="kids-details-box">
                            <div className="item-img">
                              <img src={student1} alt="kids" />
                            </div>
                            <div className="item-content table-responsive">
                              <table className="table text-nowrap">
                                <tbody>
                                  <tr>
                                    <td>Name:</td>
                                    <td>Jack Steve</td>
                                  </tr>
                                  <tr>
                                    <td>Gender:</td>
                                    <td>Male</td>
                                  </tr>
                                  <tr>
                                    <td>class:</td>
                                    <td>3</td>
                                  </tr>
                                  <tr>
                                    <td>Roll:</td>
                                    <td>#2205</td>
                                  </tr>
                                  <tr>
                                    <td>Section:</td>
                                    <td>A</td>
                                  </tr>
                                  <tr>
                                    <td>Admission Id:</td>
                                    <td>#0045</td>
                                  </tr>
                                  <tr>
                                    <td>Admission Date:</td>
                                    <td>07.08.2017</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-7-xxxl col-12">
                <div className="card dashboard-card-eleven">
                  <div className="card-body">
                    <div className="heading-layout1">
                      <div className="item-title">
                        <h3>All Expenses</h3>
                      </div>
                      <div className="dropdown">
                        <a
                          className="dropdown-toggle"
                          href="/#"
                          role="button"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        >
                          ...
                        </a>

                        <div className="dropdown-menu dropdown-menu-right">
                          {/* <a className="dropdown-item" href="/#">
                            <i className="fas fa-times text-orange-red"></i>
                            Close
                          </a>
                          <a className="dropdown-item" href="/#">
                            <i className="fas fa-cogs text-dark-pastel-green"></i>
                            Edit
                          </a> */}
                          <div className="dropdown-item" onClick={resetSearch}>
                            <i className="fas fa-redo-alt text-orange-peel"></i>
                            Refresh
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="table-box-wrap">
                      <form className="search-form-box">
                        <div className="row gutters-8">
                          <div className="col-lg-4 col-md-3 form-group">
                            <input
                              type="text"
                              placeholder="Search by Exam ..."
                              className="form-control"
                              onChange={(e) => {
                                setKeyword(e.target.value);
                              }}
                            />
                          </div>
                          <div className="col-lg-3 col-md-3 form-group">
                            <input
                              type="text"
                              placeholder="Search by Subject ..."
                              className="form-control"
                              onChange={(e) => {
                                setKeyword(e.target.value);
                              }}
                            />
                          </div>
                          <div className="col-lg-3 col-md-3 form-group">
                            <input
                              type="text"
                              placeholder="dd/mm/yyyy"
                              className="form-control"
                              onChange={(e) => {
                                setKeyword(e.target.value);
                              }}
                            />
                          </div>
                          <div className="col-lg-2 col-md-3 form-group">
                            <button
                              type="submit"
                              className="fw-btn-fill btn-gradient-yellow"
                              onClick={handleSearch}
                            >
                              SEARCH
                            </button>
                          </div>
                        </div>
                      </form>
                      <div className="table-responsive expenses-table-box">
                        <table className="table data-table text-nowrap">
                          <thead>
                            <tr>
                              <th>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input checkAll"
                                  />
                                  <label className="form-check-label">ID</label>
                                </div>
                              </th>
                              <th>Expanse</th>
                              <th>Amount</th>
                              <th>Status</th>
                              <th>E-Mail</th>
                              <th>Date</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {searchActive ? (
                              // Render filteredBooks when a search is active
                              filteredExpenses ? (
                                <tr>
                                  <td>
                                    <div class="form-check">
                                      <input
                                        type="checkbox"
                                        class="form-check-input"
                                      />
                                      <label class="form-check-label">
                                        {filteredExpenses.id_no}
                                      </label>
                                    </div>
                                  </td>
                                  <td>{filteredExpenses.expense_type}</td>
                                  <td>{filteredExpenses.amount}</td>
                                  <td className="badge badge-pill badge-success d-block mg-t-8">
                                    {filteredExpenses.status}
                                  </td>
                                  <td>{filteredExpenses.parent_email}</td>
                                  <td>{filteredExpenses.date_expense}</td>
                                  <td>
                                    <div class="dropdown">
                                      <a
                                        href="/#"
                                        class="dropdown-toggle"
                                        data-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        {/* <span class="flaticon-more-button-of-three-dots"></span> */}
                                      </a>
                                      <div class="dropdown-menu dropdown-menu-right">
                                        <a class="dropdown-item" href="/#">
                                          <i class="fas fa-times text-orange-red"></i>
                                          Close
                                        </a>
                                        <a class="dropdown-item" href="/#">
                                          <i class="fas fa-cogs text-dark-pastel-green"></i>
                                          Edit
                                        </a>
                                        <a class="dropdown-item" href="/#">
                                          <i class="fas fa-redo-alt text-orange-peel"></i>
                                          Refresh
                                        </a>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ) : (
                                <tr>
                                  <td
                                    colSpan="16"
                                    style={{
                                      textAlign: "center",
                                      color: "green",
                                    }}
                                  >
                                    No Matching Expenses Found
                                  </td>
                                </tr>
                              )
                            ) : Array.isArray(expenses) &&
                              expenses.length > 0 ? (
                              expenses.map((expense) => (
                                <tr key={expense.id}>
                                  <td>
                                    <div className="form-check">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                      />
                                      <label className="form-check-label">
                                        {expense.id_no}
                                      </label>
                                    </div>
                                  </td>
                                  <td>{expense.expense_type}</td>
                                  <td>₦{expense.amount}</td>
                                  <td className="badge badge-pill badge-success d-block mg-t-8">
                                    {expense.status}
                                  </td>
                                  <td>{expense.parent_email}</td>
                                  <td>{expense.date_expense}</td>
                                  <td>
                                    <div className="dropdown">
                                      <a
                                        href="/#"
                                        className="dropdown-toggle"
                                        data-toggle="dropdown"
                                        aria-expanded="false"
                                      ></a>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        <a className="dropdown-item" href="/#">
                                          <i className="fas fa-times text-orange-red"></i>
                                          Close
                                        </a>
                                        <a className="dropdown-item" href="/#">
                                          <i className="fas fa-cogs text-dark-pastel-green"></i>
                                          Edit
                                        </a>
                                        <a className="dropdown-item" href="/#">
                                          <i className="fas fa-redo-alt text-orange-peel"></i>
                                          Refresh
                                        </a>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan="16"
                                  style={{
                                    textAlign: "center",
                                    color: "green",
                                  }}
                                >
                                  No Expenses Available
                                </td>
                              </tr>
                            )}
                            {/* <tr>
                              <td>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                  />
                                  <label className="form-check-label">
                                    #0022
                                  </label>
                                </div>
                              </td>
                              <td>Semister Fees</td>
                              <td>₦350.00</td>
                              <td className="badge badge-pill badge-danger d-block mg-t-8">
                                Due
                              </td>
                              <td>akkhorschool@gmail.com</td>
                              <td>22/02/2019</td>
                              <td>
                                <div className="dropdown">
                                  <a
                                    href="/#"
                                    className="dropdown-toggle"
                                    data-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                            
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-times text-orange-red"></i>
                                      Close
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-cogs text-dark-pastel-green"></i>
                                      Edit
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-redo-alt text-orange-peel"></i>
                                      Refresh
                                    </a>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                  />
                                  <label className="form-check-label">
                                    #0023
                                  </label>
                                </div>
                              </td>
                              <td>Exam Fees</td>
                              <td>₦150.00</td>
                              <td className="badge badge-pill badge-success d-block mg-t-8">
                                Paid
                              </td>
                              <td>akkhorschool@gmail.com</td>
                              <td>22/02/2019</td>
                              <td>
                                <div className="dropdown">
                                  <a
                                    href="/#"
                                    className="dropdown-toggle"
                                    data-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-times text-orange-red"></i>
                                      Close
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-cogs text-dark-pastel-green"></i>
                                      Edit
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-redo-alt text-orange-peel"></i>
                                      Refresh
                                    </a>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                  />
                                  <label className="form-check-label">
                                    #0024
                                  </label>
                                </div>
                              </td>
                              <td>Exam Fees</td>
                              <td>₦150.00</td>
                              <td className="badge badge-pill badge-danger d-block mg-t-8">
                                Due{" "}
                              </td>
                              <td>akkhorschool@gmail.com</td>
                              <td>22/02/2019</td>
                              <td>
                                <div className="dropdown">
                                  <a
                                    href="/#"
                                    className="dropdown-toggle"
                                    data-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                  
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-times text-orange-red"></i>
                                      Close
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-cogs text-dark-pastel-green"></i>
                                      Edit
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-redo-alt text-orange-peel"></i>
                                      Refresh
                                    </a>
                                  </div>
                                </div>
                              </td>
                            </tr> */}
                            {/* <tr>
                              <td>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                  />
                                  <label className="form-check-label">
                                    #0025
                                  </label>
                                </div>
                              </td>
                              <td>Exam Fees</td>
                              <td>₦150.00</td>
                              <td className="badge badge-pill badge-success d-block mg-t-8">
                                Paid
                              </td>
                              <td>akkhorschool@gmail.com</td>
                              <td>22/02/2019</td>
                              <td>
                                <div className="dropdown">
                                  <a
                                    href="/#"
                                    className="dropdown-toggle"
                                    data-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                              
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-times text-orange-red"></i>
                                      Close
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-cogs text-dark-pastel-green"></i>
                                      Edit
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-redo-alt text-orange-peel"></i>
                                      Refresh
                                    </a>
                                  </div>
                                </div>
                              </td>
                            </tr> */}
                            {/* <tr>
                              <td>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                  />
                                  <label className="form-check-label">
                                    #0026
                                  </label>
                                </div>
                              </td>
                              <td>Semister Fees</td>
                              <td>₦350.00</td>
                              <td className="badge badge-pill badge-danger d-block mg-t-8">
                                Due
                              </td>
                              <td>akkhorschool@gmail.com</td>
                              <td>22/02/2019</td>
                              <td>
                                <div className="dropdown">
                                  <a
                                    href="/#"
                                    className="dropdown-toggle"
                                    data-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                            
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-times text-orange-red"></i>
                                      Close
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-cogs text-dark-pastel-green"></i>
                                      Edit
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-redo-alt text-orange-peel"></i>
                                      Refresh
                                    </a>
                                  </div>
                                </div>
                              </td>
                            </tr> */}
                            {/* <tr>
                              <td>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                  />
                                  <label className="form-check-label">
                                    #0027
                                  </label>
                                </div>
                              </td>
                              <td>Exam Fees</td>
                              <td>₦150.00</td>
                              <td className="badge badge-pill badge-success d-block mg-t-8">
                                Paid
                              </td>
                              <td>akkhorschool@gmail.com</td>
                              <td>22/02/2019</td>
                              <td>
                                <div className="dropdown">
                                  <a
                                    href="/#"
                                    className="dropdown-toggle"
                                    data-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                              
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-times text-orange-red"></i>
                                      Close
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-cogs text-dark-pastel-green"></i>
                                      Edit
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-redo-alt text-orange-peel"></i>
                                      Refresh
                                    </a>
                                  </div>
                                </div>
                              </td>
                            </tr> */}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-4 col-12">
                <div className="card dashboard-card-six">
                  <div className="card-body">
                    <div className="heading-layout1 mg-b-17">
                      <div className="item-title">
                        <h3>Notifications</h3>
                      </div>
                      <div className="dropdown">
                        <a
                          className="dropdown-toggle"
                          href="/#"
                          role="button"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        >
                          ...
                        </a>

                        <div className="dropdown-menu dropdown-menu-right">
                          <a className="dropdown-item" href="/#">
                            <i className="fas fa-times text-orange-red"></i>
                            Close
                          </a>
                          <a className="dropdown-item" href="/#">
                            <i className="fas fa-cogs text-dark-pastel-green"></i>
                            Edit
                          </a>
                          <a className="dropdown-item" href="/#">
                            <i className="fas fa-redo-alt text-orange-peel"></i>
                            Refresh
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="notice-box-wrap m-height-660">
                      {Array.isArray(notices) && notices.length > 0 ? (
                        notices.map((notice) => (
                          <div className="notice-list" key={notice.id}>
                            <div className="post-date bg-skyblue">
                              <FaCalendarAlt /> {notice.posted_date}
                            </div>
                            <h6 className="notice-title">
                              <a href="/#">{notice.details}</a>
                            </h6>
                            <div className="entry-meta">
                              <FaUser /> {notice.posted_by} / <FaUserClock />{" "}
                              <span>{notice.notice_time}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div
                          style={{ textAlign: "center" }}
                          className="notice-list"
                        >
                          <div
                            style={{ textAlign: "center", color: "black" }}
                            className="post-date bg-skyblue"
                          >
                            No notices available
                          </div>
                        </div>
                      )}
                      {/* <div className="notice-list">
                        <div className="post-date bg-skyblue">
                          16 June, 2019
                        </div>
                        <h6 className="notice-title">
                          <a href="/#">
                            Great School manag mene esom tus eleifend lectus sed
                            maximus mi faucibusnting.
                          </a>
                        </h6>
                        <div className="entry-meta">
                          {" "}
                          Jennyfar Lopez / <span>5 min ago</span>
                        </div>
                      </div> */}
                      {/* <div className="notice-list">
                        <div className="post-date bg-yellow">16 June, 2019</div>
                        <h6 className="notice-title">
                          <a href="/#">Great School manag printing.</a>
                        </h6>
                        <div className="entry-meta">
                          {" "}
                          Jennyfar Lopez / <span>5 min ago</span>
                        </div>
                      </div> */}
                      {/* <div className="notice-list">
                        <div className="post-date bg-pink">16 June, 2019</div>
                        <h6 className="notice-title">
                          <a href="/#">
                            Great School manag Nulla rhoncus eleifensed mim us
                            mi faucibus id. Mauris vestibulum non purus
                            lobortismenearea
                          </a>
                        </h6>
                        <div className="entry-meta">
                          {" "}
                          Jennyfar Lopez / <span>5 min ago</span>
                        </div>
                      </div> */}
                      {/* <div className="notice-list">
                        <div className="post-date bg-blue">16 June, 2019</div>
                        <h6 className="notice-title">
                          <a href="/#">
                            Great School manag mene esom text of the printing.
                          </a>
                        </h6>
                        <div className="entry-meta">
                          {" "}
                          Jennyfar Lopez / <span>5 min ago</span>
                        </div>
                      </div> */}
                      {/* <div className="notice-list">
                        <div className="post-date bg-yellow">16 June, 2019</div>
                        <h6 className="notice-title">
                          <a href="/#">Great School manag printing.</a>
                        </h6>
                        <div className="entry-meta">
                          {" "}
                          Jennyfar Lopez / <span>5 min ago</span>
                        </div>
                      </div> */}
                      {/* <div className="notice-list">
                        <div className="post-date bg-blue">16 June, 2019</div>
                        <h6 className="notice-title">
                          <a href="/#">Great School manag meneesom.</a>
                        </h6>
                        <div className="entry-meta">
                          {" "}
                          Jennyfar Lopez / <span>5 min ago</span>
                        </div>
                      </div> */}
                      {/* <div className="notice-list">
                        <div className="post-date bg-pink">16 June, 2019</div>
                        <h6 className="notice-title">
                          <a href="/#">Great School manag meneesom.</a>
                        </h6>
                        <div className="entry-meta">
                          {" "}
                          Jennyfar Lopez / <span>5 min ago</span>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-8 col-12">
                <div className="card dashboard-card-eleven">
                  <div className="card-body">
                    <div className="heading-layout1">
                      <div className="item-title">
                        <h3>All Exam Results</h3>
                      </div>
                      <div className="dropdown">
                        <a
                          className="dropdown-toggle"
                          href="/#"
                          role="button"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        >
                          ...
                        </a>

                        <div className="dropdown-menu dropdown-menu-right">
                          {/* <a className="dropdown-item" href="/#">
                            <i className="fas fa-times text-orange-red"></i>
                            Close
                          </a>
                          <a className="dropdown-item" href="/#">
                            <i className="fas fa-cogs text-dark-pastel-green"></i>
                            Edit
                          </a> */}
                          <div
                            className="dropdown-item"
                            onClick={resetSearchResult}
                          >
                            <i className="fas fa-redo-alt text-orange-peel"></i>
                            Refresh
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="table-box-wrap">
                      <form className="search-form-box">
                        <div className="row gutters-8">
                          <div className="col-lg-4 col-md-3 form-group">
                            <input
                              type="text"
                              placeholder="Search by Exam Name..."
                              className="form-control"
                              onChange={(e) => {
                                setKeywordResult(e.target.value);
                              }}
                            />
                          </div>
                          <div className="col-lg-3 col-md-3 form-group">
                            <input
                              type="text"
                              placeholder="Search by Subject ..."
                              className="form-control"
                              onChange={(e) => {
                                setKeywordResult(e.target.value);
                              }}
                            />
                          </div>
                          <div className="col-lg-3 col-md-3 form-group">
                            <input
                              type="text"
                              placeholder="dd/mm/yyyy"
                              className="form-control"
                              onChange={(e) => {
                                setKeywordResult(e.target.value);
                              }}
                            />
                          </div>
                          <div className="col-lg-2 col-md-3 form-group">
                            <button
                              type="submit"
                              className="fw-btn-fill btn-gradient-yellow"
                              onClick={handleSearchResult}
                            >
                              SEARCH
                            </button>
                          </div>
                        </div>
                      </form>
                      <div className="table-responsive result-table-box">
                        <table className="table display data-table text-nowrap">
                          <thead>
                            <tr>
                              <th>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input checkAll"
                                  />
                                  <label className="form-check-label">ID</label>
                                </div>
                              </th>
                              <th>Student Name</th>
                              <th>Exam Name</th>
                              <th>Subject</th>
                              <th>className</th>
                              <th>Grade</th>
                              <th>Mark</th>
                              <th>Percent</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {searchActiveResult ? (
                              // Render filteredBooks when a search is active
                              filteredResults ? (
                                <tr>
                                  <td>
                                    <div class="form-check">
                                      <input
                                        type="checkbox"
                                        class="form-check-input"
                                      />
                                      <label class="form-check-label">
                                        {filteredResults.roll}
                                      </label>
                                    </div>
                                  </td>
                                  <td>{filteredResults.student_name}</td>
                                  <td>{filteredResults.exam_name}</td>
                                  <td>{filteredResults.subject}</td>
                                  <td>{filteredResults.class_name}</td>
                                  <td>{filteredResults.grade_name}</td>
                                  <td>{filteredResults.mark}</td>
                                  <td>
                                    {filteredResults.percentage_from}
                                    {">"}
                                    {filteredResults.percentage_upto}
                                  </td>
                                  <td>{filteredResults.result_date}</td>
                                  <td>
                                    <div class="dropdown">
                                      <a
                                        href="/#"
                                        class="dropdown-toggle"
                                        data-toggle="dropdown"
                                        aria-expanded="false"
                                      ></a>
                                      <div class="dropdown-menu dropdown-menu-right">
                                        <a class="dropdown-item" href="/#">
                                          <i class="fas fa-times text-orange-red"></i>
                                          Close
                                        </a>
                                        <a class="dropdown-item" href="/#">
                                          <i class="fas fa-cogs text-dark-pastel-green"></i>
                                          Edit
                                        </a>
                                        <a class="dropdown-item" href="/#">
                                          <i class="fas fa-redo-alt text-orange-peel"></i>
                                          Refresh
                                        </a>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ) : (
                                <tr>
                                  <td
                                    colSpan="16"
                                    style={{
                                      textAlign: "center",
                                      color: "green",
                                    }}
                                  >
                                    No Matching Results Found
                                  </td>
                                </tr>
                              )
                            ) : Array.isArray(results) && results.length > 0 ? (
                              results.map((result) => (
                                <tr key={result.id}>
                                  <td>
                                    <div className="form-check">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                      />
                                      <label className="form-check-label">
                                        {result.roll}
                                      </label>
                                    </div>
                                  </td>
                                  <td>{result.student_name}</td>
                                  <td>{result.exam_name}</td>
                                  <td>{result.subject}</td>
                                  <td>{result.class_name}</td>
                                  <td>{result.grade_name}</td>
                                  <td>{result.mark}</td>
                                  <td>
                                    {result.percentage_from}
                                    {">"}
                                    {result.percentage_upto}
                                  </td>
                                  <td>{result.result_date}</td>
                                  <td>
                                    <div className="dropdown">
                                      <a
                                        href="/#"
                                        className="dropdown-toggle"
                                        data-toggle="dropdown"
                                        aria-expanded="false"
                                      ></a>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        <a className="dropdown-item" href="/#">
                                          <i className="fas fa-times text-orange-red"></i>
                                          Close
                                        </a>
                                        <a className="dropdown-item" href="/#">
                                          <i className="fas fa-cogs text-dark-pastel-green"></i>
                                          Edit
                                        </a>
                                        <a className="dropdown-item" href="/#">
                                          <i className="fas fa-redo-alt text-orange-peel"></i>
                                          Refresh
                                        </a>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan="16"
                                  style={{
                                    textAlign: "center",
                                    color: "green",
                                  }}
                                >
                                  No Results available
                                </td>
                              </tr>
                            )}
                            {/* <tr>
                              <td>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                  />
                                  <label className="form-check-label">
                                    #0022
                                  </label>
                                </div>
                              </td>
                              <td>class Test</td>
                              <td>English</td>
                              <td>1</td>
                              <td>#0025</td>
                              <td>A</td>
                              <td>99.00 {">"} 100</td>
                              <td>22/02/2019</td>
                              <td>
                                <div className="dropdown">
                                  <a
                                    href="/#"
                                    className="dropdown-toggle"
                                    data-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                 
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-times text-orange-red"></i>
                                      Close
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-cogs text-dark-pastel-green"></i>
                                      Edit
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-redo-alt text-orange-peel"></i>
                                      Refresh
                                    </a>
                                  </div>
                                </div>
                              </td>
                            </tr> */}
                            {/* <tr>
                              <td>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                  />
                                  <label className="form-check-label">
                                    #0023
                                  </label>
                                </div>
                              </td>
                              <td>class Test</td>
                              <td>Drawing</td>
                              <td>2</td>
                              <td>#0045</td>
                              <td>A</td>
                              <td>99.00 {">"} 100</td>
                              <td>22/02/2019</td>
                              <td>
                                <div className="dropdown">
                                  <a
                                    href="/#"
                                    className="dropdown-toggle"
                                    data-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-times text-orange-red"></i>
                                      Close
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-cogs text-dark-pastel-green"></i>
                                      Edit
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-redo-alt text-orange-peel"></i>
                                      Refresh
                                    </a>
                                  </div>
                                </div>
                              </td>
                            </tr> */}
                            {/* <tr>
                              <td>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                  />
                                  <label className="form-check-label">
                                    #0024
                                  </label>
                                </div>
                              </td>
                              <td>class Test</td>
                              <td>English</td>
                              <td>1</td>
                              <td>#0048</td>
                              <td>A</td>
                              <td>99.00 {">"} 100</td>
                              <td>22/02/2019</td>
                              <td>
                                <div className="dropdown">
                                  <a
                                    href="/#"
                                    className="dropdown-toggle"
                                    data-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-times text-orange-red"></i>
                                      Close
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-cogs text-dark-pastel-green"></i>
                                      Edit
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-redo-alt text-orange-peel"></i>
                                      Refresh
                                    </a>
                                  </div>
                                </div>
                              </td>
                            </tr> */}
                            {/* <tr>
                              <td>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                  />
                                  <label className="form-check-label">
                                    #0025
                                  </label>
                                </div>
                              </td>
                              <td>class Test</td>
                              <td>Chemistry</td>
                              <td>8</td>
                              <td>#0050</td>
                              <td>A</td>
                              <td>99.00 {">"} 100</td>
                              <td>22/02/2019</td>
                              <td>
                                <div className="dropdown">
                                  <a
                                    href="/#"
                                    className="dropdown-toggle"
                                    data-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                 
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-times text-orange-red"></i>
                                      Close
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-cogs text-dark-pastel-green"></i>
                                      Edit
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-redo-alt text-orange-peel"></i>
                                      Refresh
                                    </a>
                                  </div>
                                </div>
                              </td>
                            </tr> */}
                            {/* <tr>
                              <td>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                  />
                                  <label className="form-check-label">
                                    #0025
                                  </label>
                                </div>
                              </td>
                              <td>class Test</td>
                              <td>Bangla</td>
                              <td>4</td>
                              <td>#0035</td>
                              <td>D</td>
                              <td>70.00 {">"} 100</td>
                              <td>22/02/2019</td>
                              <td>
                                <div className="dropdown">
                                  <a
                                    href="/#"
                                    className="dropdown-toggle"
                                    data-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                              
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-times text-orange-red"></i>
                                      Close
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-cogs text-dark-pastel-green"></i>
                                      Edit
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-redo-alt text-orange-peel"></i>
                                      Refresh
                                    </a>
                                  </div>
                                </div>
                              </td>
                            </tr> */}
                            {/* <tr>
                              <td>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                  />
                                  <label className="form-check-label">
                                    #0025
                                  </label>
                                </div>
                              </td>
                              <td>class Test</td>
                              <td>Drawing</td>
                              <td>2</td>
                              <td>#0045</td>
                              <td>C</td>
                              <td>80.00 {">"} 100</td>
                              <td>22/02/2019</td>
                              <td>
                                <div className="dropdown">
                                  <a
                                    href="/#"
                                    className="dropdown-toggle"
                                    data-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                  
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-times text-orange-red"></i>
                                      Close
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-cogs text-dark-pastel-green"></i>
                                      Edit
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-redo-alt text-orange-peel"></i>
                                      Refresh
                                    </a>
                                  </div>
                                </div>
                              </td>
                            </tr> */}
                            {/* <tr>
                              <td>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                  />
                                  <label className="form-check-label">
                                    #0025
                                  </label>
                                </div>
                              </td>
                              <td>class Test</td>
                              <td>English</td>
                              <td>4</td>
                              <td>#0048</td>
                              <td>B</td>
                              <td>99.00 {">"} 100</td>
                              <td>22/02/2019</td>
                              <td>
                                <div className="dropdown">
                                  <a
                                    href="/#"
                                    className="dropdown-toggle"
                                    data-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                  
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-times text-orange-red"></i>
                                      Close
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-cogs text-dark-pastel-green"></i>
                                      Edit
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-redo-alt text-orange-peel"></i>
                                      Refresh
                                    </a>
                                  </div>
                                </div>
                              </td>
                            </tr> */}
                            {/* <tr>
                              <td>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                  />
                                  <label className="form-check-label">
                                    #0025
                                  </label>
                                </div>
                              </td>
                              <td>First Semister</td>
                              <td>English</td>
                              <td>2</td>
                              <td>#0045</td>
                              <td>A</td>
                              <td>99.00 {">"} 100</td>
                              <td>22/02/2019</td>
                              <td>
                                <div className="dropdown">
                                  <a
                                    href="/#"
                                    className="dropdown-toggle"
                                    data-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                  
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-times text-orange-red"></i>
                                      Close
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-cogs text-dark-pastel-green"></i>
                                      Edit
                                    </a>
                                    <a className="dropdown-item" href="/#">
                                      <i className="fas fa-redo-alt text-orange-peel"></i>
                                      Refresh
                                    </a>
                                  </div>
                                </div>
                              </td>
                            </tr> */}
                          </tbody>
                        </table>
                      </div>
                    </div>
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

export default ParentDashboard;
