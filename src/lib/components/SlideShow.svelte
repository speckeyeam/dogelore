<script lang="ts">
  export let fileArray: any[];
</script>

<div class="file-div">
  <img
    class="post-file"
    src={"https://dogelore.s3.amazonaws.com/" + fileArray.Contents[0].Key}
    alt="doge"
  />
</div>
