<script lang="ts">
import { useAuthStore } from '@/stores/auth.store';
import { getApiUrl } from '@/utils/constants';
const API_URL = `api/user/create/`;

export default {
   data:() =>({
      isValid: false,
      form: { userName:'', password: '' },
      passwordConfirm: '',
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
     }
   ),
   methods: {
     async register() {
      const form = this.$refs.registrationForm as any
      const { valid } = await form.validate();
      this.isValid == valid;
      if(valid){
         const authStore = useAuthStore();
         this.loading = true;
         const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.form),
         };
         fetch(getApiUrl(API_URL), requestOptions)
           .then(async (response) => {
             const data = await response.json();
             console.log(data);
             return authStore.login(this.form);
           });
      }
     },
   },
   computed: {
     passwordMatch(){
        return (this.form.password === this.passwordConfirm)|| 'Passwords do not match';
     }
   }
};
</script>

<template>
  <v-container>
    <v-responsive
      class="mx-auto"
      max-width="1080"
    >
      <v-card title="New User Registration">
        <v-card>
          <v-form
            ref="registrationForm"
            v-model="isValid"
            lazy-validation
            @submit.prevent="register"
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
                <v-text-field
                  v-model="passwordConfirm"
                  :readonly="loading"
                  :rules="[passwordMatch]"
                  clearable
                  label="Confirm Password"
                  placeholder="Re-enter your password"
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
                  Register
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-card>
    </v-responsive>
  </v-container>
</template>

<style lang="css"></style>
