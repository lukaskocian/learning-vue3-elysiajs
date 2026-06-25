import { defineStore } from 'pinia';

import { ref } from 'vue';
import { treaty } from '@elysiajs/eden';
import type { App, NoteTable } from '../../../micro-notepad-backend/src/index';

export const useMyNotesStore = defineStore('notes_hash_key', () => {

    // inicalization of client - connecting to backend
    const client = treaty<App>('localhost:3000');

    // memory for notes and text that will be shown
    const notes_list = ref<NoteTable[]>([]);
    const new_note_text = ref<string>("");
    const updated_text = ref<string>();
    const updated_note_id = ref<number>();

    const downloadNotes = async () => {
        
        // see route 'notes.get()' from backend
        const data_from_backend = await client.notes.get();

        if (data_from_backend.error) {
            console.error("Error while reading: ", data_from_backend.error);
            return;
        }

        notes_list.value = data_from_backend.data;
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
            console.error("Error while posting: ", response.error);
            return;
        }

        new_note_text.value = "";
        downloadNotes();
    }

    const updateNote = async () => {

        if (updated_text.value === undefined || updated_note_id.value === undefined) {
            return;
        }

        const response = await client.notes({id : String(updated_note_id.value)}).put({content : updated_text.value})

        if (response.error) {
            console.error("Error while updating: ", response.error);
            return;
        }

        updated_note_id.value = undefined;
        updated_text.value = "";
        downloadNotes();
    }

    const deleteNote = async (id_to_delete : number) => {

        const response = await client.notes({id : String(id_to_delete)}).delete();

        if (response.error) {
            console.error("Error while deleting: ", response.error);
            return;
        }

        downloadNotes();
    }

    const startEditing = (note_to_be_edited : NoteTable) => {
        updated_text.value = note_to_be_edited.content;
        updated_note_id.value = note_to_be_edited.id;
    }

    return {
        notes_list,
        new_note_text,
        updated_text,
        updated_note_id,
        downloadNotes,
        addNote,
        updateNote,
        deleteNote,
        startEditing
    };
})