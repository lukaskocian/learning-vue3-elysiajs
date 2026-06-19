import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";

export interface Note {
    id : number,
    content : string,
}

const notes : Note[] = [];

const app = new Elysia()
    .use(cors())
    .get("/", () => "Hello Elysiaaaa")
    .get("/notes", () => {

        return notes;
    })

    .post("/notes", ({body}) : Note => { // {body} je destructuring většího objektu Context, který obsahuje info o socketu, body, atd..

        // vytvoříme novou poznámku
        const new_note : Note = {
            id : notes.length,
            content : body.content,
        };

        notes.push(new_note);
        return new_note;
    }, {
        // 3. parametr - kontroluje jestli klint posílá správné datové typy - pokud ne - navrátí e. 404
        body : t.Object({
            content : t.String()
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