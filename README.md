# Micro Notepad

My first weekend project in fullstack. 

It's a simple notepad application with ability to translate notes to any language.

## What I used
- **Backend:** ElysiaJS (running on Bun), notes are stored in PostgreSQL DB running on cloud (Neon.com), for communication with DB we use Prisma, OpenAI API is used for translation
- **Frontend:** Vue 3, we use Pinia stores to organize frontendfiles for memory and logic
- **Connection:** Eden Treaty (shares types from the backend straight to the frontend)

## How to run it
You need to have Bun installed. Then open two terminals:

1. In the first one, go to the `micro-notepad-backend` folder, run `bun install`, and start it with `bun run dev`.
2. In the second one, navigate to `micro-notepad-frontend`, also run `bun install`, and then `bun run dev`.
3. Setup OpenAI api and Neon DB URL in micro-notepad-backend/.env

The app will then be running in your browser at the address that pops up in the frontend terminal.
