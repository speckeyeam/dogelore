<script lang="ts">
  export let nodeReference: any;
  export let data: {};
</script>

<div bind:this={nodeReference} style="padding-top: 1rem; padding-bottom: 1rem;">
  <h2>comment</h2>
</div>
<slot />
