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
          <img src="../assets/images/icon-moon.svg" alt="dark mode" />
        </div>
        <div v-else>
          <img src="../assets/images/icon-sun.svg" alt="light mode" />
        </div>
      </div>
    </div>
    <!--//? END: todo header -->
    <Todos />
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import Todos from "../components/Todos.vue";
import { onMounted } from "@vue/runtime-core";

export default {
  name: "Home",
  components: {
    Todos,
  },
  
  setup() {
    const theme = ref("");

    onMounted(() => {
      // document.documentElement.style.setProperty('--background-color', '#000'); //* change the variable individualy
      let localTheme = localStorage.getItem("theme"); //* gets stored theme value if any
      document.documentElement.setAttribute("data-theme", localTheme); //* updates the data-theme attribute
    });

    //* change the theme from dark to light and vice versa
    const toggleTheme = () => {
      theme.value = theme.value == "darkMode" ? "" : "darkMode"; //* toggles theme value
      document.documentElement.setAttribute("data-theme", theme.value); //* sets the data-theme attribute to html tag
      localStorage.setItem("theme", theme.value); //* stores theme value on local storage
    };
    return {
      theme,
      toggleTheme,
    };
  },
};
</script>
