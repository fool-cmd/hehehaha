# MCQ Solver Overlay

A stealthy desktop overlay that solves Python OOP multiple-choice questions using AI.

## Requirements

- **Windows 10/11**
- **Node.js** (v18+) — Download from [nodejs.org](https://nodejs.org/) or run: `winget install OpenJS.NodeJS.LTS`
- **Groq API Key** (free) — Get one at [console.groq.com](https://console.groq.com/)

## Setup (First Time)

1. **Get a Groq API key:**
   - Go to [console.groq.com](https://console.groq.com/)
   - Sign up / Log in
   - Go to API Keys → Create new key
   - Copy the key

2. **Run the app:**
   - Double-click `setup_and_run.bat`
   - It will automatically install all dependencies on first run
   - A Microsoft-style sign-in window will appear — paste your Groq API key in the "Password" field
   - Click "Sign in"

3. **You're ready!**

## How to Use

1. **Copy** an MCQ question to your clipboard (Ctrl+C)
2. Press **Ctrl+Shift+G** to get the answer
3. The answer appears as a subtle URL-style text in the bottom-left corner of your screen

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+Shift+G` | Get answer from clipboard |
| `Ctrl+Shift+F` | Re-query (get a different answer) |
| `Ctrl+Shift+↓` | Next line of answer |
| `Ctrl+Shift+↑` | Previous line of answer |
| `Ctrl+Shift+R` | Reset / Clear |
| `Ctrl+Shift+H` | Hide overlay |

## Notes

- The overlay is designed to look like a browser URL loading bar
- The settings window is disguised as a Microsoft sign-in dialog
- Your API key is saved locally in `.api_config.json` — you only need to enter it once
- Answers are also saved to `cs_answer.txt` on your Desktop for review
