# AI Interview Architect

A modern, AI-powered interview question generator. This application allows users to instantly generate high-quality interview questions for any job role using generative AI.

## Features

- **Gemini AI Integration**: Uses `@google/genai` to generate context-aware interview questions.
- **Tailwind CSS 4.0**: Fully styled with the latest Tailwind features for a sleek, modern UI.
- **Dark Mode**: Smooth transition between light and dark themes.
- **Vite Powered**: Ultra-fast development and build process.
- **Fully Responsive**: Optimized for desktop, tablet, and mobile screens.
- **Type Safe**: Written in TypeScript with strict error handling and interface definitions.

## Tech Stack

- **Frontend**: React 19
- **Styling**: Tailwind CSS 4 & Lucide React (Icons)
- **AI Engine**: Google Gemini API (gemini-2.5-flash)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js
- A Google AI Studio API Key. Get one [here](https://aistudio.google.com/app/apikey).

### Installation

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/kaberege/ai-interviewer.git](https://github.com/kaberege/ai-interviewer.git)
   cd ai-interviewer

   ```

2. **Install dependencies:**

```bash
npm install


```

````

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your API key:
   ```env
   VITE_GEMINI_API_KEY=your_actual_api_key_here

````

4. **Run the development server:**

```bash
npm run dev


```
