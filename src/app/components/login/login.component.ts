import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EduscoreService } from 'src/app/services/eduscore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public users: string[] = [];
  public subscriptions = new Subscription();
  public newUsername = new FormControl('');

  constructor(private _eduScoreService: EduscoreService) { }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this._eduScoreService.getUsers().subscribe((users) => {
        this.users = users;
      })
    )
  }

  login(username: string): void {
    this._eduScoreService.login(username);
  }

  addUser(): void {
    if (this.newUsername.value !== '') {
      this._eduScoreService.login(this.newUsername.value);
    }
  }

}
