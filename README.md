# 🍳 AI Recipe Generator

An AI-powered web app that helps you discover and manage recipes using natural language, ingredients, or dish names — with a clean UI, Google OAuth, dark mode, and recipe-saving features.

Live Demo 👉 (https://fatima-ai-recipe-generator-lapf0vrba-fatimas-projects-877cc0df.vercel.app)

---

## 🚀 Features

### ✅ Continue with Google
- Secure authentication via **Google OAuth** using Supabase Auth.
- No sign-up form — one-click login using your Google account.

### 🥦 Ingredient-Based Recipe Generation
- Simply enter a list of ingredients (e.g., "chicken, rice, garlic").
- The AI will generate a complete recipe with steps, title, and more.

### 🍝 Recipe by Dish Name
- Know what you want to cook?
- Just type the name (e.g., "Butter Chicken"), and get a full recipe instantly.

### 💾 Save & Manage Recipes
- Save your favorite recipes to your personal dashboard.
- Avoid duplicates — recipes are uniquely stored per user.

### 🌓 Toggle Theme (Light/Dark)
- Seamless switch between light and dark themes.
- Your preference is remembered using local storage.

### 📋 Interactive Checklist for Recipe Steps
- Follow the recipe with a **step-by-step checklist**.
- Tick off steps as you cook!

---

## 🛠️ Tech Stack

- **Next.js (App Router)**
- **Supabase** (Auth + DB)
- **OpenAI API / Gemini (n8n logic)**
- **Tailwind CSS + ShadCN UI**
- **Lucide Icons**
- **TypeScript**

---

## 📦 Getting Started (Local Dev)

```bash
git clone https://github.com/your-username/ai-recipe-generator.git
cd ai-recipe-generator
npm install
