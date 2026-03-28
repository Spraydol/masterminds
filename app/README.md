# 🎓 EduBuddy - Frontend (React + Vite)

<div align="center">

[![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-Latest-purple?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0+-blue?logo=tailwind-css)](https://tailwindcss.com)

**Frontend for EduBuddy Learning Platform** 🚀

📋 **For complete project documentation, see the [main README](../README.md)**

</div>

---

## 📚 Frontend Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🎨 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ui/              # Radix UI components
├── pages/               # Application pages
│   ├── Dashboard.tsx
│   ├── Chat.tsx
│   ├── Community.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Upload.tsx
│   ├── Streaks.tsx
│   └── Achievements.tsx
├── sections/            # Landing page sections
├── services/            # API services
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── App.tsx              # Main component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

---

## 🚀 Development

### Start the dev server
```bash
npm run dev
```

Access at: http://localhost:5173

### Build for production
```bash
npm run build
```

### Code Quality
```bash
npm run lint
```

---

## 🔗 Backend Connection

The frontend connects to the Flask backend at `http://localhost:5000`

Make sure the backend is running:
```bash
cd ../edubuddy-backend
python app.py
```

---

## 📖 Full Documentation

For complete project information including:
- Features overview
- Tech stack details
- Installation guide
- API endpoints
- Contributing guidelines
- Troubleshooting

👉 **See [../README.md](../README.md)**

---

## 🁕 What's Next?

- Read the [main README](../README.md) for full project documentation
- Check out the backend:  [edubuddy-backend/](../edubuddy-backend/)
- Start developing with `npm run dev`

---

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details
