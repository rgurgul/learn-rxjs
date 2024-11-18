import { Component, inject } from '@angular/core';
import { GameComponent } from './game/game/game.component';
import { StopWatchComponent } from './game/watch/stop-watch.component';
import { HttpClient } from '@angular/common/http';

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
    // this.observableAndObserver();
    // this.observabeExamples();
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
}
