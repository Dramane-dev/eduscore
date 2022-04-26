const { app, BrowserWindow, ipcMain } = require('electron')
const url = require("url");
const path = require("path");

let newSubjectWin;

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
    return win
}

ipcMain.on("open-new-score-window", () => {
    console.log('okok coucou')
    const win = createWindow("http://localhost:4200/add-score", width = 1200, height = 800);

    // win.on("close", () => {
    // });
});

ipcMain.on("open-new-subject-window", () => {
    console.log("okok coucou2")

    if(!newSubjectWin){
        newSubjectWin = createWindow("http://localhost:4200/add-subject", width = 1200, height = 800);
    }
});

ipcMain.on("close-new-subject-window", () => {
    if(newSubjectWin){
        newSubjectWin.close();
        newSubjectWin = null
    }
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