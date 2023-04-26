<script lang="ts">
import { useAuthStore } from '@/stores/auth.store';


export default {
  data: () => ({
    isValid: false,
    showAlert: false,
    alertMsg: '',
    showPW: false,
    form: { userName: '', password: '' },
    userNameRules: [
      (value: string) => (!!value || 'Username is required'),
      (value: string) => {
        if (value?.length > 3) return true
        return 'User name must be at least 3 characters.'
      }
    ],
    passwordRules: [
      (value: string) => (!!value || 'Password is required'),
      (value: string) => {
        if (value?.length >= 6) return true
        return 'Password must be at least 6 characters.'
      }
    ],
    loading: false,
  }),

  methods: {
    async login() {
      const form = this.$refs.loginForm as any
      const { valid } = await form.validate();
      this.isValid == valid;
      if (valid) {
        const { login } = useAuthStore();
        this.loading = true
        try {
          await login(this.form);
        } catch (error: any) {
          console.log(error)
          console.log(error.message.split(':')[1])
          this.loading = false;
          this.alertMsg = error.message.split(':')[1];
          this.showAlert = true;
        }
      }
    },
  },
};
</script>

<template>
  <v-sheet class="login-sheet pa-1 mx-auto mx-md-6 mx-lg-15 mx-xl-auto xl-width my-9 my-lg-15" rounded>
    <v-card class="mx-3 mx-lg-12 my-3 my-lg-12 px-1 px-md-3 px-lg-9 py-3 py-lg-9" elevation="6">
      <v-card-title class="title-large">
        Log In
      </v-card-title>
      <div>
        <v-alert v-model="showAlert" type="error" variant="tonal" closable close-label="Close Alert">
          {{
            alertMsg
          }}
        </v-alert>
      </div>
      <v-card class="px-3 px-lg-15 pb-3 pt-6 py-lg-15" variant="tonal" elevation="5">
        <v-form ref="loginForm" v-model="isValid" lazy-validation @submit.prevent="login">
          <v-row>
            <v-col>
              <v-text-field v-model="form.userName" :readonly="loading" :rules="userNameRules" class="mb-2" clearable
                label="User Name" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="form.password" :readonly="loading" :rules="passwordRules"
                :append-icon="showPW ? 'fa:fas fa-duotone fa-eye' : 'fa:fas fa-duotone fa-eye-slash'"
                :type="showPW ? 'text' : 'password'" @click:append="$event => showPW = !showPW" counter clearable
                label="Password" placeholder="Enter your password" />
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-btn :loading="loading" block color="success" size="large" type="submit" variant="tonal"
                class="submit-btn">
                Sign In
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-card>
  </v-sheet>
</template>

<style lang="css">
.login-sheet {
  background-color: var(--md-ref-palette-secondary20);
}

.submit-btn {
  box-shadow: 1.5px 1.5px 6px 3px rgba(0, 6, 1, 0.33);
  border: 1px dotted rgba(32, 88, 34);
}
</style>
