import { Card } from "../core/card.ts";
import { Deck } from "../core/deck.ts";
import { BasePlayer } from "../core/player.ts";

class Player extends BasePlayer {
  public points: number = 0;
  public cards: Card[] = [];
}

export class ChinesePoker {
  public deck: Deck = new Deck();
  public players: Player[] = [];

  public addPlayer(id: string, name: string) {
    if (this.players.length === 2) {
      return;
    }

    this.players.push(new Player(id, name));
  }

  public startRound() {
    this.deck.reset();
    this.deck.shuffle();
    this.players.forEach((player) => {
      player.cards = [];
    });
  }

  public deal() {
    this.players.forEach((player) => {
      player.cards = this.deck.pick(13);
    });
  }
}
