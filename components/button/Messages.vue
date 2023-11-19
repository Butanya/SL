<template>
  <div class="header">
    <h1>{{ header }}</h1>
    <button v-if="editing" @click="doEdit(false)" class="btn btn-cancel">Cancel</button>
    <button v-else class="btn btn-primary" @click="doEdit(true)" style="margin-left: 40px;">
      Add Item
    </button>
  </div>

  <form class="add-item-form" v-if="editing" @submit.prevent="saveItem">
    <input v-model.trim="newItem" type="text" placeholder="Add something">
    <button :disabled="newItem.length < 1" class="btn btn-primary">Save Item</button>
  </form>
 
  <ul>
    <li v-for="(item, index) in reversedItems" :key="item.id" class="static-class">
      <span v-if="item.purchased" @click="eraseItem(item)" class="erase-icon">
        <span class="erase-cross">❌</span>
      </span>
      <span
        :class="{ 'strikeout': item.purchased }"
        @click="togglePurchased(item)"
        class="item-label"
      >
        {{ item.label }}
      </span>
    </li>
  </ul>

  <p v-if="!items.length">
    Nothing to see here
  </p>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const header = ref('Shopping List App');
const editing = ref(false);
const items = ref([]);

// Check if running in the browser before using localStorage
const isBrowser = typeof window !== 'undefined';

// Load from localStorage on component mount
onMounted(() => {
  if (isBrowser) {
    const storedList = localStorage.getItem('shoppingList');
    if (storedList) {
      items.value = JSON.parse(storedList);
    }
  }
});

const reversedItems = computed(() => [...items.value].reverse());
const newItem = ref('');

const saveItem = () => {
  items.value.push({
    id: items.value.length + 1, 
    label: newItem.value,
    purchased: false,
  });
  saveToLocalStorage();
  newItem.value = '';
};

const doEdit = (e) => {
  editing.value = e;
  newItem.value = '';
};

const togglePurchased = (item) => {
  item.purchased = !item.purchased;
  saveToLocalStorage();
};

const eraseItem = (item) => {
  const index = items.value.findIndex(i => i === item);
  if (index !== -1) {
    items.value.splice(index, 1);
    saveToLocalStorage();
  }
};

const saveToLocalStorage = () => {
  if (isBrowser) {
    localStorage.setItem('shoppingList', JSON.stringify(items.value));
  }
};

// Save to localStorage on component unmount
onBeforeUnmount(() => {
  saveToLocalStorage();
});
</script>


<style scoped>
.strikeout {
  text-decoration: line-through;
}

.erase-cross {
  color: #3498db;     
}

.erase-icon {
  display: flex;
  align-items: center;
  position: relative;
  margin-left: 22px;
}

.hidden {
  display: none;
}
</style>

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
  background: #ffc07a;
  color: #fff;
}

.btn-cancel:hover {
  background: #f9a6cf;
  color: #fff;
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
    color: #3498db;
    font-size: 10px;
    cursor: pointer;
    position: absolute;
    float: left;
    margin-left: -20px;
    top: -7px;
}


.erase-text {
  text-decoration: line-through;
  color: #f9a6cf;  
}
</style>