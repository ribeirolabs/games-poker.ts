import { Card, CardJSON } from '../core/card.ts';
import { Deck } from '../core/deck.ts';

type ChineseHand = {
  top: Card[];
  middle: Card[];
  bottom: Card[];
};

type ChineseHandJSON = {
  top: CardJSON[];
  middle: CardJSON[];
  bottom: CardJSON[];
};

export type PlayerJSON = {
  id: string;
  points: number;
  cards: CardJSON[];
  hand: ChineseHandJSON;
};

class Player {
  public id: string;
  public points: number = 0;
  public cards: Card[] = [];
  public hand: ChineseHand = {
    top: [],
    middle: [],
    bottom: [],
  };

  constructor(id: string) {
    this.id = id;
  }

  public addToHand(position: keyof ChineseHand, card: Card) {
    const hand = this.hand[position];

    if (position === 'top' && hand.length === 3) {
      return;
    } else if (hand.length === 5) {
      return;
    }

    hand.push(card);
  }

  public toJSON(): PlayerJSON {
    return {
      id: this.id,
      points: this.points,
      cards: this.cards.map((card) => card.toJSON()),
      hand: {
        top: this.hand.top.map((card) => card.toJSON()),
        middle: this.hand.middle.map((card) => card.toJSON()),
        bottom: this.hand.bottom.map((card) => card.toJSON()),
      },
    };
  }
}

export type ChinesePokerJSON = {
  deck: CardJSON[];
  players: PlayerJSON[];
  button: number;
};

export class ChinesePoker {
  public deck: Deck = new Deck();
  public players: Player[] = [];
  public waiting: Player[] = [];
  public button: number = -1;

  public toJSON(): ChinesePokerJSON {
    return {
      deck: this.deck.cards.map((card) => card.toJSON()),
      players: this.players.map((player) => player.toJSON()),
      button: this.button,
    };
  }

  public seatPlayer(id: string) {
    if (this.players.length === 2) {
      this.waiting.push(new Player(id));
      return;
    }

    this.players.push(new Player(id));
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
