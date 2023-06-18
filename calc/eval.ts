import { Expression } from "./parser.ts";
import { Value, decimal, divide, integer, minus, multi, neg, plus } from "./value.ts";

export function eval_(expr: Expression): Value {
    if (expr.type === "number") {
        if (expr.form === "decimal") return decimal(expr.value);
        if (expr.form === "integer") return integer(expr.value);
        throw `unknown number form '${expr.form}'`;
    }

    if (expr.type === "unary") {
        if (expr.op === "plus") return eval_(expr.expr);

        if (expr.op === "minus") return neg(eval_(expr.expr));

        console.log(expr);
        throw `an error occur in evaluating unary expression ${ expr.expr }`;
    }

    if (expr.type === "binary") {
        if (expr.op === "plus") return plus(eval_(expr.left), eval_(expr.right));
        if (expr.op === "minus") return minus(eval_(expr.left), eval_(expr.right));
        if (expr.op === "multi") return multi(eval_(expr.left), eval_(expr.right));
        if (expr.op === "divide") return divide(eval_(expr.left), eval_(expr.right));

        throw `an error occur in evaluating binary expression`;
    }

    throw `an error occur in evaluating`;
}
