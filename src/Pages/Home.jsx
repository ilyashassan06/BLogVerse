// src/pages/Blogs.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useTheme } from "../Context/ThemeContext";

export default function Home() {
  const { theme } = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

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

  const featured = useMemo(() => blogs[0] || null, [blogs]);

  const stripHtml = (html = "") => (html || "").replace(/<[^>]+>/g, "").slice(0, 220);
  const formatDate = (ts) => {
    try {
      if (!ts) return "Unknown";
      const date = typeof ts.toDate === "function" ? ts.toDate() : new Date(ts);
      return date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return "Unknown";
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Example: replace with Firestore or API call as needed.
    if (email && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  if (loading) {
    return (
      <div className={`${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"} min-h-screen flex items-center justify-center p-6`}>
        <div className="animate-pulse text-center">
          <div className="h-6 w-64 bg-gray-300 rounded mb-4 mx-auto"></div>
          <div className="h-4 w-40 bg-gray-300 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"} transition-colors duration-500`}>

      {/* HERO */}
      <header className={`${theme === "dark" ? "bg-linear-to-b from-gray-900 to-gray-800" : "bg-white"} border-b`}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className={`text-4xl md:text-5xl font-extrabold leading-tight ${theme === "dark" ? "text-yellow-300" : "text-blue-600"}`}>
                Fresh ideas, short reads.
              </h1>
              <p className="mt-4 text-lg opacity-80 max-w-xl">
                Read opinions, tutorials and stories from creators. Curated for busy readers — clear, actionable and short.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link to={featured ? `/blog/${featured.id}` : "/"} className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg font-medium shadow-md transition-all ${theme === "dark" ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                  {featured ? "Read Featured" : "Explore"}
                </Link>

                <a href="#latest" className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all border ${theme === "dark" ? "border-gray-700 text-gray-200 hover:bg-gray-800" : "border-gray-200 text-gray-800 hover:bg-gray-50"}`}>
                  Latest Posts
                </a>
              </div>

              {/* categories chips */}
              <div className="mt-6 flex flex-wrap gap-2">
                {['React','Firebase','UI','Productivity','Stories'].map((c) => (
                  <span key={c} className={`px-3 py-1 text-sm rounded-full font-semibold ${theme === "dark" ? "bg-gray-800 text-yellow-300" : "bg-white text-blue-700 border border-gray-200"}`}>
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Featured */}
            <div>
              {featured ? (
                <article className={`rounded-2xl overflow-hidden shadow-xl transition-transform transform hover:-translate-y-1 ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
                  {featured.imageUrl ? (
                    <img src={featured.imageUrl} alt={featured.title} className="w-full h-56 object-cover" />
                  ) : (
                    <div className={`w-full h-56 flex items-center justify-center ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                      <span className="text-sm opacity-60">No cover image</span>
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className={`text-2xl font-bold mb-2 ${theme === "dark" ? "text-yellow-300" : "text-blue-700"}`}>{featured.title}</h3>
                    <p className="text-sm opacity-70">{featured.authorName || featured.authorEmail || 'Unknown'} • {formatDate(featured.createdAt)}</p>
                    <p className="mt-3 text-sm opacity-80">{stripHtml(featured.content)}</p>

                    <div className="mt-4">
                      <Link to={`/blog/${featured.id}`} className={`inline-block px-4 py-2 rounded-md font-medium ${theme === "dark" ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                        Read full
                      </Link>
                    </div>
                  </div>
                </article>
              ) : (
                <div className={`rounded-2xl overflow-hidden shadow-xl p-6 ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
                  <h3 className="text-xl font-semibold mb-2">No featured post</h3>
                  <p className="text-sm opacity-70">Publish a post to show it here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* LATEST */}
      <main className="max-w-6xl mx-auto px-6 py-12" id="latest">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Latest Posts</h2>
          <Link to="/all" className={`text-sm font-medium ${theme === "dark" ? "text-yellow-300" : "text-blue-600"}`}>View all</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.slice(0, 9).map((b) => (
            <article key={b.id} className={`rounded-2xl overflow-hidden shadow-md transition-transform transform hover:-translate-y-1 ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
              {b.imageUrl ? (
                <img src={b.imageUrl} alt={b.title} className="w-full h-44 object-cover" />
              ) : (
                <div className={`w-full h-44 flex items-center justify-center ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                  <span className="text-sm opacity-60">No image</span>
                </div>
              )}

              <div className="p-4">
                <h3 className={`text-lg font-semibold mb-1 ${theme === "dark" ? "text-yellow-200" : "text-gray-900"}`}>{b.title}</h3>
                <p className="text-xs opacity-70">{b.authorName || b.authorEmail || 'Unknown'} • {formatDate(b.createdAt)}</p>
                <p className="mt-3 text-sm opacity-80">{stripHtml(b.content)}</p>
                <div className=" flex items-center justify-between">
                  <Link to={`/blog/${b.id}`} className={`text-xl font-medium border-2
                    px-4 py-2 rounded-md  ${theme === "dark" ? "text-yellow-300" : "text-blue-600"}`}>Read Full</Link>
                  <span className="text-xs opacity-60">{b.category || 'General'}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CATEGORIES + SUBSCRIBE */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className={`rounded-2xl p-6 ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
            <h4 className="text-lg font-semibold mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {['React','Firebase','UI','Productivity','Stories','Design'].map((c) => (
                <button key={c} className={`px-3 py-1 rounded-full text-sm font-medium ${theme === "dark" ? "bg-gray-700 text-yellow-300" : "bg-gray-50 text-blue-700 border border-gray-200"}`}>{c}</button>
              ))}
            </div>
          </div>

          <div className={`md:col-span-2 rounded-2xl p-6 flex flex-col justify-between ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
            <div>
              <h4 className="text-xl font-semibold mb-2">Stay in the loop</h4>
              <p className="text-sm opacity-80">Get the best posts delivered to your inbox weekly. No spam.</p>

              <form onSubmit={handleSubscribe} className="mt-4 flex flex-col sm:flex-row gap-3">
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className={`px-4 py-2 rounded-md outline-none w-full ${theme === "dark" ? "bg-gray-700 text-white placeholder-gray-400" : "bg-gray-100 text-gray-900 placeholder-gray-500"}`} />
                <button type="submit" className={`px-4 py-2 rounded-md font-medium ${theme === "dark" ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}>{subscribed ? 'Subscribed' : 'Subscribe'}</button>
              </form>
            </div>

            <div className="mt-6 text-sm opacity-70">
              <p>We respect your privacy. You can unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
}
