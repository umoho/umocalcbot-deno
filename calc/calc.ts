import { eval_ } from "./eval.ts";
import { getTokens } from "./lexer.ts";
import { Parser } from "./parser.ts";
import { display } from "./value.ts";

export { calculate };

function calculate(input: string): string {
    const tokens = getTokens(input);

    const parser = new Parser(tokens);

    const expr = parser.parse();

    const result = eval_(expr);

    console.log(`Result`, result);

    return display(result);
}
