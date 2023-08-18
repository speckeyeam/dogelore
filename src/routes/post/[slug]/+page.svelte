<script lang="ts">
  import type { PageData } from "./$types";
  import NavBar from "$lib/components/NavBar.svelte";
  import "$lib/styles/style.css";
  import "$lib/styles/post.css";
  export let data: PageData;
  let post = data.data;
</script>

<NavBar {data} />
<div class="post-bg">
  {#if post.file}
    <h1>video</h1>
  {:else}
    <h1 class="post-title">{post.title}</h1>
    <h3 class="post-user">speckam (add later)</h3>
    <h3 class="post-type">meme</h3>
    <div class="post-text-div">
      <h3 class="post-text">{post.text}</h3>
    </div>
  {/if}
</div>
