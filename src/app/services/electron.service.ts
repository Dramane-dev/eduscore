import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ElectronService {
    private _ipc;

    constructor() {
        if (window.require) {
            try {
                this._ipc = window.require('electron').ipcRenderer;
            } catch (e) {
                throw e;
            }
        } else {
            console.warn("Electron's IPC was not loaded");
        }
    }

    public on(channel: string, listener: Function): void {
        if (!this._ipc) {
            return;
        }
        this._ipc.on(channel, listener);
    }

    public send(channel: string, ...args: any[]): void {
        if (!this._ipc) {
            return;
        }
        this._ipc.send(channel, ...args);
    }
}
