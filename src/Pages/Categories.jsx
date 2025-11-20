import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchBlogs } from "../features/blogSlice";
import { useTheme } from "../Context/ThemeContext";

export default function Categories() {
  const { id } = useParams(); // category from URL
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const { items: blogs, loading, error } = useSelector(
    (state) => state.blogs
  );

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  // Filter blogs by category (case-insensitive)
  const filteredBlogs = blogs.filter(
    (blog) => blog.category?.toLowerCase() === id.toLowerCase()
  );

  const stripHtml = (html = "") =>
    (html || "").replace(/<[^>]+>/g, "").slice(0, 150);

  const formatDate = (ts) => {
    if (!ts) return "Unknown";
    const date =
      typeof ts.toDate === "function" ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Loading state
  if (loading === "pending") {
    return (
      <div
        className={`${
          theme === "dark"
            ? "bg-gray-900 text-gray-100"
            : "bg-gray-100 text-gray-900"
        } min-h-screen flex items-center justify-center p-6`}
      >
        <div className="animate-pulse text-center">
          <div className="h-6 w-64 bg-gray-300 rounded mb-4 mx-auto"></div>
          <div className="h-4 w-40 bg-gray-300 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* HEADER */}
      <header
        className={`py-16 border-b ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <h1
            className={`text-4xl font-bold ${
              theme === "dark" ? "text-yellow-300" : "text-blue-600"
            }`}
          >
            Category: {id}
          </h1>
          <p className="mt-2 opacity-80 text-lg">
            Showing all posts under "{id}" category.
          </p>
        </div>
      </header>

      {/* POSTS GRID */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {filteredBlogs.length === 0 ? (
          <div
            className={`text-center p-10 rounded-xl ${
              theme === "dark"
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <h2 className="text-xl font-semibold mb-2">No posts found</h2>
            <p className="opacity-70">
              There are no posts in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((b) => (
              <article
                key={b.id}
                className={`rounded-2xl overflow-hidden shadow-md transition-transform transform hover:-translate-y-1 ${
                  theme === "dark"
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white border border-gray-200"
                }`}
              >
                {/* Image */}
                {b.imageUrl ? (
                  <img
                    src={b.imageUrl}
                    alt={b.title}
                    className="w-full h-44 object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-44 flex items-center justify-center ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <span className="text-sm opacity-60">No image</span>
                  </div>
                )}

                {/* Content */}
                <div className="p-4">
                  <h3
                    className={`text-lg font-semibold mb-1 ${
                      theme === "dark"
                        ? "text-yellow-200"
                        : "text-gray-900"
                    }`}
                  >
                    {b.title}
                  </h3>
                  <p className="text-xs opacity-70">
                    {b.authorName || b.authorEmail || "Unknown"} •{" "}
                    {formatDate(b.createdAt)}
                  </p>

                  <p className="mt-3 text-sm opacity-80">
                    {stripHtml(b.contentHtml)}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <Link
                      to={`/blog/${b.id}`}
                      className={`text-sm font-medium px-4 py-2 rounded-md border ${
                        theme === "dark"
                          ? "text-yellow-300 border-gray-600"
                          : "text-blue-700 border-blue-300"
                      }`}
                    >
                      Read Full
                    </Link>

                    <span className="text-xs opacity-60">
                      {b.category || "General"}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
