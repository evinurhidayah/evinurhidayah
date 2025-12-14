# Evi - System Analyst Portfolio

Portfolio website profesional untuk Evi Nur Hidayah dengan AI Chat Assistant (Luna) yang interaktif.

## ✨ Features

- 🎨 **Modern UI/UX** - Desain futuristik dengan nebula theme
- 🤖 **Luna AI Chat** - AI assistant dengan Groq Llama 3.3 70B
- 🔍 **Web Search Integration** - Luna bisa search web dengan Brave Search API
- ⌨️ **Live Typing Effect** - Real-time typing animation untuk chat
- 📝 **Markdown Support** - Render markdown dengan syntax highlighting
- 🔗 **Source Citations** - Tampilkan sumber informasi dari web search
- 🚀 **Fast Performance** - Code splitting & lazy loading
- 📱 **Responsive Design** - Mobile-friendly interface
- ⭐ **Interactive Elements** - Smooth animations dengan Framer Motion
- 🧠 **Smart Context Detection** - Auto-detect kapan perlu web search

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI**: Groq API (Llama 3.3 70B)
- **Web Search**: Brave Search API
- **Markdown**: React-Markdown, Remark GFM
- **Icons**: Lucide React

## 🚀 Run Locally

**Prerequisites:** Node.js 18+

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Setup API Keys:**

   Buat file `.env.local` di root directory:

   ```bash
   GROQ_API_KEY=your_groq_api_key_here
   BRAVE_SEARCH_API_KEY=your_brave_api_key_here
   ```

   - **Groq API** (Required): https://console.groq.com/keys
   - **Brave Search API** (Required): https://api-dashboard.search.brave.com/register

   Keduanya memiliki free tier yang cukup untuk personal use.

3. **Run development servers:**

   Web search memerlukan proxy server untuk menghindari CORS:

   ```bash
   # Run proxy + vite dev server (recommended)
   npm run dev:all
   ```

   Atau jalankan terpisah di 2 terminal:

   ```bash
   # Terminal 1: Proxy server
   npm run dev:proxy

   # Terminal 2: Vite dev server
   npm run dev
   ```

   📝 **Note:** Proxy server (port 3001) diperlukan untuk web search di development.

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🤖 Luna AI Chat Features

- ✅ **Bahasa Indonesia** - Menjawab dalam Bahasa Indonesia
- ✅ **Typing Animation** - Efek mengetik real-time
- ✅ **Markdown Support** - Format teks dengan bold, italic, lists, code blocks
- ✅ **Context-Aware** - Memahami portfolio Evi dari `content.ts`
- ✅ **Responsive UI** - Maximize/minimize chat window
- ✅ **Smart Answers** - Referensi spesifik ke projects, skills, dan achievements

### Contoh Pertanyaan untuk Luna:

```
- "Ceritakan tentang project TING"
- "Apa saja skill Evi di bidang data engineering?"
- "Project apa yang menggunakan BigQuery?"
- "Bagaimana cara contact Evi?"
```

## 📁 Project Structure

```
├── components/
│   ├── LunaChat.tsx          # AI Chat component
│   ├── TypewriterText.tsx    # Typing animation + markdown
│   ├── Hero.tsx              # Hero section
│   ├── Projects.tsx          # Projects showcase
│   └── ...
├── data/
│   └── content.ts            # Portfolio content (9 projects)
├── utils/
│   └── cn.ts                 # Tailwind class merger
└── App.tsx                   # Main app component
```

## 🎨 Customization

### Update Portfolio Content

Edit `data/content.ts` untuk mengubah:

- Projects (9 case studies)
- Skills & Tech Stack
- Education & Certifications
- Contact Information

### Customize Luna AI

Edit prompt di `components/LunaChat.tsx`:

- Personality
- Response style
- Language preferences

## 📦 Deployment

### Vercel (Recommended)

1. Push ke GitHub repository
2. Import di [Vercel](https://vercel.com)
3. Set environment variables (Project → Settings → Environment Variables):
   - `GROQ_API_KEY` (untuk Luna AI)
   - `BRAVE_SEARCH_API_KEY` (untuk endpoint serverless `/api/search`)
4. Deploy! 🚀

📝 Catatan penting:

- Di production (Vercel), web search **otomatis** jalan lewat serverless function `api/search.ts`.
- File `.env.local` hanya untuk **development lokal** (dipakai oleh `dev-proxy.js`). Jangan commit API key ke repo.

### Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js      (114 KB - main bundle)
│   ├── index-[hash].js      (439 KB - markdown lazy chunk)
│   └── favicon-[hash].svg
```

## 📝 License

© 2025 Evi Nur Hidayah. All rights reserved.

## 🔗 Links

- Portfolio: https://evinurhidayah.vercel.app
- LinkedIn: https://linkedin.com/in/evinurhidayah/
- Email: evinurhidayahh@gmail.com
