import React from "react";
import AdminDashboard from "./Components/AdminDashboard";
import { Routes, Route } from "react-router-dom";
import StudentDashboard from "./Components/StudentDashboard";
import ParentDashboard from "./Components/ParentDashboard";
import AllStudent from "./Components/AllStudent";
import TeacherDashboard from "./Components/TeacherDashboard";
import StudentDetails from "./Components/StudentDetails";
import AdmissionForm from "./Components/AdmissionForm";
import StudentPromotion from "./Components/StudentPromotion";
import AllTeacher from "./Components/AllTeacher";
import TeacherDetails from "./Components/TeacherDetails";
import AddTeacher from "./Components/AddTeacher";
import TeacherPayment from "./Components/TeacherPayment";
import AllParent from "./Components/AllParent";
import ParentDetails from "./Components/ParentDetails";
import AddParent from "./Components/AddParent";
import AllBook from "./Components/AllBook";
import AddBook from "./Components/AddBook";
import AllFeesCollection from "./Components/AllFeesCollection";
import AllExpense from "./Components/AllExpense";
import AddExpense from "./Components/AddExpense";
import AllClass from "./Components/AllClass";
import AddClass from "./Components/AddClass";
import Subject from "./Components/Subject";
import ClassRoutine from "./Components/ClassRoutine";
import Attendance from "./Components/Attendance";
import Transport from "./Components/Transport";
import Hostel from "./Components/Hostel";
import Notice from "./Components/Notice";
import Messsage from "./Components/Message";
import User from "./Components/User";
import AddTeacherPayment from "./Components/AddTeacherPayment";
import Login from "./Components/Login";
import Forget from "./Components/Forget";
import ExamGrade from "./Components/ExamGrade";

import "./css/bootstrap.min.css";
import "./css/all.min.css";
import "./fonts/flaticon.css";
import "./css/fullcalendar.min.css";
import "./Components/style.css";
import AddFeesCollection from "./Components/AddFeesCollection";
import ExamSchedule from "./Components/ExamSchedule";
import AddResult from "./Components/AddResult";
import EditUser from "./Components/EditUser";
import EditStudent from "./Components/EditStudent";
import EditParent from "./Components/EditParent";
import EditTeacher from "./Components/EditTeacher";




function App() {

  

  return (
    <Routes>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/studentDashboard" element={<StudentDashboard />} />
      <Route path="/parentDashboard" element={<ParentDashboard />} />
      <Route path="/teacherDashboard" element={<TeacherDashboard />} />
      <Route path="/allStudent" element={<AllStudent />} />
      <Route path="/studentDetails/:id" element={<StudentDetails />} />
      <Route path="/admissionForm" element={<AdmissionForm />} />
      <Route path="/studentPromotion" element={<StudentPromotion />} />
      <Route path="/allTeacher" element={<AllTeacher />} />
      <Route path="/teacherDetails/:id" element={<TeacherDetails />} />
      <Route path="/addTeacher" element={<AddTeacher />} />
      <Route path="/teacherPayment" element={<TeacherPayment />} />
      <Route path="/allParent" element={<AllParent />} />
      <Route path="/parentDetails/:id" element={<ParentDetails />} />
      <Route path="/addParent" element={<AddParent />} />
      <Route path="/allBook" element={<AllBook />} />
      <Route path="/addBook" element={<AddBook />} />
      <Route path="/allFeesCollection" element={<AllFeesCollection />} />
      <Route path="/allExpense" element={<AllExpense />} />
      <Route path="/addExpense" element={<AddExpense />} />
      <Route path="/allClass" element={<AllClass />} />
      <Route path="/addClass" element={<AddClass />} />
      <Route path="/addFees" element={<AddFeesCollection />} />
      <Route path="/subject" element={<Subject />} />
      <Route path="/classRoutine" element={<ClassRoutine />} />
      <Route path="/attendence" element={<Attendance />} />
      <Route path="/transport" element={<Transport />} />
      <Route path="/hostel" element={<Hostel />} />
      <Route path="/notice" element={<Notice />} />
      <Route path="/messaging" element={<Messsage />} />
      <Route path="/setting" element={<User />} />
      <Route path="/addTeacherPayment" element={<AddTeacherPayment />} />
      <Route path="/" element={<Login />} />
      <Route path="/forgetPassword" element={<Forget />} />
      <Route path="/exam-grade" element={<ExamGrade />} />
      <Route path="/exam-schedule" element={<ExamSchedule />} />
      <Route path="/exam-result" element={<AddResult />} />
      <Route path="/edit-user/:userId" element={<EditUser />} />
      <Route path="/edit-student/:studentId" element={<EditStudent />} />
      <Route path="/edit-parent/:parentId" element={<EditParent />} />
      <Route path="/edit-teacherr/:teacherId" element={<EditTeacher />} />
    </Routes>
  );
}

export default App;
