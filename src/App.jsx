import { useState } from "react";


import "./App.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import DashBoard from "./Pages/DashBoard";
import EditBlog from "./Pages/EditBlog";
import Login from "./Pages/Login";
import AddBlog from "./Pages/AddBlog";
import BlogDetails from "./Pages/BlogDetails";
import { useTheme } from "./Context/ThemeContext";
import ProtectedRoute from "./Context/ProtectedRoutes";
import Categories from "./Pages/Categories";

function App() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div
      className={`relative min-h-screen min-w-fit transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route
        path="/Dashboard"
        element={
          <ProtectedRoute>
            <DashBoard />
          </ProtectedRoute>
        }
      />
          <Route
        path="/EditBlog"
        element={
          <ProtectedRoute>
            <EditBlog />
          </ProtectedRoute>
        }
      />

        <Route path="/Blog/:id" element={<BlogDetails />} />
        <Route path="/:id" element={<Categories />} />
          <Route
        path="/AddBlog"
        element={
          <ProtectedRoute>
            <AddBlog />
          </ProtectedRoute>
        }
      />
        <Route path="/Login" element={<Login />} />
      </Routes>

      <Footer />

      {/* 🌙 Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed bottom-5 right-5 flex items-center justify-center gap-2 px-4 py-2 rounded-full shadow-lg font-medium transition-all duration-300 
          ${
            theme === "dark"
              ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
      >
        {theme === "dark" ? (
          <>
            ☀️ <span>Light Mode</span>
          </>
        ) : (
          <>
            🌙 <span>Dark Mode</span>
          </>
        )}
      </button>
    </div>
  );
}

export default App;
