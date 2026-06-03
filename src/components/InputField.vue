<script setup>
defineProps({
  label: String,
  name: String,
  type: { type: String, default: 'text' },
  modelValue: [String, Number],
  error: String,
  step: String
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="form-group">
    <label :for="name">{{ label }}:</label>
    <input
      :id="name"
      :type="type"
      :step="step"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :class="{ 'input-error': error }"
    />
    <span class="error-msg" v-if="error">{{ error }}</span>
  </div>
</template>

<style scoped>
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: bold; color: #555;}
input { width: 100%; padding: 10px; box-sizing: border-box; border-radius: 4px; border: 1px solid #ccc; font-family: inherit; transition: 0.3s;}
.input-error { border-color: #f44336; background-color: #fff8f8; }
.error-msg { color: #f44336; font-size: 0.85rem; font-weight: bold; margin-top: 4px; display: block; }
</style>