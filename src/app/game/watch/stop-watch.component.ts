import { Observable, of, merge } from 'rxjs';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { fromEvent, interval } from 'rxjs';
import { switchMap, scan, tap, map, share } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

interface State {
  run: boolean;
  speed: number;
  value: number;
}

@Component({
  selector: 'stop-watch',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>Użyte operatory: fromEvent, map, scan, tap, switchMap, share.</p>
    <div class="border bg-green-500 rounded-full w-40 h-40 text-center py-10">
      <div class="text-4xl">
        {{ ((state$ | async)?.value || 0) / 100 | number : '1.2-2' }}
      </div>
      <div id="controls">
        <button
          class="px-1 border rounded m-1"
          [class.hidden]="(state$ | async)?.run"
          #start
        >
          start
        </button>
        <button
          class="px-1 border rounded m-1"
          [class.hidden]="!(state$ | async)?.run"
          #pause
        >
          pause
        </button>
        <button class="px-1 border rounded m-1" #reset>reset</button>
      </div>
    </div>
  `,
})
export class StopWatchComponent implements AfterViewInit {
  @ViewChild('start') start!: ElementRef;
  @ViewChild('pause') pause!: ElementRef;
  @ViewChild('reset') reset!: ElementRef;
  state$!: Observable<State>;

  ngAfterViewInit(): void {
    const events$ = merge(
      fromEvent(this.start.nativeElement, 'click').pipe(
        map((_) => ({ run: true }))
      ),
      fromEvent(this.pause.nativeElement, 'click').pipe(
        map((_) => ({ run: false }))
      ),
      fromEvent(this.reset.nativeElement, 'click').pipe(
        map((_) => ({ value: 0 }))
      )
    );

    const initValue = {
      run: false,
      speed: 10,
      value: 0,
    };

    /* this.state$ = events$.pipe(
      
    ); */
  }
}
