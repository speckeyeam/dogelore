<script lang="ts">
  export let nodeReference: any;
  export let data: {};
  let replies = true;
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
      {#if replies}
        <svg
          id="Layer_1"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 95.6 52.23"
          class="show-replies-svg"
          color="#14336f"
        >
          <defs>
            <style>
              .cls-1 {
                fill: #fff;
                stroke: #14336f;
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-width: 9px;
              }
            </style>
          </defs>
          <polygon
            class="cls-1"
            points="47.8 47.73 91.1 4.5 4.5 4.5 47.8 47.73"
          />
        </svg>
      {/if}
    </div>
  </div>
</div>
<slot />
