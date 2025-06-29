import assert from "node:assert/strict";
import { it } from "node:test";
import { ChinesePoker } from "./chinese.ts";

it("startRound()", () => {
  const game = new ChinesePoker();
  game.addPlayer("01", "Player 1");
  game.addPlayer("02", "Player 2");
  game.addPlayer("03", "Player 3");
  game.startRound();
  game.deal();

  assert.equal(game.players.length, 2);

  game.players.forEach((player) => {
    assert.equal(player.cards.length, 13);
  });
});
