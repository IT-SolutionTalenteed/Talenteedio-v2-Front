<template>
  <div class="wysiwyg-editor">
    <ckeditor
      :editor="editor"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :config="editorConfig"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])

const editor = ref(ClassicEditor)

const editorConfig = ref({
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    'link',
    'bulletedList',
    'numberedList',
    '|',
    'blockQuote',
    'insertTable',
    '|',
    'undo',
    'redo'
  ],
  language: 'fr',
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
  }
})
</script>

<style>
.wysiwyg-editor .ck-editor__editable {
  min-height: 300px;
}
</style>
