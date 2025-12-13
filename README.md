# Evi - System Analyst Portfolio

Portfolio website profesional untuk Evi Nur Hidayah dengan AI Chat Assistant (Luna) yang interaktif.

## ✨ Features

- 🎨 **Modern UI/UX** - Desain futuristik dengan nebula theme
- 🤖 **Luna AI Chat** - AI assistant dengan Groq Llama 3.3 70B
- ⌨️ **Live Typing Effect** - Real-time typing animation untuk chat
- 📝 **Markdown Support** - Render markdown dengan syntax highlighting
- 🚀 **Fast Performance** - Code splitting & lazy loading
- 📱 **Responsive Design** - Mobile-friendly interface
- ⭐ **Interactive Elements** - Smooth animations dengan Framer Motion

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI**: Groq API (Llama 3.3 70B)
- **Markdown**: React-Markdown, Remark GFM
- **Icons**: Lucide React

## 🚀 Run Locally

**Prerequisites:** Node.js 18+

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Setup API Key:**

   Buat file `.env.local` di root directory:

   ```bash
   GROQ_API_KEY=your_groq_api_key_here
   ```

   Dapatkan API key gratis dari: https://console.groq.com/keys

3. **Run development server:**

   ```bash
   npm run dev
   ```

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
3. Set environment variable: `GROQ_API_KEY`
4. Deploy! 🚀

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
