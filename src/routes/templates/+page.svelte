<script lang="ts">
  import NavBar from "$lib/components/NavBar.svelte";
  export let data;
  export let folders: any;
  import "$lib/styles/style.css";
  import { page } from "$app/stores";
  let templatePopupMenu = false;

  let uploading = false;
  let postTitle = "";
  let file: any;
  let userId = (data?.session?.user as User)?.id;

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

  const renameTemplate = async (id: number, e: Event) => {
    const title = e.target.value;
    fetch("/api/templates/rename", {
      method: "POST",
      body: JSON.stringify({
        id,
        isFolder: true,
        title,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          //yay
        } else {
        }
      })
      .catch((e) => console.log(e.message));
  };

  const deleteTemplate = async (id: number) => {
    fetch("/api/templates/delete", {
      method: "POST",
      body: JSON.stringify({
        id,
        isFolder: true,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          if (res.folder) {
            const index = data?.folders?.findIndex(
              (folder) => folder.id === res.folder.id
            );

            if (index !== -1 && index != null) {
              data?.folders?.splice(index, 1);
              data.folders = data.folders;
            }
          }
        } else {
        }
      })
      .catch((e) => console.log(e.message));
  };
  const submitFilePost = async () => {
    if (!uploading) {
      uploading = true;
      var body = new FormData();
      body.append("title", postTitle);
      body.append("file", file, file.name);

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
          if (res.sucess && res.folder && res.entry) {
            console.log(res.entry);
            res.folder.entries = [0];
            //res.folder.entries.push(res.entry);
            data.folders?.push(res.folder);
            console.log(data.folders);
            data.folders = data.folders;

            let url = $page.url.origin + "/templates/" + res.folder.id;
            toggleCreatePost();
            window.open(url, "_blank")!.focus();
            postTitle = "";
            file = null;
            uploading = false;
          }
        }
      };

      xhr.open("POST", "/api/templates/folder/create", true);
      xhr.send(body);
    }
  };

  //infinite scroll
  let loadmore = false;
  let y: any;
  const handleScroll = async () => {
    console.log("test");
    if (
      window.innerHeight * 1.6 + window.scrollY >=
      document.body.offsetHeight
    ) {
      if (!loadmore) {
        loadmore = true;
        loadMore();
        console.log("test");
      }
    }
  };

  const loadMore = async () => {
    // alert(data.posts[data.posts.length - 1].title);
    console.log(data.folders);
    fetch("/api/post/load", {
      method: "POST",
      body: JSON.stringify({
        id: data.folders[data.folders.length - 1].id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.folders.length > 0) {
          data.folders.push(...res.folders);
          data.folders = data.folders;
          loadmore = false;
        } else {
          loadmore = false;
        }
      })
      .catch((e) => console.log(e.message));
  };
</script>

<svelte:window bind:scrollY={y} on:scroll={handleScroll} />
<NavBar {data} />
<div class="template-container">
  <input placeholder="quoge..." class="template-search" />
  <br />

  {#if data.session}
    <div class="template-div">
      <button
        class="create-template"
        on:click={() => (templatePopupMenu = true)}>+</button
      >
      <h2 class="template-text">Template</h2>
    </div>
  {/if}
  {#if templatePopupMenu && data?.session}
    <button class="popup-background" on:click={toggleCreatePost} />
    <div class="popup-menu" id="popupMenu">
      <div class="popup-div">
        <h1 class="popup-title">New Template</h1>

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

  {#if data.folders}
    {#each data.folders as entry, i}
      <div class="template-div">
        <div class="folder-div">
          <a href={"templates/" + entry.id}>
            <img
              src={"https://dogelore.s3.amazonaws.com/folder/" +
                entry.imageId +
                ".webp"}
              class="entry-image"
            />
          </a>
          {#if entry.userId == userId}
            <button
              class="close-button-template"
              on:click={() => deleteTemplate(entry.id)}
            >
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
          {/if}
        </div>
        {#if entry.userId == userId}
          <div class="template-text-div">
            <input
              class="template-text template-input"
              value={entry.title}
              on:change={(e) => renameTemplate(entry.id, e)}
            />
          </div>
        {:else}
          <h2 class="template-text">
            {entry.title}
          </h2>
        {/if}
      </div>
    {/each}
  {/if}
</div>
