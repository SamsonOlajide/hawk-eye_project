

/**
 * This file aims to represent a single playing card in a standard deck.
 *
 * 
 * As usual card implementations,
 * A single card is identified by its suit, rank, and a numeric value obtained from the rank.
 */
export enum Ranks{
    Two = "2",
    Three = "3",
    Four = "4",
    Five = "5",
    Six = "6",
    Seven = "7",
    Eight = "8",
    Nine = "9",
    Ten = "10",
    Jack = "Jack",
    Queen = "Queen",
    King = "King",
    Ace = "Ace",
    Joker = "Joker"
}


/**
 * The suit of the card (e.g. hearts, spades, clubs, diamonds).
 */
export enum Suit {
    Clubs = "Clubs",
    Diamonds = "Diamonds",
    Heart = "Heart",
    Spades = "Spades"
}



/** rank_vals
 * Numeric value associated with this card's rank. 
 * This is how we can tell what card take higer precedence over the other.
 */
const rank_vals: Record<Ranks, number> = {
    [Ranks.Two]: 2,
    [Ranks.Three]: 3,
    [Ranks.Four]: 4,
    [Ranks.Five]: 5,
    [Ranks.Six]: 6,
    [Ranks.Seven]: 7,
    [Ranks.Eight]: 8,
    [Ranks.Nine]: 9,
    [Ranks.Ten]: 10,
    [Ranks.Jack]: 11,
    [Ranks.Queen]: 12,
    [Ranks.King]: 13,
    [Ranks.Ace]: 14,
    [Ranks.Joker]: 15
};


/**
 * Returns a human-readable string of the card.
 *
 * Example:
 * - Every card will be displayed as "<rank> of <suit>"
 * - If the card is a 'Joker' card it'll be returned as Joker
 * 
 * @returns A string representation of this card.
 */
export class Card {
    public readonly suit: Suit;
    public readonly rank: Ranks;
    public readonly value: number;

    constructor(suit: Suit, rank: Ranks){
        this.suit = suit;
        this.rank = rank;
        this.value = rank_vals[rank];
    }

    toString(): string {
        if (this.rank === "Joker"){
            return "Joker";
        }
        return `${this.rank} of ${this.suit}`
    }
}


