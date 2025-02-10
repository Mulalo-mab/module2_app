<template>
  <div class="p-6">
    <div class="container mx-auto">
      <h1 class="text-2xl font-bold text-center mb-6">Employee Attendance</h1>

      <!-- Button to open modal -->
      <button 
        @click="showForm = true" 
        class="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        + Add Employee Attendance
      </button>

      <!-- Attendance Form (Modal) -->
      <div v-if="showForm" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 class="text-xl font-bold mb-4">Add Employee Attendance</h2>

          <form @submit.prevent="addAttendance">
            <div class="mb-3">
              <label class="block text-gray-700 font-medium">Employee ID</label>
              <input 
                v-model="newAttendance.employment_id" 
                type="text" 
                required
                class="w-full p-2 border rounded"
              />
            </div>

            <div class="mb-3">
              <label class="block text-gray-700 font-medium">Date</label>
              <input 
                v-model="newAttendance.date" 
                type="date" 
                required 
                class="w-full p-2 border rounded"
              />
            </div>

            <div class="mb-3">
              <label class="block text-gray-700 font-medium">Status</label>
              <select 
                v-model="newAttendance.status" 
                required 
                class="w-full p-2 border rounded"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>

            <div class="flex justify-between mt-4">
              <button 
                type="button" 
                @click="showForm = false"
                class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                Add Attendance
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Attendance List -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="attendence in $store.state.attendence" 
          :key="attendence.employment_id" 
          class="p-4 border rounded-lg shadow-lg bg-white"
        >
          <h2 class="text-lg font-semibold">Employee ID: {{ attendence.employment_id }}</h2>
          <p class="text-gray-700"><strong>Date:</strong> {{ attendence.date }}</p>
          <p :class="getStatusClass(attendence.status)"><strong>Status:</strong> {{ attendence.status }}</p>
          <button 
            @click="deleteAttendence(attendence.employment_id)" 
            class="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      showForm: false, // Controls modal visibility
      newAttendance: {
        employment_id: "",
        date: "",
        status: "Present",
      }
    };
  },
  methods: {
    ...mapActions(["getAttendance", "postAttendance", "deleteAttendence"]),

    async addAttendance() {
      await this.postAttendance(this.newAttendance);
      this.newAttendance = { employment_id: "", date: "", status: "Present" }; // Reset form
      this.showForm = false; // Close modal
      this.getAttendance(); // Refresh attendance list
    },

    getStatusClass(status) {
      return status === "Present" ? "text-green-600 font-bold" : "text-red-600 font-bold";
    }
  },
  mounted() {
    this.getAttendance();
  }
};
</script>


<style>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
.border {
  border: 1px solid #ddd;
}
.rounded-lg {
  border-radius: 10px;
}
.shadow-lg {
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}
.shadow-lg:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}
</style>
