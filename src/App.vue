<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
}

form {
  max-width: 400px;
  margin: 0 auto;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* Tables */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

table th,
table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

table tr:nth-child(even) {
  background-color: #f9f9f9;
}

/* Forms */
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-family: inherit;
  resize: vertical;
}

select[multiple] {
  height: 100px;
}

/* Navigation tabs */
nav {
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

nav button {
  margin-right: 10px;
  width: auto;
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

nav button:hover {
  background-color: #e9ecef;
}

/* Grid layout */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.stats-card {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 4px;
  text-align: center;
}

ul {
  list-style-type: disc;
  padding-left: 20px;
}

nav {
  margin-bottom: 20px;
}

nav button {
  width: auto;
  background-color: #dc3545;
}

nav button:hover {
  background-color: #c82333;
}
</style>
