import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard    from "./pages/Dashboard";
import Addproduct   from "./pages/Addproduct";
import Listproduct  from "./pages/Listproduct";
import Editproduct  from "./pages/Editproduct";
import Addretreat   from "./pages/Addretreat";
import Listretreat  from "./pages/Listretreat";
import Editretreat  from "./pages/Editretreat";
import Login        from "./pages/Login";
import CourseList   from "./pages/CourseList";
import AddCourse    from "./pages/AddCourse";
import EditCourse   from "./pages/EditCourse";
import ManageCourse from "./pages/ManageCourse";
import "./App.css";

function App() {
  const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem("uname");
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

          {/* Courses (Learning Platform) */}
          <Route path="/courses"                element={<PrivateRoute><CourseList /></PrivateRoute>} />
          <Route path="/addcourse"              element={<PrivateRoute><AddCourse /></PrivateRoute>} />
          <Route path="/editcourse/:id"         element={<PrivateRoute><EditCourse /></PrivateRoute>} />
          <Route path="/managecourse/:id"       element={<PrivateRoute><ManageCourse /></PrivateRoute>} />

          {/* Product / Services */}
          <Route path="/addproduct"             element={<PrivateRoute><Addproduct /></PrivateRoute>} />
          <Route path="/listproduct"            element={<PrivateRoute><Listproduct /></PrivateRoute>} />
          <Route path="/editproduct/:id"        element={<PrivateRoute><Editproduct /></PrivateRoute>} />

          {/* Retreats */}
          <Route path="/addretreat"             element={<PrivateRoute><Addretreat /></PrivateRoute>} />
          <Route path="/listretreat"            element={<PrivateRoute><Listretreat /></PrivateRoute>} />
          <Route path="/editretreat/:id"        element={<PrivateRoute><Editretreat /></PrivateRoute>} />

          {/* Login */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
