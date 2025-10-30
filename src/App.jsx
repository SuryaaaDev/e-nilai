import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import LayoutAdmin from "./components/LayoutAdmin";
import LayoutTeacher from "./components/LayoutTeacher";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminDashboard from "./pages/admin/Dashboard";
import Kelas from "./pages/admin/Classes";
import Students from "./pages/admin/Students";
import Majors from "./pages/admin/Majors";
import Teachers from "./pages/admin/Teachers";
import TeacherClasses from "./pages/admin/TeacherClasses";
import Subjects from "./pages/admin/Subjects";

import TeacherDashboard from "./pages/teacher/Dashboard";
import NilaiSiswa from "./pages/teacher/NilaiSiswa";
import TeacherClassDetail from "./pages/teacher/TeacherClassDetail";
import TeacherProfile from "./pages/teacher/TeacherProfile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <LayoutAdmin />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="classes" element={<Kelas />} />
          <Route path="students" element={<Students />} />
          <Route path="majors" element={<Majors />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="teacher-classes" element={<TeacherClasses />} />
        </Route>

        {/* TEACHER ROUTES */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <LayoutTeacher />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="scores" element={<NilaiSiswa />} />
          <Route path="classes/:id" element={<TeacherClassDetail />} />
          <Route path="profile" element={<TeacherProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
