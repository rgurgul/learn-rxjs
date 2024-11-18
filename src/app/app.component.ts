import { Component, inject } from '@angular/core';
import { GameComponent } from './game/game/game.component';
import { StopWatchComponent } from './game/watch/stop-watch.component';
import { HttpClient } from '@angular/common/http';
import { from, fromEvent, interval, of, timeout } from 'rxjs';
import { ajax } from 'rxjs/ajax';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GameComponent, StopWatchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'learn-rxjs';
  url = 'https://api.debugger.pl/items';
  http = inject(HttpClient);

  constructor() {
    //this.observableAndObserver();
     this.observabeExamples();
    // this.subjectExamples();
    // this.customObservable();
    // this.unsubscribeWays();
    // this.errorHandle();
    // this.filteringOperators();
    // this.transformationOperators();
    // this.combinationOperators();
    // this.hotvscold();
    // this.multicastOperators();
    // this.customOperators();
    // this.higherOrder()
  }
  observabeExamples() {
    const x=interval(1000)
    x.subscribe(this.myObserver);

    //fromEvent(document, 'click').subscribe(this.myObserver)

    from([1,2,3]).subscribe(this.myObserver)

    const promise = fetch(this.url);
    /* myPromise.then((resp)=>{
      console.log(resp);
    }) */
    from(promise).subscribe(this.myObserver)

    ajax(this.url).subscribe(this.myObserver)
  }
  observableAndObserver() {
    of(123).subscribe(this.myObserver);
  }
  get myObserver() {
    return {
      next: (val: any) => {
        console.log(val);
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        console.log('finito');
      },
    };
  }
}
