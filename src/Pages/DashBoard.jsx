import { useTheme } from "../Context/ThemeContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc, getDoc, query, getDocs, collection, orderBy } from "firebase/firestore";
import { useUser } from "../Context/UserNameContext";

function DashBoard() {
  const { theme } = useTheme();
 const [blogs, setBlogs] = useState([]);
 const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  const { username, setUsername, savedName, handleSaveName, saving, user } = useUser();

  // Dummy Blog Data
   useEffect(() => {
      (async () => {
        try {
          const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
          const snap = await getDocs(q);
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          setBlogs(list);
        } catch (e) {
          console.error("Error fetching blogs:", e);
        } finally {
          setLoading(false);
        }
      })();
    }, []);

  // ✅ Save username in Firestore
 

console.log(blogs)

  // ✅ Handle add blog
  const handleAddBlog = () => {
    navigate("/AddBlog");
  };

  // ✅ Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // ✅ Show loading until data fetched
  if (saving) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${
          theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"
        }`}
      >
        <p className="text-lg font-semibold animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div
      className={`pt-24 pb-10 min-h-screen w-full overflow-x-hidden transition-colors duration-500 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-8 px-4 sm:px-6 w-full">
        {/* 🔹 Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
          <h1
            className={`text-3xl font-bold text-center sm:text-left ${
              theme === "dark" ? "text-yellow-400" : "text-blue-600"
            }`}
          >
            Dashboard
          </h1>

          <div className="flex flex-wrap gap-3 justify-center sm:justify-end w-full sm:w-auto">
            <button
              onClick={handleAddBlog}
              className={`px-4 py-2 rounded-lg font-semibold shadow-md w-full sm:w-auto transition-all ${
                theme === "dark"
                  ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              ➕ Add Blog
            </button>
            <button
              onClick={handleSignOut}
              className={`px-4 py-2 rounded-lg font-semibold shadow-md w-full sm:w-auto transition-all ${
                theme === "dark"
                  ? "bg-gray-800 text-yellow-400 border border-yellow-400 hover:bg-gray-700"
                  : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
              }`}
            >
              🚪 Sign Out
            </button>
          </div>
        </div>

        {/* 🔹 Username Section */}
        <div
          className={`rounded-xl p-5 shadow-md w-full transition-colors flex flex-col gap-5 ${
            theme === "dark"
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
            <div className="text-center sm:text-left w-full sm:w-1/2">
              <h2 className="text-xl font-semibold mb-1">Profile Settings 👤</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Set your username for blog uploads
              </p>
            </div>

            <form
              onSubmit={handleSaveName}
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-1/2 items-center justify-center sm:justify-end"
            >
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`px-4 py-2 rounded-md w-full outline-none transition-colors ${
                  theme === "dark"
                    ? "bg-gray-700 text-white placeholder-gray-400"
                    : "bg-gray-100 text-gray-900 placeholder-gray-500"
                }`}
              />
              <button
                type="submit"
                className={`px-4 sm:px-2 py-2 rounded-md font-medium w-full sm:w-[200px] transition-all ${
                  theme === "dark"
                    ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {savedName?"Change Name":"Add Name"}
              </button>
            </form>
          </div>

          {savedName && (
            <p className="text-sm italic text-center sm:text-left text-gray-500 dark:text-gray-400">
              Current Username:{" "}
              <span
                className={`font-semibold ${
                  theme === "dark" ? "text-yellow-300" : "text-blue-700"
                }`}
              >
                {savedName}
              </span>
            </p>
          )}
        </div>

        {/* 🔹 Blog List Section */}
        <div
          className={`rounded-xl p-5 shadow-md w-full transition-colors ${
            theme === "dark"
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4 text-center sm:text-left">
            Your Blogs
          </h2>

          {/* Desktop Table */}
          <div className="hidden md:block w-full  overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className={`text-sm ${
                    theme === "dark"
                      ? "text-gray-300 border-b border-gray-700"
                      : "text-gray-700 border-b border-gray-300"
                  }`}
                >
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Title</th>
                  <th className="py-2 px-3">Uploaded By</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog, index) => (
                  <tr
                    key={blog.id}
                    className={`text-sm ${
                      theme === "dark"
                        ? "border-b border-gray-700 hover:bg-gray-700"
                        : "border-b border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <td className="py-2 px-3">{index + 1}</td>
                    <td className="py-2 px-3">{blog.title}</td>
                    <td className="py-2 px-3 italic">
                      {savedName ? (
                        <span
                          className={`font-semibold ${
                            theme === "dark" ? "text-yellow-300" : "text-blue-700"
                          }`}
                        >
                          {savedName}
                        </span>
                      ) : (
                        <span className="text-gray-400">No name</span>
                      )}
                    </td>
                    <td className="py-2 px-3">{blog.date}</td>
                    <td
                      className={`py-2 px-3 font-medium ${
                        blog.status === "Published"
                          ? theme === "dark"
                            ? "text-green-400"
                            : "text-green-600"
                          : theme === "dark"
                          ? "text-yellow-300"
                          : "text-yellow-600"
                      }`}
                    >
                      {blog.status}
                    </td>
                    <td className="py-2 px-3 flex gap-2 justify-center flex-wrap">
                      <button
                        className={`px-3 py-1 rounded-md text-sm transition-all ${
                          theme === "dark"
                            ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        Edit
                      </button>
                      <button
                        className={`px-3 py-1 rounded-md text-sm transition-all ${
                          theme === "dark"
                            ? "bg-red-500 text-white hover:bg-red-400"
                            : "bg-red-600 text-white hover:bg-red-700"
                        }`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {blogs.map((blog, index) => (
              <div
                key={blog.id}
                className={`p-4 rounded-lg shadow-md ${
                  theme === "dark"
                    ? "bg-gray-700 border border-gray-600"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <p className="text-sm font-medium">
                  <span className="font-semibold">#{index + 1}</span> • {blog.date}
                </p>
                <h3 className="text-lg font-semibold mt-2">{blog.title}</h3>
                <p className="text-sm italic mt-1">
                  Uploaded by:{" "}
                  {savedName ? (
                    <span
                      className={`font-semibold ${
                        theme === "dark" ? "text-yellow-300" : "text-blue-700"
                      }`}
                    >
                      {savedName}
                    </span>
                  ) : (
                    <span className="text-gray-400">No name</span>
                  )}
                </p>
                <p
                  className={`mt-1 text-sm font-medium ${
                    blog.status === "Published"
                      ? theme === "dark"
                        ? "text-green-400"
                        : "text-green-600"
                      : theme === "dark"
                      ? "text-yellow-300"
                      : "text-yellow-600"
                  }`}
                >
                  {blog.status}
                </p>

                <div className="flex gap-3 mt-3">
                  <button
                    className={`px-3 py-1 rounded-md text-sm w-full transition-all ${
                      theme === "dark"
                        ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md text-sm w-full transition-all ${
                      theme === "dark"
                        ? "bg-red-500 text-white hover:bg-red-400"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
