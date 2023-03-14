<script lang="ts">

export default {
    data: () => ({
      form: false,
      userName: null,
      password: null,
      loading: false,
    }),

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
  <v-sheet class="bg-deep-purple pa-12" rounded>
    <v-responsive>
      <v-card class="mx-auto px-6 py-8">
        <v-form
          v-model="form"
          @submit.prevent="onSubmit"
        >
          <v-text-field
            v-model="userName"
            :readonly="loading"
            :rules="[required]"
            class="mb-2"
            clearable
            label="User Name"
          />

          <v-text-field
            v-model="password"
            :readonly="loading"
            :rules="[required]"
            clearable
            label="Password"
            placeholder="Enter your password"
          />

          <br>

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
        </v-form>
      </v-card>
    </v-responsive>
  </v-sheet>
</template>

<style lang="css"></style>
