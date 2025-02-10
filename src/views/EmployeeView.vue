<template>
  <div class="cont">
    <!-- Add Employee Button -->
    <div class="mt-4 text-end">
      <button class="btn btn-primary" @click="openAddEmployeeModal">
        Add Employee
      </button>
    </div>

    <!-- Employee Modal -->
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ isEditing ? "Edit Employee" : "Add New Employee" }}</h3>
        <form @submit.prevent="submitEmployee">
          <label>Employee ID:</label>
          <input v-model="newEmployee.employee_id" type="number" required />
          
          <label>Name:</label>
          <input v-model="newEmployee.name" type="text" required />

          <label>Position:</label>
          <input v-model="newEmployee.position" type="text" required />

          <label>Department:</label>
          <input v-model="newEmployee.department" type="text" required />

          <label>Salary:</label>
          <input v-model="newEmployee.salary" type="number" required />

          <label>Employment History:</label>
          <textarea v-model="newEmployee.employment_history" required></textarea>

          <label>Contact:</label>
          <input v-model="newEmployee.contact" type="email" required />

          <div class="modal-actions">
            <button type="submit" class="btn btn-success">
              {{ isEditing ? "Update" : "Save" }}
            </button>
            <button type="button" class="btn btn-danger" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Employee Details Modal -->
    <div v-if="isDetailsModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h3>Employee Details</h3>
        <p><strong>ID:</strong> {{ employeeDetails.employee_id }}</p>
        <p><strong>Name:</strong> {{ employeeDetails.name }}</p>
        <p><strong>Position:</strong> {{ employeeDetails.position }}</p>
        <p><strong>Department:</strong> {{ employeeDetails.department }}</p>
        <p><strong>Salary:</strong> {{ employeeDetails.salary }}</p>
        <p><strong>Employment History:</strong> {{ employeeDetails.employement_history }}</p>
        <p><strong>Contact:</strong> {{ employeeDetails.contact }}</p>
        
        <button class="btn btn-danger" @click="closeDetailsModal">Close</button>
      </div>
    </div>

    <!-- Employee Table -->
    <table class="table table-striped mt-4" border="1" cellspacing="0" cellpadding="8">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Position</th>
          <th>Department</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(employee) in $store.state.employees" :key="employee.employee_id">
          <td>{{ employee.employee_id }}</td>
          <td>{{ employee.name }}</td>
          <td>{{ employee.position }}</td>
          <td>{{ employee.department }}</td>
          
          <td>
            <button class="btn btn-warning btn-sm" @click="editEmployee(employee)">Edit</button></td>
            <td><button class="btn btn-danger btn-sm" @click="deleteEmployees(employee.employee_id)">Delete</button></td>
            <td><button class="btn btn-info btn-sm" @click="showEmployeeDetails(employee.employee_id)">Show More</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isModalOpen: false,
      isDetailsModalOpen: false,
      isEditing: false,
      newEmployee: {
        employee_id: "",
        name: "",
        position: "",
        department: "",
        salary: "",
        employment_history: "",
        contact: "",
      },
      employeeDetails: {},
    };
  },
  mounted() {
    this.$store.dispatch("getData");
  },
  methods: {
    deleteEmployees(employee_id) {
      this.$store.dispatch("deleteEmployees", employee_id);
    },
    postEmployees() {
      this.$store.dispatch("postEmployees", this.newEmployee);
    },
    patchEmployee() {
      this.$store.dispatch("patchEmployees", {
        employee_id: this.newEmployee.employee_id,
        updatedData: this.newEmployee,
      });
    },
    openAddEmployeeModal() {
      this.isModalOpen = true;
      this.isEditing = false;
    },
    closeModal() {
      this.isModalOpen = false;
      this.resetForm();
    },
    async showEmployeeDetails(employee_id) {
      try {
        console.log("Fetching details for employee ID:", employee_id);

        if (!employee_id) {
          console.error("Invalid employee ID:", employee_id);
          return;
        }

        const response = await this.$store.dispatch("getSingleEmployee", employee_id);

        if (response && response.employees && response.employees.length > 0) {
          this.employeeDetails = response.employees[0];
          this.isDetailsModalOpen = true;
          console.log("Employee details loaded:", this.employeeDetails);
        } else {
          console.error("Employee details not found in API response.");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    },

    closeDetailsModal() {
      this.isDetailsModalOpen = false;
    },
    editEmployee(employee) {
      this.isModalOpen = true;
      this.isEditing = true;
      this.newEmployee = { ...employee };
    },
    submitEmployee() {
      if (this.isEditing) {
        this.patchEmployee();
      } else {
        this.postEmployees();
      }
      this.closeModal();
    },
    resetForm() {
      this.newEmployee = {
        employee_id: "",
        name: "",
        position: "",
        department: "",
        salary: "",
        employment_history: "",
        contact: "",
      };
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.3s ease-in-out;
}
.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
