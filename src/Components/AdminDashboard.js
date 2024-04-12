import { registerLicense } from "@syncfusion/ej2-base";
import $ from "jquery";
import { Chart } from "chart.js/auto";
import React, { useState, useRef, useEffect } from "react";
import logo1 from "./img/logo1.png";
import penetralia from "./img/penetralia.jpg";
import adminP from "./img/figure/admin.jpg";
import student11 from "./img/figure/student11.png";
import student12 from "./img/figure/student12.png";
import student13 from "./img/figure/student13.png";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  ScheduleComponent,
  Day,
  Week,
  Month,
  Inject,
} from "@syncfusion/ej2-react-schedule";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-calendars/styles/material.css";
import "@syncfusion/ej2-dropdowns/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-lists/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-react-schedule/styles/material.css";
import { FaCalendarAlt, FaUserClock, FaUser } from "react-icons/fa";
import {initMain} from "../js/main";
import {useNavigate} from "react-router-dom";



const AdminDashboard = () => {
  const [admin, setAdmin] = useState(() => {
    const storedData = localStorage.getItem("adminData");
    return storedData ? JSON.parse(storedData) : "";
  });
  const earningChartRef = useRef(null);
  const expenseChartRef = useRef(null);
  const studentChartRef = useRef(null);
  const [notices, setNotices] = useState("");
  const [studentCount, setStudentCount] = useState(0);
  const [parentCount, setParentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [earningCount, setEarningCount] = useState(0);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const navigate = useNavigate();
  

  registerLicense(
    "Ngo9BigBOggjHTQxAR8/V1NAaF5cWWJCfEx0Q3xbf1x0ZFJMZV1bRndPMyBoS35RckViW3hed3FURGJZWEZ2"
  );

  const handleEventClick = (args) => {
    setSelectedEvent(args.event);
  };

  const handleCloseForm = () => {
    setSelectedEvent(null);
  };

  useEffect(() => {
    const authToken = localStorage.getItem("userInfo");

    if (authToken) {
      const userAuthToken = JSON.parse(authToken);
      const token = userAuthToken.data.access_token;

      fetch("https://sms-penetralia.azurewebsites.net/api/dashboard", {
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
          if (result && result.data) {
            setAdmin(result.data);
            // Save the fetched data in localStorage
            console.log(admin);
            localStorage.setItem("adminData", JSON.stringify(result.data));
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
    if (admin) {
      const intervalId = setInterval(() => {
        setStudentCount((prevCount) =>
          admin.total_student
            ? Math.min(prevCount + 1, admin.total_student)
            : prevCount
        );
        setParentCount((prevCount) =>
          admin.total_parent
            ? Math.min(prevCount + 1, admin.total_parent)
            : prevCount
        );
        setTeacherCount((prevCount) =>
          admin.total_teacher
            ? Math.min(prevCount + 1, admin.total_teacher)
            : prevCount
        );
        setEarningCount((prevCount) =>
          admin.total_earning
            ? Math.min(prevCount + 1, admin.total_earning)
            : prevCount
        );
      }, 200); // Update every 200 milliseconds

      return () => clearInterval(intervalId);
    }
  }, [admin]);

  useEffect(() => {
    // Check if data is available
    if (
      !admin ||
      !admin.total_collection_by_month ||
      !admin.fees_collection_by_month
    ) {
      return;
    }

    // Destroy existing chart if it exists
    if (earningChartRef.current) {
      earningChartRef.current.destroy();
    }

    var lineChartData = {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apri",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          data: admin.total_collection_by_month,
          backgroundColor: "#ff0000",
          borderColor: "#ff0000",
          borderWidth: 1,
          pointRadius: 0,
          pointBackgroundColor: "#ff0000",
          pointBorderColor: "#ffffff",
          pointHoverRadius: 6,
          pointHoverBorderWidth: 3,
          fill: "origin",
          label: "Total Collection",
        },
        {
          data: admin.fees_collection_by_month,
          backgroundColor: "#417dfc",
          borderColor: "#417dfc",
          borderWidth: 1,
          pointRadius: 0,
          pointBackgroundColor: "#304ffe",
          pointBorderColor: "#ffffff",
          pointHoverRadius: 6,
          pointHoverBorderWidth: 3,
          fill: "origin",
          label: "Fees Collection",
        },
      ],
    };

    var lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 2000,
      },
      scales: {
        xAxes: [
          {
            display: true,
            ticks: {
              display: true,
              fontColor: "#222222",
              fontSize: 16,
              padding: 20,
            },
            gridLines: {
              display: true,
              drawBorder: true,
              color: "#cccccc",
              borderDash: [5, 5],
            },
          },
        ],
        yAxes: [
          {
            display: true,
            ticks: {
              display: true,
              autoSkip: true,
              maxRotation: 0,
              fontColor: "#646464",
              fontSize: 16,
              stepSize: 25000,
              padding: 20,
              callback: function (value) {
                var ranges = [
                  {
                    divider: 1e6,
                    suffix: "M",
                  },
                  {
                    divider: 1e3,
                    suffix: "",
                  },
                ];

                function formatNumber(n) {
                  for (var i = 0; i < ranges.length; i++) {
                    if (n >= ranges[i].divider) {
                      return (
                        (n / ranges[i].divider).toString() + ranges[i].suffix
                      );
                    }
                  }
                  return n;
                }
                return formatNumber(value);
              },
            },
            gridLines: {
              display: true,
              drawBorder: false,
              color: "#cccccc",
              borderDash: [5, 5],
              zeroLineBorderDash: [5, 5],
            },
          },
        ],
      },
      legend: {
        display: false,
      },
      tooltips: {
        mode: "index",
        intersect: false,
        enabled: true,
      },
      elements: {
        line: {
          tension: 0.35,
        },
        point: {
          pointStyle: "circle",
        },
      },
    };

    var earningCanvas = $("#earning-line-chart").get(0).getContext("2d");
    var newEarningChart = new Chart(earningCanvas, {
      type: "line",
      data: lineChartData,
      options: lineChartOptions,
    });

    // Save the chart instance to the ref and state
    earningChartRef.current = newEarningChart;
    // setEarningChart(newEarningChart)

    // Cleanup function to destroy the chart when the component is unmounted
    return () => {
      if (newEarningChart) {
        newEarningChart.destroy();
      }
    };
  }, [admin]);

  useEffect(() => {
    // Check if data is available
    if (!admin || !admin.expense_chart) {
      return;
    }

    // Destroy existing chart if it exists
    if (expenseChartRef.current) {
      expenseChartRef.current.destroy();
    }

    var barChartData = {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          backgroundColor: [
            "#40dfcd",
            "#417dfc",
            "#ffaa01",
            "#32CF30",
            "#EFE558",
            "#4E4535",
            "#ffaa01",
            "#3C97A1",
            "#21A0BD",
            "#7B7974",
            "#040404",
            "#F53009",
          ],
          data: admin.expense_chart,
          label: "Expenses (millions)",
        },
      ],
    };

    var barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 2000,
      },
      scales: {
        xAxes: [
          {
            display: true,
            maxBarThickness: 100,
            ticks: {
              display: true,
              fontColor: "#646464",
              fontSize: 14,
            },
            gridLines: {
              display: true,
              color: "#e1e1e1",
            },
          },
        ],
        yAxes: [
          {
            display: true,
            ticks: {
              display: true,
              autoSkip: false,
              fontColor: "#646464",
              fontSize: 14,
              stepSize: 25000,
              padding: 20,
              beginAtZero: true,
              callback: function (value) {
                var ranges = [
                  {
                    divider: 1e6,
                    suffix: "M",
                  },
                  {
                    divider: 1e3,
                    suffix: "",
                  },
                ];

                function formatNumber(n) {
                  for (var i = 0; i < ranges.length; i++) {
                    if (n >= ranges[i].divider) {
                      return (
                        (n / ranges[i].divider).toString() + ranges[i].suffix
                      );
                    }
                  }
                  return n;
                }
                return formatNumber(value);
              },
            },
            gridLines: {
              display: true,
              drawBorder: true,
              color: "#e1e1e1",
              zeroLineColor: "#e1e1e1",
            },
          },
        ],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: true,
      },
      elements: {},
    };

    var expenseCanvas = $("#expense-bar-chart").get(0).getContext("2d");
    var newExpenseChart = new Chart(expenseCanvas, {
      type: "bar",
      data: barChartData,
      options: barChartOptions,
    });

    // Save the chart instance to the ref
    expenseChartRef.current = newExpenseChart;

    // Cleanup function to destroy the chart when the component is unmounted
    return () => {
      if (newExpenseChart) {
        newExpenseChart.destroy();
      }
    };
  }, [admin]);

  useEffect(() => {
    // Check if data is available
    if (!admin || !admin.total_female_student || !admin.total_male_student) {
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
          data: [admin.total_female_student, admin.total_male_student],
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

    var studentCanvas = $("#student-doughnut-chart").get(0).getContext("2d");
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
  }, [admin]);

  useEffect(() => {
    const authToken = localStorage.getItem("userInfo");

    if (authToken) {
      const userAuthToken = JSON.parse(authToken);
      const token = userAuthToken.data.access_token;

      fetch("https://sms-penetralia.azurewebsites.net/api/notice/notice_list", {
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
    initMain();
  }, []);


  const handleAddEvent = (event) => {
    setEvents([...events, event]);
  };


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
    const role = userAuthToken.data.roles;
   
    switch (role) {
      case "admin":
        return true
      case "student":
        return true
      case "parent":
        return true
      case "teacher":
        return true
      default:
        return false
       
    }
  }




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
                    <img src={adminP} alt="Admin" />
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
                        <i className="fas fa-angle-right"></i>Student Details
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
                <li className="nav-item" style={{ backgroundColor: "black" }}>
                  <a href="/subject" className="nav-link">
                    <i className="flaticon-open-book"></i>
                    <span>Subject</span>
                  </a>
                </li>
                <li className="nav-item" style={{ backgroundColor: "black" }}>
                  <a href="/classRoutine" className="nav-link">
                    <i className="flaticon-calendar"></i>
                    <span>Class Routine</span>
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
                <li className="nav-item" style={{ backgroundColor: "black" }}>
                  <a href="/transport" className="nav-link">
                    <i className="flaticon-bus-side-view"></i>
                    <span>Transport</span>
                  </a>
                </li>
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
                <li className="nav-item" style={{ backgroundColor: "black" }}>
                  <a href="/setting" className="nav-link">
                    <i className="flaticon-settings"></i>
                    <span>Users Setting</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="dashboard-content-one">
            <div className="breadcrumbs-area">
              <h3>Admin Dashboard</h3>
              <ul>
                <li>
                  <a href="/index.html">Home</a>
                </li>
                <li>Admin</li>
              </ul>
            </div>

            <div className="row gutters-20">
              <div className="col-xl-3 col-sm-6 col-12">
                <div className="dashboard-summery-one mg-b-20">
                  <div className="row align-items-center">
                    <div className="col-6">
                      <div className="item-icon bg-light-green ">
                        <i className="flaticon-classmates text-green"></i>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="item-content">
                        <div className="item-title">Total Students</div>
                        <div className="item-number">
                          <span className="" data-num="">
                            {studentCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6 col-12">
                <div className="dashboard-summery-one mg-b-20">
                  <div className="row align-items-center">
                    <div className="col-6">
                      <div className="item-icon bg-light-blue">
                        <i className="flaticon-multiple-users-silhouette text-blue"></i>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="item-content">
                        <div className="item-title">Total Teachers</div>
                        <div className="item-number">
                          <span className="" data-num="">
                            {teacherCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6 col-12">
                <div className="dashboard-summery-one mg-b-20">
                  <div className="row align-items-center">
                    <div className="col-6">
                      <div className="item-icon bg-light-yellow">
                        <i className="flaticon-couple text-orange"></i>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="item-content">
                        <div className="item-title">Total Parents</div>
                        <div className="item-number">
                          <span className="" data-num="">
                            {parentCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-sm-6 col-12">
                <div className="dashboard-summery-one mg-b-20">
                  <div className="row align-items-center">
                    <div className="col-6">
                      <div className="item-icon bg-light-red">
                        <i className="flaticon-money text-red"></i>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="item-content">
                        <div className="item-title">Total Earnings</div>
                        <div className="item-number">
                          <span>₦</span>
                          <span className="" data-num="">
                            {earningCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row gutters-20">
              <div className="col-12 col-xl-8 col-6-xxxl">
                <div className="card dashboard-card-one pd-b-20">
                  <div className="card-body">
                    <div className="heading-layout1">
                      <div className="item-title">
                        <h3>Earnings</h3>
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
                    <div className="earning-report">
                      <div className="item-content">
                        <div className="single-item pseudo-bg-red">
                          <h4>Total Collections</h4>
                          <h4>₦{admin.total_collection}</h4>
                        </div>
                        <div className="single-item pseudo-bg-blue">
                          <h4>Fees Collection</h4>
                          <h4>₦{admin.fees_collection}</h4>
                        </div>
                      </div>
                      <div className="dropdown">
                        <a
                          className="date-dropdown-toggle"
                          href="/#"
                          role="button"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Jan 20, 2019
                        </a>
                        <div className="dropdown-menu dropdown-menu-right">
                          <a className="dropdown-item" href="/#">
                            Jan 20, 2019
                          </a>
                          <a className="dropdown-item" href="/#">
                            Jan 20, 2020
                          </a>
                          <a className="dropdown-item" href="/#">
                            Jan 20, 2021
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="earning-chart-wrap">
                      <canvas
                        id="earning-line-chart"
                        width="660"
                        height="320"
                      ></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-xl-4 col-3-xxxl">
                <div className="card dashboard-card-two pd-b-20">
                  <div className="card-body">
                    <div className="heading-layout1">
                      <div className="item-title">
                        <h3>Expenses</h3>
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
                    <div className="expense-report">
                      <div className="monthly-expense pseudo-bg-Aquamarine">
                        <div className="expense-date">Jan</div>
                        <div className="expense-amount">
                          {/* <span>₦</span> 15,000 */}
                        </div>
                      </div>
                      <div className="monthly-expense pseudo-bg-blue">
                        <div className="expense-date">Feb</div>
                        <div className="expense-amount">
                          {/* <span>₦</span> 10,000 */}
                        </div>
                      </div>
                      <div className="monthly-expense pseudo-bg-yellow">
                        <div className="expense-date">Mar</div>
                        <div className="expense-amount">
                          {/* <span>₦</span> 8,000 */}
                        </div>
                      </div>
                    </div>
                    <div className="expense-chart-wrap">
                      <canvas
                        id="expense-bar-chart"
                        width="150"
                        height="300"
                      ></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-xl-6 col-3-xxxl">
                <div className="card dashboard-card-three pd-b-20">
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
                        id="student-doughnut-chart"
                        width="100"
                        height="300"
                      ></canvas>
                    </div>
                    <div className="student-report">
                      <div className="student-count pseudo-bg-yellow">
                        <h4 className="item-title">Male Students</h4>
                        <div className="item-number">
                          {admin.total_male_student}
                        </div>
                      </div>
                      <div className="student-count pseudo-bg-blue">
                        <h4 className="item-title">Female Students</h4>
                        <div className="item-number">
                          {admin.total_female_student}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-xl-6 col-4-xxxl">
                <div className="card dashboard-card-four pd-b-20">
                  <div
                    className="card-body"
                    style={{ maxHeight: 500, overflow: "hidden auto" }}
                  >
                    <div className="heading-layout1">
                      <div className="item-title">
                        <h3>Event Calender</h3>
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
                    <div className="calender-wrap">
                      <div id="" className="fc-calender">
                        {selectedEvent && (
                          <div>
                            <form
                              onSubmit={(values, { setSubmitting }) => {
                                setSubmitting(true);
                                handleAddEvent(values);
                                setSubmitting(false);
                                setSelectedEvent(null);
                              }}
                            >
                              <label>Title:</label>
                              <input
                                type="text"
                                name="title"
                                defaultValue={selectedEvent.Subject}
                              />

                              <label>Location:</label>
                              <input
                                type="text"
                                name="location"
                                defaultValue={selectedEvent.Location}
                              />

                              <label>Start Date:</label>
                              <input
                                type="date"
                                name="startDate"
                                defaultValue={selectedEvent.StartTime}
                              />

                              <label>End Date:</label>
                              <input
                                type="date"
                                name="endDate"
                                defaultValue={selectedEvent.EndTime}
                              />

                              <label>Description:</label>
                              <input
                                type="text"
                                name="description"
                                defaultValue={selectedEvent.Description}
                              />

                              <button type="submit">Save Changes</button>
                              <button type="button" onClick={handleCloseForm}>
                                Cancel
                              </button>
                            </form>
                          </div>
                        )}
                        <ScheduleComponent
                          currentView="Month"
                          eventClick={handleEventClick}
                          eventSettings={{ dataSource: events }}
                        >
                          <Inject services={[Day, Week, Month]} />
                          <style>
                            {`
          /* Custom styles for calendar-like appearance */
          .e-schedule {
            border: 1px solid #ddd; /* Border color */
            border-radius: 5px; /* Border radius */
            overflow: hidden; /* Hide overflow content */
          }

          .e-schedule .e-schedule-toolbar {
            background-color: #f8f8f8; /* Toolbar background color */
            border-bottom: 1px solid #ddd; /* Bottom border color */
          }

          .e-schedule .e-toolbar-item {
            color: #333; /* Toolbar item text color */
          }

          .e-schedule .e-current-panel {
            background-color: #f8f8f8; /* Current panel background color */
          }

          .e-schedule .e-work-cells {
            border: 1px solid #ddd; /* Border color for work cells */
          }

          /* Add more styles as needed */
        `}
                          </style>
                        </ScheduleComponent>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-xl-6 col-4-xxxl">
                <div className="card dashboard-card-five pd-b-20">
                  <div className="card-body pd-b-14">
                    <div className="heading-layout1">
                      <div className="item-title">
                        <h3>Network Traffic</h3>
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
                    <h6 className="traffic-title">Unique Visitors</h6>
                    <div className="traffic-number">2,590</div>
                    <div className="traffic-bar">
                      <div
                        className="direct"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Direct"
                      ></div>
                      <div
                        className="search"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Search"
                      ></div>
                      <div
                        className="referrals"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Referrals"
                      ></div>
                      <div
                        className="social"
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Social"
                      ></div>
                    </div>
                    <div className="traffic-table table-responsive">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td className="t-title pseudo-bg-Aquamarine">
                              Admin
                            </td>
                            <td>12,890</td>
                            <td>50%</td>
                          </tr>
                          <tr>
                            <td className="t-title pseudo-bg-blue">Teacher</td>
                            <td>7,245</td>
                            <td>27%</td>
                          </tr>
                          <tr>
                            <td className="t-title pseudo-bg-yellow">Parent</td>
                            <td>4,256</td>
                            <td>8%</td>
                          </tr>
                          <tr>
                            <td className="t-title pseudo-bg-red">Student</td>
                            <td>500</td>
                            <td>7%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-xl-6 col-4-xxxl">
                <div className="card dashboard-card-six pd-b-20">
                  <div className="card-body">
                    <div className="heading-layout1 mg-b-17">
                      <div className="item-title">
                        <h3>Notice Board</h3>
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
                      </div>
                      {/* <div className="notice-list">
            <div className="post-date bg-yellow">16 June, 2019</div>
            <h6 className="notice-title">
             <a href="/#">Great School manag printing.</a>
            </h6>
            <div className="entry-meta">
             {' '}
                          Jennyfar Lopez / <span>5 min ago</span>
            </div>
           </div> */}
                      {/* <div className="notice-list">
            <div className="post-date bg-pink">16 June, 2019</div>
            <h6 className="notice-title">
             <a href="/#">Great School manag meneesom.</a>
            </h6>
            <div className="entry-meta">
             {' '}
                          Jennyfar Lopez / <span>5 min ago</span>
            </div>
           </div> */}
                      {/* <div className="notice-list">
            <div className="post-date bg-skyblue">
                          16 June, 2019
            </div>
            <h6 className="notice-title">
             <a href="/#">
                            Great School manag mene esom text of the printing.
             </a>
            </h6>
            <div className="entry-meta">
             {' '}
                          Jennyfar Lopez / <span>5 min ago</span>
            </div>
           </div> */}
                      {/* <div className="notice-list">
            <div className="post-date bg-yellow">16 June, 2019</div>
            <h6 className="notice-title">
             <a href="/#">Great School manag printing.</a>
            </h6>
            <div className="entry-meta">
             {' '}
                          Jennyfar Lopez / <span>5 min ago</span>
            </div>
           </div> */}
                      {/* <div className="notice-list">
            <div className="post-date bg-pink">16 June, 2019</div>
            <h6 className="notice-title">
             <a href="/#">Great School manag meneesom.</a>
            </h6>
            <div className="entry-meta">
             {' '}
                          Jennyfar Lopez / <span>5 min ago</span>
            </div>
           </div> */}
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

export default AdminDashboard;
