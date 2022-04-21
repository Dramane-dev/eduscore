const {app, BrowserWindow} = require('electron')
const url = require("url");
const path = require("path");

require('electron-reload')(path.join(__dirname, `/dist/eduScore/index.html`), {
    electron: path.join(__dirname, './node_modules', '.bin', 'electron')
});

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    
    win.loadFile(path.join(__dirname, `/dist/eduScore/index.html`));
    win.webContents.on("did-finish-load", () => {
        win.webContents.openDevTools();
    });
}

app.whenReady()
.then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});