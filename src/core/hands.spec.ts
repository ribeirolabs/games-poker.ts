import assert from "node:assert";
import { describe, it } from "node:test";
import { Card } from "./card.ts";
import { getHand } from "./hands.ts";

describe("high-card", () => {
  it("A33", () => {
    // prettier-ignore
    const cards = [
      new Card(3, "s"),
      new Card(1, "s"),
      new Card(2, "s"),
    ];

    const hand = getHand(cards);
    assert.equal(hand.type, "high-card");
    assert.deepEqual(
      hand.cards.map((card) => card.face),
      [1, 3, 2],
    );
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
    assert.deepEqual(
      hand.cards.map((card) => card.face),
      [11, 8, 4],
    );
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
    assert.deepEqual(
      hand.cards.map((card) => card.face),
      [1, 13, 12],
    );
  });
});

describe("one-pair", () => {
  it("22A73", () => {
    // prettier-ignore
    const cards = [
      new Card(7, "s"),
      new Card(2, "s"),
      new Card(1, "s"),
      new Card(2, "s"),
      new Card(3, "s"),
    ];

    const hand = getHand(cards);
    assert.equal(hand.type, "one-pair");
    assert.deepEqual(
      hand.cards.map((card) => card.face),
      [2, 2, 1, 7, 3],
    );
  });
});

describe("two-pair", () => {
  it("KK992", () => {
    // prettier-ignore
    const cards = [
      new Card(9, "s"),
      new Card(2, "s"),
      new Card(12, "s"),
      new Card(9, "s"),
      new Card(12, "s"),
    ];

    const hand = getHand(cards);
    assert.equal(hand.type, "two-pair");
    assert.deepEqual(
      hand.cards.map((card) => card.face),
      [12, 12, 9, 9, 2],
    );
  });
});

describe("three-of-a-kind", () => {
  it("JJJA4", () => {
    // prettier-ignore
    const cards = [
      new Card(1, "s"),
      new Card(11, "s"),
      new Card(4, "s"),
      new Card(11, "s"),
      new Card(11, "s"),
    ];

    const hand = getHand(cards);
    assert.equal(hand.type, "three-of-a-kind");
    assert.deepEqual(
      hand.cards.map((card) => card.face),
      [11, 11, 11, 1, 4],
    );
  });
});

describe("full-house", () => {
  it("AAA33", () => {
    // prettier-ignore
    const cards = [
      new Card(3, "s"),
      new Card(1, "s"),
      new Card(3, "s"),
      new Card(1, "s"),
      new Card(1, "s"),
    ];

    const hand = getHand(cards);
    assert.equal(hand.type, "full-house");
    assert.deepEqual(
      hand.cards.map((card) => card.face),
      [1, 1, 1, 3, 3],
    );
  });
});
