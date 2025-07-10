import { stdout } from "node:process";

const SUITS = ["s", "c", "h", "d"] as const;
type Suit = (typeof SUITS)[number];

const FACE_COUNT = 13;

const FACE_DISPLAY = {
  1: "A",
  10: "T",
  11: "J",
  12: "Q",
  13: "K",
};

const SUIT_DISPLAY: Record<Suit, string> = {
  s: "♠",
  c: "♣",
  d: "♦",
  h: "♥",
};

export function generateAllCards() {
  const cards: Card[] = [];
  for (const suit of SUITS) {
    for (let face = 1; face <= FACE_COUNT; face++) {
      cards.push(new Card(face, suit));
    }
  }
  return cards;
}

export function renderCards() {
  stdout.write("\n");
  stdout.write("\n");

  for (const suit of SUITS) {
    for (let face = 1; face <= FACE_COUNT; face++) {
      const card = new Card(face, suit);
      stdout.write(card.display() + " ");
    }
    stdout.write("\n");
  }
}

export type CardJSON = { suit: Suit; face: number };

export class Card {
  public suit: Suit;
  public face: number;

  static fromDisplay(display: string): Card {
    const [faceDisplay, suit] = display.split("");
    let face: number = parseInt(faceDisplay);
    if (Number.isNaN(face)) {
      for (const [value, display] of Object.entries(FACE_DISPLAY)) {
        if (faceDisplay === display) {
          face = parseInt(value);
          if (Number.isNaN(face)) {
            throw new Error(`INVALID_CARD: Invalid face ${faceDisplay}`);
          }
        }
      }
    }

    if (!SUITS.includes(suit as any)) {
      throw new Error(`INVALID_CARD: invalid suit ${suit}`);
    }

    return new Card(face, suit as Card["suit"]);
  }

  constructor(face: number, suit: Suit) {
    this.face = face;
    this.suit = suit;
  }

  public display(): string {
    return `${FACE_DISPLAY[this.face] ?? this.face}${this.suit}`;
  }

  public toJSON(): CardJSON {
    return {
      suit: this.suit,
      face: this.face,
    };
  }

  public render(): string {
    const display = `${FACE_DISPLAY[this.face] ?? this.face}${SUIT_DISPLAY[this.suit] ?? this.suit}`;
    return display;
    // prettier-ignore
    // return [
    //   '┌──┐',
    //   `│${display}│`,
    //   '└──┘',
    // ].join('\n');
  }
}
