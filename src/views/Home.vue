<template>
  <div class="home">
    <div v-if="todos.length > 0">{{ todos.filter(todo => todo.status === "waiting").length }} items left</div>
    <form @submit.prevent="addTodo">
      <input type="text" v-model="title">
      <textarea name="" id="" cols="30" rows="10" v-model="description"></textarea>
      <button>add</button>
    </form>
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <div v-if="todo.status === 'waiting'">
          <button @click="handleChangeStatus(todo.id, true)">complete</button>
        </div>
        <div v-else>
          <button @click="handleChangeStatus(todo.id, false)">todo</button>
        </div>
        <button @click="removeTodo(todo.id)">remove</button>
        <h4 :class="[todo.status === 'waiting' ? 'waiting' : 'completed']">{{ todo.title }}</h4>
        <p>{{ todo.description }}</p>
        <p>{{ todo.status }}</p>
      </li>
    </ul>
    <div v-if="todos.length">
      <button @click="filterTodos('completed')">completed</button>
      <button @click="filterTodos('waiting')">waiting</button>
      <button @click="filterTodos('')">all</button>
    </div>
    <button @click="clearCompletedStatus()">remove all completed todo</button>
  </div>
</template>

<script>

import {ref, reactive, computed} from "@vue/reactivity";
import {watch, watchEffect} from '@vue/runtime-core';
import axios from 'axios';

export default {
  name: 'Home',
  components: {},
  setup() {
    const todos = ref([]);
    const title = ref(null);
    const description = ref(null);
    const status = ref("waiting")

    watchEffect(async () => {
      try {
        const {data} = await axios.get("http://localhost:3000/todos");
        todos.value = data
      } catch (e) {
        console.log(e)
      }
    })

    const addTodo = async () => {
      try {
        const {data} = await axios.post("http://localhost:3000/todos", {
          id: Math.random() * 99999999,
          title: title.value,
          description: description.value,
          status: status.value
        });
        todos.value = [...todos.value, data];
        title.value = "";
        description.value = ""
      } catch (e) {
        console.log(e)
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
    }

    const removeTodo = async (id) => {
      try {
        const {status} = await axios.delete(`http://localhost:3000/todos/${id}`);
        todos.value = todos.value.filter(todo => todo.id !== id)
      } catch (e) {
        console.log(e)
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
    }

    const handleChangeStatus = async (id, isCompleted) => {
      try {
        const {data} = await axios.patch(`http://localhost:3000/todos/${id}`, {status: isCompleted ? "completed" : "waiting"});
        let todo = todos.value.find(todo => todo.id === id);
        todo.status = isCompleted ? "completed" : "waiting"
        // todos.value = [...todos.value, data]
      } catch (e) {
        console.log(e)
      }
    }

    const filterTodos = async (status) => {
      try {
        const {data} = await axios.get(`http://localhost:3000/todos${status ? `?status=${status}` : ""}`);
        todos.value = data
      } catch (e) {
        console.log(e)
      }
    }

    const clearCompletedStatus = async () => {
      try {
        let reqs = []
        todos.value.filter(todo => {
          if (todo.status === "completed") {
            reqs.push(axios.delete(`http://localhost:3000/todos/${todo.id}`))
          }
        })
        const {status} = await axios.all(reqs);
        if (status === 200) {
          todos.value = todos.value.filter(todo => todo.status !== "completed")
        }
        // todos.value = data
        // todos.value.filter(async todo => {
        //   if (todo.status === "completed") {
        //     const {data} = await axios.delete(`http://localhost:3000/todos/${todo.id}`);
        //     todos.value = todos.value.filter(item => item.id !== todo.id)
        //   }
        // })
      } catch (e) {
        console.log(e)
      }
    }


    return {
      todos,
      title,
      description,
      status,
      addTodo,
      removeTodo,
      handleChangeStatus,
      filterTodos,
      clearCompletedStatus
    }
  },
}
</script>

<style lang="scss">
.waiting {
  color: red;
}

.completed {
  text-decoration: line-through;
}
</style>
