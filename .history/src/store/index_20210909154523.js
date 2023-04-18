import { createStore } from 'vuex'

export default createStore({
  state: {
    todos: [
      {
        id: Math.random() * 9999999,
        title: "mamad",
        description: "hastam",
        status: "waiting"
      }
    ]
  },
  mutations: {
    handleAddNewTodo(state, newTodo) {
      state.todos = [...state.todos, newTodo];
    },
    handleFilterTodos(state, filteredTodos) {
      state.todos = filteredTodos
    }
  },
  actions: {
  },
  modules: {
  }
})
