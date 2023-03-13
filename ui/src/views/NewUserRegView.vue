<script lang="ts">

export default {
    data() {
      return{
        form: false,
        userName: null,
        password: null,
        passwordConfirm: null,
        loading: false,
      }
    },

    methods: {
      onSubmit () {
        if (!this.form) return

        this.loading = true

        setTimeout(() => (this.loading = false), 2000)
      },
      required (v: string) {
        return !!v || 'Field is required'
      },
    },
};
</script>

<template>
  <v-container>
    <v-responsive
      class="mx-auto"
      max-width="500"
    >
      <v-card title="New User Registration">
        <v-card>
          <v-form         
            v-model="form"
            @submit.prevent="onSubmit"
          >
            <v-row>
              <v-col>
                <v-text-field
                  v-model="userName"
                  :readonly="loading"
                  :rules="[required]"
                  class="mb-2"
                  clearable
                  label="User Name"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="password"
                  :readonly="loading"
                  :rules="[required]"
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
                  :rules="[required]"
                  clearable
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  :disabled="!form"
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
      </v-card>
    </v-responsive>
  </v-container>
</template>

<style lang="css"></style>
