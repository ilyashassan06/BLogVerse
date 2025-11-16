📘 BlogVerse – Modern React Blog Platform

A fully responsive, theme-aware, Firebase-powered blogging platform built with React and TailwindCSS, featuring a beautiful landing page, rich text editor support, sanitised HTML rendering, and an admin dashboard for managing content.

🚀 Features
🔥 Modern Landing Page

Featured post display

Latest posts grid

Category filters

Smooth dark/light theme

Professional UI with TailwindCSS

📝 Rich Blog Editor

Create, edit, and publish posts

Supports images, headings, lists, code blocks and more

Automatically sanitizes HTML for safety

🌙 Dark / Light Theme

Powered by useTheme()

Different colors for headings, paragraphs, lists, and UI elements

Yellow accents in dark mode, blue accents in light mode

No logic changed — pure theme-based UI layer

📄 Beautiful Blog Details Page

Large hero-style header

Author card with metadata

Clean, readable typography

Styled lists, images, code blocks

Optional DOMPurify sanitization to remove harmful inline styles

Sticky sidebar widgets

“You might also like” section

🛠 Admin Dashboard

Secure login using Firebase Authentication

Add, edit, delete blogs

Username saved in Firestore

Dark/light themed UI

Mobile-friendly table & card views

🔐 Secure Rendering

Uses optional DOMPurify to sanitize blog HTML

Prevents inline font-size, list-style overrides

Blocks XSS and unwanted attributes

☁ Firebase Integration

Firebase Firestore for storing blogs

Firebase Storage for blog images

Firebase Auth for admin login

Real-time timestamp formatting

🧱 Tech Stack
Frontend   :	React, React Router
Styling    :	TailwindCSS (custom dark/light theme)
Rich Text  :	React Quill / Custom HTML content
Backend    :	Firebase Firestore + Firebase Storage
Auth       :	Firebase Authentication
Security   :	DOMPurify 
