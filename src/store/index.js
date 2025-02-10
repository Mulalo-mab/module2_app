import { createStore } from 'vuex'

export default createStore({
  state: {
    // for variabl
    employees:null,
    attendence: null,
    singlePayroll: null,
    leave:null

  },
  // commit
  mutations: {
    setEmployees(state,payload){
      state.employees = payload

    }, 
    setPayrolls(state,payload){
      state.employees = payload
    },
    setSinglePayroll(state, employee) {
      console.log("Setting Vuex store singlePayroll:", employee);
      state.singlePayroll = employee;
    },
    setAttendence(state,payload){
      state.attendence = payload
    },

    setLeave(state,payload){
      state.leave = payload
    },
    SET_PAYROLL(state, payroll) {
      state.payroll = payroll;
    },
    ADD_PAYROLL(state, newPayroll) {
      state.payroll.push(newPayroll);
    }
  },
  // dispatch
  actions: {
    // employee get
    async getData({commit},payload){
      let {employees} = await (await fetch('http://localhost:4000/employee')).json()
      commit('setEmployees', employees)
    },

    // employee delete
    async deleteEmployees({ commit }, employee_id) {
      await fetch('http://localhost:4000/employee/' + employee_id, {
        method: 'DELETE'
      })
      location.reload()
    },

    // employee post
    async postEmployees({commit}, employee){
      console.log(employee);
      await fetch('http://localhost:4000/employee', {
        method: 'POST',
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          employee_id: employee.employee_id,
          name: employee.name,  
          position: employee.position,
          department: employee.department,
          salary: employee.salary,
          employment_history: employee.employment_history,
          contact: employee.contact
        }),
      })
      location.reload()
    },
// Employee patch
    async patchEmployees({ commit }, { employee_id, updatedData }) {
      await fetch('http://localhost:4000/employee/' + employee_id, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData),  // Send only the fields that need to be updated
      })
      location.reload()  // Reload the page after updating
    },

    // getSingle Employees
     
    async getSingleEmployee({ commit }, employee_id) {
      try {
        console.log("Fetching from API for employee ID:", employee_id);
    
        const response = await fetch(`http://localhost:4000/employee/${employee_id}`);
    
        if (!response.ok) {
          console.error("Error fetching employee data:", response.status);
          return null;
        }
    
        const data = await response.json();
        console.log("Employee data received:", data);
    
        return data;  // Ensure this returns the expected structure
      } catch (error) {
        console.error("Error in getSingleEmployee action:", error);
        return null;
      }
    },
    
    
      // Other actions..

    // Payroll
    async getPayroll({commit},payload){
      let {employees} = await (await fetch('http://localhost:4000/payroll')).json()
      commit('setPayrolls',employees)
    },

    // payroll delete
    async deletePayroll({commit},employee_id){
      await fetch('http://localhost:4000/payroll/'+employee_id,{
        method: 'DELETE'
      })
      location.reload()
    },

    // Post employee payroll with salary calculation
  async postPayroll({ commit }, employee) {
    console.log(employee);

    // Assuming hourly rate is fixed (you can replace with a dynamic value)
    const hourlyRate = 100; // Example hourly rate
    const final_salary = employee.hours_worked * hourlyRate - employee.leave_deductions;

    await fetch('http://localhost:4000/payroll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        employee_id: employee.employee_id,
        hours_worked: employee.hours_worked,
        leave_deductions: employee.leave_deductions,
        final_salary: final_salary, // Calculated salary
      }),
    });
    location.reload();
  },

    // getSinglePayroll
// Fetch a single employee's payroll details
async getSinglePayroll({ commit }, employee_id) {
  try {
    console.log("Fetching payroll for employee ID:", employee_id);

    let response = await fetch(`http://localhost:4000/payroll/${employee_id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch payroll: ${response.statusText}`);
    }
    
    let employee = await response.json();
    console.log("API Response:", employee);

    commit('setSinglePayroll', employee);
  } catch (error) {
    console.error('Error fetching single payroll data:', error);
  }
},

    

    // Attendence Get
    async getAttendence({commit},payload){
      let {attendence} = await (await fetch('http://localhost:4000/attendence')).json()
      commit('setAttendence', attendence)
    },

    // attendence POST
    async postAttendence(){},
     

  
    //delete attendence
    async deleteAttendence({commit},employment_id){
      await fetch('http://localhost:4000/attendence/' + employment_id, {
        method: 'DELETE'
      })
      location.reload
      //console.log(employment_id)
    },

    // Leave get
    async getLeaves({commit},payload){
      let {leave} = await (await fetch('http://localhost:4000/leave')).json()
      //console.log(leave);
      commit('setLeave', leave)
    },

    // delete leave Request
    async deleteLeave({commit}, payload){
      await fetch('http://localhost:4000/leave/' +payload)
    },
    
  },
  modules: {
  }
})
