<template>
  <form @submit.prevent="addTodo">
    <div class="new-todo">
      <button>
        <span class="circle"></span>
      </button>
      <input type="text" placeholder="Create a new todo..." :value="title" @input="$emit('update:title', $event.target.value)" />
      <input type="date" class="ml-auto" :value="date" @input="$emit('update:date', $event.target.value)" />
    </div>
  </form>
</template>

<script>
export default {
    name: "SingleTodo",
    props: ["addTodo", "title", "date"],
    emits: ["update:title", "update:date"],
setup() {
}
};
</script>

<style>
</style>