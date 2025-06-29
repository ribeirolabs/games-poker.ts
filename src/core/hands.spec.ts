import assert from "node:assert";
import { describe, it } from "node:test";
import { Card } from "./card.ts";
import { getHand, rankHands, Hand } from "./hands.ts";

function renderCards(cards: Card[]): string {
  return cards.map((card) => card.display()).join(",");
}

function getCards(from: string): Card[] {
  return from.split(",").map(Card.fromDisplay);
}

function getHands(from: string[]): Hand[] {
  return from.map((display) => getHand(getCards(display)));
}

it("throws error with invalid hand", () => {
  // prettier-ignore
  assert.throws(() => getHand([
    new Card(3, "s"),
    new Card(3, "s"),
    new Card(2, "s"),
  ]));
});

describe("identify hands", () => {
  describe("high-card", () => {
    it("A32", () => {
      const hand = getHand([
        new Card(3, "s"),
        new Card(1, "s"),
        new Card(2, "s"),
      ]);
      assert.equal(hand.type, "high-card");
      assert.equal(renderCards(hand.cards), "As,3s,2s");
    });
    it("J84", () => {
      const hand = getHand([
        new Card(8, "s"),
        new Card(4, "s"),
        new Card(11, "s"),
      ]);
      assert.equal(hand.type, "high-card");
      assert.equal(renderCards(hand.cards), "Js,8s,4s");
    });
    it("AKQ", () => {
      const hand = getHand([
        new Card(13, "s"),
        new Card(1, "s"),
        new Card(12, "s"),
      ]);
      assert.equal(hand.type, "high-card");
      assert.equal(renderCards(hand.cards), "As,Ks,Qs");
    });
  });

  it("one-pair", () => {
    const hand = getHand([
      new Card(7, "s"),
      new Card(2, "s"),
      new Card(1, "s"),
      new Card(2, "c"),
      new Card(3, "s"),
    ]);
    assert.equal(hand.type, "one-pair");
    assert.equal(renderCards(hand.cards), "2s,2c,As,7s,3s");
  });

  it("two-pair", () => {
    const hand = getHand([
      new Card(9, "s"),
      new Card(2, "s"),
      new Card(13, "s"),
      new Card(9, "c"),
      new Card(13, "c"),
    ]);
    assert.equal(hand.type, "two-pair");
    assert.equal(renderCards(hand.cards), "Ks,Kc,9s,9c,2s");
  });

  it("three-of-a-kind", () => {
    const hand = getHand([
      new Card(1, "s"),
      new Card(11, "s"),
      new Card(4, "c"),
      new Card(11, "c"),
      new Card(11, "h"),
    ]);
    assert.equal(hand.type, "three-of-a-kind");
    assert.equal(renderCards(hand.cards), "Js,Jc,Jh,As,4c");
  });

  it("full-house", () => {
    const hand = getHand([
      new Card(3, "s"),
      new Card(1, "c"),
      new Card(3, "h"),
      new Card(1, "h"),
      new Card(1, "d"),
    ]);
    assert.equal(hand.type, "full-house");
    assert.equal(renderCards(hand.cards), "Ac,Ah,Ad,3s,3h");
  });

  it("flush", () => {
    const hand = getHand([
      new Card(3, "s"),
      new Card(8, "s"),
      new Card(2, "s"),
      new Card(1, "s"),
      new Card(12, "s"),
    ]);
    assert.equal(hand.type, "flush");
    assert.equal(renderCards(hand.cards), "As,Qs,8s,3s,2s");
  });

  it("royal-flush", () => {
    const hand = getHand([
      new Card(10, "s"),
      new Card(13, "s"),
      new Card(11, "s"),
      new Card(1, "s"),
      new Card(12, "s"),
    ]);
    assert.equal(hand.type, "royal-flush");
    assert.equal(renderCards(hand.cards), "As,Ks,Qs,Js,Ts");
  });

  it("straight-flush", () => {
    const hand = getHand([
      new Card(4, "s"),
      new Card(7, "s"),
      new Card(6, "s"),
      new Card(5, "s"),
      new Card(8, "s"),
    ]);
    assert.equal(hand.type, "straight-flush");
    assert.equal(renderCards(hand.cards), "8s,7s,6s,5s,4s");
  });

  describe("straight", () => {
    it("5-A", () => {
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

  it("quads", () => {
    const hand = getHand([
      new Card(3, "h"),
      new Card(3, "d"),
      new Card(3, "c"),
      new Card(1, "s"),
      new Card(3, "s"),
    ]);
    assert.equal(hand.type, "four-of-a-kind");
    assert.equal(renderCards(hand.cards), "3h,3d,3c,3s,As");
  });
});

describe("rank hands", () => {
  it("no ties", () => {
    const hands = getHands([
      "3s,3d,3c,2s,5s",
      "4s,4d,4c,4h,7s",
      "4d,3s,6h,7d,5c",
      "9s,7s,2s,8s,Ks",
    ]);
    assert.deepEqual(
      rankHands(hands).map((h) => h.type),
      // prettier-ignore
      [
        "four-of-a-kind",
        "flush", 
        "straight",
        "three-of-a-kind",
      ],
    );
  });
  describe("tie break", () => {
    it("high-card", () => {
      const hands = getHands([
        // prettier-ignore
        "7d,3h,Tc,2s,Kc",
        "9c,Js,2h,8s,Ks",
      ]);
      const ranked = rankHands(hands);
      assert.deepEqual(
        ranked.map((h) => [h.type, renderCards(h.cards)]),
        [
          ["high-card", "Ks,Js,9c,8s,2h"],
          ["high-card", "Kc,Tc,7d,3h,2s"],
        ],
      );
    });
    it("one-pair", () => {
      const hands = getHands([
        // prettier-ignore
        "7d,7h,8c,2s,5s",
        "7c,7s,2h,8s,Ks",
      ]);
      const ranked = rankHands(hands);
      assert.deepEqual(
        ranked.map((h) => [h.type, renderCards(h.cards)]),
        [
          ["one-pair", "7c,7s,Ks,8s,2h"],
          ["one-pair", "7d,7h,8c,5s,2s"],
        ],
      );
    });
    it("two-pair", () => {
      const hands = getHands([
        // prettier-ignore
        "7c,7s,2s,6s,2h",
        "7d,7h,8c,2d,2c",
      ]);
      const ranked = rankHands(hands);
      assert.deepEqual(
        ranked.map((h) => [h.type, renderCards(h.cards)]),
        [
          ["two-pair", "7d,7h,2d,2c,8c"],
          ["two-pair", "7c,7s,2s,2h,6s"],
        ],
      );
    });
    it("flush", () => {
      const hands = getHands([
        "3s,3d,3c,2s,5s",
        "9s,7s,2s,8s,Ks",
        "4d,3s,6h,7d,5c",
        "3c,Ac,9c,8c,Tc",
      ]);
      const ranked = rankHands(hands);
      assert.deepEqual(
        ranked.map((h) => [h.type, renderCards(h.cards)]),
        [
          ["flush", "Ac,Tc,9c,8c,3c"],
          ["flush", "Ks,9s,8s,7s,2s"],
          ["straight", "7d,6h,5c,4d,3s"],
          ["three-of-a-kind", "3s,3d,3c,5s,2s"],
        ],
      );
    });
    it("straight", () => {
      const hands = getHands([
        // prettier-ignore
        "3s,6d,2c,4s,5s",
        "9s,7h,6s,8c,Ts",
      ]);
      const ranked = rankHands(hands);
      assert.deepEqual(
        ranked.map((h) => [h.type, renderCards(h.cards)]),
        [
          // prettier-ignore
          ["straight", "Ts,9s,8c,7h,6s"],
          ["straight", "6d,5s,4s,3s,2c"],
        ],
      );
    });
  });
});
