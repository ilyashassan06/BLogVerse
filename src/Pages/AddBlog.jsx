import React, { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { useUser } from "../Context/UserNameContext";
import { useTheme } from "../Context/ThemeContext";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // TinyMCE HTML content
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("General");
  const [userSection, setUserSection] = useState(false);
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);

  const { savedName, user } = useUser();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "blog_upload"); // your Cloudinary preset

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

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Save blog post
  const handleSaveBlog = async (e) => {
    e.preventDefault();
    console.log(content)
    const currentUser = auth.currentUser;
    if (!currentUser) return alert("Please log in to add a blog");

    setLoading(true);
    try {
      let imageUrl = "";
      if (image) {
        imageUrl = await uploadImageToCloudinary(image);
      }

   
     
      

      await addDoc(collection(db, "blogs"), {
        title,
        contentHtml: content, // FULL HTML from TinyMCE
        imageUrl,
        authorEmail: currentUser.email,
        authorName: savedName || "",
        category,
        userSection,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        createdAt: serverTimestamp(),
      });

      alert("Blog added successfully!");
      setTitle("");
      setContent("");
      setImage(null);
      setCategory("General");
      setUserSection(false);
      setTags("");
    } catch (error) {
      console.error("Error saving blog:", error);
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
            Add a New Blog 📝
          </h2>

          <form
            onSubmit={handleSaveBlog}
            className="flex flex-col w-full gap-4"
          >
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

            {/* TINYMCE EDITOR */}
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
             {/* <Editor
  apiKey="bm8bj07p4ybx78vomp4kghk7amg8xonzmtn28095tvomz16s"
  value={content}
  onEditorChange={(newValue) => setContent(newValue)}
  init={{
    height: 500,
    menubar: true,

    // REAL HEADINGS
    block_formats:
      "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4",
plugins: [
  "advlist autolink lists link image charmap preview anchor",
  "searchreplace visualblocks code fullscreen",
  "insertdatetime media table help wordcount",
],

toolbar:
  "undo redo | formatselect | " +
  "bold italic underline | " +
  "alignleft aligncenter alignright alignjustify | " +
  "bullist numlist outdent indent | " +
  "link image media table | " +
  "code | preview fullscreen",


    content_style:
      "body { font-family: Inter, Arial, sans-serif; font-size: 16px; }",
  }}
/> */}
<Editor
      apiKey='bm8bj07p4ybx78vomp4kghk7amg8xonzmtn28095tvomz16s'
      value={content}
  onEditorChange={(newValue) => setContent(newValue)}
      init={{
        plugins: [
          // Core editing features
          'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
          // Your account includes a free trial of TinyMCE premium features
          // Try the most popular premium features until Dec 1, 2025:
          'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'advtemplate', 'ai', 'uploadcare', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown','importword', 'exportword', 'exportpdf'
        ],
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        mergetags_list: [
          { value: 'First.Name', title: 'First Name' },
          { value: 'Email', title: 'Email' },
        ],
        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
        uploadcare_public_key: '0497c4627adae963d5e2',
      }}
      initialValue="Welcome to TinyMCE!"
    />

              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label
                className={`block mb-1 font-medium ${
                  theme === "dark" ? labelDark : labelLight
                }`}
              >
                Upload an image
              </label>
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
              {loading ? "Saving..." : "Save Blog"}
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

export default AddBlog;
