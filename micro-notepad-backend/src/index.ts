import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter }); // vytvoření socketu

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