import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

export interface Message {
  username?: string;
  clientX?: number;
  clientY?: number;
  size?: number;
  action?: string;
  type?: string;
  active?: boolean;
}

const host = window.location.host;

export class Api {
  // WebSocket Game end-points
  static GAME_PLAY = `ws:/${host}/play`;
  static GAME_GET_USER = 'get-user';
  static GAME_REGISTER_USER = 'register-user';
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  ws!: Subject<any>;
  private http = inject(HttpClient);

  register(username: string): Observable<any> {
    return this.http.post(
      Api.GAME_REGISTER_USER,
      { username }
    );
  }

  getUser(): Observable<any> {
    return this.http.get(Api.GAME_GET_USER);
  }

  get messanger(): Subject<Message> {
    return this.ws ? this.ws : (this.ws = webSocket(Api.GAME_PLAY));
  }
}
