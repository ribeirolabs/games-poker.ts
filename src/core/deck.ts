import shuffle from "lodash.shuffle";
import { Card, generateAllCards } from "./card.ts";

export class Deck {
  public cards: Card[] = generateAllCards();

  public shuffle() {
    const half = Math.floor(this.cards.length / 2);
    for (let i = 0; i < 5; i++) {
      this.cards = shuffle(this.cards);
      this.cards = [...this.cards.splice(half), ...this.cards.splice(0)];
    }
  }

  public pick(count: number = 1): Card[] {
    return this.cards.splice(0, count);
  }

  public reset() {
    this.cards = generateAllCards();
  }
}
