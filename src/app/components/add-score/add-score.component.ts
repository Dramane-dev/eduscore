import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-score',
  templateUrl: './add-score.component.html',
  styleUrls: ['./add-score.component.scss']
})
export class AddScoreComponent implements OnInit {
  public scoreForm: FormGroup = new FormGroup({
    score: new FormControl("")
  });
  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  addScore(): void {
    const { score } = this.scoreForm.controls;
    console.log(score.value);
  };

  navigateTo(url: string): void {
    this._router.navigateByUrl(url);
  }
}
