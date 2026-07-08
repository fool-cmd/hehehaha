const { app, BrowserWindow, globalShortcut, ipcMain, clipboard, Tray, Menu, screen } = require('electron');
const path = require('path');

let mainWindow;
let overlayWindow;
let tray;

function createMainWindow() {\r
  mainWindow = new BrowserWindow({\r
    width: 340,\r
    height: 380,\r
    resizable: false,\r
    frame: false,\r
    transparent: true,\r
    alwaysOnTop: true,\r
    autoHideMenuBar: true,\r
    skipTaskbar: true,\r
    show: false,\r
    icon: require('electron').nativeImage.createEmpty(),\r
    webPreferences: {\r
      nodeIntegration: true,\r
      contextIsolation: false\r
    }\r
  });\r
\r
  mainWindow.loadFile('index.html');\r
\r
  mainWindow.on('close', (event) => {\r
    if (!app.isQuitting) {\r
      event.preventDefault();\r
      mainWindow.hide();\r
    }\r
  });\r
}\r


function createOverlayWindow() {
  const { height } = screen.getPrimaryDisplay().workAreaSize;

  overlayWindow = new BrowserWindow({
    width: 600,
    height: 30,
    x: 0,
    y: height - 30,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    focusable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  overlayWindow.setIgnoreMouseEvents(true);
  overlayWindow.loadFile('overlay.html');
}

function registerShortcuts() {
  globalShortcut.register('CommandOrControl+Shift+G', () => {
    console.log('Global: Ctrl+Shift+G pressed');
    const clipboardText = clipboard.readText();
    if (overlayWindow) {
      overlayWindow.webContents.send('get-answer', clipboardText);
    }
  });

  globalShortcut.register('CommandOrControl+Shift+Down', () => {
    if (overlayWindow) overlayWindow.webContents.send('next-line');
  });

  globalShortcut.register('CommandOrControl+Shift+Up', () => {
    if (overlayWindow) overlayWindow.webContents.send('prev-line');
  });

  // Reset/Clear
  globalShortcut.register('CommandOrControl+Shift+R', () => {
    if (overlayWindow) {
      overlayWindow.webContents.send('reset');
      overlayWindow.hide();
    }
  });

  // Hide Overlay (Panic Button) - Keeping this as it's useful
  globalShortcut.register('CommandOrControl+Shift+H', () => {
    if (overlayWindow) overlayWindow.hide();
  });

  // Re-query: same question, new answer
  globalShortcut.register('CommandOrControl+Shift+F', () => {
    if (overlayWindow) overlayWindow.webContents.send('re-query');
  });
}

function createTray() {
  try {
    const { nativeImage } = require('electron');

    // Generate a 16x16 Microsoft logo (4 colored squares with gap)
    const size = 16;
    const canvas = nativeImage.createFromBuffer(
      (() => {
        const buf = Buffer.alloc(size * size * 4);

        // Microsoft colors
        const red    = [242, 80, 34];   // #F25022 - top-left
        const green  = [127, 186, 0];   // #7FBA00 - top-right
        const blue   = [0, 164, 239];   // #00A4EF - bottom-left
        const yellow = [255, 185, 0];   // #FFB900 - bottom-right

        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const i = (y * size + x) * 4;
            let color = null;

            // Gap lines at x=7,8 and y=7,8 (2px gap in center)
            const isGapX = x === 7 || x === 8;
            const isGapY = y === 7 || y === 8;

            if (!isGapX && !isGapY) {
              // Top-left quadrant (red)
              if (x >= 1 && x <= 6 && y >= 1 && y <= 6) color = red;
              // Top-right quadrant (green)
              else if (x >= 9 && x <= 14 && y >= 1 && y <= 6) color = green;
              // Bottom-left quadrant (blue)
              else if (x >= 1 && x <= 6 && y >= 9 && y <= 14) color = blue;
              // Bottom-right quadrant (yellow)
              else if (x >= 9 && x <= 14 && y >= 9 && y <= 14) color = yellow;
            }

            if (color) {
              buf[i]     = color[0]; // R
              buf[i + 1] = color[1]; // G
              buf[i + 2] = color[2]; // B
              buf[i + 3] = 255;      // A
            } else {
              // Transparent
              buf[i] = 0; buf[i + 1] = 0; buf[i + 2] = 0; buf[i + 3] = 0;
            }
          }
        }
        return buf;
      })(),
      { width: size, height: size }
    );

    tray = new Tray(canvas);

    const contextMenu = Menu.buildFromTemplate([
      { label: 'Microsoft Store Settings', click: () => mainWindow.show() },
      { label: 'Check for Updates', enabled: false },
      { type: 'separator' },
      { label: 'Quit', click: () => { app.isQuitting = true; app.quit(); } }
    ]);

    tray.setToolTip('Microsoft Store');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
      mainWindow.show();
    });
  } catch (e) {
    console.log('Tray creation failed', e);
  }
}


app.whenReady().then(() => {
  createMainWindow();
  createOverlayWindow();
  registerShortcuts();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('before-quit', () => {
  app.isQuitting = true;
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers
ipcMain.on('settings-saved', (event, settings) => {
  console.log('Settings received in main:', settings);
  if (overlayWindow) {
    overlayWindow.webContents.send('update-settings', settings);
  }
});

// Auto-hide: position as small toast in bottom-right, hide after 10s
ipcMain.on('auto-hide-toast', () => {
  if (mainWindow) {
    const { width: screenW, height: screenH } = screen.getPrimaryDisplay().workAreaSize;
    mainWindow.setBounds({ x: screenW - 360, y: screenH - 400, width: 340, height: 380 });
    mainWindow.show();
    setTimeout(() => {
      if (mainWindow) mainWindow.hide();
    }, 10000);
  }
});

// Manual save from input form — hide immediately
ipcMain.on('hide-main', () => {
  if (mainWindow) mainWindow.hide();
});

ipcMain.on('show-overlay', () => {
  if (overlayWindow) {
    overlayWindow.show();
  }
});

ipcMain.on('hide-overlay', () => {
  if (overlayWindow) {
    overlayWindow.hide();
  }
});