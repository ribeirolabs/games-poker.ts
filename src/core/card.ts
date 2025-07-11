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

const FACE_NAME = {
  1: "Aces",
  2: "Deuces",
  3: "Threes",
  4: "Fours",
  5: "Fives",
  6: "Sixes",
  7: "Seves",
  8: "Eights",
  9: "Nines",
  10: "Tens",
  11: "Jacks",
  12: "Queens",
  13: "Kings",
};

const SUIT_DISPLAY: Record<Suit, string> = {
  s: "♠",
  c: "♣",
  d: "♦",
  h: "♥",
};

const SUIT_NAME: Record<Suit, string> = {
  s: "Spades",
  c: "Clubs",
  d: "Diamonds",
  h: "Hearts",
};

export function generateAllCards() {
  const cards: Card[] = [];
  for (const suit of SUITS) {
    for (let face = 1; face <= FACE_COUNT; face++) {
      const card = new Card(face, suit);
      card.key = crypto.randomUUID();
      cards.push(card);
    }
  }
  return cards;
}

export type CardJSON =
  | {
      side: "front";
      key: string;
      suit: Suit;
      face: number;
      faceDisplay: string;
      faceName: string;
      suitDisplay: string;
      suitName: string;
    }
  | {
      side: "back";
      key: string;
    };

export class Card {
  public suit: Suit;
  public face: number;
  public key: string;

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

  public faceDisplay(): string {
    return FACE_DISPLAY[this.face] ?? this.face.toString();
  }

  public faceName(): string {
    return FACE_NAME[this.face];
  }

  public suitDisplay(): string {
    return SUIT_DISPLAY[this.suit];
  }

  public suitName(): string {
    return SUIT_NAME[this.suit];
  }

  public toJSON(): Extract<CardJSON, { side: "front" }> {
    return {
      side: "front",
      key: this.key || this.display(),
      suit: this.suit,
      suitDisplay: this.suitDisplay(),
      suitName: this.suitName(),
      face: this.face,
      faceDisplay: this.faceDisplay(),
      faceName: this.faceName(),
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
