import { Bot } from "https://deno.land/x/grammy@v1.16.2/mod.ts";
import { calculate } from "./calc/calc.ts";

const token = await Deno.readTextFile("secret/bot_token.txt");
const bot = new Bot(token);

console.log("Bot started.");

bot.on("message", async ctx => {
    const messageId = ctx.message.message_id;
    const text = ctx.message.text;
    try {
        const result = calculate(text);
        await ctx.reply(`${result}`, {
            reply_to_message_id: messageId,
        });
    } catch (err) {
        await ctx.reply(`Error: ${err}`);
    }
});

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    console.error(err.error);
});

bot.start();
