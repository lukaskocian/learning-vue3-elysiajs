import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const connectionString = `${process.env.DATABASE_URL}`;
const openai = new OpenAI()

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter }); // vytvoření socketu

const TranslationFormat = z.object({
    translated_text: z.string(),
});

const getPrompt = (language : string, text_to_translate : string) : string => {

    return `Translate this text:\n${text_to_translate}\nto language ${language}. If the language you are translating from is same as language you are translating to, just rewrite it the same way.`;
}

const app = new Elysia()
    .use(cors())

    // zdroj info o syntaxe Prismy: https://www.prisma.io/docs/orm/prisma-client/queries/crud

    // READ
    .get("/notes", async () => {

        return await prisma.noteTable.findMany({
            orderBy: { createdAt: "asc" }
        });
    })

    // CREATE
    .post("/notes", async ({body}) => { 
        // {body} je destructuring většího objektu Context, který obsahuje info o socketu, body, atd..
        /*
        takhle vypadá struktura objektu Context
        Context {
            body,     // Zde je JSON text od klienta
            params,   // Zde jsou vytažené proměnné z URL
            headers,  // Zde jsou HTTP hlavičky
            request_id,
        }
        */

        // vytvoříme novou poznámku
        const new_note = await prisma.noteTable.create({
            data: {
                // id (náš primární klíč) je autom.-generovaný
                content : body.content,
            },
        })

        return new_note;
    }, {
        // 3. parametr - kontroluje jestli klint posílá správné datové typy (VSTUP) - pokud ne - navrátí e. 404
        body : t.Object({
            content : t.String()
        })
    })

    // UPDATE
    .put("/notes/:id", async ({params, body}) => {

        const updatedNote = await prisma.noteTable.update({
            where: { id: params.id },
            data: { content: body.content },
        })

        return updatedNote;

    } , {
        // je vstupní parametr (id) číslo a nový obsah string?
        params : t.Object({
            id : t.Numeric()
        }),

        body : t.Object({
            content : t.String()
        })
    })

    // DELETE
    .delete("/notes/:id", async ({params}) => { // Elysia parsovaný string (:id) automaticky zabalí do objektu params

        const deletedNote = await prisma.noteTable.delete({
            where: { id: params.id }
        })

        return deletedNote;

    } , {
        params : t.Object({
            id : t.Numeric()
        })
    })

    // TRANSLATE NOTE
    .put("notes/translate/:id", async ({params, body}) => {

        // find in db
        const noteToTranslate = await prisma.noteTable.findUnique({
             where: { id: params.id } 
        });

        if (!noteToTranslate) {
            return { error: "Note id not found in DB"}
        };

        // translate with OpenAI LLM
        const response = await openai.responses.parse({
            model: "gpt-5.4-mini",
            input: [
                { role: "system", content: "You are a professional translator. Translate the given text to the requested language. Do not add any notes." },
                { role: "user", content: getPrompt(body.language, noteToTranslate.content)}
            ],
            text: {
                format: zodTextFormat(TranslationFormat, "translation_response"), // the name is for openai cache
            },
        });

        const result = response.output_parsed;
        if (!result) {
            return;
        }        

        // save back to DB
        const translatedNote = await prisma.noteTable.update({
            where: { id: params.id },
            data: { content: result?.translated_text },
        })

        return translatedNote;


    } , {
        params : t.Object({
            id : t.Numeric()
        }),

        body : t.Object({
            language : t.String()
        })
    })


    .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

/*
udělat post (ze strany klienta) z terminálu

curl -X POST http://localhost:3000/notes \
     -H "Content-Type: application/json" \
     -d '{"content": "Moje první poznámka z terminálu!"}
*/

export type App = typeof app;
// v "@prisma/client" je vygenerovaný (pomocí schema.prisma - 'bunx prisma generate') TS hlavičkový sobour obsahujicí inteface NoteTable
export type { NoteTable } from "@prisma/client";
