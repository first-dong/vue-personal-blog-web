<template>
  <div class="flex gap-8 animate-pulse">
    <!-- Main Content Skeleton -->
    <div class="flex-1 min-w-0">
      <!-- Header Skeleton -->
      <div class="mb-6">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-4/5 mb-3"></div>
        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/5 mb-4"></div>
        <div class="flex gap-4">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>

      <!-- Cover Image Skeleton -->
      <div class="h-64 md:h-96 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8"></div>

      <!-- Content Skeleton -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 md:p-10">
        <div class="space-y-4">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mt-6"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    </div>

    <!-- Sidebar Skeleton (hidden on small screens) -->
    <div class="hidden xl:block w-64 flex-shrink-0">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 space-y-3">
        <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-4"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 ml-4"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 ml-4"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 ml-4"></div>
      </div>
    </div>
  </div>
</template>
