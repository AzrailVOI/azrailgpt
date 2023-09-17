import OpenAI from "openai";
import config from 'config'
import {createReadStream} from "fs";

class Openai{
    constructor(apiKey) {
        this.openai = new OpenAI({
            apiKey
        });
    }

    chat(){

    }

    async transcription(filePath){
        try {
            const response = await this.openai.audio.transcriptions.create({
                file: createReadStream(filePath),
                model: "whisper-1"
            }
            )
            console.log("TRANSCRIPTION: ",response.text)
            return response.text
        }
        catch (e) {
            console.log(e)
        }
    }

}

export const openai = new Openai(config.get('OPENAI_KEY'))
