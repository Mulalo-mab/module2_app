<template>
  <div class="p-6">
    <div class="container mx-auto">
      <h1 class="text-2xl font-bold text-center mb-6">Employee Leave Requests</h1>
      
      <button @click="toggleForm" class="mb-4 px-4 py-2 bg-blue-600 text-white rounded">{{ showForm ? 'Close' : 'Add Leave' }}</button>
      
      <div v-if="showForm" class="p-4 border rounded-lg shadow-lg bg-white mb-6">
        <h2 class="text-lg font-semibold mb-2">Add Leave Request</h2>
        <form @submit.prevent="addLeave">
          <div class="mb-2">
            <label class="block">Employee ID:</label>
            <input v-model="newLeave.employee_id" type="text" class="border p-2 w-full" required />
          </div>
          <div class="mb-2">
            <label class="block">Date:</label>
            <input v-model="newLeave.date" type="date" class="border p-2 w-full" required />
          </div>
          <div class="mb-2">
            <label class="block">Reason:</label>
            <textarea v-model="newLeave.reason" class="border p-2 w-full" required></textarea>
          </div>
          <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded">Submit</button>
        </form>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="leave in $store.state.leave" :key="leave.employee_id" class="p-4 border rounded-lg shadow-lg bg-white">
          <h2 class="text-lg font-semibold">Employee ID: {{ leave.employee_id }}</h2>
          <p class="text-gray-700"><strong>Date:</strong> {{ leave.date }}</p>
          <p class="text-gray-700"><strong>Reason:</strong> {{ leave.reason }}</p>
          <p :class="getStatusClass(leave.status)"><strong>Status:</strong> {{ leave.status }}</p>
          <button @click="deleteLeave(leave.employee_id)" class="mt-2 px-4 py-1 bg-red-600 text-white rounded">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showForm: false,
      newLeave: {
        employee_id: '',
        date: '',
        reason: '',
      },
    };
  },
  mounted() {
    this.$store.dispatch('getLeaves');
  },
  methods: {
    toggleForm() {
      this.showForm = !this.showForm;
    },
    addLeave() {
      this.$store.dispatch('addLeave', this.newLeave);
      this.newLeave = { employee_id: '', date: '', reason: '' };
      this.showForm = false;
    },
    deleteLeave(employee_id) {
      this.$store.dispatch('deleteLeave', employee_id);
    },
    getStatusClass(status) {
      return status === 'Approved'
        ? 'text-green-600 font-bold'
        : status === 'Pending'
        ? 'text-yellow-600 font-bold'
        : status === 'Denied'
        ? 'text-red-600 font-bold'
        : 'text-gray-600';
    },
  },
};
</script>

<style scoped>
.grid {
  display: grid;
  gap: 1rem;
}
.border {
  border: 1px solid #ddd;
}
.rounded-lg {
  border-radius: 8px;
}
.shadow-lg {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.bg-white {
  background-color: white;
}
.text-green-600 {
  color: green;
}
.text-yellow-600 {
  color: goldenrod;
}
.text-red-600 {
  color: red;
}
</style>
