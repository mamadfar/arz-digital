<template>
  <!--//! START: new todo form -->
  <SingleTodo
    :addTodo="addTodo"
    :title="title"
    @update:title="title = $event"
    :date="date"
    @update:date="date = $event"
  />
  <!--//? END: new todo form -->

  <ul class="todos-list">
    <li v-for="todo in todos" :key="todo.id" v-if="todos.length > 0">
      <div>
        <button
          v-if="todo.status === 'completed'"
          class="completed"
          @click="handleChangeStatus(todo.id, false)"
        >
          <span class="checked">
            <img src="../assets/images/icon-check.svg" alt="Completed" />
          </span>
        </button>
        <button v-else @click="handleChangeStatus(todo.id, true)">
          <span class="circle"></span>
        </button>
      </div>
      <p :class="[todo.status === 'active' ? 'active' : 'completed']">
        {{ todo.title }}
      </p>
      <p :class="[todo.status === 'active' ? 'active ml-auto' : 'completed ml-auto']">
        {{ todo.date }}
      </p>
      <button @click="removeTodo(todo.id)" class="remove-todo">
        <img src="../assets/images/icon-cross.svg" alt="Delete" />
      </button>
    </li>
    <li v-else>
      <p>Your Great !</p>
    </li>
    <li>
      <div class="todo-footer">
        <div>
          <small
            >{{ todos.filter((todo) => todo.status === "active").length }} items
            left</small
          >
        </div>
        <!-- //! START: desktop filter section -->
        <div class="desktop-filters">
          <label
            for="all"
            class="cursor-pointer filter-style"
            @click="filterTodos('')"
          >
            <input
              style="visibility: hidden; opacity: 0; position: absolute"
              id="all"
              type="radio"
              name="filter"
              checked
            />
            <span>All</span>
          </label>
          <label
            for="active"
            class="cursor-pointer filter-style"
            @click="filterTodos('active')"
          >
            <input
              style="visibility: hidden; opacity: 0; position: absolute"
              id="active"
              type="radio"
              name="filter"
            />
            <span>Active</span>
          </label>
          <label
            for="completed"
            class="cursor-pointer filter-style"
            @click="filterTodos('completed')"
          >
            <input
              style="visibility: hidden; opacity: 0; position: absolute"
              id="completed"
              type="radio"
              name="filter"
            />
            <span>Completed</span>
          </label>
        </div>
        <!-- //? END: desktop filter section -->
        <div>
          <button class="cursor-pointer" @click="clearCompletedStatus()">
            Clear Completed
          </button>
        </div>
      </div>
    </li>
  </ul>
  <!-- //! START: mobile filter section -->
  <div class="mobile-filters">
    <label
      for="all-m"
      class="cursor-pointer filter-style"
      @click="filterTodos('')"
    >
      <input
        style="visibility: hidden; opacity: 0; position: absolute"
        id="all-m"
        type="radio"
        name="filter-m"
        checked
      />
      <span>All</span>
    </label>
    <label
      for="active-m"
      class="cursor-pointer filter-style"
      @click="filterTodos('active')"
    >
      <input
        style="visibility: hidden; opacity: 0; position: absolute"
        id="active-m"
        type="radio"
        name="filter-m"
      />
      <span>Active</span>
    </label>
    <label
      for="completed-m"
      class="cursor-pointer filter-style"
      @click="filterTodos('completed')"
    >
      <input
        style="visibility: hidden; opacity: 0; position: absolute"
        id="completed-m"
        type="radio"
        name="filter-m"
      />
      <span>Completed</span>
    </label>
  </div>
  <!-- //? END: mobile filter section -->
</template>

<script>
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import axios from "axios";
import SingleTodo from "@/components/SingleTodo.vue";
export default {
  name: "Todos",
  components: {
    SingleTodo,
  },
  setup() {
    const todos = ref([]);
    const title = ref("");
    const date = ref("");
    const status = ref("active");

    onMounted(async () => {
      //* get data
      try {
        const { data } = await axios.get("http://localhost:3000/todos");
        todos.value = data;
      } catch (e) {
        console.log(e);
      }
    });

    //* add new todo
    const addTodo = async () => {
      try {
        const { data } = await axios.post("http://localhost:3000/todos", {
          id: Math.random() * 99999999,
          title: title.value,
          date: date.value,
          status: status.value,
        });
        todos.value = [...todos.value, data];
        title.value = "";
        date.value = "";
      } catch (e) {
        console.log(e);
      }
    };

    //* remove todo
    const removeTodo = async (id) => {
      try {
        const { status } = await axios.delete(
          `http://localhost:3000/todos/${id}`
        );
        todos.value = todos.value.filter((todo) => todo.id !== id);
      } catch (e) {
        console.log(e);
      }
    };

    //* change the status of the todo to completed or active
    const handleChangeStatus = async (id, isCompleted) => {
      try {
        const { data } = await axios.patch(
          `http://localhost:3000/todos/${id}`,
          { status: isCompleted ? "completed" : "active" }
        );
        let todo = todos.value.find((todo) => todo.id === id);
        todo.status = isCompleted ? "completed" : "active";
        // todos.value = [...todos.value, data]
      } catch (e) {
        console.log(e);
      }
    };

    //* filter todos based on completed, active or all status
    const filterTodos = async (status) => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/todos${status ? `?status=${status}` : ""}`
        );
        todos.value = data;
      } catch (e) {
        console.log(e);
      }
    };

    //* clear all completed todo
    const clearCompletedStatus = async () => {
      try {
        let reqs = [];
        todos.value.filter((todo) => {
          if (todo.status === "completed") {
            reqs.push(axios.delete(`http://localhost:3000/todos/${todo.id}`));
          }
        });
        const { status } = await axios.all(reqs);
        // if (status === 200) {
        todos.value = todos.value.filter((todo) => todo.status !== "completed");
        // }
        // todos.value = data
        // todos.value.filter(async todo => {
        //   if (todo.status === "completed") {
        //     const {data} = await axios.delete(`http://localhost:3000/todos/${todo.id}`);
        //     todos.value = todos.value.filter(item => item.id !== todo.id)
        //   }
        // })
      } catch (e) {
        console.log(e);
      }
    };

    return {
      todos,
      removeTodo,
      handleChangeStatus,
      filterTodos,
      clearCompletedStatus,
      addTodo,
      title,
      date,
    };
  },
};
</script>

<style>
</style>