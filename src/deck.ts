import { Card, Suit, Ranks } from "./card";
/**
 * This file contains functionalities which models as a standard deck of playing cards,
 * including two Jokers. It includes core functionalities such as shuffling, drawing, and
 * inspecting the remaining cards.
 */


/**
 * Represents a deck of playing cards, including two Jokers.
 *
 * The deck is backed by a stack of cards instances and is
 * automatically initialised to a full, ordered set of cards when constructed.
 *
 * Common usage:
 * - construct a new deck with `Deck()`.
 * - calling "shuffle" to randomise card order.
 * - calling "draw" to draw cards from the top of the deck.
 * - calling "remaining" to check how many cards are left.
 */
export class Deck {
    private cards: Card[] = [];
    

    constructor(){
        this.reset(); // Creates a new Deck and initialises it with a full set of cards.
    }

    
    /** reset()
     * Resets the deck to a complete, ordered set of cards.
     *
     * After calling this method, the deck will be in an unshuffled
     * manner. Using the shuffle()funciton will help to randomise the card ordering.
    */
    reset(): void{
        this.cards = [];

        for (const suit of Object.values(Suit)) {
            for (const rank of Object.values(Ranks)) {
            if (rank === Ranks.Joker) continue;
            this.cards.push(new Card(suit, rank));
            }
        }
        this.cards.push(new Card(Suit.Clubs, Ranks.Joker));
        this.cards.push(new Card(Suit.Spades, Ranks.Joker));
    }


    /** shuffle()
     * Randomises the order of the cards in the deck using the Fisher–Yates shuffle.
     *
     * This method shuffles the deck.
     * After shuffling, calls draw() function to return cards
    */
    shuffle(): void{
        for(let i = this.cards.length -1; i > 0; i--){
            const j = Math.floor(Math.random() * (i+1));
            const temporary = this.cards[i]!;
            this.cards[i] = this.cards[j]!;
            this.cards[j] = temporary;
        }
    }

    // Draws() helps in removing and returning the top card from the deck.
    draw(): Card{
        const card = this.cards.pop();
        if (!card){
            throw new Error("The Deck is empty");
        }
        return card;
    }

    // remaining() - obtains the number of cards currently remaining in the deck.
    remaining(): number {
        return this.cards.length;
    }
}
