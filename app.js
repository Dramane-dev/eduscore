const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const url = require("url");
const path = require("path");
let newScoreWin;

const createWindow = (pathFile, width = 1200, height = 800) => {
    const win = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    win.loadURL(pathFile);
    // win.webContents.on("did-finish-load", () => {
    //     win.webContents.openDevTools();
    // });
    return win;
}

ipcMain.on("open-new-score-window", () => {
    if (!newScoreWin) {
        newScoreWin = createWindow("http://localhost:4200/add-score", width = 500, height = 450);
    }
});

ipcMain.on("close-new-score-window", () => {
    if (newScoreWin) {
        newScoreWin.close();
        newScoreWin = null
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

const template = [
    {
        label: "Action",
        submenu: [
            {
                label: "Nouvelle Matière",
                accelerator: "CommandOrControl+N", click() {
                    const win = createWindow("http://localhost:4200/add-subject", 500, 450);
                }
            },
            {
                label: "Nouvelle Note",
                accelerator: "CommandOrControl+N", click() {
                    const win = createWindow("http://localhost:4200/add-score", 500, 450);
                }
            },
            {
                label: "Fenêtre",
                submenu: [
                   { role: 'reload' }, 
                   { role: 'toggledevtools' }, 
                   { role: 'separator' }, 
                   { role: 'togglefullscreen' }, 
                   { role: 'minimize' }, 
                   { role: 'separator' }, 
                   { role: 'close' }, 
                ]
            },
        ]
    }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);