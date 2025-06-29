import { Card } from "./card.ts";

const HAND_TYPES = [
  "invalid",
  "high-card",
  "one-pair",
  "two-pair",
  "three-of-a-kind",
  "straight",
  "flush",
  "full-house",
  "quads",
  "straight-flush",
  "royal-flush",
] as const;

type HandType = (typeof HAND_TYPES)[number];

function sortHighToLow(a: Card, b: Card): number {
  if (a.face === 1) {
    return -1;
  }
  if (b.face === 1) {
    return 1;
  }
  return b.face - a.face;
}

class Hand {
  public type: HandType;
  public cards: Card[];

  constructor(type: HandType, cards: Card[]) {
    this.type = type;
    this.cards = cards;
  }
}

function getPairs(cards: Card[]): {
  pairs: Card[];
  trips: Card[];
  others: Card[];
} {
  if (cards.length < 2) {
    return {
      pairs: [],
      trips: [],
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
  const others: Card[] = [];

  for (const cards of Object.values(counts)) {
    if (cards.length === 2) {
      pairs.push(...cards);
    } else if (cards.length === 3) {
      trips.push(...cards);
    } else {
      others.push(...cards);
    }
  }

  return {
    pairs: pairs.sort(sortHighToLow),
    trips: trips.sort(sortHighToLow),
    others: others.sort(sortHighToLow),
  };
}

export function getHand(cards: Card[]): Hand {
  if (cards.length < 2) {
    return new Hand("invalid", cards);
  }

  const result = getPairs(cards);

  if (result.trips.length && result.pairs.length === 2) {
    return new Hand("full-house", result.trips.concat(result.pairs));
  }

  if (result.trips.length) {
    return new Hand("three-of-a-kind", result.trips.concat(result.others));
  }

  if (result.pairs.length === 2) {
    return new Hand("one-pair", result.pairs.concat(result.others));
  }

  if (result.pairs.length === 4) {
    return new Hand("two-pair", result.pairs.concat(result.others));
  }

  return new Hand("high-card", [...cards].sort(sortHighToLow));
}
