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
  tap,
  throttleTime,
} from 'rxjs/operators';
import { GameService, Message } from '../services/game.service';

@Component({
  selector: 'app-game',
  template: `
    <h3>WebSocket Multiplayer Game</h3>

    <ng-template #playerTpl let-x>
      <div
        class="el"
        [id]="x.username"
        [ngStyle]="{ 'left.px': x.clientX, 'top.px': x.clientY }"
      >
        {{ x.username }}
        <div>{{ x.score }}</div>
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
  }

  updatePlayer(msg: Message) {
    const playerExist = this.players.get(msg.username as string);
    if(playerExist){
      playerExist.context.$implicit = msg;
    } else {
      const player = this.container.createEmbeddedView(this.playerTpl()!, {$implicit:msg});
      this.players.set(msg.username as string, player);
    }
  }

  init() {
    this.gameService.messanger.subscribe((msg) => this.updatePlayer(msg));
    fromEvent<any>(this.areaEl()!.nativeElement, 'mousemove')
    .subscribe(({clientX, clientY}:MouseEvent)=>{
      this.gameService.messanger.next({clientX, clientY})
    })
  }

  register() {
    of('your name 3-6 znaków')
      .pipe(
        map((msg) => prompt(msg)),
        tap(console.log),
        switchMap((username) => this.gameService.register(username)),
        retry(3)
      )
      .subscribe();
  }
}
