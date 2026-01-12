import readline from "node:readline";
import { HigherLowerImplementation } from "./game";
import type { Guess } from "./game";

const readlne = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function userInput(question: string): Promise<string> {
  return new Promise((resolve) => readlne.question(question, resolve));
}

function getGuess(input: string): Guess | "quit" | null {
  const val = input.trim().toLowerCase();
  if (val === "q" || val === "quit") return "quit";
  if (val === "h") return "h";
  if (val === "l") return "l";
  return null;
}

/**
 * Entry point for the Higher / Lower (Hawk-Eye Coding Task) CLI game.
 *
 * Initialises a new game session, displays instructions to the user, and then
 * enters an interactive loop where the current card and the challenging card
 * are shown each round. The user is prompted to guess whether the challenging
 * card is higher or lower than the current card by entering:
 *
 * - `h` for higher
 * - `l` for lower
 * - `q` to quit the game
 *
 * For each round, the guess is validated and checked against the actual
 * outcome via the game engine. The score and remaining number of cards are
 * displayed after each guess. If the deck is finished or the user guesses
 * incorrectly, the game ends and the final score is shown.
 *
 * After game over, the user is prompted to start a new game or exit. 
 * The function continues to loop until the user chooses to quit.
 *
 */
async function main() {
  const game = new HigherLowerImplementation();
  game.begin();

  console.log("Welcome to Higher / Lower (Hawk-Eye Coding Task)");
  console.log("-------------------------------\n\n");
  console.log("You need to guess if the challenging card is higher or lower by typing 'h' or 'l'.");
  console.log("Type: h if Higher, l if Lower, or q to quit");

  while (true) {
    const current_card = game.getCurrentCard();
    const challenging_card = game.getChallengingCard();

    console.log("\n\n-------------------------------");
    console.log(`Current Card:    ${current_card.toString()}`);
    console.log(`Challenging Card: ${challenging_card.toString()}`);
    console.log("-------------------------------\n\n");
    console.log(`Score is now - ${game.getScore()} / There are ${game.remainingCards()} card(s) remaining.`);

    const input = await userInput("\nIs the challenging card higher or lower?\n(`h` - higher |`l` - lower | `q` - quit):");
    const guess = getGuess(input);

    if (guess === "quit") {
      console.log("\nGoodbye!");
      break;
    }
    if (guess === null) {
      console.log("Invalid input. Please type h, l, or q.\n");
      continue;
    }

    const result = game.checkHigherOrLower(guess);

    if (result.correct) {
      if (result.gameOver && result.reason?.startsWith("Deck is empty")) {
        console.log(`Correct ${result.reason}`);
        console.log(`Final score: ${result.score}\n`);
        break;
      }
      console.log(`Correct, score is currently: ${result.score}\n`);
      console.log("-----------NEXT ROUND-----------");
      continue;
    }

    console.log(`\nIncorrect (${result.reason ?? "Wrong guess"}). Your final score is: ${result.score}\n\n`);

    const restart = (await userInput("Play again?\n('y' - for Yes/'n' - for No): ")).trim().toLowerCase();
    if (restart === "y" || restart === "yes") {
      game.begin();
      console.log("-----------NEW GAME STARTING-----------");
      continue;
    }

    console.log("Thanks for playing!");
    break;
  }

  readlne.close();
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  readlne.close();
  process.exit(1);
});
