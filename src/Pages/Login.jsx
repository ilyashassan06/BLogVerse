// src/components/LoginForm.jsx
import { useState } from "react";
import {  useForm } from "react-hook-form";
import { useTheme } from "../Context/ThemeContext";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [firebaseError, setfirebaseError] = useState("")
  const [loading, setLoading] = useState(false)
  const ALLOWED_EMAIL = "adminblogverse@gmail.com";
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    reset,
  } = useForm({
    mode: "onSubmit",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async ({email,password}) => {
     console.log("onSubmit called with:", email); // <-- add this
    setfirebaseError("");
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth,email,password);
      const user = cred.user;

      if(user.email !== ALLOWED_EMAIL){
        await signOut(auth);
        setfirebaseError("This Acoout is not allowed")
        return;
      }
        navigate("/Dashboard")
        console.log("success")

    } catch (error) {
      setfirebaseError("Invalid email or password.");
    }finally {
    setLoading(false);
  }
  console.log(firebaseError)
    reset({ password: "" });
  };

  const accent = theme === "dark" ? "yellow-400" : "blue-600";
  const cardBg = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const panelBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const textBase = theme === "dark" ? "text-gray-100" : "text-gray-900";
  const textMuted = theme === "dark" ? "text-gray-300" : "text-gray-700";
  const borderBase = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const errText = "text-red-500";

  return (
    <section
      className={`min-h-[70vh] w-full ${cardBg} ${textBase} flex items-center justify-center px-4 py-10`}
    >
      <div
        className={`w-full max-w-md rounded-2xl shadow-lg ${panelBg} border ${borderBase} p-6 sm:p-8`}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-1">Welcome back 👋</h2>
        <p className={`${textMuted} mb-6`}>
          Log in to continue to{" "}
          <span
            className={`font-semibold ${
              theme === "dark" ? "text-yellow-400" : "text-blue-600"
            }`}
          >
            BlogVerse
          </span>
        </p>

       <form onSubmit={handleSubmit(onSubmit, (formErrs) => {
  console.log("INVALID ->", formErrs); // shows which rule is failing
})} noValidate>
          {/* Email */}
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
             autoComplete="email"
            placeholder="you@example.com"
            className={`
              w-full rounded-xl border ${borderBase} px-4 py-3 outline-none
              bg-transparent
              focus:ring-2 focus:ring-${accent} focus:border-${accent}
              transition
            `}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                message: "Enter a valid email address",
              },
            })}
          />
          {errors.email && (
            <p className={`${errText} text-sm mt-1`}>{errors.email.message}</p>
          )}

          {/* Password */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className={`
                  w-full rounded-xl border ${borderBase} px-4 py-3 pr-12 outline-none
                  bg-transparent
                  focus:ring-2 focus:ring-${accent} focus:border-${accent}
                  transition
                `}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Must be at least 8 characters",
                  },
                  validate: {
                    letter: (v) =>
                      /[A-Za-z]/.test(v) || "Include at least one letter",
                    number: (v) => /\d/.test(v) || "Include at least one number",
                    symbol: (v) =>
                      /[^A-Za-z0-9]/.test(v) || "Include at least one symbol",
                  },
                })}
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className={`absolute inset-y-0 right-0 px-3 text-sm ${textMuted} hover:opacity-80`}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {errors.password && (
              <ul
                className={`${errText} text-sm mt-1 list-disc pl-5 space-y-0.5`}
              >
                {typeof errors.password.message === "string" ? (
                  <li>{errors.password.message}</li>
                ) : (
                  Object.values(errors.password.types || {}).map(
                    (msg, i) => <li key={i}>{msg}</li>
                  )
                )}
              </ul>
            )}

            <p className="text-xs mt-2 opacity-80">
              Use at least 8 characters with letters, numbers & symbols.
            </p>
          </div>

          {firebaseError && (
  <div className="mt-3 text-sm text-red-500">{firebaseError}</div>
)}

          {/* Submit button */}
          <button
            type="submit"
            disabled={!isValid || isSubmitting }
            className={`
              mt-6 w-full rounded-xl px-4 py-3 font-semibold transition
              ${
                theme === "dark"
                  ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500 disabled:bg-yellow-400/60"
                  : "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-600/60"
              }
            `}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>

          {/* Extra options */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="h-4 w-4" />
              <span className={`${textMuted}`}>Remember me</span>
            </label>

            <a
              href="#"
              className={`font-medium hover:underline ${
                theme === "dark" ? "text-yellow-400" : "text-blue-600"
              }`}
            >
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </section>
  );
}
