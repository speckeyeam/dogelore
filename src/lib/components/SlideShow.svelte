<script lang="ts">
  import Video from "$lib/components/Video.svelte";
  export let fileArray: any;
  import { register } from "swiper/element/bundle";
  register();

  const isImage = (input: string) => {
    if (input.length > 4) {
      if (input.substring(input.length - 4)) {
        let ext = input.substring(input.length - 4);

        return ext == "webp" ? true : false;
      }
    }
    return false;
  };
</script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@vime/core@^5/themes/default.css"
/>

<!-- Optional light theme (extends default). ~400B -->

<div class="file-div {fileArray.length > 1 ? '' : 'justify-content-div'}">
  {#if fileArray.length > 1}
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
      {#each fileArray as image}
        <swiper-slide>
          <div class="post-file-container">
            {#if isImage(image.postFileName)}
              <a
                href={"https://dogelore.s3.amazonaws.com/" + image.postFileName}
                target="_blank"
              >
                <img
                  class="post-file"
                  src={"https://dogelore.s3.amazonaws.com/" +
                    image.postFileName}
                  alt="doge"
                />
              </a>
            {:else}
              <Video
                src={"https://dogelore.s3.amazonaws.com/" + image.postFileName}
              />
            {/if}
          </div>
        </swiper-slide>
      {/each}
    </swiper-container>
  {:else if isImage(fileArray[0].postFileName)}
    <a
      href={"https://dogelore.s3.amazonaws.com/" + fileArray[0].postFileName}
      target="_blank"
    >
      <img
        class="post-file"
        src={"https://dogelore.s3.amazonaws.com/" + fileArray[0].postFileName}
        alt="doge"
      />
    </a>
  {:else}
    <Video
      src={"https://dogelore.s3.amazonaws.com/" + fileArray[0].postFileName}
    />
  {/if}
</div>
