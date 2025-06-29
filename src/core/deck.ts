import shuffle from "lodash.shuffle";
import { Card, generateAllCards } from "./card.ts";

export class Deck {
  public cards: Card[] = generateAllCards();

  public shuffle() {
    this.cards = shuffle(this.cards);
  }

  public pick(count: number): Card[] {
    return this.cards.splice(0, count);
  }

  public reset() {
    this.cards = generateAllCards();
  }
}
