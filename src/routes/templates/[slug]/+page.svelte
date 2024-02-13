<script lang="ts">
  import NavBar from "$lib/components/NavBar.svelte";
  export let data;
  import "$lib/styles/style.css";
  import { page } from "$app/stores";
  let templatePopupMenu = true;
  let template = true;
  let uploading = false;
  let postTitle = "";
  let file: any;
  console.log(data);
  const toggleCreatePost = async () => {
    templatePopupMenu = !templatePopupMenu;
  };

  const handleImages = async (e: any) => {
    if (e.target.files) {
      file = e.target.files[0];
    }
  };

  const openFile = async (pu: any) => {
    const input = document.getElementById("imageInput");
    input?.click();
  };

  const removeImage = async () => {
    file = null;
  };

  const submitFilePost = async () => {
    if (!uploading) {
      uploading = true;
      var data = new FormData();
      data.append("title", postTitle);
      data.append("file", file, file.name);

      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          // uploadProgress = percentComplete;
        }
      };

      xhr.onloadend = () => {
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          if (res.sucess && res.id) {
            let url = $page.url.origin + "/post/" + res.id;
            toggleCreatePost();
            window.open(url, "_blank")!.focus();
            postTitle = "";
            file = null;
            uploading = false;
          }
        }
      };

      xhr.open("POST", "/api/templates/folder/create", true);
      xhr.send(data);
    }
  };
</script>

<NavBar {data} />
<div class="template-container"></div>
<hr />

<div class="template-div">
  <button class="create-template">+</button>
  <h2 class="template-text">Create Template</h2>
</div>

{#if templatePopupMenu}
  <button class="popup-background" on:click={toggleCreatePost} />
  <div class="popup-menu" id="popupMenu">
    <div class="popup-div">
      <h1 class="popup-title">
        New {template ? "Template" : "Entry"}
      </h1>

      <h2 class="popup-input-tag">title</h2>
      <input bind:value={postTitle} class="popup-input" placeholder="title" />

      <h2 class="popup-input-tag">upload file</h2>
      <div class="file-holder">
        {#if file}
          <div class="image-container">
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              class="uploaded-image"
            />
            <button class="close-button" on:click={removeImage}>
              <svg
                color="#14336f"
                width="2rem"
                height="2rem"
                fill="#000000"
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 460.775 460.775"
                xml:space="preserve"
              >
                <path
                  d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
         c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
         c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
         c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
         l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
         c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
                />
              </svg></button
            >
          </div>
        {/if}
        {#if !file}
          <button on:click={openFile} class="popup-input-file">+</button>
        {/if}
      </div>

      <input
        type="file"
        id="imageInput"
        style="display: none;"
        accept="image/*, video/*"
        on:change={(e) => handleImages(e)}
      />
      <!-- <progress class="progress-bar" value={uploadProgress} max="100"
      ></progress> -->
      <div class="popup-buttons">
        <button on:click={toggleCreatePost} class="nav-button popup-button"
          >Close</button
        >

        <button on:click={submitFilePost} class="nav-button popup-button"
          >Submit</button
        >
      </div>
    </div>
  </div>
{/if}

<a href="/backgrounds">backgrounds</a>
<a href="/characters">characters</a>
