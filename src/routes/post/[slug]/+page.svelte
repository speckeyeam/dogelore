<script lang="ts">
  import type { PageData } from "./$types";
  import NavBar from "$lib/components/NavBar.svelte";
  import Comment from "$lib/components/Comment.svelte";
  import SlideShow from "$lib/components/SlideShow.svelte";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import "$lib/styles/style.css";
  import "$lib/styles/post.css";
  import { goto } from "$app/navigation";
  export let data: PageData;
  let post = data.data;
  $: test = data.viewComment;
  let post_id = post.id;
  let comment = "";
  let element: any;
  let liked: boolean;
  let disliked = false;
  // console.log(data);
  let likeCount = 0;
  let originalCount = 0;
  let userId = (data?.session?.user as User).id;
  const like = async (like: boolean) => {
    if (like) {
      if (liked) {
        liked = disliked = false;
        likeCount = originalCount;
      } else {
        likeCount = likeCount + (disliked ? 2 : 1);
        liked = true;
        disliked = false;
      }
    } else {
      if (disliked) {
        liked = disliked = false;
        likeCount = originalCount;
      } else {
        likeCount = likeCount - (liked ? 2 : 1);
        disliked = true;
        liked = false;
      }
    }

    fetch("/api/post/like", {
      method: "POST",
      body: JSON.stringify({
        post_id,
        like,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          likeCount = likeCount;
        } else if (res.notLoggedIn) {
          alert("not logged in");
        } else {
        }
      })
      .catch(() => console.log("stop spamming it bruh"));
  };

  onMount(() => scrollToBottom(element));

  const scrollToBottom = async (node: any) => {
    likeCount = post.Likes.length - post.Dislikes.length;
    originalCount = post.Likes.length - post.Dislikes.length;

    if (data.session?.user) {
      console.log(data.fileArray);

      if (
        post.Likes.find(
          (item: any) => item.id === data?.session?.user?.id + post.id
        )
      ) {
        liked = true;
        originalCount = post.Likes.length - post.Dislikes.length - 1;
      }

      if (
        post.Dislikes.find(
          (item: any) => item.id === data?.session?.user?.id + post.id
        )
      ) {
        disliked = true;
        originalCount = post.Likes.length - post.Dislikes.length + 1;
      }
    }

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
      }
    }
  };
  const seekMain = async () => {
    if (data.viewComment) {
      let url = $page.url.pathname;
      //window.location.href = url;
      goto(url);
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

<NavBar {data} />

{#if post.file}
  <div class="post-bg">
    <div>
      <h1 class="post-title">{post.title}</h1>
      <h3 class="post-user">{post.User ? post.User.name : "???"}</h3>
      <h3 class="post-type">meme</h3>
      <div class="post-text-div">
        {#if data.fileArray}
          <SlideShow fileArray={data.fileArray} />
        {/if}
      </div>
    </div>
    <div class="post-likes-div">
      <div class="post-likes-container">
        <button
          class="like-post btn {liked ? '' : 'not-selected-like-btn'}"
          on:click={() => like(true)}>👍</button
        >
        <h3 class="post-likes {liked ? '' : ''}">
          {likeCount}
        </h3>
        <button
          class="dislike-post btn {disliked ? '' : 'not-selected-like-btn  '}"
          on:click={() => like(false)}>👎</button
        >
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
{:else}<div class="post-bg">
    <div>
      <h1 class="post-title">{post.title}</h1>
      <h3 class="post-user">{post.User ? post.User.name : "???"}</h3>
      <h3 class="post-type">meme</h3>
      <div class="post-text-div">
        <h3 class="post-text">{post.text}</h3>
      </div>
    </div>
    <div class="post-likes-div">
      <div class="post-likes-container">
        <button
          class="like-post btn {liked ? '' : 'not-selected-like-btn'}"
          on:click={() => like(true)}>👍</button
        >
        <h3 class="post-likes {liked ? '' : ''}">
          {likeCount}
        </h3>
        <button
          class="dislike-post btn {disliked ? '' : 'not-selected-like-btn  '}"
          on:click={() => like(false)}>👎</button
        >
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
{/if}
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

{#key $page.url.search}
  {#if data.comments && data.comments.length > 0}
    <div class="comments-div" bind:this={element}>
      {#each data.comments as comment, i}
        <Comment
          redirect={false}
          second={true}
          data={comment}
          nodeReference={null}
          user_id={userId}
        />
      {/each}
    </div>
  {/if}
{/key}
