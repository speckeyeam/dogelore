<script lang="ts">
  import Video from "$lib/components/Video.svelte";
  export let fileArray: any;
  import { register } from "swiper/element/bundle";
  register();

  const isImage = (input: String) => {
    if (input.substring(input.length - 3)) {
      let ext = input.substring(input.length - 3);

      return ext == "jpg" ? true : false;
    }
    return false;
  };
</script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@vime/core@^5/themes/default.css"
/>

<!-- Optional light theme (extends default). ~400B -->

<div
  class="file-div {fileArray.Contents.length > 1 ? '' : 'justify-content-div'}"
>
  {#if fileArray.Contents.length > 1}
    <swiper-container
      navigation="true"
      centered-slides="true"
      style={{
        "--swiper-pagination-color": "#000000",
        "--swiper-pagination-bullet-inactive-color": "#000000",
        "--swiper-pagination-bullet-inactive-opacity": "0",
        "--swiper-pagination-bullet-size": "160px",
        "--swiper-pagination-bullet-horizontal-gap": "60px",
        "--swiper-theme-color": "#000000",
      }}
      pagination="true"
    >
      {#each fileArray.Contents as image}
        <swiper-slide>
          <div class="post-file-container">
            {#if isImage(image.Key)}
              <img
                class="post-file"
                src={"https://dogelore.s3.amazonaws.com/" + image.Key}
                alt="doge"
              />
            {:else}
              <Video src={"https://dogelore.s3.amazonaws.com/" + image.Key} />
            {/if}
          </div>
        </swiper-slide>
      {/each}
    </swiper-container>
  {:else if isImage(fileArray.Contents[0].Key)}
    <img
      class="post-file"
      src={"https://dogelore.s3.amazonaws.com/" + fileArray.Contents[0].Key}
      alt="doge"
    />
  {:else}
    <Video
      src={"https://dogelore.s3.amazonaws.com/" + fileArray.Contents[0].Key}
    />
  {/if}
</div>
