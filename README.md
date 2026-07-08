# MCQ Solver Overlay

A stealthy desktop overlay that solves Python OOP multiple-choice questions using AI.

## Requirements

- **Windows 10/11**
- **Node.js** (v18+)
- **Groq API Key** (free)

---

## Quick Setup (Automatic)

1. **Install Node.js** — download from [nodejs.org](https://nodejs.org/) (click the big green LTS button, install, keep clicking Next)
2. **Get a Groq API key:**
   - Go to [console.groq.com](https://console.groq.com/)
   - Sign up / Log in
   - Go to **API Keys** → **Create new key**
   - Copy the key
3. **Double-click `setup_and_run.bat`** — it installs everything and starts the app
4. A Microsoft-style sign-in window appears — paste your Groq API key in the "Password" field
5. Click "Sign in" — **you're ready!**

---

## Manual Install (If setup_and_run.bat Doesn't Work)

If the setup script fails, follow these steps in **Command Prompt** or **PowerShell**:

### Step 1: Install Node.js

Download and install from [nodejs.org](https://nodejs.org/) (LTS version).

**Or** install via terminal:
```
winget install OpenJS.NodeJS.LTS
```

After installing, **close and reopen** your terminal, then verify:
```
node --version
npm --version
```
You should see version numbers (e.g. `v20.x.x` and `10.x.x`). If you get an error, restart your PC and try again.

### Step 2: Install Dependencies

Open terminal, navigate to the `llama-overlay` folder and install:

```
cd "PATH_TO_WHERE_YOU_EXTRACTED\llama-overlay"
npm install
```

> **Example:** If you extracted to your Desktop:
> ```
> cd "%USERPROFILE%\Desktop\hehehaha\llama-overlay"
> npm install
> ```

This downloads Electron and other dependencies. **Wait until it finishes** (may take 2-5 minutes).

### Step 3: Run the App

```
npm start
```

That's it! The overlay should appear.

---

## Hidden Run (No Terminal Window)

After the first setup is done, double-click **`run_hidden.vbs`** to launch the app **without any visible terminal window**. 

- First time: it will run the normal setup (with terminal visible)
- After that: it runs completely silently in the background

To **stop** the hidden app: open Task Manager (`Ctrl+Shift+Esc`), find `electron` or `MCQ Solver`, and End Task.

---

## How to Use

1. **Copy** an MCQ question to your clipboard (Ctrl+C)
2. Press **Ctrl+Shift+G** to get the answer
3. The answer appears as a subtle URL-style text in the bottom-left corner

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
