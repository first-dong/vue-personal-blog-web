<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
    <div class="flex flex-col md:flex-row">
      <!-- Cover Image Skeleton -->
      <div class="md:w-64 h-48 md:h-auto flex-shrink-0 bg-gray-200 dark:bg-gray-700"></div>

      <!-- Content Skeleton -->
      <div class="flex-1 p-6 flex flex-col space-y-4">
        <!-- Category & Date -->
        <div class="flex items-center gap-3">
          <div class="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        <!-- Title -->
        <div class="space-y-2">
          <div class="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        <!-- Summary -->
        <div class="space-y-2 flex-1">
          <div class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        <!-- Tags -->
        <div class="flex items-center gap-2">
          <div class="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div class="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div class="h-6 w-14 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ArticleCardSkeleton - skeleton loading effect for article card
</script>
