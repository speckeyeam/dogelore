<script lang="ts">
  export let nodeReference: any;
  export let data: {};
</script>

<div
  class="comment"
  bind:this={nodeReference}
  style="padding-top: 1rem; padding-bottom: 1rem;"
>
  <img class="comment-pfp" src={data.User.image} />
  <div class="comment-text-wrapper">
    <h2 class="comments-user">{data.User.name}</h2>
    <h2 class="comments-text">{data.text}</h2>
    <div class="comment-likes-container">
      <button class="comment-like btn">👍</button>
      <h3 class="comment-likes">100</h3>
      <button class="comment-like btn">👎</button>
      <button class="comment-reply btn">Reply</button>
    </div>
  </div>
</div>
<slot />
