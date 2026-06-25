<script setup lang="ts">
import { useMyNotesStore } from '../stores/notesStore';
import type { NoteTable } from '../../../micro-notepad-backend/src/index';

const store = useMyNotesStore();

// definice vstupních parametrů komponenty (Props)
defineProps<{ parm_note: NoteTable }>();
</script>

<template>

    <li>
        <div v-if="store.updated_note_id === parm_note.id">
            <input type="text" v-model="store.updated_text" />
            
            <button @click="store.updateNote">Save</button>
            
            <button @click="store.updated_note_id = undefined">Done</button>
        </div>

        <div v-else>
            <span>{{ parm_note.content }}</span>
            
            <button @click="store.startEditing(parm_note)">Edit</button>
            <button @click="store.deleteNote(parm_note.id)">Delete</button>

        </div>
    </li>

</template>