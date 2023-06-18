import { BigDenary } from "https://deno.land/x/bigdenary@1.0.0/mod.ts";

type Fraction = { type: "fraction", num: bigint, denom: bigint };
type Decimal = { type: "decimal", dec: BigDenary };
type Integer = { type: "integer", int: bigint };
export type Value = Fraction | Decimal | Integer;

export function fraction(
    n: string | number | bigint,
    d: string | number | bigint
): Fraction {
    return { type: "fraction", num: BigInt(n), denom: BigInt(d) };
}

export function decimal(n: string | BigDenary): Decimal {
    return { type: "decimal", dec: new BigDenary(n) };
}

export function integer(n: string | number | bigint): Integer {
    return { type: "integer", int: BigInt(n) };
}

function displayWithoutSimp(value: Value): string {
    if (value.type === "integer") {
        return value.int.toString();
    }

    if (value.type === "decimal") {
        return value.dec.toString();
    }

    if (value.type === "fraction") {
        return `${value.num.toString()}/${value.denom.toString()}`;
    }

    throw `unknown how to display the value`;
}

export function display(value: Value): string {
    if (value.type === "fraction") {
        const simplifiedFrac = simplifyFraction(value);
        return displayWithoutSimp(simplifiedFrac);
    }

    return displayWithoutSimp(value);
}

function gcd(a: bigint, b: bigint): bigint {
    if (b === 0n) return a;
    return gcd(b, a % b);
}

function simplifyFraction(frac: Fraction): Fraction | Integer {
    const divisor = gcd(frac.num, frac.denom);

    let num = frac.num / divisor;
    let denom = frac.denom / divisor;

    if (denom < 0n) {
        num = -num;
        denom = -denom;
    }

    if (denom === 1n) {
        return integer(num);
    }

    return fraction(num, denom);
}

function toFraction(value: Value): Fraction {
    if (value.type === "fraction") return value;

    if (value.type === "integer") return { type: "fraction", num: value.int, denom: 1n }

    if (value.type === "decimal") {
        const decStr = value.dec.toString();

        const afterDot = decStr.split(".")[1];
        /*
        BigDenary.toString() will output '1' in the case which input is '1.0'.
        */
        const afterDotLen = afterDot !== undefined ? afterDot.length : 0;

        const num = BigInt(decStr.replace(".", ""));
        const denom = BigInt(10 ** afterDotLen);

        const simplified = simplifyFraction({ type: "fraction", num, denom });
        return toFraction(simplified);
    }

    throw `cannot covert the value to a fraction`;
}

export function neg(value: Value): Value {
    if (value.type === "integer") return integer(-value.int);

    if (value.type === "decimal") return decimal(value.dec.neg());

    if (value.type === "fraction") return fraction(-value.num, value.denom);

    throw `cannot neg the value`;
}

export function plus(left: Value, right: Value): Value {
    if (left.type === "fraction" && right.type === "fraction") {
        const [a, b] = [left.num, left.denom];
        const [c, d] = [right.num, right.denom];
        return fraction(a * d + c * b, b * d);
    }

    return plus(toFraction(left), toFraction(right));
}

export function minus(left: Value, right: Value): Value {
    if (left.type === "fraction" && right.type === "fraction") {
        const [a, b] = [left.num, left.denom];
        const [c, d] = [right.num, right.denom];
        return fraction(a * d - c * b, b * d);
    }

    return minus(toFraction(left), toFraction(right));
}

export function multi(left: Value, right: Value): Value {
    if (left.type === "fraction" && right.type === "fraction") {
        const [a, b] = [left.num, left.denom];
        const [c, d] = [right.num, right.denom];
        return fraction(a * c, b * d);
    }

    return multi(toFraction(left), toFraction(right));
}

export function divide(left: Value, right: Value): Value {
    if (left.type === "fraction" && right.type === "fraction") {
        const [a, b] = [left.num, left.denom];
        const [c, d] = [right.num, right.denom];
        return fraction(a * d, b * c);
    }

    return divide(toFraction(left), toFraction(right));
}
