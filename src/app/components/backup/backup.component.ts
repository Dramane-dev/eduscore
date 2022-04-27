import { Component, OnInit } from '@angular/core';
import { EduscoreService } from 'src/app/services/eduscore.service';
import { ElectronService } from 'src/app/services/electron.service';

@Component({
    selector: 'app-backup',
    templateUrl: './backup.component.html',
    styleUrls: ['./backup.component.scss'],
})
export class BackupComponent implements OnInit {
    constructor(private _eduScoreService: EduscoreService, private _electronService: ElectronService) {}

    ngOnInit(): void {}

    exportData() {
        const data = JSON.stringify(this._eduScoreService.export());
        const file = new Blob([data], { type: 'application/json' });
        this._electronService.send('download', URL.createObjectURL(file));
    }

    onFileDropped(file: File) {
        if (file && file.name.split('.').reverse()[0] === 'eduscbck') {
            this._electronService.send('import', (file as any).path);
        }
    }
}
