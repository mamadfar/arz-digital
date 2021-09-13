import {
    ref
} from '@vue/reactivity';

const getTodos = () => {
    const todos = ref([]);
    //* get data
    const getData = async () => {
        try {
            const {
                data
            } = await axios.get("http://localhost:3000/todos");
            todos.value = data;
        } catch (e) {
            console.log(e);
        }
    }
    return {
        todos,
        getData
    }
}

export default getTodos;