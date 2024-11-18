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
    <h3 class="!text-xl">WebSocket Multiplayer Game</h3>

    <ng-template #playerTpl let-data>
      <div
        class="el text-rose-900"
        [id]="data.username"
        [ngStyle]="{ 'left.px': data.clientX, 'top.px': data.clientY }"
      >
        {{ data.username }}
        <div class="text-rose-700">{{ data.score }}</div>
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
    this.gameService.getUser().subscribe(({ warning }) => {
      warning ? this.register() : this.init();
    });

    merge(fromEvent<MouseEvent>(this.areaEl()!.nativeElement, 'mousemove'))
      .pipe(throttleTime(30))
      .subscribe(({ clientX, clientY }: MouseEvent) => {
        this.gameService.messanger.next({ clientX, clientY });
      });
  }

  updatePlayer(msg: Message) {
    const playerExists = this.players.get(msg.username as string);
    playerExists
      ? (playerExists.context.$implicit = msg)
      : this.players.set(
          msg.username!,
          this.container.createEmbeddedView(this.playerTpl()!, {
            $implicit: msg,
          })
        );
  }

  init() {
    this.gameService.messanger.subscribe((msg) => this.updatePlayer(msg));
  }

  register() {
    of('your game nick according to pattern /^[a-zA-Z]{3,6}$/')
      .pipe(
        map((data) => prompt(data)),
        switchMap((username) => this.gameService.register(username as string)),
        catchError((error) => {
          console.log('register error', JSON.stringify(error));
          return throwError(() => error);
        }),
        retry(1)
      )
      .subscribe(this.init.bind(this));
  }
}
