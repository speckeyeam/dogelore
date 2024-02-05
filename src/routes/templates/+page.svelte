<script lang="ts">
  import NavBar from "$lib/components/NavBar.svelte";
  export let data;
  import "$lib/styles/style.css";
</script>

<NavBar {data} />
<div class="template-container"></div>
<hr />

<button class="create-template">+</button>
<a href="/backgrounds">backgrounds</a>
<a href="/characters">characters</a>
