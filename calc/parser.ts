import { Token } from "./lexer.ts";

type Number = { type: "number", form: "decimal" | "integer", value: string };
type Unary = { type: "unary", op: string, expr: Expression };
type Binary = { type: "binary", op: string, left: Expression, right: Expression };
export type Expression = Number | Unary | Binary;

export class Parser {
    pos: number;
    tokens: Array<Token>;
    currToken: Token;

    constructor(tokens: Array<Token>) {
        this.pos = 0;
        this.tokens = tokens;
        this.currToken = tokens[0];
    }

    nextToken() {
        this.pos += 1;

        this.currToken = this.tokens[this.pos];
    }

    eat(token: { value: string, type: string }) {
        if (this.currToken.type === token.type) {
            this.nextToken();
        } else {
            throw `excepted token '${token.value}', found '${this.currToken.value}'`
            + ` at line ${this.currToken.line}, column ${this.currToken.column}'`;
        }
    }

    factor(): Expression {
        const token = this.currToken;
        if (token.type === "open_paren") {
            this.eat({ value: token.value, type: token.type });
            const elem = this.expr();
            this.eat({ value: ")", type: "close_paren" });
            return elem;
        }

        if (token.type === "decimal" || token.type === "integer") {
            this.eat({ value: token.value, type: token.type });
            return { type: "number", form: token.type, value: token.value };
        }

        if (token.type === "plus" || token.type === "minus") {
            this.eat({ value: token.value, type: token.type });
            return { type: "unary", op: token.type, expr: this.factor() };
        }

        throw "an error occur in parsing factor";
    }

    term(): Expression {
        let node = this.factor();

        while (this.currToken.type === "multi" || this.currToken.type === "divide") {
            const token = this.currToken;

            this.eat({ value: token.value, type: token.type });

            node = { type: "binary", op: token.type, left: node, right: this.factor() };
        }

        return node;
    }

    expr(): Expression {
        let node = this.term();

        while (this.currToken.type === "plus" || this.currToken.type === "minus") {
            const token = this.currToken;

            this.eat({ value: token.value, type: token.type });

            node = { type: "binary", op: token.type, left: node, right: this.term() };
        }

        return node;
    }

    parse(): Expression {
        return this.expr();
    }
}
