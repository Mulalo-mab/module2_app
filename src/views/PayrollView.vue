<template>
  <div class="payroll">
    <section class="payroll-calculator container mt-5">
      <h2 class="text-center text-dark mb-4">Payroll Calculator</h2>

      <!-- Employee Form -->
      <div>
    <!-- Button to Open Modal -->
    <button @click="showPayrollModal = true">Add Salary Details</button>

    <!-- Salary Modal -->
    <div v-if="showPayrollModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Add Employee Salary Details</h2>
        <form @submit.prevent="postPayroll">
          <label>Employee ID:</label>
          <input type="text" v-model="employee.employee_id" required />
          <br>
          <label>Hours Worked:</label>
          <input type="number" v-model="employee.hours_worked" required />
          <br>
          <label>Leave Deductions:</label>
          <input type="number" v-model="employee.leave_deductions" required />
          <br>
          <button type="submit">Submit</button>
          <br>
          <br>
          <button class="btn btn-danger btn-sm" type="button" @click="showPayrollModal = false">Close</button>
        </form>
      </div>
    </div>
  </div>

      <!-- Employee Data Table -->
      <table class="table table-striped table-bordered table-hover">
        <thead class="thead-dark">
          <tr>
            <th>Employee ID</th>
            <th>Hours Worked</th>
            <th>Leave Deductions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in $store.state.employees" :key="employee.employee_id">
            <td>{{ employee.employee_id }}</td>
            <td>R{{ employee.hours_worked }}</td>
            <td>R{{ employee.leave_deductions }}</td>
            <td>
              <button class="btn btn-primary btn-sm" @click="fetchEmployeePayroll(employee.employee_id)">
                View Payslip
              </button>
              </td> <td>
              <button class="btn btn-danger btn-sm" @click="deletePayroll(employee.employee_id)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Payslip Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h4 class="mb-3">Payslip Details</h4>
        <p>Employee ID: {{ selectedEmployeeData?.employee_id }}</p>
        <p>Hours Worked: R{{ selectedEmployeeData?.hours_worked }}</p>
        <p>Leave Deductions: R{{ selectedEmployeeData?.leave_deductions }}</p>
        <p class="font-weight-bold text-success">Final Salary: R{{ selectedEmployeeData?.final_salary }}</p>

        <button class="btn btn-secondary" @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showPayrollModal: false,
      employee: {
        employee_id: '',
        hours_worked: '',
        leave_deductions: '',
    
      },
      showModal: false,
      selectedEmployeeData: null,
    };
  },
  mounted() {
    this.$store.dispatch('getPayroll');
  },
  methods: {
    deletePayroll(employee_id) {
      this.$store.dispatch('deletePayroll', employee_id);
    },
    async postPayroll() {
  try {
    console.log("Submitting Payroll:", this.employee);

    // Dispatch Vuex action to store the data
    await this.$store.dispatch('postPayroll', this.employee);

    // Fetch the updated payroll data
    await this.$store.dispatch('getPayroll');

    // Reset form fields
    this.employee = {
      employee_id: '',
      hours_worked: '',
      leave_deductions: '',
    };

    // Close the modal
    this.showPayrollModal = false;
  } catch (error) {
    console.error("Error submitting payroll:", error);
  }
},



    async fetchEmployeePayroll(employee_id) {
  try {
    console.log("Fetching payroll for employee ID:", employee_id);
    
    await this.$store.dispatch('getSinglePayroll', employee_id);
    
    // Ensure data exists before setting
    const data = this.$store.state.singlePayroll;
    
    if (data && data.employees && data.employees.length > 0) {
      this.selectedEmployeeData = data.employees[0]; // Get first employee
    } else {
      console.error("Error: No employee data found.");
      this.selectedEmployeeData = null;
    }
    
    console.log("Fetched Employee Payroll:", this.selectedEmployeeData);
    
    this.showModal = true; // Show modal
  } catch (error) {
    console.error("Error fetching payroll:", error);
  }
},


    closeModal() {
      this.showModal = false;
      this.selectedEmployeeData = null;
    },
  },
};
</script>

<style scoped>
/* Payroll calculator container styles */
.payroll-calculator {
  max-width: 800px;
  margin: 0 auto;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 10px;
}

/* Table styles */
table {
  width: 100%;
  background: white;
  margin-top: 20px;
  border-collapse: collapse;
}

thead {
  background-color: #00ff6e;
  color: rgb(59, 95, 223);
}

th,
td {
  padding: 10px;
  text-align: center;
}

th {
  font-weight: bold;
}

td button {
  margin: 0;
  padding: 5px 10px;
}

/* Modal overlay styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 300px;
}
/* Button styling */
button {
  background-color: blue;
  color: white;
  padding: 8px;
  border: none;
  cursor: pointer;
}

button.btn-danger {
  background-color: red;
}

button.btn-secondary {
  background-color: gray;
}
</style>
