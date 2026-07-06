const { useState, useEffect } = React;
const { ipcRenderer, shell } = require('electron');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '.api_config.json');

function loadSavedKey() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
      return data.apiKey || '';
    }
  } catch (e) {}
  return '';
}

function saveKey(key) {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({ apiKey: key }), 'utf8');
  } catch (e) {}
}

// Shortcuts disguised as sign-in option labels
const shortcuts = [
  { keys: 'Ctrl+Shift+G', desc: 'Get Answer' },
  { keys: 'Ctrl+Shift+F', desc: 'Re-query' },
  { keys: 'Ctrl+Shift+\u2193', desc: 'Next Line' },
  { keys: 'Ctrl+Shift+\u2191', desc: 'Prev Line' },
  { keys: 'Ctrl+Shift+R', desc: 'Reset' },
  { keys: 'Ctrl+Shift+H', desc: 'Hide' },
];

// --- Shared Microsoft styles ---
const msFont = "'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, sans-serif";

const containerStyle = {
  width: '100%',
  height: '100%',
  background: '#fff',
  fontFamily: msFont,
  display: 'flex',
  flexDirection: 'column',
  padding: '24px 28px',
  boxSizing: 'border-box',
  overflow: 'hidden',
};

const msLogoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginBottom: '16px',
};

const msSquaresStyle = {
  display: 'grid',
  gridTemplateColumns: '8px 8px',
  gridTemplateRows: '8px 8px',
  gap: '2px',
};

const squareColors = ['#f25022', '#7fba00', '#00a4ef', '#ffb900'];

function MsLogo() {
  return (
    <div style={msLogoStyle}>
      <div style={msSquaresStyle}>
        {squareColors.map((c, i) => (
          <div key={i} style={{ width: '8px', height: '8px', background: c }} />
        ))}
      </div>
      <span style={{ fontSize: '15px', fontWeight: 600, color: '#242424', letterSpacing: '-0.2px' }}>Microsoft</span>
    </div>
  );
}

function SettingsApp() {
  const [apiKey, setApiKey] = useState('');
  const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  const model = 'llama-3.3-70b-versatile';
  const [mode, setMode] = useState('loading');

  useEffect(() => {
    const existingKey = loadSavedKey();
    if (existingKey) {
      setApiKey(existingKey);
      ipcRenderer.send('settings-saved', {
        apiKey: existingKey,
        apiUrl,
        model
      });
      setMode('toast');
      ipcRenderer.send('auto-hide-toast');
    } else {
      setMode('input');
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      saveKey(apiKey.trim());
      ipcRenderer.send('settings-saved', {
        apiKey,
        apiUrl,
        model
      });
      setMode('toast');
      ipcRenderer.send('auto-hide-toast');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
  };

  // ==========================================
  // TOAST MODE — Looks like MS "Sign-in options"
  // ==========================================
  if (mode === 'toast') {
    return (
      <div style={containerStyle}>
        <MsLogo />

        <div style={{ fontSize: '20px', fontWeight: 600, color: '#1b1b1b', marginBottom: '4px' }}>
          Sign in
        </div>
        <div style={{ fontSize: '13px', color: '#616161', marginBottom: '14px' }}>
          to continue to Microsoft Store
        </div>

        {/* Shortcuts disguised as sign-in option rows */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {shortcuts.map((s, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '5px 8px',
              borderRadius: '4px',
              background: i === 0 ? '#f5f5f5' : 'transparent',
              cursor: 'default',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: i === 0 ? '#0067b8' : '#c4c4c4',
                }} />
                <span style={{
                  fontSize: '12px',
                  color: '#1b1b1b',
                  fontFamily: 'Consolas, monospace',
                  fontWeight: i === 0 ? 600 : 400,
                }}>{s.keys}</span>
              </div>
              <span style={{
                fontSize: '11px',
                color: '#616161',
              }}>{s.desc}</span>
            </div>
          ))}
        </div>

        {/* Fake "Next" button area */}
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{
            background: '#c4c4c4',
            color: '#fff',
            padding: '6px 20px',
            fontSize: '13px',
            fontWeight: 600,
            borderRadius: '2px',
            cursor: 'default',
          }}>Next</div>
        </div>

        <div style={{ fontSize: '10px', color: '#b0b0b0', marginTop: '6px', textAlign: 'right' }}>
          Privacy & Cookies
        </div>
      </div>
    );
  }

  // ==========================================
  // INPUT MODE — Looks like MS password entry
  // ==========================================
  if (mode === 'input') {
    return (
      <div style={containerStyle}>
        <MsLogo />

        <div style={{ fontSize: '20px', fontWeight: 600, color: '#1b1b1b', marginBottom: '2px' }}>
          Enter password
        </div>
        <div style={{
          fontSize: '13px', color: '#616161', marginBottom: '16px',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <div style={{
            width: '20px', height: '20px', borderRadius: '50%',
            background: '#d2d2d2', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', color: '#666',
          }}>👤</div>
          <span>user@outlook.com</span>
        </div>

        {/* API key input disguised as password field */}
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Password"
          autoFocus
          style={{
            width: '100%',
            padding: '8px 10px',
            fontSize: '14px',
            fontFamily: msFont,
            border: 'none',
            borderBottom: '2px solid #0067b8',
            outline: 'none',
            background: '#f5f5f5',
            color: '#1b1b1b',
            marginBottom: '10px',
            boxSizing: 'border-box',
          }}
        />

        <div style={{
          fontSize: '12px', color: '#0067b8', cursor: 'pointer', marginBottom: '16px',
        }}>Forgot password?</div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
          <div
            onClick={handleSave}
            style={{
              background: apiKey.trim() ? '#0067b8' : '#c4c4c4',
              color: '#fff',
              padding: '6px 20px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '2px',
              cursor: apiKey.trim() ? 'pointer' : 'default',
            }}
          >Sign in</div>
        </div>

        <div style={{ fontSize: '10px', color: '#b0b0b0', marginTop: '8px', textAlign: 'right' }}>
          Privacy & Cookies
        </div>
      </div>
    );
  }

  return null;
}

ReactDOM.render(<SettingsApp />, document.getElementById('root'));