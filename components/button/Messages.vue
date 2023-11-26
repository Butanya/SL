<template>
  <div class="header">
    <h1>{{ header }}</h1>
    <button v-if="editing" class="btn btn-cancel" @click="doEdit(false)">Cancel</button>
    <button v-else class="btn btn-primary" style="margin-left: 40px;" @click="doEdit(true)">
      Add Item
    </button>
  </div>

  <form v-if="editing" class="add-item-form" @submit.prevent="saveItem">
    <input
      v-model.trim="newItem"
      placeholder="Add something"
      type="text"
    >
    <button :disabled="newItem.length < 1" class="btn btn-primary">
      Save Item
    </button>
  </form>

  <ul>
    <li
      v-for="(item, index) in reversedItems"
      :key="item.id"
      class="static-class"
      @click="togglePurchased(item)"
    >
      <span v-if="item.purchased" class="erase-icon">
        <span class="erase-cross" @click="eraseItem(item)">❌</span>
        <span class="erase-text">{{ item.label }}</span>
      </span>
      <span v-else>{{ item.label }}</span>
    </li>
  </ul>

  <p v-if="!items.length">
    Nothing to see here
  </p>
</template>

<script setup>
import { computed, ref, watchEffect } from "vue"

const header = ref("Shopping List App")
const editing = ref(false)
const reversedItems = computed(() => [...items.value].reverse())
const newItem = ref("")

onMounted(() => {
  items.value = loadItems(); // Load items once the component is mounted on the client side
})

const loadItems = () => {
  // Ensure this code runs only on the client-side
  if (typeof window !== "undefined") {
    return JSON.parse(window.localStorage.getItem('shoppingItems')) || [];
  }
  return [];
}

const items = ref(loadItems())

watchEffect(() => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem('shoppingItems', JSON.stringify(items.value));
  }
})

const saveItem = () => {
  items.value.push({
    id: items.value.length + 1,
    label: newItem.value,
    purchased: false,
  })
  newItem.value = ""
}

const doEdit = (e) => {
  editing.value = e
  newItem.value = ""
}

const togglePurchased = (item) => {
  item.purchased = !item.purchased
}

const eraseItem = (item) => {
  const index = items.value.indexOf(item)
  if (index !== -1) {
    items.value.splice(index, 1)
  }
}
</script>

<style>
body {
  background: #ffefc1;
  height: 100vh;
  width: 100vw;
  font-family: system-ui, BlinkMacSystemFont, -apple-system, Segoe UI, Roboto,
  Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
}

.counter {
  font-size: 0.8rem;
  padding-left: 10px;
  padding-right: 10px;
}

#shopping-list {
  background: #fff;
  padding: 2rem;
  margin: 1rem;
  border-radius: 3px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08);
  width: 95%;
  max-width: 900px;
}

h1 {
  color: #67798a;
}

ul {
  list-style: none;
  padding: 0;
}

a {
  color: #a9d695;
  font-size: 1.25rem;
  transition: all 0.1s ease-in;
  margin-top: 0.5rem;
  display: block;
}

a:hover {
  color: #a9d695;
}

li,
p {
  display: flex;
  align-items: center;
  line-height: 1.75;
  letter-spacing: 0.5px;
  color: #667a8a;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.1s ease-in;
}

li:hover {
  color: #667a8a;
}

li input {
  margin: 0 0.5rem 0;
}

#shopping-list > input,
#shopping-list > select {
  width: 100%;
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f8;
  color: #606f7b;
  padding: 0.5rem 0.75rem;
  box-sizing: border-box;
  font-size: 1rem;
  letter-spacing: 0.5px;
  margin: 0.5rem 0;
}

.add-item-form,
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.add-item-form input {
  width: 70%;
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f8;
  color: #667a8a;
  padding: 0.5rem 0.75rem;
  box-sizing: border-box;
  font-size: 1rem;
  letter-spacing: 0.5px;
  margin: 0.5rem 0;
}

.btn {
  border: none;
  border-radius: 3px;
  margin: auto 0;
  padding: 0.5rem 0.75rem;
  flex-shrink: 0;
  cursor: pointer;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  transition: all 0.1s ease-in;
}

.btn[disabled] {
  background: #a9d695;
}

.btn[disabled]:hover {
  background: #f9a6cf;
}

.btn-primary {
  background: #a9d695;
  color: #fff;
}

.btn-primary:hover {
  background: #f9a6cf;
}

.btn-cancel {
  background: #ffc07a ! important;
  color: #fff ! important;
}

.btn-cancel:hover {
  background: #f9a6cf !important;
  color: #fff !important;
}

.strikeout {
  text-decoration: line-through; /* Add strikeout only to item text, not the cross */
  color: #f9a6cf;
}

.strikeout:hover {
  color: #667a8a;
}

.erase-icon {
  display: flex;
  align-items: center;
  position: relative;
}

.erase-cross {
  color: #f00;
  font-size: 10px;
  cursor: pointer;
  position: absolute;
  top: 55%;
  transform: translateY(-50%);
}

.erase-text {
  text-decoration: line-through;
  color: #f9a6cf;
  margin-left: 20px;
}

</style>


