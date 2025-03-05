const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let backendProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the React app
  const reactAppPath = path.join(__dirname, '../client/build/index.html');
  console.log('React app path:', reactAppPath);
  win.loadFile(reactAppPath);

  // Start the Node.js backend
  const serverDir = path.join(process.resourcesPath, 'server'); // Use process.resourcesPath
  const backendPath = path.join(serverDir, 'index.js');
  console.log('Server directory:', serverDir);
  console.log('Backend path:', backendPath);

  // Use fork to start the backend
  backendProcess = fork(backendPath, {
    cwd: serverDir,
    stdio: 'inherit',
  });

  // Log backend process events
  backendProcess.on('error', (err) => {
    console.error('Backend process error:', err);
  });

  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend stdout: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend stderr: ${data}`);
  });

  // Open DevTools (optional)
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Kill the backend process when the app quits
app.on('will-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});