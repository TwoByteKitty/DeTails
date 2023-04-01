<script lang="ts">


export default {};
</script>

<template>
  <v-sheet
    class="pa-12 ma-12"
  >
    <v-card
      class="ma-12 pa-12 elevation-9"
    >
      <div
        class="mb-3"
      >
        <v-img
          src="/assets/logo-no-background.svg"
        />
      </div>
      <v-card
        class="ma-9 pa-9"
        variant="tonal"
      >
        <v-card-item
          class="ml-3 mb-3"
        >
          <v-card-title>Hi there! New around here?</v-card-title>

          <v-card-subtitle
            class="pa-3 ml-2"
          >
            Please take a moment
            <router-link to="/register">
              <span
                class="reg-span"
              >
                to register.
              </span>
            </router-link>
          </v-card-subtitle>
        </v-card-item>
        <v-card-item
          class="ml-3"
        >
          <v-card-subtitle>
            Otherwise, welcome back!
            <router-link to="/login">
              <span
                class="login-span"
              >
                Please log in.
              </span>
            </router-link>
          </v-card-subtitle>
        </v-card-item>
      </v-card>
    </v-card>
  </v-sheet>
</template>

<style lang="css">
.reg-span, .login-span {
  font-size: 1.03rem;
}

</style>
