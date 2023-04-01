<script lang="ts">
import { useAuthStore } from '@/stores/auth.store';
import { POST, USER_API } from '@/utils/fetch';

export default {
   data:() =>({
      isValid: false,
      showPW: false,
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
         const { login } = useAuthStore();
         this.loading = true;
         const data = await POST(`${USER_API}/create`, this.form)
         console.log(data);
         login(this.form);
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
  <v-sheet
    class="ma-12 pa-12"
  >
    <v-card 
      class="ma-6 pa-6 elevation-9"
      variant="tonal"
    >
      <v-card-title
        class="title-large"
      >
        New User Registration
      </v-card-title>
      <v-card
        class="ma-3 pa-6"
      >
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
                :append-icon="showPW ? 'fa:fas fa-duotone fa-eye' : 'fa:fas fa-duotone fa-eye-slash'"
                :type="showPW ? 'text' : 'password'"
                @click:append="$event => showPW = !showPW"
                counter
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
                :append-icon="showPW ? 'fa:fas fa-duotone fa-eye' : 'fa:fas fa-duotone fa-eye-slash'"
                :type="showPW ? 'text' : 'password'"
                @click:append="$event => showPW = !showPW"
                counter
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
                class="reg-btn"
                color="success"
                size="large"
                type="submit"
                variant="tonal"
              >
                Register
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-card>
  </v-sheet>
</template>

<style lang="css">
.reg-btn {
  margin-top: 9px;
  margin-bottom: 15px;
  box-shadow: 1.5px 1.5px 6px 3px rgba(0, 6, 1, .3);
  border: 1px solid rgba(32, 88, 34, 0.66);
}

</style>
