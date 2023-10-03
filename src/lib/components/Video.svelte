<script lang="ts">
  import { onMount } from "svelte";

  export let src: any;
  let showPlayer = false;
  let player;

  onMount(async () => {
    const { defineCustomElements } = await import("@vime/core");
    defineCustomElements();
    showPlayer = true;
  });
</script>

{#if showPlayer}
  <vm-player bind:this={player}>
    <vm-video>
      <source data-src={src} type="video/mp4" />
    </vm-video>
    <vm-ui>
      <vm-default-controls hide-on-mouse-leave />
    </vm-ui>
  </vm-player>
{/if}
