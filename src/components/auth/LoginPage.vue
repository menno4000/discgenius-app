<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="handleSubmit">
      <div class="grid-container">
        <div class="grid-item">
          <label class="login label">E-Mail</label>
        </div>
        <div class="grid-item">
          <input type="text" v-model="username" name="username" class="form-control" :class="{ 'is-invalid': submitted && !username }" />
        </div>
        <div class="grid-item">
          <label class="login label">Password</label>
        </div>
        <div class="grid-item">
          <input type="password" v-model="password" name="password" class="form-control" :class="{ 'is-invalid': submitted && !password }" />
        </div>
      </div>
      <div class="form-group">
        <button class="loginButton" :disabled="!username">Login</button>
        <img v-show="!username" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
        <router-link to="/register" class="registerButton">Register</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import UserService from '@/services/UserService'

export default {
  data () {
   return {
      username: '',
      password: '',
      submitted: false
    }
  },
  created () {
    this.$store.dispatch('logout');
  },
  methods: {
    async handleSubmit(e) {
      this.submitted = true
      try{
        const {username, password} = this
        if (username && password) {
          const response = await UserService.login(username, password)
          // console.log(response)

          const token = response.data['access_token']
          const user = username

          await this.$store.dispatch('login', {token, user})
          await this.$router.push('/')
        }
      } catch(error) {
        console.log(error)
      }

    }
  },
  name: "LoginPage"

}
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
.loginButton{
  color: white;
  font-size: 16px;
  background-color: #00b9ff;
  margin: 20px;
  padding: 15px 30px;
  border-radius: 4px;
}
.registerButton{
  color: black;
  background-color: white;
  outline-color: dimgrey;
  outline-style: auto;
  margin: 20px;
  padding: 15px 30px;
  border-radius: 4px;
}
</style>