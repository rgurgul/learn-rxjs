import { Component, inject } from '@angular/core';
import { GameComponent } from './game/game/game.component';
import { StopWatchComponent } from './game/watch/stop-watch.component';
import { HttpClient } from '@angular/common/http';

import { ajax } from 'rxjs/ajax';
import {
  of,
  concatMap,
  delay,
  Observable,
  Observer,
  share,
  merge,
  fromEvent,
  map,
  take,
  groupBy,
  mergeMap,
  toArray,
  reduce,
  interval,
  filter,
  throttleTime,
  catchError,
  takeWhile,
  Subject,
  ReplaySubject,
  BehaviorSubject,
  from,
  exhaustMap,
  switchMap,
} from 'rxjs';

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
    //this.observabeExamples();
    //this.subjectExamples();
    //this.customObservable();
    //this.unsubscribeWays();
    //this.errorHandle();
    //this.filteringOperators();
    //this.transformationOperators();
    //this.combinationOperators();
    //this.hotvscold();
    // this.multicastOperators();
    //this.customOperators();
    //this.higherOrder();
  }
  higherOrder() {
    const click$ = fromEvent(document, 'click');
    const req$ = ajax('https://api.debugger.pl/utils/big-deal/500000');

    const observable$ = click$.pipe(
      //mergeMap(() => req$),
      //switchMap(() => req$),
      //concatMap(() => req$),
      exhaustMap(() => req$)
    );

    observable$.subscribe(console.log);
  }
  customOperators() {
    of(111).pipe(this.double).subscribe(this.myObserver);
  }
  double(val$: Observable<number>): Observable<any> {
    return new Observable((obs: Observer<any>) => {
      val$.subscribe({
        next: (val) => {
          obs.next(2 * val);
        },
      });
    });
  }
  hotvscold() {
    const req$ = this.http.get(this.url).pipe(share());
    req$.subscribe();
    req$.subscribe();
    req$.subscribe();
  }
  combinationOperators() {
    merge<any>(fromEvent(document, 'click'), fromEvent(document, 'mousemove'))
      .pipe(
        map(({ pageX, pageY, type }: MouseEvent) => ({ pageX, pageY, type })),
        take(100),
        groupBy(({ type }) => type),
        mergeMap((obs$) =>
          obs$.pipe(
            toArray(),
            map((val) => ({ [obs$.key]: val }))
          )
        )
      )
      .subscribe(this.myObserver);
  }
  transformationOperators() {
    fromEvent(document, 'mousemove')
      .pipe(
        //map((val)=>{val+1000})
        take(100),
        reduce(
          (acc: any, val: any) => {
            return { ...acc, count: ++acc.count, val };
          },
          { count: 0 }
        )
      )
      .subscribe(this.myObserver);
  }
  filteringOperators() {
    interval(1000).pipe(
      //skip(2)
      filter((val: number) => val > 3)
    );
    //.subscribe(this.myObserver);

    fromEvent(document, 'mousemove')
      .pipe(throttleTime(20))
      .subscribe(this.myObserver);
  }
  errorHandle() {
    ajax('https://xyzzz.io')
      .pipe(
        catchError((err: any) => {
          alert('error');
          return err;
        })
      )
      .subscribe(this.myObserver);
  }
  unsubscribeWays() {
    const myof = interval(1000);
    const sub = myof
      .pipe(
        //take(5)
        //takeUntil(fromEvent(document,'click'))
        takeWhile((val: number) => val < 3)
      )
      .subscribe(this.myObserver);
    setTimeout(() => {
      //sub.unsubscribe();
    }, 2000);
  }
  customObservable() {
    throw new Error('Method not implemented.');
  }
  subjectExamples() {
    const su: Subject<number> = new Subject();
    su.subscribe(this.myObserver);
    su.next(1234);

    const rs: ReplaySubject<number> = new ReplaySubject();
    rs.next(222);
    rs.subscribe(this.myObserver);

    const bs: BehaviorSubject<number> = new BehaviorSubject(123);
    bs.next(555);
    //bs.subscribe(this.myObserver);
    console.log(bs.value);
  }
  observabeExamples() {
    const x = interval(1000);
    x.subscribe(this.myObserver);

    //fromEvent(document, 'click').subscribe(this.myObserver)

    from([1, 2, 3]).subscribe(this.myObserver);

    const promise = fetch(this.url);
    /* myPromise.then((resp)=>{
      console.log(resp);
    }) */
    from(promise).subscribe(this.myObserver);

    ajax(this.url).subscribe(this.myObserver);
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
