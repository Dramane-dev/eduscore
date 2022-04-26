const { app, BrowserWindow, ipcMain } = require('electron')
const url = require("url");
const path = require("path");

require('electron-reload')(path.join(__dirname, `/dist/eduScore/index.html`), {
    electron: path.join(__dirname, './node_modules', '.bin', 'electron')
});

const createWindow = (pathFile, width = 1200, height = 800) => {
    const win = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    
    // win.loadFile(path.join(__dirname, `/dist/eduScore/index.html`));
    win.loadURL(pathFile);
    win.webContents.on("did-finish-load", () => {
        win.webContents.openDevTools();
    });
}

ipcMain.on("open-new-score-window", () => {
    const win = createWindow("http://localhost:4200/AddScore", width = 1200, height = 800);

    win.on("close", () => {
    });
});

app.whenReady()
.then(() => {
    createWindow('http://localhost:4200');

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});