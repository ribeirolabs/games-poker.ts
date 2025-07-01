import assert from "node:assert/strict";
import { before, it } from "node:test";
import { ChinesePoker } from "./chinese.ts";

const game = new ChinesePoker();

before(() => {
  game.seatPlayer("01", "Player 1");
  game.seatPlayer("02", "Player 2");
});

it("only seats 2 players and add others to waiting list", () => {
  game.seatPlayer("03", "Player 3");
  assert.equal(game.players.length, 2);
  assert.deepEqual(
    game.players.map((p) => p.id),
    ["01", "02"],
    "players seated",
  );
  assert.equal(game.waiting.length, 1, "player added to wainting list");
});

it("changes button", () => {
  game.startRound();
  assert.equal(game.button, 0, "button starts with first player");
  game.startRound();
  assert.equal(game.button, 1, "button moves to second player");
  game.startRound();
  assert.equal(game.button, 0, "button moves back to first player");
});

it("deals cards", () => {
  game.startRound();

  game.players.forEach((player) => {
    assert.equal(player.cards.length, 0, "each player with o cards");
  });

  game.deal();

  game.players.forEach((player) => {
    assert.equal(player.cards.length, 13, "each player with 13 cards");
  });
});

it("allows playing hand", () => {
  game.startRound();
  game.deal();
  const player = game.players[0];
  player.addToHand("top", player.cards[0]);
  player.addToHand("top", player.cards[0]);
  player.addToHand("top", player.cards[0]);
  assert.equal(player.hand.top.length, 3, "added card to hand");
  player.addToHand("top", player.cards[0]);
  assert.equal(
    player.hand.top.length,
    3,
    "did not add more than 3 to top hand",
  );
});
