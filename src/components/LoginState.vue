<template>
  <div>
    <div class="loginDiv" v-if="!authState">
      <button class="loginButton" @click="doLogin">Login</button>
    </div>
    <div class="loginDiv" v-else-if="authState">
      <div>
        <label class="loginLabel">Logged in as {{username}}</label>
      </div>
      <div>
        <button class="logoutButton" @click="doLogout">Logout</button>
      </div>
    </div>
  </div>
</template>

<script>

export default{
  computed:{
    authState(){
      return this.$store.getters["isLoggedIn"];
    },
    username() {
      return this.$store.getters["getUser"];
    }
  },
  methods: {
    doLogin() {
      this.$router.push('/login')
    },
    doLogout() {
      this.$store.dispatch('logout')
    }
  }
}
</script>

<style scoped>

.loginDiv{
  text-align: center;
  align-content: center;
}
.loginButton{
  color: white;
  font-size: 16px;
  background-color: #00b9ff;
  margin: 20px;
  padding: 15px 30px;
  border-radius: 4px;
}
.loginLabel{
  margin: 20px;
  align-content: center;
  align-self: center;
}
.loginDiv{
  display: inline-block;
  align-content: center;
}
.logoutButton{
  align-self: center;
  color: white;
  font-size: 16px;
  background-color: #00b9ff;
  margin: 20px;
  padding: 10px 20px;
  border-radius: 4px;
}

</style>