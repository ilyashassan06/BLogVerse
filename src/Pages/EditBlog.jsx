import React, { useState, useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { useUser } from "../Context/UserNameContext";
import { useTheme } from "../Context/ThemeContext";
import { signOut } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateBlog } from "../features/blogSlice";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("General");
  const [userSection, setUserSection] = useState(false);
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);
  const { savedName, user } = useUser();
  const { theme } = useTheme();

  // Fetch existing blog data
  useEffect(() => {
    const fetchBlog = async () => {
      const ref = doc(db, "blogs", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setTitle(data.title);
        setContent(data.contentHtml);
        setCategory(data.category);
        setUserSection(data.userSection || false);
        setTags(data.tags?.join(", ") || "");
        setImageUrl(data.imageUrl || "");
      }
    };

    fetchBlog();
  }, [id]);

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "blog_upload");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dznsgojy6/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // Save updated blog
  const handleUpdateBlog = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      let newImageUrl = imageUrl;

      if (image) {
        newImageUrl = await uploadImageToCloudinary(image);
      }

      const updatedData = {
        title,
        contentHtml: content,
        imageUrl: newImageUrl,
        category,
        userSection,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      await dispatch(updateBlog({ id, updatedData }));

      alert("Blog updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const cardBase = "rounded-lg shadow-md border transition-colors";
  const cardLight = "bg-white border-gray-200 text-gray-900";
  const cardDark = "bg-gray-800 border-gray-700 text-gray-100";

  const inputBase =
    "w-full px-3 py-2 rounded-md outline-none border transition-colors";
  const inputLight =
    "bg-gray-100 border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-blue-400";
  const inputDark =
    "bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-100 focus:ring-2 focus:ring-yellow-400";

  const labelLight = "text-gray-700";
  const labelDark = "text-gray-200";

  const pageLight = "bg-gray-100 text-gray-900";
  const pageDark = "bg-gray-900 text-gray-100";

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div
      className={`mx-auto w-[90%] md:w-[90%] lg:w-[80%] pt-24 pb-10 min-h-screen ${
        theme === "dark" ? pageDark : pageLight
      }`}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT CARD */}
        <div
          className={`${cardBase} ${
            theme === "dark" ? cardDark : cardLight
          } w-full lg:flex-3 p-6`}
        >
          <h2
            className={`text-2xl font-bold mb-5 text-center lg:text-left ${
              theme === "dark" ? "text-yellow-400" : "text-blue-600"
            }`}
          >
            Edit Blog ✏️
          </h2>

          <form onSubmit={handleUpdateBlog} className="flex flex-col w-full gap-4">
            {/* Title */}
            <div>
              <label
                className={`block mb-1 font-medium ${
                  theme === "dark" ? labelDark : labelLight
                }`}
              >
                Title
              </label>
              <input
                type="text"
                placeholder="Enter blog title"
                className={`${inputBase} ${
                  theme === "dark" ? inputDark : inputLight
                }`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* TinyMCE Editor */}
            <div>
              <label
                className={`block mb-1 font-medium ${
                  theme === "dark" ? labelDark : labelLight
                }`}
              >
                Content
              </label>

              <div
                className={`rounded-md border ${
                  theme === "dark"
                    ? "border-gray-600 bg-gray-800"
                    : "border-gray-300 bg-white"
                }`}
              >
                <Editor
                  apiKey="bm8bj07p4ybx78vomp4kghk7amg8xonzmtn28095tvomz16s"
                  value={content}
                  onEditorChange={(v) => setContent(v)}
                  init={{
                    plugins: [
                      "anchor", "autolink", "charmap", "codesample", "emoticons",
                      "link", "lists", "media", "searchreplace", "table",
                      "visualblocks", "wordcount", "checklist", "mediaembed",
                      "casechange", "formatpainter", "pageembed", "a11ychecker",
                      "tinymcespellchecker", "permanentpen", "powerpaste",
                      "advtable", "advcode", "advtemplate", "ai", "uploadcare",
                      "mentions", "tinycomments", "tableofcontents", "footnotes",
                      "mergetags", "autocorrect", "typography", "inlinecss",
                      "markdown"
                    ],
                    toolbar:
                      "undo redo | blocks fontfamily fontsize | bold italic underline |" +
                      "alignleft aligncenter alignright | bullist numlist |" +
                      "link image table | removeformat",
                  }}
                />
              </div>
            </div>

            {/* IMAGE UPLOAD */}
            <div>
              <label
                className={`block mb-1 font-medium ${
                  theme === "dark" ? labelDark : labelLight
                }`}
              >
                Change Image
              </label>

              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Current"
                  className="w-32 h-32 object-cover rounded-md mb-2 border"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className={`${inputBase} ${
                  theme === "dark" ? inputDark : inputLight
                }`}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-2 px-4 py-2 rounded-md font-semibold transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : theme === "dark"
                  ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {loading ? "Updating..." : "Update Blog"}
            </button>
          </form>
        </div>

        {/* RIGHT PANEL */}
        <div
          className={`${cardBase} ${
            theme === "dark" ? cardDark : cardLight
          } w-full lg:flex-1 p-6`}
        >
          <h3 className="text-lg font-semibold mb-4">Post Options</h3>

          {/* User Info */}
          <div className="mb-4">
            <p className="text-sm opacity-80">
              <span className="font-medium">Logged in:</span>{" "}
              {user?.email || "—"}
            </p>
            <p className="text-sm opacity-80">
              <span className="font-medium">Username:</span>{" "}
              {savedName || (
                <span className="italic text-gray-400">not set</span>
              )}
            </p>
          </div>

          {/* Category */}
          <div className="mb-4">
            <label
              className={`block mb-1 font-medium ${
                theme === "dark" ? labelDark : labelLight
              }`}
            >
              Category
            </label>
            <select
              className={`${inputBase} ${
                theme === "dark" ? inputDark : inputLight
              }`}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>General</option>
              <option>Programming</option>
              <option>Technology</option>
              <option>News</option>
            </select>
          </div>

          {/* Toggle */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-medium">Feature under my user section</p>
              <p className="text-xs opacity-70">
                Show this post under your profile/section.
              </p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={userSection}
                onChange={(e) => setUserSection(e.target.checked)}
              />
              <div
                className={`w-11 h-6 rounded-full transition ${
                  theme === "dark"
                    ? "bg-gray-600 peer-checked:bg-yellow-400"
                    : "bg-gray-300 peer-checked:bg-blue-600"
                } relative`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform peer-checked:translate-x-5`}
                />
              </div>
            </label>
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label
              className={`block mb-1 font-medium ${
                theme === "dark" ? labelDark : labelLight
              }`}
            >
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. react, firebase, tinyMCE"
              className={`${inputBase} ${
                theme === "dark" ? inputDark : inputLight
              }`}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* Sign Out */}
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
    </div>
  );
};

export default EditBlog;
