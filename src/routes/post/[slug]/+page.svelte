<script lang="ts">
  import type { PageData } from "./$types";
  import NavBar from "$lib/components/NavBar.svelte";
  import "$lib/styles/style.css";
  import "$lib/styles/post.css";
  export let data: PageData;
  let post = data.data;
</script>

<NavBar {data} />

{#if post.file}
  <h1>video</h1>
{:else}<div class="post-bg">
    <h1 class="post-title">{post.title}</h1>
    <h3 class="post-user">speckam (add later)</h3>
    <h3 class="post-type">meme</h3>
    <div class="post-text-div">
      <h3 class="post-text">{post.text}</h3>
    </div>
    <div class="post-likes-div">
      <div class="post-likes-container">
        <button class="like-post btn">👍</button>
        <h3 class="post-likes">100</h3>
        <button class="dislike-post btn">👎</button>
      </div>
      <button class="more-options-btn btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          fill="#000000"
          version="1.1"
          class="more-options"
          viewBox="0 0 32.055 32.055"
          xml:space="preserve"
        >
          <g>
            <path
              d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967   C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967   s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967   c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"
            />
          </g>
        </svg></button
      >
    </div>
  </div>
  <div class="create-comment-div">
    <div class="create-comment-container">
      <textarea
        rows="4"
        placeholder="Le comment..."
        class="create-comment-textarea"
      />
      <button class="create-comment-btn">Comment</button>
    </div>
  </div>
{/if}
