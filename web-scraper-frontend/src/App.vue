<template>
  <div id="app">
    <div>
      <label for="url">Enter URL:</label>
      <input v-model="url" id="url" type="text" placeholder="Enter the URL" />
      <button @click="getWordCount">Get Word Count</button>
    </div>
    <div v-if="wordCount !== null">
      <p>Word Count: {{ wordCount }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: 'https://wsa-test.vercel.app/', // default test URL
      wordCount: null,
    };
  },
  methods: {
    async getWordCount() {
      try {
        const response = await fetch(`http://localhost:4000/wordcount?url=${encodeURIComponent(this.url)}`);
        const data = await response.json();
        this.wordCount = data.wordCount;
      } catch (error) {
        console.error('Error:', error);
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>