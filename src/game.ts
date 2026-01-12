import { Card } from "./card";
import { Deck } from "./deck";

export type Guess = "h" | "l";

export type TurnResult = {
  current: Card;
  challenger: Card;
  guess: Guess;
  correct: boolean;
  score: number;
  remaining: number;
  gameOver: boolean;
  reason: string | undefined;
};

export class HigherLowerImplementation {
  private deck: Deck;

  private currentCard!: Card;
  private challengerCard!: Card;

  private gameOver = false;
  private score = 0;

  constructor(deck?: Deck) {
    this.deck = deck ?? new Deck();
  }

  begin(): void {
    this.deck.reset();
    this.deck.shuffle();

    this.score = 0;
    this.gameOver = false;

    if (this.deck.remaining() < 2) {
      throw new Error("Not enough cards to start a game.");
    }

    this.currentCard = this.deck.draw();
    this.challengerCard = this.deck.draw();
  }

  getCurrentCard(): Card {
    if (!this.currentCard) throw new Error("Game not started. Call start() first.");
    return this.currentCard;
  }

  getChallengingCard(): Card {
    if (!this.challengerCard) throw new Error("Game not started. Call start() first.");
    return this.challengerCard;
  }

  getScore(): number {
    return this.score;
  }

  remainingCards(): number {
    return this.deck.remaining();
  }

  isGameOver(): boolean {
    return this.gameOver;
  }


  checkHigherOrLower(guess: Guess): TurnResult {
    if (this.gameOver) {
      throw new Error("Game is over. Call start() to play again.");
    }
    if (!this.currentCard || !this.challengerCard) {
      throw new Error("Game not started. Call start() first.");
    }

    const comparison = this.challengerCard.value - this.currentCard.value;

    let correct = false;
    if (comparison > 0 && guess === "h") correct = true;
    if (comparison < 0 && guess === "l") correct = true;
    if (comparison === 0 ) correct = true;


    if (correct) {
      this.score += 1;

      this.currentCard = this.challengerCard;

      if (this.deck.remaining() === 0) {
        this.gameOver = true;
        return {
          current: this.currentCard,
          challenger: this.challengerCard,
          guess,
          correct: true,
          score: this.score,
          remaining: 0,
          gameOver: true,
          reason: "Deck is empty (you win)",
        };
      }

      this.challengerCard = this.deck.draw();
    } else {
      this.gameOver = true;
    }

    return {
      current: this.currentCard,
      challenger: this.challengerCard,
      guess,
      correct,
      score: this.score,
      remaining: this.deck.remaining(),
      gameOver: this.gameOver,
      reason: correct ? undefined : "Wrong Guess",
    };
  }
}
