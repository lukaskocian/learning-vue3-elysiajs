<script setup lang="ts">
import { useMyNotesStore } from '../stores/notesStore';
import type { NoteTable } from '../../../micro-notepad-backend/src/index';

const store = useMyNotesStore();

// definice vstupních parametrů komponenty (Props)
defineProps<{ parm_note: NoteTable }>();
</script>

<template>
    <li class="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">

        <div v-if="store.updated_note_id === parm_note.id" class="flex gap-2">
            <input 
              type="text" 
              v-model="store.updated_text" 
              class="flex-1 border border-blue-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button @click="store.updateNote" class="bg-green-500 text-white px-4 py-2 rounded font-medium hover:bg-green-600 transition">Save</button>
            <button @click="store.updated_note_id = undefined" class="bg-gray-300 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-400 transition">Cancel</button>
        </div>

        <div v-else class="flex justify-between items-center">
            
            <span class="text-gray-800 text-lg">{{ parm_note.content }}</span>
            
            <div class="flex gap-2">
                <button 
                  @click="store.startEditing(parm_note)" 
                  class="bg-indigo-100 text-indigo-700 px-4 py-2 rounded text-sm font-semibold hover:bg-indigo-200 transition"
                >
                  Edit
                </button>
                <button 
                  @click="store.deleteNote(parm_note.id)" 
                  class="bg-red-100 text-red-700 px-4 py-2 rounded text-sm font-semibold hover:bg-red-200 transition"
                >
                  Delete
                </button>
            </div>

        </div>

    </li>
</template>