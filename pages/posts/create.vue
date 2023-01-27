
<script setup lang="ts">

import { useMutation } from '@tanstack/vue-query'

const title = ref('')
const { $client } = useNuxtApp()

const { isLoading, isError, error, isSuccess, mutate: createPost } = useMutation({
  mutationFn: () => $client.createPosts.mutate({ title: title.value })
})

// const mutation = $client.createPosts.mutate({ title: title.value })

</script>

<template>
  <div>
    <input v-model.trim="title">
    <button :disabled="isLoading" @click="createPost">
      submit
    </button>
    <div v-if="isLoading">
      Adding post...
    </div>
    <div v-else-if="isError">
      An error occurred: {{ error.message }}
    </div>
    <div v-if="isSuccess">
      Post Added!
    </div>
  </div>
</template>

<style scoped>

</style>
