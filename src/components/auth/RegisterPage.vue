<template>
  <div>
    <h2>Register</h2>

    <form @submit.prevent="handleSubmit">
      <div class="grid-container">
          <div class="grid-item">
            <label>E-Mail</label>
          </div>
          <div class="grid-item">
            <input type="text" v-model="username" name="username" class="form-control" :class="{ 'is-invalid': submitted }" />
          </div>

          <div class="grid-item">
            <label>Password</label>
          </div>
          <div class="grid-item">
            <input type="password" v-model="password" min="6" name="password" class="form-control" :class="{ 'is-invalid': submitted }" />
          </div>

          <div class="grid-item">
            <label>Password (Repeat)</label>
          </div>
          <div class="grid-item">
            <input type="password" v-model="password_repeat" min="6" name="password_repeat" class="form-control" :class="{ 'is-invalid': submitted }" />
          </div>
      </div>
      <button class="registerButton" @click="handleSubmit">Register</button>
      <router-link to="/login" class="cancelButton">Cancel</router-link>
    </form>

    <p v-if="msg">{{ msg }}</p>
  </div>
</template>

<script>
import UserService from '@/services/UserService'

export default {
  data () {
    return {
      username: '',
      password: '',
      password_repeat: '',
      submitted: false,
      msg: ''
    }
  },
  methods: {
    async handleSubmit(e) {
      this.submitted = true;

      try {
        const credentials = {
          user: this.username,
          password: this.password,
          password_repeat: this.password_repeat
        };
        const response = await UserService.register(credentials)
        console.log(response)
        if (response.status === 201){
          this.msg = "registered!"
          await this.$router.push('/login')
        }
        else {
          this.msg = response
        }
      } catch (error) {
        this.msg = error.response.data.msg;
      }

    }
  }
};
</script>

<style scoped>
.form-control {
  outline-style: solid;
  outline-width: thin;
  width: 250px;
}
.grid-container {
  display: grid;
  grid-template-columns: auto auto;
  padding: 10px;
}
.grid-item {
  padding: 10px;
  text-align: center;
}
.btn.btn-link{
  margin-left: 5px;
  margin-right: 5px;
}

.registerButton{
  color: white;
  font-size: 16px;
  background-color: #00b9ff;
  margin: 20px;
  padding: 15px 30px;
  border-radius: 4px;
}
.cancelButton{
  color: black;
  background-color: white;
  outline-color: dimgrey;
  outline-style: auto;
  margin: 20px;
  padding: 15px 30px;
  border-radius: 4px;
}
</style>