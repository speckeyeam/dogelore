<script lang="ts">
  import Video from "$lib/components/Video.svelte";
  import { page } from "$app/stores";
  export let post: any;
  let fileName = post.Files[0];
  let title = post.title;
  let user = post.User;
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
</script>

<!-- Optional light theme (extends default). ~400B -->

<div class="postContainer">
  {#if type == "Option2"}
    <div>
      <h2 class="preview-post-title">{title}</h2>
      <h2 class="preview-post-user">{user.name}</h2>
    </div>
  {/if}
  <a href={"/post/" + fileName.postId} class="postContainer">
    {#if isImage(fileName.postFileName)}
      <img
        class="item {type == 'Option2' ? 'postOption2' : ''}"
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
  {#if type == "Option2"}
    <div class="preview-likes-dislikes-div">
      <h2>updoot section</h2>
    </div>
  {/if}
</div>
