<script lang="ts">
  export let fileArray: any[];
  import { register } from "swiper/element/bundle";
  register();

  const isImage = async (input: String) => {
    if (input.substring(input.length - 3)) {
      let ext = input.substring(input.length - 3);
      return ext == "jpg" ? true : false;
    }
  };
</script>

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
              <video
                class="post-file"
                src={"https://dogelore.s3.amazonaws.com/" + image.Key}
              />
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
    <video
      class="post-file"
      src={"https://dogelore.s3.amazonaws.com/" + fileArray.Contents[0].Key}
    />
  {/if}
</div>

<style>
  .swiper-button-prev {
    color: red;
  }

  .swiper-button-next {
    color: #000;
  }
  .swiper-button-next,
  .swiper-rtl .swiper-button-prev {
    color: black !important;
  }
  :root {
    --swiper-theme-color: black !important;
  }
  :host {
    --swiper-theme-color: none !important;
  }
</style>
