<script setup lang="ts">
import { useInfiniteQuery, useQuery } from '@tanstack/vue-query'
import { useDebounceFn, useIntersectionObserver } from '@vueuse/core'

const { $client } = useNuxtApp()

const PER_PAGE_LENGTH = 10

const spinnerRef = ref<HTMLElement | null>(null)
const searchText = ref('')
const isNextPageAvailable = ref<boolean>(true)

const updateSearchText = useDebounceFn((newValue: string): void => {
  searchText.value = newValue
}, 700)

const clearSearchText = () => {
  searchText.value = ''
}

useIntersectionObserver(spinnerRef, ([{ isIntersecting }]): void => {
  if (isIntersecting) {
    // API is so fast! For visual purpose i use setTimeOut to display spinner
    setTimeout(() => {
      fetchNextPage()
    }, 1000)
  }
})
const {
  data: posts,
  isLoading,
  isError,
  error,
  fetchNextPage
} = useInfiniteQuery({
  queryKey: ['postsList', searchText],
  queryFn: () => $client.posts.query({ limit: 5 }),
  staleTime: 0,
  getNextPageParam: (lastPage) => {
    return lastPage.nextCursor
  }
})

</script>

<template>
  <span v-if="isLoading">Loading...</span>
  <span v-else-if="isError">Error: {{ error.message }}</span>
  <!-- We can assume by this point that `isSuccess === true` -->
  <table v-else border="">
    <thead>
      <tr>
        <th> Id </th>
        <th> Title </th>
        <th> Content </th>
        <th> Author </th>
        <th> Last Update </th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(page, ind) in posts?.pages" :key="ind">
        <tr v-for="post in page.items" :key="post.id">
          <td>{{ post.id }}</td>
          <td>{{ post.title }}</td>
          <td>{{ post.content }}</td>
          <td> {{ post.author.name }}</td>
          <td>{{ post.updatedAt }}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
