import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import ISubject from 'src/app/interfaces/ISubject';
import IScore from 'src/app/interfaces/IScore';

export interface Export {
  subjects: ISubject[];
  scores: IScore[];
}

@Injectable({
  providedIn: 'root'
})
export class EduscoreService {

  private _localStorageKey = 'eduscore-data';

  private _subjects = new BehaviorSubject<ISubject[]>([]);
  private _scores = new BehaviorSubject<IScore[]>([]);

  constructor() {
    this._loadDataFromStorage();
  }

  public addNewSubject(subject: ISubject): void {
    this._subjects.next([...this._subjects.value, subject]);
    this._saveDataToStorage();
  }

  public addNewScore(score: IScore): void {
    this._scores.next([...this._scores.value, score]);
    this._saveDataToStorage();
  }

  public removeSubject(subjectId: string): void {
    this._subjects.next([...this._subjects.value.filter((subject) => subject.id !== subjectId)]);
    this._saveDataToStorage();
  }

  public removeScore(scoreId: string): void {
    this._scores.next([...this._scores.value.filter((score) => score.id !== scoreId)]);
    this._saveDataToStorage();
  }

  public getSubjects(): Observable<ISubject[]> {
    return this._subjects;
  }

  public getScores(): Observable<IScore[]> {
    return this._scores;
  }

  public import(dataToImport: Export): void {
    this._subjects.next(dataToImport.subjects);
    this._scores.next(dataToImport.scores);
    this._saveDataToStorage();
  }

  public export(): Export {
    return {
      subjects: this._subjects.value,
      scores: this._scores.value
    };
  }

  private _loadDataFromStorage(): void {
    const storedData = localStorage.getItem(this._localStorageKey);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      this._subjects.next(parsedData.subjects);
      this._scores.next(parsedData.scores);
    }
  }

  private _saveDataToStorage(): void {
    const dataToStore = this.export();
    localStorage.setItem(this._localStorageKey, JSON.stringify(dataToStore));
  }
}
