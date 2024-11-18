import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EmbeddedViewRef,
  TemplateRef,
  ViewContainerRef,
  inject,
  viewChild,
} from '@angular/core';
import { fromEvent, merge, of, throwError } from 'rxjs';
import {
  catchError,
  map,
  retry,
  switchMap,
  throttleTime,
} from 'rxjs/operators';
import { GameService, Message } from '../services/game.service';

@Component({
  selector: 'app-game',
  template: `
    <h3>WebSocket Multiplayer Game</h3>

    <ng-template #playerTpl let-data>
      <div
        class="el"
        [id]="data.username"
        [ngStyle]="{ 'left.px': data.clientX, 'top.px': data.clientY }"
      >
        {{ data.username }}
        <div>{{ data.score }}</div>
      </div>
    </ng-template>

    <div #area class="area"></div>
  `,
  styleUrls: ['./game.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class GameComponent implements AfterViewInit {
  playerTpl = viewChild<TemplateRef<{ $implicit: Message }>>('playerTpl');
  areaEl = viewChild<ElementRef>('area');
  players: Map<string, EmbeddedViewRef<{ $implicit: Message }>> = new Map();
  gameService = inject(GameService);
  container = inject(ViewContainerRef);

  ngAfterViewInit(): void {
    
  }

  updatePlayer(msg: Message) {
    
  }

  init() {
    this.gameService.messanger.subscribe((msg) => this.updatePlayer(msg));
  }

  register() {
    
  }
}
