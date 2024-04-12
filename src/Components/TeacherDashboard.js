import React, { useEffect, useState, useRef } from "react";
import $ from "jquery";
import { Chart } from "chart.js/auto";
import { initMain } from "../js/main";
import logo1 from "./img/logo1.png";
import penetralia from "./img/penetralia.jpg";
import admin from "./img/figure/admin.jpg";
import student11 from "./img/figure/student11.png";
import student12 from "./img/figure/student12.png";
import student13 from "./img/figure/student13.png";
import student2 from "./img/figure/student2.png";
import { FaCalendarAlt, FaUserClock, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState([]);
  const [notices, setNotices] = useState([]);
  const [students, setStudents] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [filteredStudent, setFilteredStudent] = useState([]);
  const [parentAdmin, setParentAdmin] = useState("");
  const [totalStudent, setTotalStudent] = useState(0);
  const [totalExam, setTotalExam] = useState(0);
  const [totalPromotion, setTotalPromotion] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalFemaleStudentPerClass, setTotalFemaleStudentPerClass] = useState(0);
  const [totalMaleStudentPerClass, setTotalMaleStudentPerClass] = useState(0);
  const studentChartRef = useRef(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const authToken = localStorage.getItem("userInfo");

    if (authToken) {
      const userAuthToken = JSON.parse(authToken);
      const token = userAuthToken.data.access_token;
      const email = userAuthToken.data.email;
      console.log("email:"+ email);

      fetch(
        `https://sms-penetralia.azurewebsites.net/api/teacher/teacher/${email}`,
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
          if (result && result.data) {
            setTeacher(result.data);
           
            localStorage.setItem("class_room", result.data.class_room);
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
    const class_room = localStorage.getItem("class_room");
    console.log("class2:"+ class_room);

    if (authToken) {
      const userAuthToken = JSON.parse(authToken);
      const token = userAuthToken.data.access_token;

      fetch(
        `https://sms-penetralia.azurewebsites.net/api/notice/notice/${class_room}`,
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
          if (result && result.data && Array.isArray(result.data)) {
            setNotices(result.data);
            console.log("ok_notice:"+ notices);
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
    const class_room = localStorage.getItem("class_room");
    console.log("class:"+ class_room);

    if (authToken) {
      const userAuthToken = JSON.parse(authToken);
      const token = userAuthToken.data.access_token;

      fetch(
        `https://sms-penetralia.azurewebsites.net/api/student/student_per_class/${class_room}`,
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
          if (result && result.data && Array.isArray(result.data)) {
            setStudents(result.data);
            console.log("student1:"+ students)
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
      "https://sms-penetralia.azurewebsites.net/api/student/search"
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
          setFilteredStudent(result.data);
        } else {
          console.error("Invalid data structure:", result);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };


  const resetSearch = () => {
    // Clear the search results and set searchActive to false
    setFilteredStudent([]);
    setSearchActive(false);
  };


  useEffect(() => {
    const authToken = localStorage.getItem("userInfo");
    const class_room = localStorage.getItem("class_room");
    console.log("admin:"+ class_room);

    if (authToken) {
      const userAuthToken = JSON.parse(authToken);
      const token = userAuthToken.data.access_token;

      fetch(
        `https://sms-penetralia.azurewebsites.net/api/teacher_admin/admin/${class_room}`,
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
            setParentAdmin(result.data);
            console.log(parentAdmin);
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
    if (parentAdmin) {
      const intervalId = setInterval(() => {
        setTotalStudent((prevCount) =>
          parentAdmin.total_student
            ? Math.min(prevCount + 1, parentAdmin.total_student)
            : prevCount
        );
        setTotalExam((prevCount) =>
          parentAdmin.total_exam
            ? Math.min(prevCount + 1, parentAdmin.total_exam)
            : prevCount
        );
        setTotalPromotion((prevCount) =>
          parentAdmin.total_promote
            ? Math.min(prevCount + 1, parentAdmin.total_promote)
            : prevCount
        );
        setTotalIncome((prevCount) =>
          parentAdmin.total_income
            ? Math.min(prevCount + 1, parentAdmin.total_income)
            : prevCount
        );
        setTotalFemaleStudentPerClass((prevCount) =>
          parentAdmin.total_female_student
            ? Math.min(prevCount + 1, parentAdmin.total_female_student)
            : prevCount
        );
        setTotalMaleStudentPerClass((prevCount) =>
          parentAdmin.total_male_student
            ? Math.min(prevCount + 1, parentAdmin.total_male_student)
            : prevCount
        );
      }, 200); // Update every 200 milliseconds

      return () => clearInterval(intervalId);
    }
  }, [parentAdmin]);



  useEffect(() => {
    // Check if data is available
    if (
      !parentAdmin ||
      !parentAdmin.total_female_student ||
      !parentAdmin.total_male_student
    ) {
      return;
    }

    // Destroy existing chart if it exists
    if (studentChartRef.current) {
      studentChartRef.current.destroy();
    }

    var doughnutChartData = {
      labels: ["Female Students", "Male Students"],
      datasets: [
        {
          backgroundColor: ["#304ffe", "#ffa601"],
          data: [
            parentAdmin.total_female_student,
            parentAdmin.total_male_student,
          ],
          label: "Total Students",
        },
      ],
    };

    var doughnutChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutoutPercentage: 65,
      rotation: -9.4,
      animation: {
        duration: 2000,
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: true,
      },
    };

    var studentCanvas = $("#teacher-doughnut-chart").get(0).getContext("2d");
    var newStudentChart = new Chart(studentCanvas, {
      type: "doughnut",
      data: doughnutChartData,
      options: doughnutChartOptions,
    });

    // Save the chart instance to the ref
    studentChartRef.current = newStudentChart;

    // Cleanup function to destroy the chart when the component is unmounted
    return () => {
      if (newStudentChart) {
        newStudentChart.destroy();
      }
    };
  }, [parentAdmin]);



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
                <a href="index.html">
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
                    {disable() && (
                      <li className="nav-item">
                        <a href="/studentDetails" className="nav-link">
                          <i className="fas fa-angle-right"></i>Student Details
                        </a>
                      </li>
                    )}
                    {disable() && (
                      <li className="nav-item">
                        <a href="/admissionForm" className="nav-link">
                          <i className="fas fa-angle-right"></i>Admission Form
                        </a>
                      </li>
                    )}
                    <li className="nav-item">
                      <a href="/studentPromotion" className="nav-link">
                        <i className="fas fa-angle-right"></i>Student Promotion
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
                          <i className="fas fa-angle-right"></i>Teacher Details
                        </a>
                      </li>
                    )}
                    {disable() && (
                      <li className="nav-item">
                        <a href="/addTeacher" className="nav-link">
                          <i className="fas fa-angle-right"></i>Add Teacher
                        </a>
                      </li>
                    )}
                    <li className="nav-item">
                      <a href="/teacherPayment" className="nav-link">
                        <i className="fas fa-angle-right"></i>Teacher Payment
                      </a>
                    </li>
                    {disable() && (
                      <li className="nav-item">
                        <a href="/addTeacherPayment" className="nav-link">
                          <i class="fas fa-angle-right"></i>Add Payment
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
                          <i className="fas fa-angle-right"></i>Parents Details
                        </a>
                      </li>
                    )}
                    {disable() && (
                      <li className="nav-item">
                        <a href="/addParent" className="nav-link">
                          <i className="fas fa-angle-right"></i>Add Parent
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
                    {disable() && (
                      <li class="nav-item">
                        <a href="/addFees" class="nav-link">
                          <i class="fas fa-angle-right"></i>Add Fees Collection
                        </a>
                      </li>
                    )}
                    <li className="nav-item">
                      <a href="/allExpense" className="nav-link">
                        <i className="fas fa-angle-right"></i>All Expenses
                      </a>
                    </li>
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
                          <i className="fas fa-angle-right"></i>Add New class
                        </a>
                      </li>
                    )}
                  </ul>
                </li>
                <li className="nav-item" style={{ backgroundColor: "black" }}>
                  <a href="/subject" className="nav-link">
                    <i className="flaticon-open-book"></i>
                    <span>Subject</span>
                  </a>
                </li>
                <li className="nav-item" style={{ backgroundColor: "black" }}>
                  <a href="/classRoutine" className="nav-link">
                    <i className="flaticon-calendar"></i>
                    <span>class Routine</span>
                  </a>
                </li>
                <li className="nav-item" style={{ backgroundColor: "black" }}>
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
                {disable() && (
                  <li className="nav-item" style={{ backgroundColor: "black" }}>
                    <a href="/transport" className="nav-link">
                      <i className="flaticon-bus-side-view"></i>
                      <span>Transport</span>
                    </a>
                  </li>
                )}
                <li className="nav-item" style={{ backgroundColor: "black" }}>
                  <a href="/hostel" className="nav-link">
                    <i className="flaticon-bed"></i>
                    <span>Hostel</span>
                  </a>
                </li>
                <li className="nav-item" style={{ backgroundColor: "black" }}>
                  <a href="/notice" className="nav-link">
                    <i className="flaticon-script"></i>
                    <span>Notice</span>
                  </a>
                </li>
                <li className="nav-item" style={{ backgroundColor: "black" }}>
                  <a href="/messaging" className="nav-link">
                    <i className="flaticon-chat"></i>
                    <span>Messeage</span>
                  </a>
                </li>
                {/* <li className="nav-item" style={{ backgroundColor: "black" }}>
                  <a href="/map.html" className="nav-link">
                    <i className="flaticon-planet-earth"></i>
                    <span>Map</span>
                  </a>
                </li> */}
                {disable() && (
                  <li className="nav-item" style={{ backgroundColor: "black" }}>
                    <a href="/setting" className="nav-link">
                      <i className="flaticon-settings"></i>
                      <span>User Settings</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="dashboard-content-one">
            <div className="breadcrumbs-area">
              <h3>Teacher Dashboard</h3>
              <ul>
                <li>{/* <a href="index.html">Home</a> */}</li>
                <li>Teachers</li>
              </ul>
            </div>
            <div className="row">
              <div className="col-12 col-4-xxxl">
                <div className="row">
                  <div className="col-6-xxxl col-lg-3 col-sm-6 col-12">
                    <div className="dashboard-summery-two">
                      <div className="item-icon bg-light-magenta">
                        <i className="flaticon-classmates text-magenta"></i>
                      </div>
                      <div className="item-content">
                        <div className="item-number">
                          <span className="" data-num="">
                            {totalStudent}
                          </span>
                        </div>
                        <div className="item-title">Total Students</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6-xxxl col-lg-3 col-sm-6 col-12">
                    <div className="dashboard-summery-two">
                      <div className="item-icon bg-light-blue">
                        <i className="flaticon-shopping-list text-blue"></i>
                      </div>
                      <div className="item-content">
                        <div className="item-number">
                          <span className="" data-num="">
                            {totalExam}
                          </span>
                        </div>
                        <div className="item-title">Total Exams</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6-xxxl col-lg-3 col-sm-6 col-12">
                    <div className="dashboard-summery-two">
                      <div className="item-icon bg-light-yellow">
                        <i className="flaticon-mortarboard text-orange"></i>
                      </div>
                      <div className="item-content">
                        <div className="item-number">
                          <span className="" data-num="">
                            {totalPromotion}
                          </span>
                        </div>
                        <div className="item-title">Graduate Studes</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6-xxxl col-lg-3 col-sm-6 col-12">
                    <div className="dashboard-summery-two">
                      <div className="item-icon bg-light-red">
                        <i className="flaticon-percentage-discount text-orange"></i>
                      </div>
                      <div className="item-content">
                        <div className="item-number">
                          <span className="" data-num="">
                            {totalIncome}
                          </span>
                          <span>%</span>
                        </div>
                        <div className="item-title">Attendance</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-4-xxxl col-xl-6">
                <div className="card dashboard-card-three">
                  <div className="card-body">
                    <div className="heading-layout1">
                      <div className="item-title">
                        <h3>Students</h3>
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
                    <div className="doughnut-chart-wrap">
                      <canvas
                        id="teacher-doughnut-chart"
                        width="100"
                        height="270"
                      ></canvas>
                    </div>
                    <div className="student-report">
                      <div className="student-count pseudo-bg-blue">
                        <h4 className="item-title">Female Students</h4>
                        <div className="item-number">
                          {totalFemaleStudentPerClass}
                        </div>
                      </div>
                      <div className="student-count pseudo-bg-yellow">
                        <h4 className="item-title">Male Students</h4>
                        <div className="item-number">
                          {totalMaleStudentPerClass}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-4-xxxl col-xl-6">
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
                    <div className="notice-box-wrap">
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
                       <div className="post-date bg-skyblue">16 June, 2019</div>
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
                     </div>
                     <div className="notice-list">
                       <div className="post-date bg-pink">16 June, 2019</div>
                       <h6 className="notice-title">
                         <a href="/#">
                           Great School manag Nulla rhoncus eleifensed mim us mi
                           faucibus id. Mauris vestibulum non purus
                           lobortismenearea
                         </a>
                       </h6>
                       <div className="entry-meta">
                         {" "}
                         Jennyfar Lopez / <span>5 min ago</span>
                       </div>
                     </div>
                     <div className="notice-list">
                       <div className="post-date bg-skyblue">16 June, 2019</div>
                       <h6 className="notice-title">
                         <a href="/#">
                           Great School manag mene esom text of the printing.
                         </a>
                       </h6>
                       <div className="entry-meta">
                         {" "}
                         Jennyfar Lopez / <span>5 min ago</span>
                       </div>
                     </div>
                     <div className="notice-list">
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
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="card dashboard-card-eleven">
                  <div className="card-body">
                    <div className="heading-layout1">
                      <div className="item-title">
                        <h3>My Students</h3>
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
                          <div className="col-3-xxxl col-xl-3 col-lg-3 col-12 form-group">
                            <input
                              type="text"
                              placeholder="Search by Roll ..."
                              className="form-control"
                              onChange={(e) => {
                                setKeyword(e.target.value);
                              }}
                            />
                          </div>
                          <div className="col-4-xxxl col-xl-4 col-lg-4 col-12 form-group">
                            <input
                              type="text"
                              placeholder="Search by Name ..."
                              className="form-control"
                              onChange={(e) => {
                                setKeyword(e.target.value);
                              }}
                            />
                          </div>
                          <div className="col-4-xxxl col-xl-3 col-lg-3 col-12 form-group">
                            <input
                              type="text"
                              placeholder="Search by className ..."
                              className="form-control"
                              onChange={(e) => {
                                setKeyword(e.target.value);
                              }}
                            />
                          </div>
                          <div className="col-1-xxxl col-xl-2 col-lg-2 col-12 form-group">
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
                      <div className="table-responsive student-table-box">
                        <table className="table display data-table text-nowrap">
                          <thead>
                            <tr>
                              <th>Photo</th>
                              <th>Name</th>
                              <th>Gender</th>
                              <th>className</th>
                              <th>Section</th>
                              <th>Parents</th>
                              <th>Address</th>
                              <th>Date Of Birth</th>
                              <th>Admission Date</th>
                              <th>Phone</th>
                              <th>E-mail</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {searchActive ? (
                              // Render filteredBooks when a search is active
                              filteredStudent ? (
                                <tr>
                                  {/* <td>
                                    <div class="form-check">
                                      <input
                                        type="checkbox"
                                        class="form-check-input"
                                      />
                                      <label class="form-check-label">
                                        {filteredStudent.id_no}
                                      </label>
                                    </div>
                                  </td> */}
                                  <td>
                                    {filteredStudent.first_name}{" "}
                                    {filteredStudent.last_name}
                                  </td>
                                  <td>{filteredStudent.gender}</td>
                                  <td>{filteredStudent.class_name}</td>
                                  <td>{filteredStudent.section}</td>
                                  <td>
                                    {filteredStudent.father_name}{" "}
                                    {filteredStudent.mother_name}
                                  </td>
                                  <td>{filteredStudent.address}</td>
                                  <td>{filteredStudent.date_of_birth}</td>
                                  <td>{filteredStudent.admission_date}</td>
                                  <td>{filteredStudent.phone}</td>
                                  <td>{filteredStudent.email}</td>
                                  {/* <td>
                                    <div class="dropdown">
                                      <a
                                        href="/#"
                                        class="dropdown-toggle"
                                        data-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                     
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
                                  </td> */}
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
                                    No Matching Student Found
                                  </td>
                                </tr>
                              )
                            ) : Array.isArray(students) &&
                              students.length > 0 ? (
                              students.map((student) => (
                                <tr key={student.id}>
                                  <td className="text-center">
                                    <img src={student2} alt="student" />
                                  </td>
                                  <td>
                                    {student.first_name} {student.last_name}
                                  </td>
                                  <td>{student.gender}</td>
                                  <td>{student.class_name}</td>
                                  <td>{student.section}</td>
                                  <td>
                                    {student.father_name} {student.mother_name}
                                  </td>
                                  <td>{student.address}</td>
                                  <td>{student.date_of_birth}</td>
                                  <td>{student.admission_date}</td>
                                  <td>{student.phone}</td>
                                  <td>{student.email}</td>
                                  {/* <td>
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
                                  </td> */}
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
                                  No Student Record Available
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
                             <td className="text-center">
                               <img src={student2} alt="student" />
                             </td>
                             <td>Jessia Rose</td>
                             <td>Female</td>
                             <td>1</td>
                             <td>A</td>
                             <td>Maria Jamans</td>
                             <td>59 Australia, Sydney</td>
                             <td>02/05/2001</td>
                             <td>+ 123 9988568</td>
                             <td>kazifahim93@gmail.com</td>
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
                             <td className="text-center">
                               <img src={student2} alt="student" />
                             </td>
                             <td>Mark Willy</td>
                             <td>Male</td>
                             <td>2</td>
                             <td>A</td>
                             <td>Jack Sparrow </td>
                             <td>TA-107 Newyork</td>
                             <td>02/05/2001</td>
                             <td>+ 123 9988568</td>
                             <td>kazifahim93@gmail.com</td>
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
                             <td className="text-center">
                               <img src={student2} alt="student" />
                             </td>
                             <td>Jessia Rose</td>
                             <td>Female</td>
                             <td>1</td>
                             <td>A</td>
                             <td>Maria Jamans</td>
                             <td>59 Australia, Sydney</td>
                             <td>02/05/2001</td>
                             <td>+ 123 9988568</td>
                             <td>kazifahim93@gmail.com</td>
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
                                   #0025
                                 </label>
                               </div>
                             </td>
                             <td className="text-center">
                               <img src={student2} alt="student" />
                             </td>
                             <td>Mark Willy</td>
                             <td>Male</td>
                             <td>2</td>
                             <td>A</td>
                             <td>Jack Sparrow </td>
                             <td>TA-107 Newyork</td>
                             <td>02/05/2001</td>
                             <td>+ 123 9988568</td>
                             <td>kazifahim93@gmail.com</td>
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
                                   #0026
                                 </label>
                               </div>
                             </td>
                             <td className="text-center">
                               <img src={student2} alt="student" />
                             </td>
                             <td>Jessia Rose</td>
                             <td>Female</td>
                             <td>1</td>
                             <td>A</td>
                             <td>Maria Jamans</td>
                             <td>59 Australia, Sydney</td>
                             <td>02/05/2001</td>
                             <td>+ 123 9988568</td>
                             <td>kazifahim93@gmail.com</td>
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
                                   #0027
                                 </label>
                               </div>
                             </td>
                             <td className="text-center">
                               <img src={student2} alt="student" />
                             </td>
                             <td>Mark Willy</td>
                             <td>Male</td>
                             <td>2</td>
                             <td>A</td>
                             <td>Jack Sparrow </td>
                             <td>TA-107 Newyork</td>
                             <td>02/05/2001</td>
                             <td>+ 123 9988568</td>
                             <td>kazifahim93@gmail.com</td>
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
                                   #0028
                                 </label>
                               </div>
                             </td>
                             <td className="text-center">
                               <img src={student2} alt="student" />
                             </td>
                             <td>Jessia Rose</td>
                             <td>Female</td>
                             <td>1</td>
                             <td>A</td>
                             <td>Maria Jamans</td>
                             <td>59 Australia, Sydney</td>
                             <td>02/05/2001</td>
                             <td>+ 123 9988568</td>
                             <td>kazifahim93@gmail.com</td>
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
                                   #0029
                                 </label>
                               </div>
                             </td>
                             <td className="text-center">
                               <img src={student2} alt="student" />
                             </td>
                             <td>Mark Willy</td>
                             <td>Male</td>
                             <td>2</td>
                             <td>A</td>
                             <td>Jack Sparrow </td>
                             <td>TA-107 Newyork</td>
                             <td>02/05/2001</td>
                             <td>+ 123 9988568</td>
                             <td>kazifahim93@gmail.com</td>
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
                                   #0030
                                 </label>
                               </div>
                             </td>
                             <td className="text-center">
                               <img src={student2} alt="student" />
                             </td>
                             <td>Jessia Rose</td>
                             <td>Female</td>
                             <td>1</td>
                             <td>A</td>
                             <td>Maria Jamans</td>
                             <td>59 Australia, Sydney</td>
                             <td>02/05/2001</td>
                             <td>+ 123 9988568</td>
                             <td>kazifahim93@gmail.com</td>
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

export default TeacherDashboard;
