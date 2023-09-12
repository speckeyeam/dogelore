<script lang="ts">
  import type { PageData } from "./$types";
  import NavBar from "$lib/components/NavBar.svelte";
  import Comment from "$lib/components/Comment.svelte";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import "$lib/styles/style.css";
  import "$lib/styles/post.css";
  export let data: PageData;
  let post = data.data;
  $: test = data.viewComment;
  let post_id = post.id;
  let comment = "";
  let element: any;
  console.log(data);

  onMount(() => scrollToBottom(element));

  const scrollToBottom = async (node: any) => {
    if (data.viewComment) {
      if (node) {
        // You can adjust the behavior and options as needed
        node.scrollIntoView(true);

        // window.scrollBy(node.scroll, -5.4);
        node.scroll({ top: node.scrollHeight, behavior: "smooth" });
        const offset =
          -10.5 *
          parseFloat(getComputedStyle(document.documentElement).fontSize);
        window.scroll(node);
        window.scrollBy(0, offset);
        //alert(node.t);
        // window.scrollTo({
        //   top: node.top + window.scrollY - 100,
        //   behavior: "smooth",
        // });
      }
    }
  };

  const seekMain = async () => {
    if (data.viewComment) {
      let url = $page.url.pathname;
      window.location.href = url;
    }
  };
  const submitComment = async () => {
    fetch("/api/comment/create", {
      method: "POST",
      body: JSON.stringify({
        post_id,
        comment,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.sucess) {
          if (res.comment) {
            data.comments?.unshift(res.comment);
            data.comments = data.comments;
          }
        } else if (res.notLoggedIn) {
          alert("not logged in");
        }
      })
      .catch(() => alert("Failed to submit"));
  };
</script>

{#if !data.viewComment}
  <div class="create-comment-div">
    <div class="create-comment-container">
      <textarea
        bind:value={comment}
        rows="4"
        placeholder="Le comment..."
        class="create-comment-textarea"
      />
      <button on:click={submitComment} class="create-comment-btn"
        >Comment</button
      >
    </div>
  </div>
{:else}
  <div class="go-back-btn-container">
    <button
      class="go-back-btn nav-button"
      on:click={() => window.history.go(-1)}>Go Back</button
    >
    <button class="main-btn nav-button" on:click={seekMain}
      >Return to Main</button
    >
  </div>
{/if}

{#if data.comments && data.comments.length > 0}
  <div class="comments-div" use:scrollToBottom bind:this={element}>
    {#each data.comments as comment, i}
      <Comment data={comment} />
    {/each}
  </div>
{/if}
