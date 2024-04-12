import React, {useEffect,useState} from 'react';
import { initMain } from "../js/main";
import { useNavigate } from 'react-router-dom';

import logo1 from './img/logo1.png';
import penetralia from './img/penetralia.jpg';
import admin from './img/figure/admin.jpg';
import student11 from './img/figure/student11.png';
import student12 from './img/figure/student12.png';
import student13 from './img/figure/student13.png';





const ClassRoutine = () => {

 const [class_day,setDay] = useState('');
 const [class_room, setClassRoom] = useState('');
 const [class_subject, setSubject] = useState('');
 const [class_section, setSection] = useState('');
 const [class_teacher, setTeacher] = useState('');
 const [class_time, setTime] = useState('');
 const [class_date, setDate] = useState('');
 const [end_time, setEndTime] = useState('');
 const [message, setMessage] = useState('');
 const [error, setError] = useState('');
 const [filteredClassRoutines, setFilteredClassRoutines] = useState([]);
 const [keyword, setKeyword] = useState('');
 const [searchActive, setSearchActive] = useState(false);
 const navigate = useNavigate(); 
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isParent, setIsParent] = useState(false);



 const [classRoutines, setClassRoutines] = useState('');


 const SubmitForm = (e) => {
  e.preventDefault();
  const classRoutine = { class_day,class_room, class_section, class_subject, class_teacher,class_time,class_date,end_time};
  console.log(classRoutine);
  const request = {

   'meta' : {
    'action' : '0',
    'source' : 'web'
   },
   'data':classRoutine
  };

  const authToken = localStorage.getItem('userInfo');

  if (authToken) {
   const userAuthToken = JSON.parse(authToken);
   const token = userAuthToken.data.access_token;
   console.log('token :', token);

   fetch(
    'https://sms-penetralia.azurewebsites.net/api/class_routine/class_routine_form',
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
     setMessage('Well done! You successfully submitted a new class Routine.');
    })
    .catch(() => {
     setError('Error! Data could not be added, try again, avoid duplicate class Routine.');
    });
  }
        

 }; 



 const ReSet = () =>{
  setClassRoom('');
  setClassRoutines('');
  setDate('');
  setDay('');
  setEndTime('');
  setError('');
  setMessage('');
  setSection('');
  setSubject('');
  setTeacher('');
  setTime('');
  
 };


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
  const searchUrl = new URL('https://sms-penetralia.azurewebsites.net/api/class_routine/search');
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
     setFilteredClassRoutines(result.data);
     console.log(filteredClassRoutines);
    } else {
     console.error('Invalid data structure:', result);
    }
   })
   .catch(error => {
    console.error('Error fetching data:', error);
   });



 };


 const resetSearch = () => {
  // Clear the search results and set searchActive to false
  setFilteredClassRoutines([]);
  setSearchActive(false);
 };


 useEffect(() => {
  const authToken = localStorage.getItem('userInfo');
    

  if (authToken) {
   const userAuthToken = JSON.parse(authToken);
   const token = userAuthToken.data.access_token;

   fetch('https://sms-penetralia.azurewebsites.net/api/class_routine/class_routine_list', {
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
      setClassRoutines(result.data);
     } else {
      console.error('Invalid data structure:', result);
     }
    })
    .catch(error => {
     console.error('Error fetching data:', error);
    });
  }
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


  const isFormValid = () => {
    return (
      class_day.trim() !== "" &&
      class_room.trim() !== "" &&
      class_subject.trim() !== "" &&
      class_section.trim() !== "" &&
      class_teacher.trim() !== "" &&
      class_time.trim() !== "" &&
      class_date.trim() !== "" &&
      end_time.trim() !== ""
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
                 <div class="item-title d-md-none text-16 mg-l-10">Message</div>
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
                             <i className="fas fa-angle-right"></i>Add New class
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
                           <i className="fas fa-angle-right"></i>Teacher Payment
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
           {/* <div class="sidebar-menu-content">
             <ul class="nav nav-sidebar-menu sidebar-toggle-view">
               <li
                 class="nav-item sidebar-nav-item"
                 style={{ backgroundColor: "black" }}
               >
                 <a href="#" class="nav-link">
                   <i class="flaticon-dashboard"></i>
                   <span>Dashboard</span>
                 </a>
                 <ul class="nav sub-group-menu">
                   <li class="nav-item">
                     <a href="/admin" class="nav-link">
                       <i class="fas fa-angle-right"></i>Admin
                     </a>
                   </li>
                   <li class="nav-item">
                     <a href="/studentDashboard" class="nav-link">
                       <i class="fas fa-angle-right"></i>Students
                     </a>
                   </li>
                   <li class="nav-item">
                     <a href="/parentDashboard" class="nav-link">
                       <i class="fas fa-angle-right"></i>Parents
                     </a>
                   </li>
                   <li class="nav-item">
                     <a href="/teacherDashboard" class="nav-link">
                       <i class="fas fa-angle-right"></i>Teachers
                     </a>
                   </li>
                 </ul>
               </li>
               <li
                 class="nav-item sidebar-nav-item"
                 style={{ backgroundColor: "black" }}
               >
                 <a href="#" class="nav-link">
                   <i class="flaticon-classmates"></i>
                   <span>Students</span>
                 </a>
                 <ul class="nav sub-group-menu">
                   <li class="nav-item">
                     <a href="/allStudent" class="nav-link">
                       <i class="fas fa-angle-right"></i>All Students
                     </a>
                   </li>
                   <li class="nav-item">
                     <a href="/studentDetails" class="nav-link">
                       <i class="fas fa-angle-right"></i>Student Details
                     </a>
                   </li>
                   <li class="nav-item">
                     <a href="/admissionForm" class="nav-link">
                       <i class="fas fa-angle-right"></i>Admission Form
                     </a>
                   </li>
                   <li class="nav-item">
                     <a href="/studentPromotion" class="nav-link">
                       <i class="fas fa-angle-right"></i>Student Promotion
                     </a>
                   </li>
                 </ul>
               </li>
               <li
                 class="nav-item sidebar-nav-item"
                 style={{ backgroundColor: "black" }}
               >
                 <a href="#" class="nav-link">
                   <i class="flaticon-multiple-users-silhouette"></i>
                   <span>Teachers</span>
                 </a>
                 <ul class="nav sub-group-menu">
                   <li class="nav-item">
                     <a href="/allTeacher" class="nav-link">
                       <i class="fas fa-angle-right"></i>All Teachers
                     </a>
                   </li>
                   <li class="nav-item">
                     <a href="/teacherDetails/{id}" class="nav-link">
                       <i class="fas fa-angle-right"></i>Teacher Details
                     </a>
                   </li>
                   <li class="nav-item">
                     <a href="/addTeacher" class="nav-link">
                       <i class="fas fa-angle-right"></i>Add Teacher
                     </a>
                   </li>
                   <li class="nav-item">
                     <a href="/teacherPayment" class="nav-link">
                       <i class="fas fa-angle-right"></i>Teacher Payment
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
                 class="nav-item sidebar-nav-item"
                 style={{ backgroundColor: "black" }}
               >
                 <a href="#" class="nav-link">
                   <i class="flaticon-couple"></i>
                   <span>Parents</span>
                 </a>
                 <ul class="nav sub-group-menu">
                   <li class="nav-item">
                     <a href="/allParent" class="nav-link">
                       <i class="fas fa-angle-right"></i>All Parents
                     </a>
                   </li>
                   <li class="nav-item">
                     <a href="/parentDetails/{id}" class="nav-link">
                       <i class="fas fa-angle-right"></i>Parents Details
                     </a>
                   </li>
                   <li class="nav-item">
                     <a href="/addParent" class="nav-link">
                       <i class="fas fa-angle-right"></i>Add Parent
                     </a>
                   </li>
                 </ul>
               </li>
               <li
                 class="nav-item sidebar-nav-item"
                 style={{ backgroundColor: "black" }}
               >
                 <a href="#" class="nav-link">
                   <i class="flaticon-books"></i>
                   <span>Library</span>
                 </a>
                 <ul class="nav sub-group-menu">
                   <li class="nav-item">
                     <a href="/allBook" class="nav-link">
                       <i class="fas fa-angle-right"></i>All Book
                     </a>
                   </li>
                   <li class="nav-item">
                     <a href="/addBook" class="nav-link">
                       <i class="fas fa-angle-right"></i>Add New Book
                     </a>
                   </li>
                 </ul>
               </li>
               <li
                 class="nav-item sidebar-nav-item"
                 style={{ backgroundColor: "black" }}
               >
                 <a href="#" class="nav-link">
                   <i class="flaticon-technological"></i>
                   <span>Payment</span>
                 </a>
                 <ul class="nav sub-group-menu">
                   <li class="nav-item">
                     <a href="/allFeesCollection" class="nav-link">
                       <i class="fas fa-angle-right"></i>All Fees Collection
                     </a>
                   </li>
                   <li class="nav-item">
                     <a href="/addFees" class="nav-link">
                       <i class="fas fa-angle-right"></i>Add Fees Collection
                     </a>
                   </li>
                   <li class="nav-item">
                     <a href="/allExpense" class="nav-link">
                       <i class="fas fa-angle-right"></i>Expenses
                     </a>
                   </li>
                   <li class="nav-item">
                     <a href="/addExpense" class="nav-link">
                       <i class="fas fa-angle-right"></i>Add Expenses
                     </a>
                   </li>
                 </ul>
               </li>
               <li
                 class="nav-item sidebar-nav-item"
                 style={{ backgroundColor: "black" }}
               >
                 <a href="#" class="nav-link">
                   <i class="flaticon-maths-class-materials-cross-of-a-pencil-and-a-ruler"></i>
                   <span>Class</span>
                 </a>
                 <ul class="nav sub-group-menu">
                   <li class="nav-item">
                     <a href="/allClass" class="nav-link">
                       <i class="fas fa-angle-right"></i>All Classes
                     </a>
                   </li>
                   <li class="nav-item">
                     <a href="/addClass" class="nav-link">
                       <i class="fas fa-angle-right"></i>Add New Class
                     </a>
                   </li>
                 </ul>
               </li>
               <li class="nav-item" style={{ backgroundColor: "black" }}>
                 <a href="/subject" class="nav-link">
                   <i class="flaticon-open-book"></i>
                   <span>Subject</span>
                 </a>
               </li>
               <li class="nav-item" style={{ backgroundColor: "black" }}>
                 <a href="/classRoutine" class="nav-link menu-active">
                   <i class="flaticon-calendar"></i>
                   <span class="menu-active">Class Routine</span>
                 </a>
               </li>
               <li class="nav-item" style={{ backgroundColor: "black" }}>
                 <a href="/attendence" class="nav-link">
                   <i class="flaticon-checklist"></i>
                   <span>Attendence</span>
                 </a>
               </li>
               <li
                 class="nav-item sidebar-nav-item"
                 style={{ backgroundColor: "black" }}
               >
                 <a href="#" class="nav-link">
                   <i class="flaticon-shopping-list"></i>
                   <span>Exam</span>
                 </a>
                 <ul class="nav sub-group-menu">
                   <li class="nav-item">
                     <a href="exam-schedule" class="nav-link">
                       <i class="fas fa-angle-right"></i>Exam Schedule
                     </a>
                   </li>
                   <li class="nav-item">
                     <a href="exam-grade" class="nav-link">
                       <i class="fas fa-angle-right"></i>Exam Grades
                     </a>
                   </li>
                   <li class="nav-item">
                     <a href="/exam-result" class="nav-link">
                       <i class="fas fa-angle-right"></i>Exam Result
                     </a>
                   </li>
                 </ul>
               </li>
               <li class="nav-item" style={{ backgroundColor: "black" }}>
                 <a href="/transport" class="nav-link">
                   <i class="flaticon-bus-side-view"></i>
                   <span>Transport</span>
                 </a>
               </li>
               <li class="nav-item" style={{ backgroundColor: "black" }}>
                 <a href="/hostel" class="nav-link">
                   <i class="flaticon-bed"></i>
                   <span>Hostel</span>
                 </a>
               </li>
               <li class="nav-item" style={{ backgroundColor: "black" }}>
                 <a href="/notice" class="nav-link">
                   <i class="flaticon-script"></i>
                   <span>Notice</span>
                 </a>
               </li>
               <li class="nav-item" style={{ backgroundColor: "black" }}>
                 <a href="/messaging" class="nav-link">
                   <i class="flaticon-chat"></i>
                   <span>Messeage</span>
                 </a>
               </li>

               <li class="nav-item" style={{ backgroundColor: "black" }}>
                 <a href="/map.html" class="nav-link">
                   <i class="flaticon-planet-earth"></i>
                   <span>Map</span>
                 </a>
               </li>
               <li class="nav-item" style={{ backgroundColor: "black" }}>
                 <a href="/setting" class="nav-link">
                   <i class="flaticon-settings"></i>
                   <span>User Settings</span>
                 </a>
               </li>
             </ul>
           </div> */}
         </div>

         <div class="dashboard-content-one">
           <div class="breadcrumbs-area">
             <h3>Class Routine</h3>
             <ul>
               <li>Routine</li>
               {message ? (
                 <div class="ui-alart-box">
                   <div class="icon-color-alart">
                     <div class="alert icon-alart bg-light-green2" role="alert">
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
             <div class="col-4-xxxl col-12">
               <div class="card height-auto">
                 <div class="card-body">
                   <div class="heading-layout1">
                     <div class="item-title">
                       <h3>Add Class Routine</h3>
                     </div>
                     {/* <div class="dropdown">
                        <a
                          class="dropdown-toggle"
                          href="/#"
                          role="button"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        >
                          ...
                        </a>

                        <div class="dropdown-menu dropdown-menu-right">
                          <a class="dropdown-item" href="/#">
                            <i class="fas fa-times text-orange-red"></i>Close
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
                      </div> */}
                   </div>
                   <form class="new-added-form" onSubmit={SubmitForm}>
                     <div class="row">
                       <div class="col-12-xxxl col-lg-6 col-12 form-group">
                         <label>Day *</label>
                         <input
                           type="text"
                           placeholder=""
                           class="form-control"
                           value={class_day}
                           onChange={(e) => setDay(e.target.value)}
                         />
                       </div>
                       <div class="col-12-xxxl col-lg-6 col-12 form-group">
                         <label>Class *</label>
                         <input
                           type="text"
                           placeholder=""
                           class="form-control"
                           value={class_room}
                           onChange={(e) => setClassRoom(e.target.value)}
                         />
                       </div>
                       <div class="col-12-xxxl col-lg-6 col-12 form-group">
                         <label>Subject *</label>
                         <input
                           type="text"
                           placeholder=""
                           class="form-control"
                           value={class_subject}
                           onChange={(e) => setSubject(e.target.value)}
                         />
                       </div>
                       <div class="col-12-xxxl col-lg-6 col-12 form-group">
                         <label>Section *</label>
                         <input
                           type="text"
                           placeholder=""
                           class="form-control"
                           value={class_section}
                           onChange={(e) => setSection(e.target.value)}
                         />
                       </div>
                       <div class="col-12-xxxl col-lg-6 col-12 form-group">
                         <label>Teacher *</label>
                         <input
                           type="text"
                           placeholder=""
                           class="form-control"
                           value={class_teacher}
                           onChange={(e) => setTeacher(e.target.value)}
                         />
                       </div>
                       <div className="col-xl-3 col-lg-6 col-12 form-group">
                         <label>Time *</label>
                         <div className="d-flex">
                           <input
                             type="time"
                             className="form-control mr-2"
                             value={class_time}
                             onChange={(e) => setTime(e.target.value)}
                           />
                           {/* <span className="mr-2">-</span> */}
                           <input
                             type="time"
                             className="form-control ml-2"
                             value={end_time}
                             onChange={(e) => setEndTime(e.target.value)}
                           />
                         </div>
                       </div>
                       <div className="col-xl-3 col-lg-6 col-12 form-group">
                         <label>Date *</label>
                         <input
                           type="date"
                           // placeholder="yyyy-mm-dd"
                           className="form-control air-datepicker"
                           data-position="bottom right"
                           value={class_date}
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

                             setDate(formattedDate);
                           }}
                         />
                         {/* <i className="far fa-calendar-alt"></i> */}
                       </div>
                       <div class="col-12 form-group mg-t-8">
                         <button
                           type="submit"
                           class="btn-fill-lg btn-gradient-yellow btn-hover-bluedark"
                           disabled={!isFormValid()}
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
             <div class="col-8-xxxl col-12">
               <div class="card height-auto">
                 <div class="card-body">
                   <div class="heading-layout1">
                     <div class="item-title">
                       <h3>Class Routine</h3>
                     </div>
                     <div class="dropdown">
                       <a
                         class="dropdown-toggle"
                         href="/#"
                         role="button"
                         data-toggle="dropdown"
                         aria-expanded="false"
                       >
                         ...
                       </a>

                       <div class="dropdown-menu dropdown-menu-right">
                         <a class="dropdown-item" href="/#">
                           <i class="fas fa-times text-orange-red"></i>Close
                         </a>
                         <a class="dropdown-item" href="/#">
                           <i class="fas fa-cogs text-dark-pastel-green"></i>
                           Edit
                         </a>
                         <div class="dropdown-item" onClick={resetSearch}>
                           <i class="fas fa-redo-alt text-orange-peel"></i>
                           Refresh
                         </div>
                       </div>
                     </div>
                   </div>
                   <form class="mg-b-20">
                     <div class="row gutters-8">
                       <div class="col-lg-4 col-12 form-group">
                         <input
                           type="text"
                           placeholder="Search by Day ..."
                           class="form-control"
                           onChange={(e) => setKeyword(e.target.value)}
                         />
                       </div>
                       <div class="col-lg-3 col-12 form-group">
                         <input
                           type="text"
                           placeholder="Search by Class ..."
                           class="form-control"
                           onChange={(e) => setKeyword(e.target.value)}
                         />
                       </div>
                       <div class="col-lg-3 col-12 form-group">
                         <input
                           type="text"
                           placeholder="Search by Section ..."
                           class="form-control"
                           onChange={(e) => setKeyword(e.target.value)}
                         />
                       </div>
                       <div class="col-lg-2 col-12 form-group">
                         <button
                           type="submit"
                           class="fw-btn-fill btn-gradient-yellow"
                           onClick={handleSearch}
                         >
                           SEARCH
                         </button>
                       </div>
                     </div>
                   </form>
                   <div class="table-responsive">
                     <table class="table display data-table text-nowrap">
                       <thead>
                         <tr>
                           <th>
                             <div class="form-check">
                               <input
                                 type="checkbox"
                                 class="form-check-input checkAll"
                               />
                               <label class="form-check-label">Day</label>
                             </div>
                           </th>
                           <th>Class</th>
                           <th>Subject</th>
                           <th>Section</th>
                           <th>Teacher</th>
                           <th>Time</th>
                           <th>Date</th>
                           <th></th>
                         </tr>
                       </thead>
                       <tbody>
                         {searchActive ? (
                           // Render filteredBooks when a search is active
                           filteredClassRoutines ? (
                             <tr
                               onClick={() =>
                                 navigate(`//${filteredClassRoutines.id}`)
                               }
                               style={{ cursor: "pointer" }}
                             >
                               <td>
                                 <div class="form-check">
                                   <input
                                     type="checkbox"
                                     class="form-check-input"
                                   />
                                   <label class="form-check-label">
                                     {filteredClassRoutines.class_day}
                                   </label>
                                 </div>
                               </td>
                               <td>{filteredClassRoutines.class_room}</td>
                               <td>{filteredClassRoutines.class_subject}</td>
                               <td>{filteredClassRoutines.class_section}</td>
                               <td>{filteredClassRoutines.class_teacher}</td>
                               <td>
                                 {filteredClassRoutines.class_time}-
                                 {filteredClassRoutines.end_time}
                               </td>
                               <td>{filteredClassRoutines.class_date}</td>
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
                                 style={{ textAlign: "center", color: "green" }}
                               >
                                 No matching class Routine found
                               </td>
                             </tr>
                           )
                         ) : Array.isArray(classRoutines) &&
                           classRoutines.length > 0 ? (
                           classRoutines.map((classRoutine) => (
                             <tr
                               key={classRoutine.id}
                               onClick={() => navigate(`//${classRoutine.id}`)}
                               style={{ cursor: "pointer" }}
                             >
                               <td>
                                 <div class="form-check">
                                   <input
                                     type="checkbox"
                                     class="form-check-input"
                                   />
                                   <label class="form-check-label">
                                     {classRoutine.class_day}
                                   </label>
                                 </div>
                               </td>
                               <td>{classRoutine.class_room}</td>
                               <td>{classRoutine.class_subject}</td>
                               <td>{classRoutine.class_section}</td>
                               <td>{classRoutine.class_teacher}</td>
                               <td>
                                 {classRoutine.class_time}-
                                 {classRoutine.end_time}
                               </td>
                               <td>{classRoutine.class_date}</td>
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
                           ))
                         ) : (
                           <tr>
                             <td
                               colSpan="16"
                               style={{ textAlign: "center", color: "green" }}
                             >
                               No class Routine available
                             </td>
                           </tr>
                         )}
                         {/* <tr>
                            <td>
                              <div class="form-check">
                                <input
                                  type="checkbox"
                                  class="form-check-input"
                                />
                                <label class="form-check-label">Monday</label>
                              </div>
                            </td>
                            <td>4</td>
                            <td>English</td>
                            <td>A</td>
                            <td>Adam John</td>
                            <td>10.00 am-11.00 am</td>
                            <td>20/06/2019</td>
                            <td>
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
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div class="form-check">
                                <input
                                  type="checkbox"
                                  class="form-check-input"
                                />
                                <label class="form-check-label">Tuesday</label>
                              </div>
                            </td>
                            <td>4</td>
                            <td>Economics</td>
                            <td>A</td>
                            <td>Johanthon Ray</td>
                            <td>10.00 am-11.00 am</td>
                            <td>20/06/2019</td>
                            <td>
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
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div class="form-check">
                                <input
                                  type="checkbox"
                                  class="form-check-input"
                                />
                                <label class="form-check-label">
                                  Wednesday
                                </label>
                              </div>
                            </td>
                            <td>4</td>
                            <td>Drawing</td>
                            <td>A</td>
                            <td>Mike Jonas</td>
                            <td>10.00 am-11.00 am</td>
                            <td>20/06/2019</td>
                            <td>
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
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div class="form-check">
                                <input
                                  type="checkbox"
                                  class="form-check-input"
                                />
                                <label class="form-check-label">Thursday</label>
                              </div>
                            </td>
                            <td>4</td>
                            <td>English</td>
                            <td>A</td>
                            <td>Kate Well</td>
                            <td>10.00 am-11.00 am</td>
                            <td>20/06/2019</td>
                            <td>
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
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div class="form-check">
                                <input
                                  type="checkbox"
                                  class="form-check-input"
                                />
                                <label class="form-check-label">Friday</label>
                              </div>
                            </td>
                            <td>4</td>
                            <td>Chemistry</td>
                            <td>A</td>
                            <td>Mike John</td>
                            <td>10.00 am-11.00 am</td>
                            <td>20/06/2019</td>
                            <td>
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
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div class="form-check">
                                <input
                                  type="checkbox"
                                  class="form-check-input"
                                />
                                <label class="form-check-label">Saturday</label>
                              </div>
                            </td>
                            <td>4</td>
                            <td>English</td>
                            <td>A</td>
                            <td>Mike John</td>
                            <td>10.00 am-11.00 am</td>
                            <td>20/06/2019</td>
                            <td>
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


export default ClassRoutine;
