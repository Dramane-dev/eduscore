// Import all Node.JS Libs
const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const { download } = require("electron-dl");
const fs = require("fs");
const express = require('express');
const http = require('http');
const path = require('path');


const expressApp = express();
const port = process.env.PORT || 4200;
expressApp.use(express.static(__dirname + '/dist/eduScore'));
expressApp.get('/*', (req, res) => res.sendFile(path.join(__dirname)));

const server = http.createServer(expressApp);
server.listen(port, () => console.log(`expressApp running on: http://localhost:${port}`));

// References to all BrowserWindows, null if window is not open
let globalWin;
let backupWin;
let newScoreWin;
let newSubjectWin;

// Browserwindow Factory
const createWindow = (pathFile, width = 1200, height = 800) => {
    const win = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadURL(pathFile);
    return win;
};

// Listen to open new score window
ipcMain.on("open-new-score-window", (event, id) => {
    if (!newScoreWin) {
        let url = "http://localhost:4200/add-score";
        if (id) {
            url += `/${id}`;
        }
        newScoreWin = createWindow(url, (width = 500), (height = 450));
        newScoreWin.on("closed", () => {
            newScoreWin = null;
        });
    }
});

// Listen to close new score window
ipcMain.on("close-new-score-window", () => {
    if (newScoreWin) {
        globalWin.webContents.send("update-data");
        newScoreWin.close();
        newScoreWin = null;
    }
});

// Listen to open new subject window
ipcMain.on("open-new-subject-window", (event, id) => {
    if (!newSubjectWin) {
        let url = "http://localhost:4200/add-subject";
        if (id) {
            url += `/${id}`;
        }
        console.log(url);
        newSubjectWin = createWindow(url, (width = 450), (height = 350));
        newSubjectWin.on("closed", () => {
            newSubjectWin = null;
        });
    }
});

// Listen to close new subject window
ipcMain.on("close-new-subject-window", () => {
    if (newSubjectWin) {
        globalWin.webContents.send("update-data");
        newSubjectWin.close();
        newSubjectWin = null;
    }
});

// Listen to export and download backup file
ipcMain.on("download", async (event, url) => {
    const directory = app.getPath("downloads");
    const filename = "backup.eduscbck";

    await download(BrowserWindow.getFocusedWindow(), url, {
        directory,
        filename,
        onProgress: (progress) => {
            console.log("onProgress", progress);
        },
        onCompleted: (complete) => {
            backupWin.close();
            backupWin = null;
        },
    });
});

// Listen to import backup file
ipcMain.on("import", async (event, path) => {
    fs.readFile(path, "utf-8", (err, data) => {
        if (err) {
            console.error(err);
        }
        globalWin.webContents.send("import-data", data);
        backupWin.close();
        backupWin = null;
    });
});

app.whenReady().then(() => {
    globalWin = createWindow("http://localhost:4200");

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) globalWin = createWindow("http://localhost:4200");
    });
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});

// Setup top left app menu
const template = [
    {
        label: "Action",
        submenu: [
            {
                label: "Backup Manager",
                accelerator: "CommandOrControl+B",
                click() {
                    if (!backupWin) {
                        backupWin = createWindow("http://localhost:4200/backup", 500, 500);
                        backupWin.on("closed", () => {
                            backupWin = null;
                        });
                    }
                },
            },
            {
                label: "Nouvelle Matière",
                accelerator: "CommandOrControl+Shift+N",
                click() {
                    if (!newSubjectWin) {
                        newSubjectWin = createWindow("http://localhost:4200/add-subject", 500, 450);
                        newSubjectWin.on("closed", () => {
                            newSubjectWin = null;
                        });
                    }
                },
            },
            {
                label: "Nouvelle Note",
                accelerator: "CommandOrControl+N",
                click() {
                    if (!newScoreWin) {
                        newScoreWin = createWindow("http://localhost:4200/add-score", 500, 450);
                        newScoreWin.on("closed", () => {
                            newSubjectWin = null;
                        });
                    }
                },
            },
            {
                label: "Fenêtre",
                submenu: [
                    { role: "reload" },
                    { role: "toggledevtools" },
                    { role: "separator" },
                    { role: "togglefullscreen" },
                    { role: "minimize" },
                    { role: "separator" },
                    { role: "close" },
                ],
            },
        ],
    },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
