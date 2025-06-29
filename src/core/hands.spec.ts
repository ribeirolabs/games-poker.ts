import assert from "node:assert";
import { describe, it } from "node:test";
import { Card } from "./card.ts";
import { getHand } from "./hands.ts";

function renderCards(cards: Card[]): string {
  return cards.map((card) => card.display()).join(",");
}

it("throws error with invalid hand", () => {
  // prettier-ignore
  const cards = [
    new Card(3, "s"),
    new Card(3, "s"),
    new Card(2, "s"),
  ];

  assert.throws(() => getHand(cards));
});

describe("high-card", () => {
  it("A32", () => {
    // prettier-ignore
    const cards = [
      new Card(3, "s"),
      new Card(1, "s"),
      new Card(2, "s"),
    ];

    const hand = getHand(cards);
    assert.equal(hand.type, "high-card");
    assert.equal(renderCards(hand.cards), "As,3s,2s");
  });
  it("J84", () => {
    // prettier-ignore
    const cards = [
      new Card(8, "s"),
      new Card(4, "s"),
      new Card(11, "s"),
    ];

    const hand = getHand(cards);
    assert.equal(hand.type, "high-card");
    assert.equal(renderCards(hand.cards), "Js,8s,4s");
  });
  it("AKQ", () => {
    // prettier-ignore
    const cards = [
      new Card(13, "s"),
      new Card(1, "s"),
      new Card(12, "s"),
    ];

    const hand = getHand(cards);
    assert.equal(hand.type, "high-card");
    assert.equal(renderCards(hand.cards), "As,Ks,Qs");
  });
});

it("one-pair", () => {
  // prettier-ignore
  const cards = [
    new Card(7, "s"),
    new Card(2, "s"),
    new Card(1, "s"),
    new Card(2, "c"),
    new Card(3, "s"),
  ];

  const hand = getHand(cards);
  assert.equal(hand.type, "one-pair");
  assert.equal(renderCards(hand.cards), "2s,2c,As,7s,3s");
});

it("two-pair", () => {
  // prettier-ignore
  const cards = [
    new Card(9, "s"),
    new Card(2, "s"),
    new Card(13, "s"),
    new Card(9, "c"),
    new Card(13, "c"),
  ];

  const hand = getHand(cards);
  assert.equal(hand.type, "two-pair");
  assert.equal(renderCards(hand.cards), "Ks,Kc,9s,9c,2s");
});

it("three-of-a-kind", () => {
  // prettier-ignore
  const cards = [
    new Card(1, "s"),
    new Card(11, "s"),
    new Card(4, "c"),
    new Card(11, "c"),
    new Card(11, "h"),
  ];

  const hand = getHand(cards);
  assert.equal(hand.type, "three-of-a-kind");
  assert.equal(renderCards(hand.cards), "Js,Jc,Jh,As,4c");
});

it("full-house", () => {
  // prettier-ignore
  const cards = [
    new Card(3, "s"),
    new Card(1, "c"),
    new Card(3, "h"),
    new Card(1, "h"),
    new Card(1, "d"),
  ];

  const hand = getHand(cards);
  assert.equal(hand.type, "full-house");
  assert.equal(renderCards(hand.cards), "Ac,Ah,Ad,3s,3h");
});

it("flush", () => {
  // prettier-ignore
  const cards = [
    new Card(3, "s"),
    new Card(8, "s"),
    new Card(2, "s"),
    new Card(1, "s"),
    new Card(12, "s"),
  ];
  const hand = getHand(cards);
  assert.equal(hand.type, "flush");
  assert.equal(hand.cards[0].display(), "As");
  assert.equal(hand.cards[4].display(), "2s");
});

it("royal-flush", () => {
  // prettier-ignore
  const cards = [
    new Card(10, "s"),
    new Card(13, "s"),
    new Card(11, "s"),
    new Card(1, "s"),
    new Card(12, "s"),
  ];
  const hand = getHand(cards);
  assert.equal(hand.type, "royal-flush");
  assert.equal(hand.cards[0].display(), "As");
  assert.equal(hand.cards[4].display(), "Ts");
});

describe("straight", () => {
  it("5-A", () => {
    // prettier-ignore
    const hand = getHand([
      new Card(3, "s"),
      new Card(2, "c"),
      new Card(1, "s"),
      new Card(4, "h"),
      new Card(5, "s"),
    ]);
    assert.equal(hand.type, "straight");
    assert.equal(renderCards(hand.cards), "5s,4h,3s,2c,As");
  });

  it("A-T", () => {
    // prettier-ignore
    const hand = getHand([
    new Card(12, "s"),
    new Card(11, "c"),
    new Card(13, "s"),
    new Card(1, "h"),
    new Card(10, "s"),
  ]);
    assert.equal(hand.type, "straight");
    assert.equal(renderCards(hand.cards), "Ah,Ks,Qs,Jc,Ts");
  });
});
