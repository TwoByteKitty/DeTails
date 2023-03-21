<script lang="ts">
import { useAuthStore } from '@/stores/auth.store';


export default {
    data: () => ({
      isValid: false,
      form: { userName:'', password: '' },
      userNameRules: [
         (value: string)=>(!!value || 'Username is required'),
         (value: string)=>{
            if (value?.length > 3) return true
            return 'User name must be at least 3 characters.'
         }
       ],
       passwordRules:[
         (value: string)=>(!!value || 'Password is required'),
         (value: string)=>{
            if (value?.length >= 6) return true
            return 'Password must be at least 6 characters.'
         }
       ],
      loading: false,
    }),

    methods: {
      async login () {
         const form = this.$refs.loginForm as any
         const { valid } = await form.validate();
         this.isValid == valid;
         if(valid){
            const { login } = useAuthStore();
            this.loading = true
            return login(this.form);
         }
      },
    },
};
</script>

<template>
  <v-sheet
    class="bg-deep-purple pa-12"
    rounded
  >
    <v-responsive>
      <v-card class="mx-auto px-6 py-8">
        <v-form
          ref="loginForm"
          v-model="isValid"
          lazy-validation
          @submit.prevent="login"
        >
          <v-row>
            <v-col>
              <v-text-field
                v-model="form.userName"
                :readonly="loading"
                :rules="userNameRules"
                class="mb-2"
                clearable
                label="User Name"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="form.password"
                :readonly="loading"
                :rules="passwordRules"
                clearable
                label="Password"
                placeholder="Enter your password"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-btn
                :loading="loading"
                block
                color="success"
                size="large"
                type="submit"
                variant="elevated"
              >
                Sign In
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-responsive>
  </v-sheet>
</template>

<style lang="css"></style>
