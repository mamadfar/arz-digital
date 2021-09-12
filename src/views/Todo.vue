<template>
  <div class="container">
    <!--//! START: todo header -->
    <div class="todo-header">
      <h1>Todo</h1>
      <div
          class="cursor-pointer"
          @click="toggleTheme"
          aria-label="Toggle themes"
      >
        <div v-if="theme !== 'darkMode'">
          <img src="../assets/images/icon-moon.svg" alt="dark mode"/>
        </div>
        <div v-else>
          <img src="../assets/images/icon-sun.svg" alt="light mode"/>
        </div>
      </div>
    </div>
    <!--//? END: todo header -->
    <!--//! START: new todo form -->
    <form @submit.prevent="addTodo">
      <div class="new-todo">
        <button>
          <span class="circle"></span>
        </button>
        <input type="text" placeholder="Create a new todo..." v-model="title"/>
      </div>
    </form>
    <!--//? END: new todo form -->

    <ul class="todos-list">
      <li v-for="todo in todos" :key="todo.id" v-if="todos.length > 0">
        <div>
          <button v-if="todo.status === 'completed'" class="completed" @click="handleChangeStatus(todo.id, false)">
            <span class="checked">
                <img src="../assets/images/icon-check.svg" alt="Completed">
            </span>
          </button>
          <button v-else @click="handleChangeStatus(todo.id, true)">
            <span class="circle"></span>
          </button>
        </div>
        <p :class="[todo.status === 'active' ? 'active' : 'completed']">
          {{ todo.title }}
        </p>
        <button @click="removeTodo(todo.id)" class="remove-todo">
          <img src="../assets/images/icon-cross.svg" alt="Delete">
        </button>
      </li>
      <li v-else>
        <p>Your Great !</p>
      </li>
      <li>
        <div class="command-palette">
          <div>
            <small>{{ todos.filter((todo) => todo.status === "active").length }} items left</small>
          </div>
          <div>
            <label for="all" class="cursor-pointer filter-style" @click="filterTodos('')">
              <input style="visibility: hidden; opacity: 0; position: absolute" id="all" type="radio" name="filter"
                     checked/>
              <span>All</span>
            </label>
            <label for="active" class="cursor-pointer filter-style" @click="filterTodos('active')">
              <input style="visibility: hidden; opacity: 0; position: absolute" id="active" type="radio" name="filter"/>
              <span>Active</span>
            </label>
            <label for="completed" class="cursor-pointer filter-style" @click="filterTodos('completed')">
              <input style="visibility: hidden; opacity: 0; position: absolute" id="completed" type="radio"
                     name="filter"/>
              <span>Completed</span>
            </label>
          </div>
          <div>
            <button class="cursor-pointer" @click="clearCompletedStatus()">Clear Completed</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {ref, reactive, computed} from "@vue/reactivity";
import {watch, watchEffect} from "@vue/runtime-core";
import axios from "axios";

export default {
  name: "Home",
  components: {},
  setup() {
    const todos = ref([]);
    const title = ref(null);
    // const description = ref(null);
    const status = ref("active");
    const theme = ref("");

    watchEffect(async () => {
      let localTheme = localStorage.getItem("theme"); //gets stored theme value if any
      document.documentElement.setAttribute("data-theme", localTheme); // updates the data-theme attribute
      try {
        const {data} = await axios.get("http://localhost:3000/todos");
        todos.value = data;
      } catch (e) {
        console.log(e);
      }
    });

    const addTodo = async () => {
      try {
        const {data} = await axios.post("http://localhost:3000/todos", {
          id: Math.random() * 99999999,
          title: title.value,
          // description: description.value,
          status: status.value,
        });
        todos.value = [...todos.value, data];
        title.value = "";
        // description.value = "";
      } catch (e) {
        console.log(e);
      }
      // const response = await fetch("http://localhost:3000/todos", {
      //   method: 'POST',
      //   mode: 'cors',
      //   cache: 'no-cache',
      //   credentials: 'same-origin',
      //   headers: {
      //     'Content-Type': 'application/json'
      //     // 'Content-Type': 'application/x-www-form-urlencoded',
      //   },
      //   body: JSON.stringify({
      //     id: Math.random() * 99999999,
      //     title: title.value,
      //     description: description.value,
      //     status: status.value
      //   })
      // })
      // todos.value = [...todos.value, response]
      // console.log(response)
    };

    const removeTodo = async (id) => {
      try {
        const {status} = await axios.delete(
            `http://localhost:3000/todos/${id}`
        );
        todos.value = todos.value.filter((todo) => todo.id !== id);
      } catch (e) {
        console.log(e);
      }
      // const response = await fetch(`http://localhost:3000/todos/${id}`, {
      //   method: 'DELETE',
      //   mode: 'cors',
      //   cache: 'no-cache',
      //   credentials: 'same-origin',
      //   headers: {
      //     'Content-Type': 'application/json'
      //     // 'Content-Type': 'application/x-www-form-urlencoded',
      //   }
      // })
      // return [...todos.value, response.json()]
    };

    const handleChangeStatus = async (id, isCompleted) => {
      try {
        const {data} = await axios.patch(
            `http://localhost:3000/todos/${id}`,
            {status: isCompleted ? "completed" : "active"}
        );
        let todo = todos.value.find((todo) => todo.id === id);
        todo.status = isCompleted ? "completed" : "active";
        // todos.value = [...todos.value, data]
      } catch (e) {
        console.log(e);
      }
    };

    const filterTodos = async (status) => {
      try {
        const {data} = await axios.get(
            `http://localhost:3000/todos${status ? `?status=${status}` : ""}`
        );
        todos.value = data;
      } catch (e) {
        console.log(e);
      }
    };

    const clearCompletedStatus = async () => {
      try {
        let reqs = [];
        todos.value.filter((todo) => {
          if (todo.status === "completed") {
            reqs.push(axios.delete(`http://localhost:3000/todos/${todo.id}`));
          }
        });
        const {status} = await axios.all(reqs);
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

    const toggleTheme = () => {
      theme.value = theme.value == "darkMode" ? "" : "darkMode"; //toggles theme value
      document.documentElement.setAttribute("data-theme", theme.value); // sets the data-theme attribute
      localStorage.setItem("theme", theme.value); // stores theme value on local storage
    };

    return {
      todos,
      title,
      // description,
      status,
      addTodo,
      removeTodo,
      handleChangeStatus,
      filterTodos,
      clearCompletedStatus,
      theme,
      toggleTheme,
    };
  },
};
</script>
