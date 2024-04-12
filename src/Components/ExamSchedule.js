import React, {useEffect,useState} from "react";
import { initMain } from "../js/main";
import logo1 from './img/logo1.png';
import penetralia from './img/penetralia.jpg';
import admin from './img/figure/admin.jpg';
import student11 from './img/figure/student11.png';
import student12 from './img/figure/student12.png';
import student13 from './img/figure/student13.png';
import { useNavigate } from "react-router-dom";



const ExamSchedule = () => {

  const [exam_name, setExamName] = useState("");
  const [subject_type, setSubjectType] = useState("");
  const [select_class, setSelectClass] = useState("");
  const [select_section, setSelectSection] = useState("");
  const [select_time, setSelectTime] = useState("");
  const [select_date, setSelectDate] = useState("");
  const [error , setError] = useState("");
  const [message, setMessage] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isParent, setIsParent] = useState(false);


  



  const SubMiteShedule = (e) =>{
    e.preventDefault();
  const schedule = {exam_name,subject_type,select_class,select_date,select_section,select_time};
  const request = {
   'meta': {
    'action': '0',
    'source': 'web'
   },
   'data': schedule
  };

  const authToken = localStorage.getItem('userInfo');

  if (authToken) {
   const userAuthToken = JSON.parse(authToken);
   const token = userAuthToken.data.access_token;
   console.log('token :', token);

   fetch(
    'https://sms-penetralia.azurewebsites.net/api/exam_shedule/exam_schedule_form',
    {
     method: 'POST',
     headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
     },
     body: JSON.stringify(request)
    }
   )
    .then(response => {
     if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
     }
     return response.json();
    })
    .then(() => {
     setMessage('Well done! You successfully submitted a Exam Schedule .');
    })
    .catch(() => {
     setError('Error! Data could not be added, try again, avoid duplicate Exam Schedule  ');
    });
  }

  };


  const Reset = () => {
    
    setError(null);
    setExamName("");
    setMessage(null);
    setSelectClass("");
    setSelectDate("");
    setSelectSection("");
    setSubjectType("");
    setSelectTime("");

  }



  useEffect(() => {
  const authToken = localStorage.getItem('userInfo');

  if (authToken) {
   const userAuthToken = JSON.parse(authToken);
   const token = userAuthToken.data.access_token;

   fetch('https://sms-penetralia.azurewebsites.net/api/exam_shedule/exam_schedule_list', {
    method: 'GET',
    headers: {
     'Content-Type': 'application/json',
     'Accept': 'application/json',
     'Authorization': `Bearer ${token}`,
    },
           
   })
    .then(response => {
     if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
     }
     return response.json();
    })
    .then(result => {
     // Assuming the data structure is like { meta: {...}, data: [...] }
     if (result && result.data && Array.isArray(result.data)) {
      setSchedules(result.data);
     } else {
      console.error('Invalid data structure:', result);
     }
    })
    .catch(error => {
     console.error('Error fetching data:', error);
    });
  }
 }, []);


 
 const handleSearch = (event) => {
  event.preventDefault();
   
  const authToken = localStorage.getItem('userInfo');
  const userAuthToken = JSON.parse(authToken);
  const token = userAuthToken.data.access_token;
    
  // Combine search options into a single string
  const searchOptions = [keyword]
   .filter(value => value !== null && value !== undefined)
   .join(' ');

    

  // Construct the URL with the combined search options
  const searchUrl = new URL('https://sms-penetralia.azurewebsites.net/api/exam_shedule/search');
  // Append the combined search options only if they are not empty
  if (searchOptions.trim() !== '') {
   searchUrl.searchParams.append('keyword', encodeURIComponent(searchOptions));
  }

  // Fetch data using the constructed URL
  fetch(searchUrl, {
   method: 'GET',
   headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
   },

  })
   .then(response => {
    if (!response.ok) {
     throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
   })
   .then(result => {
    setSearchActive(true);
    // Assuming the data structure is like { meta: {...}, data: [...] }
    if (result && result.data) {
     setFilteredSchedules(result.data);
    } else {
     console.error('Invalid data structure:', result);
    }
   })
   .catch(error => {
    console.error('Error fetching data:', error);
   });

 };




  const resetSearch = (e) => {
    e.preventDefault();
   // Clear the search results and set searchActive to false
   setFilteredSchedules([]);
   setSearchActive(false);

  };




 const deleteUser = async (id) => {
  //  id.preventDefault();
  console.log('current id :', id);
    
  try {
   const authToken = localStorage.getItem('userInfo');

   if (!authToken) {
    setError('User authentication data is missing.');
    return;
   }

   try {
    const userAuthToken = JSON.parse(authToken);

    if (!userAuthToken || !userAuthToken.data || !userAuthToken.data.access_token) {
     setError('Invalid user authentication data format.');
     return;
    }

    const token = userAuthToken.data.access_token;

    const response = await fetch(`https://sms-penetralia.azurewebsites.net/api/exam_shedule/delete/${id}`, {
     method: 'DELETE',
     headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
     },
    });

    if (!response.ok) {
     setError(`HTTP error! Status: ${response.status}`);
    }

    // const result = await response.json();

    setMessage(`User with ID ${id} has been deleted successfully.`);
    // You might want to update your UI or state after successful deletion
   } catch (parseError) {
    console.error('Error parsing user authentication data:', parseError);
   }
  } catch (error) {
   console.error('Error deleting user:', error);
   // Handle errors or display a message to the user
  }
 };



 const handleDelete = (event, id) => {
  event.preventDefault();

  // Rest of your delete logic with the id
  deleteUser(id);
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


const isFormValid = () => {
  return (
    exam_name.trim() !== "" &&
    subject_type.trim() !== "" &&
    select_class.trim() !== "" &&
    select_section.trim() !== "" &&
    select_time.trim() !== "" &&
    select_date.trim() !== ""
  );
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




  return (
    <div>
      {/* <div id="preloader"></div> */}
      <div id="wrapper" className="wrapper bg-ash">
        <div className="navbar navbar-expand-md header-menu-one bg-light">
          <div className="nav-bar-header-one">
            <div className="header-logo">
              <a href="index.html">
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
            {/* <div className="sidebar-menu-content">
              <ul className="nav nav-sidebar-menu sidebar-toggle-view">
                <li
                  className="nav-item sidebar-nav-item"
                  style={{ backgroundColor: "black" }}
                >
                  <a href="#" className="nav-link">
                    <i className="flaticon-dashboard"></i>
                    <span>Dashboard</span>
                  </a>
                  <ul className="nav sub-group-menu">
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
                    <li className="nav-item">
                      <a href="/teacherDashboard" className="nav-link">
                        <i className="fas fa-angle-right"></i>Teachers
                      </a>
                    </li>
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
                    <li className="nav-item">
                      <a href="/addTeacherPayment" className="nav-link">
                        <i className="fas fa-angle-right"></i>Add Payment
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
                    <li className="nav-item">
                      <a href="/addFees" className="nav-link">
                        <i className="fas fa-angle-right"></i>Add Fees
                        Collection
                      </a>
                    </li>
                    <li className="nav-item">
                      <a href="/allExpense" className="nav-link">
                        <i className="fas fa-angle-right"></i>Expenses
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
                        <i className="fas fa-angle-right"></i>All Classes
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
                  <a href="/classNameRoutine" className="nav-link">
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
                      <a href="/exam-schedule" className="nav-link menu-active">
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

                <li className="nav-item" style={{ backgroundColor: "black" }}>
                  <a href="/map.html" className="nav-link">
                    <i className="flaticon-planet-earth"></i>
                    <span>Map</span>
                  </a>
                </li>
                <li className="nav-item" style={{ backgroundColor: "black" }}>
                  <a href="/setting" className="nav-link">
                    <i className="flaticon-settings"></i>
                    <span>User Settings</span>
                  </a>
                </li>
              </ul>
            </div> */}
          </div>
          <div className="dashboard-content-one">
            <div className="breadcrumbs-area">
              <h3>Examination</h3>
              <ul>
                <li>Exam Schedule</li>
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
            <div className="row">
              <div className="col-4-xxxl col-12">
                <div className="card height-auto">
                  <div className="card-body">
                    <div className="heading-layout1">
                      <div className="item-title">
                        <h3>Add New Exam</h3>
                      </div>
                      {/* <div className="dropdown">
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
                      </div> */}
                    </div>
                    <form className="new-added-form" onSubmit={SubMiteShedule}>
                      <div className="row">
                        <div className="col-12-xxxl col-lg-6 col-12 form-group">
                          <label>Exam Name *</label>
                          <input
                            type="text"
                            placeholder=""
                            className="form-control"
                            onChange={(e) => setExamName(e.target.value)}
                          />
                        </div>
                        <div className="col-12-xxxl col-lg-6 col-12 form-group">
                          <label>Subject Type *</label>
                          <input
                            type="text"
                            placeholder=""
                            className="form-control"
                            onChange={(e) => setSubjectType(e.target.value)}
                          />
                        </div>
                        <div className="col-12-xxxl col-lg-6 col-12 form-group">
                          <label>Class *</label>
                          <input
                            type="text"
                            placeholder=""
                            className="form-control"
                            onChange={(e) => setSelectClass(e.target.value)}
                          />
                        </div>
                        <div className="col-12-xxxl col-lg-6 col-12 form-group">
                          <label>Section *</label>
                          <input
                            type="text"
                            placeholder=""
                            className="form-control"
                            onChange={(e) => setSelectSection(e.target.value)}
                          />
                        </div>
                        <div className="col-12-xxxl col-lg-6 col-12 form-group">
                          <label>Select Time *</label>
                          <input
                            type="time"
                            placeholder=""
                            className="form-control"
                            onChange={(e) => setSelectTime(e.target.value)}
                          />
                          {/* <i className="far fa-clock"></i> */}
                        </div>
                        <div className="col-12-xxxl col-lg-6 col-12 form-group">
                          <label>Select Date *</label>
                          <input
                            type="date"
                            placeholder="dd/mm/yyyy"
                            className="form-control air-datepicker"
                            onChange={(e) => setSelectDate(e.target.value)}
                          />
                          {/* <i className="far fa-calendar-alt"></i> */}
                        </div>
                        <div className="col-12 form-group mg-t-8">
                          <button
                            type="submit"
                            className="btn-fill-lg btn-gradient-yellow btn-hover-bluedark"
                            disabled={!isFormValid()}
                          >
                            Save
                          </button>
                          <button
                            type="reset"
                            className="btn-fill-lg bg-blue-dark btn-hover-yellow"
                            onClick={Reset}
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-8-xxxl col-12">
                <div className="card height-auto">
                  <div className="card-body">
                    <div className="heading-layout1">
                      <div className="item-title">
                        <h3>All Exam Schedule</h3>
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
                    <form className="mg-b-20">
                      <div className="row gutters-8">
                        <div className="col-lg-4 col-12 form-group">
                          <input
                            type="text"
                            placeholder="Search by Exam ..."
                            className="form-control"
                            onChange={(e) => setKeyword(e.target.value)}
                          />
                        </div>
                        <div className="col-lg-3 col-12 form-group">
                          <input
                            type="text"
                            placeholder="Search by Subject ..."
                            className="form-control"
                            onChange={(e) => setKeyword(e.target.value)}
                          />
                        </div>
                        <div className="col-lg-3 col-12 form-group">
                          <input
                            type="date"
                            placeholder="Search by Date ..."
                            className="form-control"
                            onChange={(e) => setKeyword(e.target.value)}
                          />
                        </div>
                        <div className="col-lg-2 col-12 form-group">
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
                    <div className="table-responsive">
                      <table className="table display data-table text-nowrap">
                        <thead>
                          <tr>
                            <th>
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input checkAll"
                                />
                                <label className="form-check-label">
                                  Exam Name
                                </label>
                              </div>
                            </th>
                            <th>Subject</th>
                            <th>Class</th>
                            <th>Section</th>
                            <th>Time</th>
                            <th>Date</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchActive ? (
                            // Render filteredBooks when a search is active
                            filteredSchedules ? (
                              <tr>
                                <td>
                                  <div class="form-check">
                                    <input
                                      type="checkbox"
                                      class="form-check-input"
                                    />
                                    <label class="form-check-label">
                                      {filteredSchedules.exam_name}
                                    </label>
                                  </div>
                                </td>
                                <td>{filteredSchedules.subject_type}</td>
                                <td>{filteredSchedules.select_class}</td>
                                <td>{filteredSchedules.select_section}</td>
                                <td>{filteredSchedules.select_time}</td>
                                <td>{filteredSchedules.select_date}</td>
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
                                      {/* <a class="dropdown-item" href="/#">
                  <i class="fas fa-times text-orange-red"></i>
                            Close
                 </a>
                 <a class="dropdown-item" href="/#">
                  <i class="fas fa-cogs text-dark-pastel-green"></i>
                            Edit
                 </a> */}
                                      <div
                                        class="dropdown-item"
                                        onClick={resetSearch}
                                      >
                                        <i class="fas fa-redo-alt text-orange-peel"></i>
                                        Refresh
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              <tr>
                                <td
                                  colSpan="8"
                                  style={{
                                    textAlign: "center",
                                    color: "green",
                                  }}
                                >
                                  No matching Exam Schedule found
                                </td>
                              </tr>
                            )
                          ) : Array.isArray(schedules) &&
                            schedules.length > 0 ? (
                            schedules.map((schedule) => (
                              <tr key={schedule.id}>
                                <td>
                                  <div class="form-check">
                                    <input
                                      type="checkbox"
                                      class="form-check-input"
                                    />
                                    <label class="form-check-label">
                                      {schedule.exam_name}
                                    </label>
                                  </div>
                                </td>
                                <td>{schedule.subject_type}</td>
                                <td>{schedule.select_class}</td>
                                <td>{schedule.select_section}</td>
                                <td>{schedule.select_time}</td>
                                <td>{schedule.select_date}</td>
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
                                      <div
                                        class="dropdown-item"
                                        onClick={(event) =>
                                          handleDelete(event, schedule.id)
                                        }
                                      >
                                        <i class="fas fa-times text-orange-red"></i>
                                        Delete
                                      </div>
                                      {/* <a class="dropdown-item" href="/#">
                            <i class="fas fa-cogs text-dark-pastel-green"></i>
                            Edit
                          </a>
                          <a class="dropdown-item" href="/#">
                            <i class="fas fa-redo-alt text-orange-peel"></i>
                            Refresh
                          </a> */}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="18"
                                style={{ textAlign: "center", color: "green" }}
                              >
                                No Exam schedule available
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
                                  Class Test
                                </label>
                              </div>
                            </td>
                            <td>English</td>
                            <td>4</td>
                            <td>A</td>
                            <td>10.00 am - 11.00 am</td>
                            <td>20/06/2019</td>
                            <td>
                              <div className="dropdown">
                                <a
                                  href="/#"
                                  className="dropdown-toggle"
                                  data-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <span className="flaticon-more-button-of-three-dots"></span>
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
                                  Class Test
                                </label>
                              </div>
                            </td>
                            <td>Chemistry</td>
                            <td>4</td>
                            <td>A</td>
                            <td>10.00 am - 11.00 am</td>
                            <td>20/06/2019</td>
                            <td>
                              <div className="dropdown">
                                <a
                                  href="/#"
                                  className="dropdown-toggle"
                                  data-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <span className="flaticon-more-button-of-three-dots"></span>
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
                                  Class Test
                                </label>
                              </div>
                            </td>
                            <td>Mathematics</td>
                            <td>4</td>
                            <td>A</td>
                            <td>10.00 am - 11.00 am</td>
                            <td>20/06/2019</td>
                            <td>
                              <div className="dropdown">
                                <a
                                  href="/#"
                                  className="dropdown-toggle"
                                  data-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <span className="flaticon-more-button-of-three-dots"></span>
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
                                  Class Test
                                </label>
                              </div>
                            </td>
                            <td>English</td>
                            <td>4</td>
                            <td>A</td>
                            <td>10.00 am - 11.00 am</td>
                            <td>20/06/2019</td>
                            <td>
                              <div className="dropdown">
                                <a
                                  href="/#"
                                  className="dropdown-toggle"
                                  data-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <span className="flaticon-more-button-of-three-dots"></span>
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
                                  Class Test
                                </label>
                              </div>
                            </td>
                            <td>Chemistry</td>
                            <td>4</td>
                            <td>A</td>
                            <td>10.00 am - 11.00 am</td>
                            <td>20/06/2019</td>
                            <td>
                              <div className="dropdown">
                                <a
                                  href="/#"
                                  className="dropdown-toggle"
                                  data-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <span className="flaticon-more-button-of-three-dots"></span>
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
                                  Class Test
                                </label>
                              </div>
                            </td>
                            <td>Mathematics</td>
                            <td>4</td>
                            <td>A</td>
                            <td>10.00 am - 11.00 am</td>
                            <td>20/06/2019</td>
                            <td>
                              <div className="dropdown">
                                <a
                                  href="/#"
                                  className="dropdown-toggle"
                                  data-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <span className="flaticon-more-button-of-three-dots"></span>
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
                                  Class Test
                                </label>
                              </div>
                            </td>
                            <td>English</td>
                            <td>4</td>
                            <td>A</td>
                            <td>10.00 am - 11.00 am</td>
                            <td>20/06/2019</td>
                            <td>
                              <div className="dropdown">
                                <a
                                  href="/#"
                                  className="dropdown-toggle"
                                  data-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <span className="flaticon-more-button-of-three-dots"></span>
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
                                  Class Test
                                </label>
                              </div>
                            </td>
                            <td>Chemistry</td>
                            <td>4</td>
                            <td>A</td>
                            <td>10.00 am - 11.00 am</td>
                            <td>20/06/2019</td>
                            <td>
                              <div className="dropdown">
                                <a
                                  href="/#"
                                  className="dropdown-toggle"
                                  data-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <span className="flaticon-more-button-of-three-dots"></span>
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
                                  Class Test
                                </label>
                              </div>
                            </td>
                            <td>Mathematics</td>
                            <td>4</td>
                            <td>A</td>
                            <td>10.00 am - 11.00 am</td>
                            <td>20/06/2019</td>
                            <td>
                              <div className="dropdown">
                                <a
                                  href="/#"
                                  className="dropdown-toggle"
                                  data-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <span className="flaticon-more-button-of-three-dots"></span>
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
                                  Class Test
                                </label>
                              </div>
                            </td>
                            <td>English</td>
                            <td>4</td>
                            <td>A</td>
                            <td>10.00 am - 11.00 am</td>
                            <td>20/06/2019</td>
                            <td>
                              <div className="dropdown">
                                <a
                                  href="/#"
                                  className="dropdown-toggle"
                                  data-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <span className="flaticon-more-button-of-three-dots"></span>
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
                                  Class Test
                                </label>
                              </div>
                            </td>
                            <td>Chemistry</td>
                            <td>4</td>
                            <td>A</td>
                            <td>10.00 am - 11.00 am</td>
                            <td>20/06/2019</td>
                            <td>
                              <div className="dropdown">
                                <a
                                  href="/#"
                                  className="dropdown-toggle"
                                  data-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <span className="flaticon-more-button-of-three-dots"></span>
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
                                  Class Test
                                </label>
                              </div>
                            </td>
                            <td>Chemistry</td>
                            <td>4</td>
                            <td>A</td>
                            <td>10.00 am - 11.00 am</td>
                            <td>20/06/2019</td>
                            <td>
                              <div className="dropdown">
                                <a
                                  href="/#"
                                  className="dropdown-toggle"
                                  data-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <span className="flaticon-more-button-of-three-dots"></span>
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
                                  Class Test
                                </label>
                              </div>
                            </td>
                            <td>Mathematics</td>
                            <td>4</td>
                            <td>A</td>
                            <td>10.00 am - 11.00 am</td>
                            <td>20/06/2019</td>
                            <td>
                              <div className="dropdown">
                                <a
                                  href="/#"
                                  className="dropdown-toggle"
                                  data-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <span className="flaticon-more-button-of-three-dots"></span>
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
                                  Class Test
                                </label>
                              </div>
                            </td>
                            <td>English</td>
                            <td>4</td>
                            <td>A</td>
                            <td>10.00 am - 11.00 am</td>
                            <td>20/06/2019</td>
                            <td>
                              <div className="dropdown">
                                <a
                                  href="/#"
                                  className="dropdown-toggle"
                                  data-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <span className="flaticon-more-button-of-three-dots"></span>
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
                                  Class Test
                                </label>
                              </div>
                            </td>
                            <td>Chemistry</td>
                            <td>4</td>
                            <td>A</td>
                            <td>10.00 am - 11.00 am</td>
                            <td>20/06/2019</td>
                            <td>
                              <div className="dropdown">
                                <a
                                  href="/#"
                                  className="dropdown-toggle"
                                  data-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <span className="flaticon-more-button-of-three-dots"></span>
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
                                  Class Test
                                </label>
                              </div>
                            </td>
                            <td>Mathematics</td>
                            <td>4</td>
                            <td>A</td>
                            <td>10.00 am - 11.00 am</td>
                            <td>20/06/2019</td>
                            <td>
                              <div className="dropdown">
                                <a
                                  href="/#"
                                  className="dropdown-toggle"
                                  data-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <span className="flaticon-more-button-of-three-dots"></span>
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
                                  Class Test
                                </label>
                              </div>
                            </td>
                            <td>English</td>
                            <td>4</td>
                            <td>A</td>
                            <td>10.00 am - 11.00 am</td>
                            <td>20/06/2019</td>
                            <td>
                              <div className="dropdown">
                                <a
                                  href="/#"
                                  className="dropdown-toggle"
                                  data-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <span className="flaticon-more-button-of-three-dots"></span>
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
                                  Class Test
                                </label>
                              </div>
                            </td>
                            <td>Chemistry</td>
                            <td>4</td>
                            <td>A</td>
                            <td>10.00 am - 11.00 am</td>
                            <td>20/06/2019</td>
                            <td>
                              <div className="dropdown">
                                <a
                                  href="/#"
                                  className="dropdown-toggle"
                                  data-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <span className="flaticon-more-button-of-three-dots"></span>
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


export default ExamSchedule;