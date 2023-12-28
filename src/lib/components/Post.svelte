<script lang="ts">
  import Video from "$lib/components/Video.svelte";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  export let post: any;
  let fileName = post.Files[0];
  let title = post.title;
  let user = post.User;
  export let userId: any;
  let liked: boolean;
  let disliked = false;
  let likeCount = 0;
  let originalCount = 0;
  console.log(user);
  export let type: string;
  import { register } from "swiper/element/bundle";
  register();

  const isImage = (input: string) => {
    console.log(input);
    if (input.length > 3) {
      if (input.substring(input.length - 3)) {
        let ext = input.substring(input.length - 3);

        return ext == "jpg" ? true : false;
      }
    }
    return false;
  };

  const like = async (like: boolean) => {
    if (userId) {
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

      likeCount = likeCount;

      fetch("/api/post/like", {
        method: "POST",
        body: JSON.stringify({
          post_id: post.id,
          like,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          likeCount = likeCount;
          if (res.success) {
          } else if (res.notLoggedIn) {
            alert("not logged in");
          } else {
          }
        })
        .catch(() => alert("Failed to submit"));
    }
  };

  likeCount = post.Likes.length - post.Dislikes.length;
  console.log(likeCount);
  originalCount = post.Likes.length - post.Dislikes.length;

  if (userId) {
    if (post.Likes.find((item: any) => item.id === userId + post.id)) {
      liked = true;
      originalCount = post.Likes.length - post.Dislikes.length - 1;
    }

    if (post.Dislikes.find((item: any) => item.id === userId + post.id)) {
      disliked = true;
      originalCount = post.Likes.length - post.Dislikes.length + 1;
    }
  }
</script>

<!-- Optional light theme (extends default). ~400B -->
{#if type == "Option1"}
  <div class="postContainer">
    <a href={"/post/" + fileName.postId} class="postContainer">
      {#if isImage(fileName.postFileName)}
        <img
          class="item"
          src={"https://dogelore.s3.amazonaws.com/" + fileName.postFileName}
          alt="doge"
        />
      {:else}
        <video
          class="item"
          src={"https://dogelore.s3.amazonaws.com/" + fileName.postFileName}
          autoplay={true}
          loop={true}
          muted={true}
        />
      {/if}
    </a>
  </div>
{/if}
{#if type === "Option2"}
  <div class="postContainer">
    <div>
      <h2 class="preview-post-title">{title}</h2>
      <h2 class="preview-post-user">{user ? user.name : "???"}</h2>
    </div>

    <a href={"/post/" + fileName.postId} class="postContainer">
      {#if isImage(fileName.postFileName)}
        <img
          class="item postOption2"
          src={"https://dogelore.s3.amazonaws.com/" + fileName.postFileName}
          alt="doge"
        />
      {:else}
        <video
          class="item postOption2"
          src={"https://dogelore.s3.amazonaws.com/" + fileName.postFileName}
          autoplay={true}
          loop={true}
          muted={true}
        />
      {/if}
    </a>
    <div class="post-likes-div preview-likes-div">
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
{#if type === "Option3"}
  <div class="option3Container">
    <a href={"/post/" + fileName.postId} class="postContainer3">
      {#if isImage(fileName.postFileName)}
        <img
          class="postOption3"
          src={"https://dogelore.s3.amazonaws.com/" + fileName.postFileName}
          alt="doge"
        />
      {:else}
        <video
          class="postOption3"
          src={"https://dogelore.s3.amazonaws.com/" + fileName.postFileName}
          autoplay={true}
          loop={true}
          muted={true}
        />
      {/if}
    </a>

    <div class="post-likes-div-option3">
      <div class="post-likes-container-option3">
        <button
          class="like-post btn {liked ? '' : 'not-selected-like-btn'}"
          on:click={() => like(true)}>👍</button
        >
        <h3 class="post-likes-option3 {liked ? '' : ''}">
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

    <div>
      <h2 class="preview-post-title preview-post-option3">{title}</h2>
      <h2 class="preview-post-user preview-post-option3">
        {user ? user.name : "???"}
      </h2>
    </div>
  </div>
{/if}
