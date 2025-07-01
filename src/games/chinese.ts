import { Card } from "../core/card.ts";
import { Deck } from "../core/deck.ts";
import { BasePlayer } from "../core/player.ts";

type ChineseHand = {
  top: Card[];
  middle: Card[];
  bottom: Card[];
};

class Player extends BasePlayer {
  public points: number = 0;
  public cards: Card[] = [];
  public hand: ChineseHand = {
    top: [],
    middle: [],
    bottom: [],
  };

  public addToHand(position: keyof ChineseHand, card: Card) {
    const hand = this.hand[position];

    if (position === "top" && hand.length === 3) {
      return;
    } else if (hand.length === 5) {
      return;
    }

    hand.push(card);
  }
}

export class ChinesePoker {
  public deck: Deck = new Deck();
  public players: Player[] = [];
  public waiting: Player[] = [];
  public button: number = -1;

  public seatPlayer(id: string, name: string) {
    if (this.players.length === 2) {
      this.waiting.push(new Player(id, name));
      return;
    }

    this.players.push(new Player(id, name));
  }

  protected moveButton() {
    this.button = (this.button + 1) % this.players.length;
  }

  public startRound() {
    this.deck.reset();
    this.moveButton();
    this.deck.shuffle();
    this.players.forEach((player) => {
      player.cards = [];
    });
  }

  public deal() {
    for (let i = 0; i < 13; i++) {
      for (const player of this.players) {
        player.cards.push(...this.deck.pick());
      }
    }
  }
}
