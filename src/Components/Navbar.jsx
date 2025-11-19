import { Link } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../Context/ThemeContext";
import { Menu, X } from "lucide-react"; // for icons

function Navbar() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
   
    { name: "Programming", path: "#" },
    { name: "Technology", path: "#" },
    { name: "News", path: "#" },
    { name: "Contact Us", path: "#" },
    { name: "About", path: "/About" },
    // { name: "Blog", path: "/blog" },
  ];

  return (
    <header
      className={`w-full  top-0 left-0 z-50 transition-all duration-500 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100 border-b border-gray-700"
          : "bg-gray-100 text-gray-900 border-b border-gray-300"
      }`}
    >
      <div className="flex justify-between items-center p-6 lg:px-20 py-4 w-full mx-auto">
        {/* Logo */}
        <Link
        to={"/"}>
        <h1
          className={`text-3xl font-bold tracking-wide ${
            theme === "dark" ? "text-yellow-400" : "text-blue-600"
          }`}
        >
          BlogVerse
        </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-xl font-medium">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={`/${link.name}`}
              className={`transition-colors duration-300 ${
                theme === "dark"
                  ? "text-gray-200 hover:text-yellow-400"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
        >
          {isOpen ? (
            <X
              size={28}
              className={`transition-colors ${
                theme === "dark" ? "text-yellow-400" : "text-blue-600"
              }`}
            />
          ) : (
            <Menu
              size={28}
              className={`transition-colors ${
                theme === "dark" ? "text-yellow-400" : "text-blue-600"
              }`}
            />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav
          className={`md:hidden flex flex-col gap-4 px-6 pb-4 transition-all duration-300 ${
            theme === "dark"
              ? "bg-gray-800 text-gray-200"
              : "bg-gray-50 text-gray-800"
          }`}
        >
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={`/categories/${link.name}`}
              onClick={() => setIsOpen(false)}
              className={`block py-2 border-b transition-colors ${
                theme === "dark"
                  ? "border-gray-700 hover:text-yellow-400"
                  : "border-gray-200 hover:text-blue-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Navbar;
