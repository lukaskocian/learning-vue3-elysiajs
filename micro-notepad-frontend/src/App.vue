<script setup lang="ts">
import { useMyNotesStore } from './stores/notesStore';
import NItem from './components/NItem.vue'

const store = useMyNotesStore();
store.downloadNotes();

</script>

<template>
  <main>
    <h1>Notepad</h1>
    
    <div>
      <input type="text" v-model="store.new_note_text"/>
      <button @click="store.addNote">Send</button>
    </div>

    <ul>
        <NItem
            v-for="note in store.notes_list" 
            :key="note.id" 
            :parm_note="note"
        />
    </ul>

  </main>
</template>