import { Card, CardJSON } from "../core/card.ts";
import { Deck } from "../core/deck.ts";

type ChineseHand = {
  top: string[];
  middle: string[];
  bottom: string[];
};

type ChineseHandJSON = {
  top: string[];
  middle: string[];
  bottom: string[];
};

export type PlayerJSON = {
  id: string;
  name: string;
  points: number;
  cards: CardJSON[];
  hand: ChineseHandJSON;
};

class Player {
  public id: string;
  public name: string;
  public points: number = 0;
  public cards: Card[] = [];
  public hand: ChineseHand = {
    top: [],
    middle: [],
    bottom: [],
  };
  public cardHands: Map<string, [keyof ChineseHandJSON, number]> = new Map();

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  static fromJSON(json: PlayerJSON): Player {
    const player = new Player(json.id, json.name);
    player.points = json.points;
    player.cards = json.cards
      .filter((card) => card.side === "front")
      .map((card) => new Card(card.face, card.suit));
    const cardsByKey = json.cards.reduce(
      (curr, card) => {
        curr[card.key] = card;
        return curr;
      },
      {} as Record<string, CardJSON>,
    );
    player.hand = {
      top: json.hand.top.filter((card) => cardsByKey[card].side === "front"),
      middle: json.hand.middle.filter(
        (card) => cardsByKey[card].side === "front",
      ),
      bottom: json.hand.bottom.filter(
        (card) => cardsByKey[card].side === "front",
      ),
    };
    for (let i = 0; i < player.hand.top.length; i++) {
      const card = player.hand.top[i];
      if (card) {
        player.cardHands.set(card, ["top", i]);
      }
    }
    for (let i = 0; i < player.hand.middle.length; i++) {
      const card = player.hand.middle[i];
      if (card) {
        player.cardHands.set(card, ["middle", i]);
      }
    }
    for (let i = 0; i < player.hand.bottom.length; i++) {
      const card = player.hand.bottom[i];
      if (card) {
        player.cardHands.set(card, ["bottom", i]);
      }
    }
    return player;
  }

  public toJSON(): PlayerJSON {
    return {
      id: this.id,
      name: this.name,
      points: this.points,
      cards: this.cards.map((card) => card.toJSON()),
      hand: {
        top: this.hand.top,
        middle: this.hand.middle,
        bottom: this.hand.bottom,
      },
    };
  }
}

export type ChinesePokerJSON = {
  deck: CardJSON[];
  players: PlayerJSON[];
  ready: string[];
  button: number;
};

export class ChinesePoker {
  public deck: Deck = new Deck();
  public players: Player[] = [];
  public waiting: Player[] = [];
  public ready: string[] = [];
  public button: number = -1;

  static fromJSON(json: ChinesePokerJSON): ChinesePoker {
    const game = new ChinesePoker();
    game.deck = new Deck();
    game.players = json.players.map((player) => Player.fromJSON(player));
    game.button = json.button;
    game.ready = json.ready;
    return game;
  }

  public toJSON(): ChinesePokerJSON {
    return {
      deck: this.deck.cards.map((card) => card.toJSON()),
      players: this.players.map((player) => player.toJSON()),
      ready: this.ready,
      button: this.button,
    };
  }

  public seatPlayer(id: string, name: string) {
    if (this.players.length === 2) {
      this.waiting.push(new Player(id, name));
      return;
    }

    this.players.push(new Player(id, name));
  }

  public unseatPlayer(id: string) {
    this.players = this.players.filter((player) => player.id !== id);
  }

  protected moveButton() {
    this.button = (this.button + 1) % this.players.length;
  }

  public reset() {
    this.deck.reset();
    this.players.forEach((player) => {
      player.cards = [];
    });
  }

  public startRound() {
    this.reset();
    this.moveButton();
    this.deck.shuffle();
  }

  public deal() {
    for (let i = 0; i < 13; i++) {
      for (const player of this.players) {
        player.cards.push(...this.deck.pick());
      }
    }
  }

  public placeCard(
    playerId: string,
    hand: keyof Player["hand"],
    position: number,
    cardKey: string,
  ) {
    for (const player of this.players) {
      if (player.id !== playerId) continue;
      const other = player.hand[hand][position];
      const current = player.cardHands.get(cardKey);
      if (current) {
        const [h, p] = current;
        if (other) {
          player.hand[h][p] = other;
          player.cardHands.set(other, current);
        } else {
          delete player.hand[h][p];
        }
      }

      player.hand[hand][position] = cardKey;
      player.cardHands.set(cardKey, [hand, position]);
    }
  }

  public removeCard(playerId: string, cardKey: string) {
    for (const player of this.players) {
      if (player.id !== playerId) continue;
      const current = player.cardHands.get(cardKey);
      if (!current) return;
      const [hand, position] = current;
      delete player.hand[hand][position];
      player.cardHands.delete(cardKey);
    }
  }
}
