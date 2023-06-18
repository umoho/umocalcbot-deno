import { Lexer } from "https://deno.land/x/lexer@1.0.0-beta.2/mod.ts";

enum TokenType {
    DECIMAL = "decimal",
    INTEGER = "integer",
    PLUS = "plus",
    MINUS = "minus",
    MULTI = "multi",
    DIVIDE = "divide",
    OPEN_PAREN = "open_paren",
    CLOSE_PAREN = "close_paren",
    WS = " ",
}

const lexer = new Lexer({
    [TokenType.DECIMAL]: /\d*\.\d+/,
    [TokenType.INTEGER]: /\d+/,
    [TokenType.PLUS]: "+",
    [TokenType.MINUS]: "-",
    [TokenType.MULTI]: "*",
    [TokenType.DIVIDE]: "/",
    [TokenType.OPEN_PAREN]: "(",
    [TokenType.CLOSE_PAREN]: ")",
    [TokenType.WS]: { pattern: /[\s\t]+/, ignore: true },
});

export type Token = {
    value: string,
    type: string,
    offset: number,
    line: number,
    column: number
};

export function getTokens(input: string): Array<Token> {
    const result = lexer.analyze(input).values;

    for (const token of result)
        if (token.type === "UNKNOWN")
            throw `unknown token '${token.value}' at line ${token.line}, column ${token.column}`

    return result;
}
