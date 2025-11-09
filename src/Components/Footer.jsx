import React from 'react'
import { useTheme } from '../Context/ThemeContext'

function Footer() {
   const { theme, toggleTheme } = useTheme();
  return (
     <footer
      className={`w-full text-center py-4 mt-10 transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gray-800 text-gray-300 border-t border-gray-700"
          : "bg-gray-200 text-gray-800 border-t border-gray-300"
      }`}
    >
      <p className="text-sm">
        © {new Date().getFullYear()} BlogVerse. Built by Ilyas Hassan 🚀
      </p>
    </footer>
  )
}

export default Footer