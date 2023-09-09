<script lang="ts">
  import type { Boolean } from "aws-sdk/clients/apigateway";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  export let nodeReference: any;
  export let data: {};
  export let redirect: Boolean;
  export let second: Boolean;
  export let third: Boolean;
  let replies = true;
  let showReplies = false;
  let replyLimit = 0;
  let reply = false;
  let replyMessage = "";

  const showReply = async () => {
    if (!redirect) {
      showReplies = !showReplies;
    } else {
      let url =
        $page.url.origin + "/post/" + data.post_id + "?comment=" + data.id;
      window.location.href = url;
    }
  };
  const submitReply = async () => {
    fetch("/api/comment/create", {
      method: "POST",
      body: JSON.stringify({
        post_id: data.post_id,
        comment: replyMessage,
        reply: true,
        reply_to: data.id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.sucess) {
          if (res.comment) {
            data.Replies?.unshift(res.comment);
            data.Replies = data.Replies;
            reply = false;
            replyMessage = "";
          }
        } else if (res.notLoggedIn) {
          alert("not logged in");
        } else {
          alert(res);
        }
      })
      .catch(() => alert("Failed to submit"));
  };
</script>

<div
  class="comment"
  bind:this={nodeReference}
  style="padding-top: 1rem; padding-bottom: 1rem;"
>
  <img class="comment-pfp" src={data.User?.image} />
  <div class="comment-text-wrapper">
    <h2 class="comments-user">{data.User?.name}</h2>
    <h2 class="comments-text">{data.text}</h2>
    <div class="comment-likes-container">
      <button class="comment-like btn">👍</button>
      <h3 class="comment-likes">100</h3>
      <button class="comment-like btn">👎</button>
      <button class="comment-reply btn" on:click={() => (reply = !reply)}
        >Reply</button
      >
    </div>
    {#if replies && data.Replies?.length > 0}
      <button class="show-reply-btn btn" on:click={showReply}>
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
          {#if showReplies}
            <polygon
              class="cls-1"
              points="47.8 47.73 91.1 4.5 4.5 4.5 47.8 47.73"
            />
          {:else}
            <polygon
              class="cls-1"
              points="47.8 4.5 4.5 47.73 91.1 47.73 47.8 4.5"
            />
          {/if}
        </svg>

        <!-- <svg
          id="Layer_1"
          class="show-replies-svg"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 95.6 52.23"
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
            points="47.8 4.5 4.5 47.73 91.1 47.73 47.8 4.5"
          />
        </svg> -->
        {data.Replies.length}
        {data.Replies.length == 1 ? "Reply" : "Replies"}</button
      >
    {/if}
  </div>
</div>
{#if reply}
  <div class="reply">
    <div class="create-comment-container">
      <textarea
        bind:value={replyMessage}
        rows="3"
        placeholder="Le comment..."
        class="create-comment-textarea"
      />
      <div class="reply-btn-container">
        <button class="nav-button reply-btn" on:click={submitReply}
          >Comment</button
        >
        <button class="nav-button reply-btn" on:click={() => (reply = !reply)}
          >Cancel</button
        >
      </div>
    </div>
  </div>
{/if}
{#if showReplies && data.Replies}
  <div class="replies-container">
    {#each data.Replies as reply, i}
      {#if second}
        <svelte:self data={reply} third={true} redirect={true} />
      {:else}
        <svelte:self data={reply} second={true} redirect={false} />
      {/if}
    {/each}
  </div>
{/if}
<slot />
