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
  $: comments = data.comments;
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
</script>

{#if comments && comments.length > 0}
  <div class="comments-div" use:scrollToBottom bind:this={element}>
    {#each comments as comment, i}
      <Comment data={comment} />
    {/each}
  </div>
{/if}
