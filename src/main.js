import {Telegraf} from "telegraf";
import config from "config";
import {message} from "telegraf/filters";
import {ogg} from './ogg.js'
import {openai} from "./openai.js";

const bot = new Telegraf(config.get("TELEGRAM_TOKEN"))

bot.on(message('voice'), async ctx => {
    try {
        // await ctx.reply(JSON.stringify(ctx.message.voice, null, 2))
        const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
        const userId = String(ctx.message.from.id)
        // console.log(link.href)
        const oggPath = await ogg.create(link.href, userId)
        const mp3Path = await ogg.toMp3(oggPath, userId)

        const text = await openai.transcription(mp3Path)
        const response = await openai.chat(text)
        await ctx.reply(response.message)
    }catch (e) {
        console.log(e)
    }
})

bot.command('start', async ctx => {
    await ctx.reply('Hi!')
})

bot.launch()


process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

console.log('Server Starts...')
