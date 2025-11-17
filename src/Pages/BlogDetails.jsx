// src/pages/BlogDetails.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useTheme } from "../Context/ThemeContext";
import DOMPurify from "dompurify"; // optional but recommended (npm install dompurify)

function BlogDetails() {
  const { theme } = useTheme();
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const ref = doc(db, "blogs", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          if (isMounted) setBlog(null);
        } else {
          if (isMounted) setBlog({ id: snap.id, ...snap.data() });
        }
      } catch (e) {
        console.error("Error fetching blog:", e);
        if (isMounted) setErr("Failed to load the blog. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // 🕒 Format createdAt date
  const formattedDate = useMemo(() => {
    if (!blog?.createdAt) return "";
    try {
      const date =
        typeof blog.createdAt.toDate === "function"
          ? blog.createdAt.toDate()
          : new Date(blog.createdAt);
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "";
    }
  }, [blog]);

  // sanitize body (defensive — removes inline styles and weird classes)
  const body = blog?.contentHtml || "";
  const cleanBody = useMemo(() => {
    if (!body) return "";
    try {
      // remove editor-specific classes (quick pre-clean)
      let tmp = body.replace(/\sclass="([^"]*?ql-[^"]*?)"/gi, "");
      // sanitize and remove inline style attributes
      const clean = DOMPurify.sanitize(tmp, {
        FORBID_ATTR: ["style", "onclick", "onerror"],
        ALLOWED_TAGS: [
          "h1","h2","h3","h4","h5","h6","p","a","ul","ol","li","strong","em",
          "blockquote","pre","code","img","figure","figcaption","hr","br","table","thead","tbody","tr","th","td","div","span"
        ],
        ALLOWED_ATTR: ["href","src","alt","title","width","height","class"]
      });
      return clean;
    } catch {
      // if DOMPurify not available for some reason, fall back to raw HTML.
      return body;
    }
  }, [body]);

  // 🌀 Loading state (kept visually consistent with theme)
  if (loading) {
    return (
      <div className={`${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"} min-h-[60vh] flex items-center justify-center`}>
        <div className="animate-pulse text-center">
          <div className="h-6 w-64 bg-gray-300 rounded mb-2 mx-auto"></div>
          <div className="h-4 w-40 bg-gray-300 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  // ⚠️ Error state
  if (err) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className={`rounded-xl border p-4 ${theme === "dark" ? "bg-red-900/30 border-red-700 text-red-200" : "bg-red-50 border-red-200 text-red-700"}`}>
          {err}
        </div>
        <div className="mt-4">
          <Link
            to="/"
            className={`inline-flex items-center rounded-lg border px-4 py-2 text-sm transition ${theme === "dark" ? "border-gray-700 text-gray-200 hover:bg-gray-800" : "border-gray-200 text-gray-800 hover:bg-gray-50"}`}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // 🚫 Blog not found
  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className={`rounded-xl border p-6 shadow-sm ${theme === "dark" ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-900"}`}>
          <h1 className="text-2xl font-semibold">Blog not found</h1>
          <p className="mt-2 text-gray-500">
            We couldn't find a post with id: <span className="font-mono">{id}</span>
          </p>
          <div className="mt-4">
            <Link
              to="/"
              className={`inline-flex items-center rounded-lg border px-4 py-2 text-sm transition ${theme === "dark" ? "border-gray-700 text-gray-200 hover:bg-gray-800" : "border-gray-200 text-gray-800 hover:bg-gray-50"}`}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // 📰 Main blog display (UI updated: hero-like header, right-side author/meta card)
  // ---------------------------------------------------------------------
  return (
    <article className={`${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"} min-h-screen transition-colors duration-300`}>
      {/* Top bar */}
      <div className={`${theme === "dark" ? "bg-gray-900" : "bg-white"} border-b`}>
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className={`text-sm ${theme === "dark" ? "text-gray-300 hover:text-gray-100" : "text-gray-600 hover:text-gray-900"}`}>
            ← Back
          </Link>
          <div className="text-sm text-gray-500">Post ID: {blog.id}</div>
        </div>
      </div>

      {/* Header / hero */}
      <header className="max-w-6xl mx-auto px-4 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main header (left, spans two cols on lg) */}
          <div className="lg:col-span-2">
            <h1 className={`text-3xl md:text-4xl font-extrabold tracking-tight leading-tight ${theme === "dark" ? "text-yellow-300" : "text-gray-900"}`}>
              {blog.title || "Untitled Post"}
            </h1>

            <div className="mt-3 flex items-center flex-wrap gap-x-3 text-sm text-gray-500">
              {blog.authorName && (
                <span className="inline-flex items-center gap-2">
                  <span className="i-lucide-user inline-block" />
                  <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{blog.authorName}</span>
                </span>
              )}
              {formattedDate && <span>• {formattedDate}</span>}
              {blog.readTime && <span>• {blog.readTime} read</span>}
            </div>

            {/* Cover image */}
            {blog.imageUrl && (
              <div className="mt-6 overflow-hidden rounded-2xl border shadow-sm">
                <img
                  src={blog.imageUrl}
                  alt={blog.title || "Blog cover"}
                  className="w-full h-[420px] object-cover"
                  loading="lazy"
                />
              </div>
            )}
          </div>

          {/* Right column: author card / metadata */}
          <aside className={`rounded-2xl p-4 shadow-sm ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-gray-700 text-yellow-300" : "bg-gray-50 text-blue-600"}`}>
                <span className="font-semibold">{(blog.authorName || "U").charAt(0)}</span>
              </div>
              <div>
                <div className="text-sm font-semibold">{blog.authorName || blog.authorEmail || "Unknown"}</div>
                <div className="text-xs opacity-70">Author</div>
              </div>
            </div>

            <div className="mt-4 text-sm space-y-2">
              {blog.category && <div><span className="font-medium">Category:</span> <span className="opacity-80">{blog.category}</span></div>}
              <div><span className="font-medium">Status:</span> <span className="opacity-80">{blog.published ? "Published" : "Draft"}</span></div>
              <div><span className="font-medium">Post ID:</span> <span className="opacity-80 font-mono">{blog.id}</span></div>
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                to="/"
                className={`flex-1 text-center px-3 py-2 rounded-md font-medium transition ${theme === "dark" ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}
              >
                Back to Home
              </Link>
              <button
                onClick={() =>
                  navigator.share?.({ title: blog.title, url: window.location.href })
                }
                className={`px-3 py-2 rounded-md border transition ${theme === "dark" ? "border-gray-700 text-yellow-300 hover:bg-gray-800" : "border-gray-200 text-gray-800 hover:bg-gray-50"}`}
                disabled={!navigator.share}
                title={!navigator.share ? "Sharing not supported on this browser" : "Share"}
              >
                Share
              </button>
            </div>
          </aside>
        </div>
      </header>

      {/* Content area */}
      <section className="max-w-6xl mx-auto px-4 pb-16 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* article content (main column) */}
          <div className="lg:col-span-2">
            <div className={`rounded-2xl p-6 ${theme === "dark" ? "bg-gray-800 border border-gray-700 text-gray-100" : "bg-white border border-gray-200 text-gray-900"} shadow-sm`}>
              {cleanBody ? (
                <div
                  className={`blog-content max-w-none text-base md:text-lg leading-relaxed
                    [&_ol]:list-decimal [&_ol]:pl-6
                    [&_ul]:list-disc [&_ul]:pl-6
                    [&_img]:max-w-full [&_img]:h-auto
                    [&_pre]:rounded [&_code]:rounded
                    /* explicit heading sizes to avoid inheritance from Tailwind preflight */
                    [&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:leading-tight [&_h1]:mt-6 [&_h1]:mb-4
                    [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:mt-6 [&_h2]:mb-3
                    [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-3
                    [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:mt-4 [&_h4]:mb-2
                    [&_h5]:text-lg [&_h5]:font-medium [&_h5]:mt-3 [&_h5]:mb-2
                    [&_h6]:text-base [&_h6]:font-medium [&_h6]:mt-2 [&_h6]:mb-2
                    ${
                      theme === "dark"
                        ? `
                          text-gray-200
                          [&_p]:text-gray-200
                          [&_li]:text-gray-200
                          [&_span]:text-gray-200
                          [&_h1]:text-yellow-300 [&_h2]:text-yellow-300 [&_h3]:text-yellow-300
                        `
                        : `
                          text-gray-900
                          [&_p]:text-gray-900
                          [&_li]:text-gray-900
                          [&_span]:text-gray-900
                          [&_h1]:text-blue-700 [&_h2]:text-blue-700 [&_h3]:text-blue-700
                        `
                    }`}
                  dangerouslySetInnerHTML={{ __html: cleanBody }}
                />
              ) : (
                <p className="text-gray-500">No content available.</p>
              )}

              {/* small footer actions inside article */}
              <div className="mt-6 flex flex-wrap gap-3 items-center">
                <button
                  onClick={() =>
                    navigator.share?.({ title: blog.title, url: window.location.href })
                  }
                  className={`rounded-xl border px-4 py-2 text-sm shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 ${theme === "dark" ? "border-gray-700 text-yellow-300" : "border-gray-200 text-gray-800"}`}
                  disabled={!navigator.share}
                >
                  Share
                </button>

                {/* placeholder for tags if present */}
                {Array.isArray(blog.tags) && blog.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {blog.tags.map((t) => (
                      <span key={t} className={`px-3 py-1 rounded-full text-sm font-medium ${theme === "dark" ? "bg-gray-700 text-yellow-300" : "bg-gray-50 text-blue-700 border border-gray-200"}`}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Related / next post suggestion (simple, non-invasive) */}
            <div className={`mt-6 p-4 rounded-lg ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
              <h4 className="font-semibold mb-2">You might also like</h4>
              <div className="text-sm text-gray-500">Check other posts on this topic from the homepage.</div>
              <div className="mt-3">
                <Link to="/" className={`inline-flex items-center gap-2 px-4 py-2 rounded-md ${theme === "dark" ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}>Explore posts</Link>
              </div>
            </div>
          </div>

          {/* right column: sticky TOC or quick nav */}
          <div>
            <div className={`sticky top-24 space-y-4 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
              <div className={`rounded-2xl p-4 ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
                <h5 className="font-semibold">Quick info</h5>
                <div className="mt-2 text-sm opacity-80">
                  <div><strong>Author:</strong> {blog.authorName || blog.authorEmail || "Unknown"}</div>
                  <div><strong>Date:</strong> {formattedDate}</div>
                  {blog.readTime && <div><strong>Read:</strong> {blog.readTime}</div>}
                </div>
              </div>

              <div className={`rounded-2xl p-4 ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
                <h5 className="font-semibold">Table of contents</h5>
                <p className="text-sm opacity-70 mt-2">Use browser find (Ctrl+F) to jump headings. (Auto-TOC can be added later.)</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

export default BlogDetails;
