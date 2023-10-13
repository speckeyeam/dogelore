<script lang="ts">
  import { onMount } from "svelte";
  import { signIn, signOut } from "@auth/sveltekit/client";
  import { text, redirect } from "@sveltejs/kit";
  import { page } from "$app/stores";

  let hot: Boolean = false;
  let memes: Boolean = true;
  let series: Boolean = false;
  let dropdown: Boolean = false;
  let dropdownValue: String = "Hot";
  let popupMenu: Boolean,
    signUp: Boolean,
    logIn: Boolean,
    otherMethods: Boolean = false;
  let files: FileList;
  let imageArray: File[] = [];
  let createPostValue: String = "Image/Video";
  let postPopupMenu = false;
  let filePost = true;
  let postTitle: string,
    postBody: string = "";

  const submitFilePost = async () => {
    var data = new FormData();
    data.append("title", postTitle);

    for (const file of imageArray) {
      data.append("file", file, file.name);
    }
    console.log(data);

    // data.append("files", imageArray[0]);

    fetch("/api/createPost", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.sucess && res.id) {
          let url = $page.url.origin + "/post/" + res.id;
          toggleCreatePost();
          window.open(url, "_blank")!.focus();
          postTitle = postBody = "";
          //oto("/post");
        }
      })
      .catch((message: any) => console.log(message));
  };
  const submitTextPost = async () => {
    var data = new FormData();
    data.append("title", postTitle);
    data.append("text", postBody);

    fetch("/api/createPost", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.sucess && res.id) {
          let url = $page.url.origin + "/post/" + res.id;
          toggleCreatePost();
          window.open(url, "_blank")!.focus();
          postTitle = postBody = "";
          //oto("/post");
        }
      })
      .catch((message: any) => console.log(message));
  };

  const handleSubmit = async () => {
    signIn("credentials", {
      username: "password",
      password: "password",
    });
    fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        password: "password",
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.sucess) {
        } else if (res.notLoggedIn) {
          alert("not logged in");
        }
      })
      .catch(() => alert("Failed to submit"));
  };
  let prevScrollPos = 0;
  let isScrollingUp = false;
  let isNavVisible = true;

  const handleScroll = async () => {
    const currentScrollPos = y;

    if (currentScrollPos > prevScrollPos) {
      // Scrolling down
      isScrollingUp = false;
      isNavVisible = false;
      dropdown = false;
    } else {
      // Scrolling up
      isScrollingUp = true;
      isNavVisible = true;
    }

    prevScrollPos = currentScrollPos;
  };

  const toggleDropdown = async (dd: any) => {
    dropdown = !dropdown;
    if (typeof dd == "string") {
      dropdownValue = dd;
    }
  };

  const toggleSignIn = async (pu: any) => {
    popupMenu = !popupMenu;
  };

  const toggleCreatePost = async () => {
    postPopupMenu = !postPopupMenu;
  };

  const handleImages = async (e: any) => {
    if (e.target.files) {
      let images = e.target.files;
      imageArray = imageArray.concat(Array.from(images));
    }
  };
  const removeImage = async (file: File) => {
    const index = imageArray.indexOf(file, 0);
    if (index > -1) {
      imageArray.splice(index, 1);
      imageArray = imageArray;
    }
  };
  const openFile = async (pu: any) => {
    const input = document.getElementById("imageInput");
    input?.click();
  };

  let y: any;
  export let data: any;
</script>

<svelte:window bind:scrollY={y} on:scroll={handleScroll} />
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Jost:wght@700&display=swap"
    rel="stylesheet"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Jost&display=swap"
    rel="stylesheet"
  />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  />
  <!--https://fonts.google.com/specimen/Jost download later maybe?-->
</head>
<body>
  <nav class="navbar">
    <a href={$page.url.origin} class="logo">
      <h1>Dogelore</h1>
    </a>
    <div class="nav-search">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="bi bi-search nav-search-icon"
        viewBox="0 0 16 16"
      >
        <path
          d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
        />
      </svg>
      <input class="nav-search-input" placeholder="Search..." />
    </div>

    <ul class="nav-links">
      {#if popupMenu}
        <button class="popup-background" on:click={toggleSignIn} />
        <div class="popup-menu" id="popupMenu">
          <div class="popup-div">
            <!-- <button on:click={toggleSignIn} class="popup-close">&#x2715</button> -->
            <h1 class="popup-title">Sign In</h1>
            <button
              on:click={() => signIn("google")}
              type="button"
              class="google-sign-in-button other"
            >
              Sign in with Google
            </button>
            <!-- <h2 class="popup-input-tag">...</h2> -->

            <div class="popup-buttons">
              <button on:click={toggleSignIn} class="nav-button popup-button"
                >Close</button
              >
            </div>
          </div>
        </div>
      {/if}

      {#if postPopupMenu}
        <button class="popup-background" on:click={toggleCreatePost} />
        <div class="popup-menu" id="popupMenu">
          <div class="popup-div">
            <h1 class="popup-title">
              {filePost ? "Image/Video" : "Text"} Post
            </h1>

            <h2 class="popup-input-tag">post title</h2>
            <input
              bind:value={postTitle}
              class="popup-input"
              placeholder="title"
            />
            {#if filePost}
              <h2 class="popup-input-tag">upload file</h2>
              <div class="file-holder">
                {#if files}
                  {#each imageArray as file}
                    <div class="image-container">
                      {#if file.type.includes("image/")}
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          class="uploaded-image"
                        />
                      {:else}
                        <video class="uploaded-image" autoplay muted loop>
                          <source src={URL.createObjectURL(file)} />
                        </video>
                      {/if}

                      <button
                        class="close-button"
                        on:click={() => removeImage(file)}
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
                    </div>
                  {/each}
                {/if}

                <button on:click={openFile} class="popup-input-file">+</button>
              </div>

              <input
                type="file"
                id="imageInput"
                multiple
                style="display: none;"
                accept="image/*, video/*"
                on:change={(e) => handleImages(e)}
                bind:files
              />

              <div class="popup-buttons">
                <button
                  on:click={toggleCreatePost}
                  class="nav-button popup-button">Close</button
                >
                <button
                  class="nav-button popup-button"
                  on:click={() => (filePost = false)}>Text Post</button
                >
                <button
                  on:click={submitFilePost}
                  class="nav-button popup-button">Submit</button
                >
              </div>
            {:else}
              <h2 class="popup-input-tag">post text</h2>
              <textarea
                bind:value={postBody}
                class="popup-input popup-textarea"
                placeholder="text"
              />
              <div class="popup-buttons">
                <button
                  on:click={toggleCreatePost}
                  class="nav-button popup-button">Close</button
                >
                <button
                  class="nav-button popup-button"
                  on:click={() => (filePost = true)}>File Post</button
                >
                <button
                  on:click={submitTextPost}
                  class="nav-button popup-button">Submit</button
                >
              </div>
            {/if}
          </div>
        </div>
      {/if}

      {#if data.session}
        <!-- <button on:click={() => signOut("google")} class="nav-right nav-button"
            >Sign out</button
          > -->
        <button on:click={toggleCreatePost} class="nav-right nav-button"
          >le post</button
        >
        <div class="pfp pfp-wrapper">
          <img
            src={data.session.user?.image ||
              "https://s.yimg.com/ny/api/res/1.2/_wPmgp89IYk4DPxgi4_HzQ--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD02NzY-/https://media.zenfs.com/en/nbc_today_217/f0ecf037deda4fc7ee4fa0c1e03584e1"}
            alt="Avatar"
            class="pfp nav-right"
          />
        </div>
      {:else}
        <div class="pfp invisible" />
        <button on:click={toggleSignIn} class="nav-right nav-button"
          >Sign In</button
        >
      {/if}
    </ul>
  </nav>
</body>
