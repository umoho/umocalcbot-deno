import { Bot } from "https://deno.land/x/grammy@v1.16.2/mod.ts";
import { calculate } from "./calc/calc.ts";

const token = await Deno.readTextFile("secret/bot_token.txt");
const bot = new Bot(token);

console.log("Bot started.");

const helpText = await Deno.readTextFile("help_message_en.txt");

bot.command(["start", "help"], async ctx => {
    const messageId = ctx.message?.message_id;
    await ctx.reply(helpText, {
            reply_to_message_id: messageId,
            parse_mode: "HTML",
    });
});

bot.command(["c", "calc", "calculate"], async ctx => {
    const messageId = ctx.message?.message_id;
    const exprText = ctx.match;
    try {
        const result = calculate(exprText);
        await ctx.reply(`${result}`, {
            reply_to_message_id: messageId,
        });
    } catch (err) {
        console.error(`Error: ${err}`);
        await ctx.reply(`Error: ${err}`, {
            reply_to_message_id: messageId,
        });
    }
});

bot.on("msg:text", async ctx => {
    const messageId = ctx.message?.message_id;
    const text = ctx.message?.text;
    try {
        if (text !== undefined) {
            const result = calculate(text);
            await ctx.reply(`${result}`, {
                reply_to_message_id: messageId,
            });
        } else throw `text is undefined`;
    } catch (err) {
        console.error(`Error: ${err}`);
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
