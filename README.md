# 📊 Personal Dashboard (Full-Stack & AI Powered)

A comprehensive web application to track daily habits, manage expenses, monitor mood, and get AI-powered financial advice. Built with modern web technologies.

## 🔗 Live Demo
👉 **[View Live App](https://personal-dashboard-sigma-lake.vercel.app)** *(ដាក់ Link Vercel របស់អ្នក)*

## ✨ Key Features
- **Authentication:** Secure Login, Register, and Password Reset (Supabase Auth).
- **Habits Tracker:** Track daily habits with streaks and GitHub-style heatmaps.
- **Expense Manager:** Log expenses, view category charts, export to CSV, and search/sort.
- **Budget & Alerts:** Set a monthly budget and get color-coded warnings (Green/Amber/Red) when nearing the limit.
- **AI Financial Advisor:** Integrated with DeepSeek AI to analyze spending and provide personalized advice in Khmer.
- **Mood Tracker:** Log daily mood and view a 7-day history.
- **Custom Themes:** Change the app's primary accent color (Indigo, Emerald, Rose, Amber).
- **PWA Ready:** Installable on mobile devices for a native app experience.

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Zustand, Recharts
- **Backend/BaaS:** Supabase (PostgreSQL, Row Level Security, Auth)
- **AI Integration:** DeepSeek API
- **Deployment:** Vercel

## 📸 Screenshots
*(ថតរូបភាព App របស់អ្នក រួចអូសទម្លាក់ (Drag & Drop) ចូលទីនេះ)*

## 🚀 Run Locally
1. `git clone https://github.com/phyromsal22/personal-dashboard.git`
2. `npm install`
3. Add `.env` file with `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_DEEPSEEK_API_KEY`
4. `npm run dev`
