import { Bot } from "https://deno.land/x/grammy@v1.16.2/mod.ts";
import { calculate } from "./calc/calc.ts";

const token = await Deno.readTextFile("secret/bot_token.txt");
const bot = new Bot(token);

console.log("Bot started.");

bot.command(["start", "help"], async ctx => {
    const messageId = ctx.message?.message_id;
    await ctx.reply(
        `You can just send the expression you want to calculate to me `
        + `or use command <code>/calc ...</code>\n`
        + `Help:\n`
        + `  Available operations: <code>+</code> (plus), <code>-</code> (minus), <code>*</code> (multi), <code>/</code> (divide)\n`
        + `  Use parentheses <code>(</code> and <code>)</code> to increase priority\n`
        + `  Multiplication and division have higher priority than addition\n`
        + `  <code>0</code> before decimal separator can be omitted\n`
        + `Example:\n`
        + `  <code>.1 + .1 + .1</code>\n`
        + `  <code>(20 + 1) * 2</code>`, {
            reply_to_message_id: messageId,
            parse_mode: "HTML",
        });
});

bot.command("calc", async ctx => {
    const messageId = ctx.message?.message_id;
    const exprText = ctx.match;
    try {
        const result = calculate(exprText);
        await ctx.reply(`${result}`, {
            reply_to_message_id: messageId,
        });
    } catch (err) {
        await ctx.reply(`Error: ${err}`, {
            reply_to_message_id: messageId,
        });
    }
});

bot.on("message", async ctx => {
    const messageId = ctx.message.message_id;
    const text = ctx.message.text;
    try {
        if (text !== undefined) {
            const result = calculate(text);
            await ctx.reply(`${result}`, {
                reply_to_message_id: messageId,
            });
        } else throw `text is undefined`;
    } catch (err) {
        await ctx.reply(`Error: ${err}`, {
            reply_to_message_id: messageId,
        });
    }
});

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    console.error(err.error);
});

bot.start();
