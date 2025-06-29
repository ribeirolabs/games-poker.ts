import { Card } from "./card.ts";

const HAND_TYPES = [
  "high-card",
  "one-pair",
  "two-pair",
  "three-of-a-kind",
  "straight",
  "flush",
  "full-house",
  "four-of-a-kind",
  "straight-flush",
  "royal-flush",
] as const;

type HandType = (typeof HAND_TYPES)[number] | "incomplete";

type Result = {
  success: boolean;
  cards: Card[];
};

function sortHighToAceLow(a: Card, b: Card): number {
  return b.face - a.face;
}

function sortAceHighToLow(a: Card, b: Card): number {
  if (a.face === 1) {
    return b.face === 1 ? 0 : -1;
  }
  if (b.face === 1) {
    return 1;
  }
  return b.face - a.face;
}

export class Hand {
  public type: HandType;
  public cards: Card[];
  public rank: number;

  constructor(type: HandType, cards: Card[]) {
    this.type = type;
    this.cards = cards;
    this.rank = type === "incomplete" ? -1 : HAND_TYPES.indexOf(type);
  }
}

function getPairs(cards: Card[]): {
  pairs: Card[];
  trips: Card[];
  quads: Card[];
  others: Card[];
} {
  if (cards.length < 2) {
    return {
      pairs: [],
      trips: [],
      quads: [],
      others: cards,
    };
  }

  const counts: Record<number, Card[]> = {};
  for (const card of cards) {
    if (card.face in counts === false) {
      counts[card.face] = [];
    }
    counts[card.face].push(card);
  }

  const pairs: Card[] = [];
  const trips: Card[] = [];
  const quads: Card[] = [];
  const others: Card[] = [];

  for (const cards of Object.values(counts)) {
    if (cards.length === 2) {
      pairs.push(...cards);
    } else if (cards.length === 3) {
      trips.push(...cards);
    } else if (cards.length === 4) {
      quads.push(...cards);
    } else {
      others.push(...cards);
    }
  }

  return {
    pairs: pairs.sort(sortAceHighToLow),
    trips: trips.sort(sortAceHighToLow),
    quads: quads.sort(sortAceHighToLow),
    others: others.sort(sortAceHighToLow),
  };
}

function getFlush(cards: Card[]): Result {
  if (cards.length !== 5) {
    return {
      success: false,
      cards,
    };
  }

  const suit: Card["suit"] = cards[0].suit;
  for (let i = 1; i < cards.length; i++) {
    const card = cards[i];
    if (suit !== card.suit) {
      return { success: false, cards };
    }
  }

  return { success: true, cards: [...cards].sort(sortAceHighToLow) };
}

function getStraight(cards: Card[]): Result {
  if (cards.length !== 5) {
    return {
      success: false,
      cards,
    };
  }

  const aceHigh = [...cards].sort(sortAceHighToLow);
  const isAceToTen = aceHigh[0].face === 1 && aceHigh[4].face === 10;
  if (isAceToTen) {
    return {
      success: true,
      cards: aceHigh,
    };
  }

  const aceLow = [...cards].sort(sortHighToAceLow);
  const isStraight = aceLow[0].face - aceLow[4].face === 4;
  if (isStraight) {
    return {
      success: true,
      cards: aceLow,
    };
  }

  return {
    success: false,
    cards,
  };
}

function validateHand(cards: Card[]) {
  const unique = new Set<string>();
  for (const card of cards) {
    const display = card.display();
    if (unique.has(display)) {
      throw new Error("INVALID_HAND");
    }
    unique.add(display);
  }
}

export function getHand(cards: Card[]): Hand {
  validateHand(cards);

  if (cards.length < 2) {
    return new Hand("incomplete", cards);
  }

  const pairs = getPairs(cards);
  const flush = getFlush(cards);

  if (
    flush.success &&
    flush.cards[0].face === 1 &&
    flush.cards[4].face === 10
  ) {
    return new Hand("royal-flush", flush.cards);
  }

  if (flush.success && flush.cards[0].face - flush.cards[4].face === 4) {
    return new Hand("straight-flush", flush.cards);
  }

  if (pairs.quads.length) {
    return new Hand("four-of-a-kind", pairs.quads.concat(pairs.others));
  }

  if (pairs.trips.length && pairs.pairs.length === 2) {
    return new Hand("full-house", pairs.trips.concat(pairs.pairs));
  }

  if (flush.success) {
    return new Hand("flush", flush.cards);
  }

  const straight = getStraight(cards);
  if (straight.success) {
    return new Hand("straight", straight.cards);
  }

  if (pairs.trips.length) {
    return new Hand("three-of-a-kind", pairs.trips.concat(pairs.others));
  }

  if (pairs.pairs.length === 2) {
    return new Hand("one-pair", pairs.pairs.concat(pairs.others));
  }

  if (pairs.pairs.length === 4) {
    return new Hand("two-pair", pairs.pairs.concat(pairs.others));
  }

  return new Hand("high-card", [...cards].sort(sortAceHighToLow));
}

export function rankHands(hands: Hand[]): Hand[] {
  return [...hands].sort((a, b) => {
    const diff = b.rank - a.rank;
    if (diff !== 0) {
      return diff;
    }

    if (a.type === "royal-flush") {
      return 0;
    }

    if (
      [
        "high-card",
        "one-pair",
        "two-pair",
        "three-of-a-kind",
        "four-of-a-kind",
        "full-house",
      ].includes(a.type)
    ) {
      for (let i = 0; i < a.cards.length; i++) {
        const aCard = a.cards[i];
        const bCard = b.cards[i];
        const diff = sortAceHighToLow(aCard, bCard);
        if (diff !== 0) {
          return diff;
        }
      }
    }

    return sortAceHighToLow(a.cards[0], b.cards[0]);
  });
}
