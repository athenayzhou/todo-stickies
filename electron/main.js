const { app, BrowserWindow } = require('electron');
const path = require('path');
const waitOn = require('wait-on');

// const isDev = process.env.NODE_ENV === 'development';
const isDev = true;
const port = 3000;

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isDev) {
    await waitOn({ resources: [`http://localhost:${port}`] });
    mainWindow.loadURL(`http://localhost:${port}`);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/out/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit();
});