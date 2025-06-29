import { it } from "node:test";
import assert from "node:assert/strict";
import { Deck } from "./deck.ts";

it("pick() returns cards and removes them from the deck", () => {
  const deck = new Deck();
  const cards = deck.pick(2);
  assert.equal(cards.length, 2);
  assert.equal(deck.cards.length, 50);
});
