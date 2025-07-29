<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create Account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Register for Contact Management
        </p>
      </div>
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div class="text-center">
          <p class="text-green-600 font-medium">✅ Register page working!</p>
          <div class="mt-4">
            <RouterLink to="/auth/login" class="text-blue-600 hover:text-blue-800">
              Back to Login
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>