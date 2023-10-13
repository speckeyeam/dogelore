<script lang="ts">
  import Video from "$lib/components/Video.svelte";
  import { page } from "$app/stores";
  export let fileName: any;
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
<a href={"/post/" + fileName.postId}>
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
    />
  {/if}
</a>
