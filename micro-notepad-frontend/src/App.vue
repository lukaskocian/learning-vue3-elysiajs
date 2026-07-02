<script setup lang="ts">
import { useMyNotesStore } from './stores/notesStore';
import NItem from './components/NItem.vue'

const store = useMyNotesStore();
store.downloadNotes();

</script>

<template>
  <main class="max-w-2xl mx-auto p-6 mt-12 bg-white rounded-xl shadow-lg border border-gray-100">

    <h1 class="text-4xl font-bold text-blue-600 mb-8 text-center tracking-tight">Notepad</h1>
    
    <div class="flex mb-8 shadow-sm rounded-lg overflow-hidden">
      <input 
        type="text" 
        v-model="store.new_note_text"
        placeholder="Write new message..."
        @keyup.enter="store.addNote" 
        class="flex-1 bg-gray-50 border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
      />
      <button 
        @click="store.addNote"
        class="bg-blue-600 text-white font-semibold px-8 py-4 hover:bg-blue-700 transition-colors"
      >
        Send
      </button>
    </div>

    <div class="flex mb-8 shadow-sm rounded-lg overflow-hidden border border-gray-300">
      
      <div class="flex items-center bg-gray-100 text-gray-700 px-4 font-medium border-r border-gray-300">
        Translate to:
      </div>

      <input 
        type="text" 
        v-model="store.language_translate_to"
        class="flex-1 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
      />
      
    </div>

    <ul class="space-y-3">
        <NItem
            v-for="note in store.notes_list" 
            :key="note.id" 
            :parm_note="note"
        />
    </ul>

  </main>
</template>