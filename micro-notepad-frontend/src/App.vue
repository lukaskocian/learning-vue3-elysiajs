<script setup lang="ts">
import { ref } from 'vue';
import { treaty } from '@elysiajs/eden';
import type { App, NoteTable } from '../../micro-notepad-backend/src/index';

// inicalization of client - connecting to backend
const client = treaty<App>('localhost:3000');

// memory for notes and text that will be shown
const notes_list = ref<NoteTable[]>([]);
const new_note_text = ref<string>("");

const downloadNotes = async () => {
    
    // see route 'notes.get()' from backend
    const data_from_backend = await client.notes.get();

    if (!data_from_backend.error) {
        notes_list.value = data_from_backend.data;
    }
};
downloadNotes();

// we dont have to put parameters, Vue has global memory - we can go straightly to new_note_text.value
const addNote = async () => {

    if (new_note_text.value === "") {
        return;
    }

    // "Single Sourse of Truth" - rule, that when we send something to backend, we clean
    // the variable in frontend and download it back from backend so the user always sees what
    // is stored in backend

    const response = await client.notes.post({content : new_note_text.value});

    if (response.error) {
        console.error("Chyba při ukládání: ", response.error);
        return;
    }

    new_note_text.value = "";
    downloadNotes();
}

</script>

<template>
  <main>

    <h1>Micro-Notepad</h1>
    
    <div>
      <input type="text" v-model="new_note_text"/>
      <button @click="addNote">Send</button>
    </div>

    <ul>
      <li v-for="note in notes_list">
        {{ note.content }}
      </li>
    </ul>

    

  </main>
</template>