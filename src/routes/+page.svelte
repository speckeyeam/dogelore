<script lang="ts">
  import { onMount } from "svelte";
  import { signIn, signOut } from "@auth/sveltekit/client";
  import { text } from "@sveltejs/kit";
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
  let menu: Boolean[] = [false, true, false];
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
        if (res.sucess) {
        }
      })
      .catch(() => alert("Failed to submit"));
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
        if (res.sucess) {
        }
      })
      .catch(() => alert("Failed to submit"));
  };
  const toggleMenu = async (section: string) => {
    switch (section) {
      case "hot": {
        if (!hot) {
          hot = memes = series = false;
          hot = true;
        }
        break;
      }
      case "memes": {
        if (!memes) {
          hot = memes = series = false;
          memes = true;
        }
        break;
      }
      case "series": {
        if (!series) {
          hot = memes = series = false;
          series = true;
        }
        break;
      }
    }
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

  const toggleCreatePost = async (pu: any) => {
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
  export let data;
  const user = data.session;
  console.log(user);
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
    <a href="#" class="logo">
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
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        class="uploaded-image"
                      />
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
  <div class="menu {isNavVisible && 'visible'}" on:scroll={handleScroll}>
    <button
      on:click={() => toggleMenu("hot")}
      class="menu-item {hot ? 'selected-menu-item' : ''}"
    >
      hot
    </button>
    <button
      on:click={() => toggleMenu("memes")}
      class="menu-item {memes ? 'selected-menu-item' : ''}"
    >
      memes
    </button>
    <button
      on:click={() => toggleMenu("series")}
      class="menu-item {series ? 'selected-menu-item' : ''}"
    >
      series
    </button>

    <div class="dropdown">
      <button
        class="dropbtn {dropdown ? 'selected-dropbtn' : ''}"
        on:click={toggleDropdown}>Sort - {dropdownValue}</button
      >
      {#if dropdown}
        <div class="dropdown-content">
          <button
            class="dropdown-btn {dropdownValue == 'Hot'
              ? 'selected-dropdown-btn'
              : ''}"
            on:click={() => toggleDropdown("Hot")}>Hot</button
          >
          <br />
          <button
            class="dropdown-btn {dropdownValue == 'New'
              ? 'selected-dropdown-btn'
              : ''}"
            on:click={() => toggleDropdown("New")}>New</button
          >
          <br />
          <button
            class="dropdown-btn {dropdownValue == 'Old'
              ? 'selected-dropdown-btn'
              : ''}"
            on:click={() => toggleDropdown("Old")}>Old</button
          >
          <br />
          <button
            class="dropdown-btn {dropdownValue == 'Top'
              ? 'selected-dropdown-btn'
              : ''}"
            on:click={() => toggleDropdown("Top")}>Top</button
          >
        </div>
      {/if}
    </div>
  </div>
  <div style="width:100%; height: 4000px" />
</body>

<style>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    font-family: "Jost", sans-serif;
    border-bottom: 1px solid #3a71d4;
    margin: 0 auto;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    height: 10%;
    background-color: white;
    z-index: 2;
    transition: transform 0.3s ease;
  }

  .nav-links {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: relative;
    font-size: 1rem;
    margin: 0;
    margin-bottom: 0.3rem;
    margin-top: 0.3rem;
  }
  .nav-right {
    margin-right: 1rem;
  }
  .logo {
    text-decoration: none;
    color: black;
    font-size: 2rem;
    margin-left: 1rem;
    margin-right: 3rem;
    /* font family is bold 700*/
  }
  .pfp {
    vertical-align: middle;
    width: 4rem;
    height: 4rem;
    border: double 0.2rem transparent;
    object-fit: cover;
    border-radius: 50%;
    transition: opacity 1s ease;
    cursor: pointer;
    transition: transform 0.7s;
    margin: 0 auto;
  }

  .pfp-wrapper {
    background-image: linear-gradient(white, white),
      radial-gradient(circle at bottom right, #f4b43e, white);
    background-origin: border-box;
    background-clip: content-box, border-box;
    object-fit: cover;
    display: flex;
    justify-content: center; /* Center content horizontally */
    align-items: center; /* Center content vertically */
    margin-right: 1rem;
  }

  .pfp:hover {
    transform: rotate(-180deg);
  }

  .pfp:hover > * {
    transform: rotate(180deg);
  }

  input:focus {
    outline: none;
  }

  input {
    font-weight: 400;
    font-family: "Jost", sans-serif;
  }

  .nav-button {
    align-items: center;
    white-space: nowrap;
    display: flex;
    background: none;
    height: fit-content;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    vertical-align: middle;
    font-weight: 700;
    padding: 0.2rem 1rem 0.2rem 1rem;
    border-radius: 1000rem;
    font-size: 1.25rem;
    background-color: #3a71d4;
    color: white;
    cursor: pointer;
  }
  h1 {
    margin: 0;
  }
  .nav-search {
    width: 28rem;
    height: 2.5rem;
    border-style: none;
    background-color: #f5f5f5;
    border-radius: 0.3rem;
    border-bottom: 0.2rem solid #f4b43e;
    border-right: 0.15rem solid #f4b43e;
    align-items: center;
    display: flex;
    justify-content: center;
    transition-duration: 0.2s;
  }
  .nav-search-input {
    width: 23rem;
    background-color: transparent;
    border-style: none;
    font-size: 1.2rem;
    /*change font size */
  }

  .nav-search:hover {
    border-bottom: 0.2rem solid #f5f5f5;
    border-right: 0.15rem solid #f5f5f5;
  }

  .nav-search-icon {
    margin-right: 1rem;
    fill: #9b9b9b;
    width: 1.8rem;
    height: 1.8rem;
    cursor: pointer;
  }

  .menu {
    display: flex;
    align-items: left;
    user-select: none;
    width: 100%;
    position: fixed;
    top: 10%;
    left: 0;
    right: 0;
    margin-right: 2rem;
    background-color: white;
    max-height: 10%;
    z-index: 1;
    transition-duration: 0.3s;
  }
  .menu:not(.visible) {
    transform: translateY(-100%);
  }
  .menu-item {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    margin-left: 2rem;
    margin-top: 0.8rem;
    padding-bottom: 0.3rem;
    font-family: "Jost", sans-serif !important;
    font-weight: 700;
    font-size: 2rem;
    color: #14336f;
    height: 100%;
    margin-bottom: 0;
    padding-right: 0.5rem;
    padding-left: 0.5rem;
    border-radius: 0.25rem 0.25rem 0 0;
    cursor: pointer;
    bottom: 0;
  }
  .menu:not(.visible) {
    transform: translateY(-100%);
  }
  body {
    background-color: #f5f5f5;
    height: 100%;
    width: 100%;
  }
  .selected-menu-item {
    background-color: #f5f5f5;
  }
  .dropdown {
    margin-left: 2rem;
  }

  .dropbtn {
    color: #9b9b9b;
    font-family: "Jost", sans-serif;
    font-weight: 700;
    font-size: 1.5rem;
    border: none;
    margin-top: 0.8rem;
    background-color: transparent;
    bottom: 0;
  }
  .dropbtn:hover {
    color: black;
  }
  .dropdown {
    position: relative;
    display: flex;
    align-items: center;
    text-align: center;
  }

  .dropdown-content {
    position: absolute;
    background-color: white;
    min-width: 8rem;
    color: #9b9b9b;
    z-index: 3;
    top: calc(100% + 0.125rem);
    font-family: "Jost", sans-serif;
    font-weight: 700;
    text-align: center;
  }
  .dropdown-btn:hover {
    color: black;
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }

  .dropdown-btn {
    align-items: center;
    background: none;
    height: fit-content;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    padding-bottom: 0.25rem;
    padding-top: 0.25rem;
    width: 100%;
    text-align: center;
  }

  .selected-dropdown-btn {
    color: black;
  }

  .selected-dropbtn {
    color: black !important;
  }

  .popup-close {
    position: absolute;
    top: 0rem;
    right: 0rem;
    font-size: 2rem;
    cursor: pointer;
    border-radius: 50%;
    border-style: none;
    background-color: transparent;
  }
  .popup-background {
    border-style: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(244, 180, 62, 0.5); /* Orange with 50% opacity */
    cursor: pointer;
  }

  /* Styles for the popup menu */
  .popup-menu {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    z-index: 9999;
    max-width: 37rem;
  }
  .popup-title {
    font-family: "Jost", sans-serif;
    text-align: left;
    font-size: 2.3rem;
  }
  .popup-div {
    text-align: left;
    display: flex;
    flex-direction: column;
    margin: 0;
  }
  .popup-input {
    border-style: none;
    border: 0.01rem solid;
    display: block;
    /* margin-right: 8rem; */
    /* margin-left: 8rem; */
    font-size: 1.5rem;
    padding-top: 0.5rem;
    padding-left: 0.5rem;
    padding-bottom: 0.5rem;
    border-color: #e2e1e5;
    color: black;
    width: 35rem;
    border-radius: 0.18rem;
  }
  .popup-textarea {
    max-width: 35rem;
    font-family: "Jost", sans-serif;
  }
  .popup-input::placeholder {
    color: #d2d2d2;
  }

  .popup-input:focus {
    border-color: transparent;
  }
  .popup-textarea:focus {
    border-color: transparent;
  }
  .popup-input-tag {
    margin-top: 1rem;
    /* margin-right: 8rem; */
    /* margin-left: 8rem; */
    margin-bottom: 0.2rem;
    font-weight: 200;
    font-size: 1.5rem;
  }
  .popup-button {
    width: fit-content !important;
    right: 0;
    margin-left: auto;
    flex-direction: row;
    display: inline-flex;
    margin-top: 1rem;
  }
  .popup-buttons {
    margin-left: auto;
  }

  .google-sign-in-button {
    width: 15rem;
    cursor: pointer;
    transition: background-color 0.3s, box-shadow 0.3s;
    margin-top: 1rem;
    margin-left: 8.5rem;
    padding: 0.75rem 0.5rem 0.75rem;
    border: none;
    border-radius: 0.4rem;
    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.25);

    color: #757575;
    font-size: 0.9rem;
    font-weight: 500;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;

    background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=);
    background-color: white;
    background-repeat: no-repeat;
    background-position: 12px 11px;
    display: inline-block;
  }
  .other {
    margin-right: 8rem !important;
    margin-left: 8rem !important;
  }
  .other-button {
    font-family: "Jost", sans-serif;
    font-weight: 700;
    display: inline-block;
    margin-left: 0.5rem;
    font-size: 0.8rem;
    color: #14336f;
    border-style: none;
    background-color: transparent;
    text-decoration: underline;
    cursor: pointer;
  }
  .google-sign-in-button:hover {
    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.25);
  }

  .google-sign-in-button:active {
    background-color: #eeeeee;
  }

  .google-sign-in-button:active {
    outline: none;
    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.25),
      0 0 0 3px #c8dafc;
  }

  .google-sign-in-button:disabled {
    filter: grayscale(100%);
    background-color: #ebebeb;
    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.25);
    cursor: not-allowed;
  }
  .invisible {
    color: transparent !important;
    border-style: none !important;
    border-color: transparent !important;
    background-color: transparent !important;
    cursor: default;
  }
  .popup-input-file {
    width: 8rem;
    height: 8rem;
    background-color: white;
    border: 0.2rem solid #3a71d4;
    border-radius: 0.5rem;
    font-size: 2.5rem;
    font-weight: 200;
    cursor: pointer;
    min-width: 8rem;
    height: 8rem;
  }
  .uploaded-image {
    width: 13rem;
    height: 13rem;
    background-color: white;
    border: 0.2rem solid #14336f;
    border-radius: 0.5rem;
    cursor: pointer;

    object-fit: contain;
    min-width: 13rem;
    min-height: 13rem;
    margin-bottom: 0.5rem;
  }
  .file-holder {
    display: flex;
    overflow-x: scroll;
    white-space: nowrap;
    max-width: 35rem;
  }

  .file-holder::-webkit-scrollbar {
    height: 0.5rem;
  }
  .file-holder::-webkit-scrollbar-track {
    background: white;
  }
  .file-holder::-webkit-scrollbar-thumb {
    background: #d9d9d9;
    border-radius: 1rem;
    width: 0.5rem;
  }

  .close-button {
    position: absolute;
    top: 0.3rem;
    right: 0;
    background-color: rgb(255, 255, 255, 0.5);
    border: none;
    padding: 0.5rem;
    left: 10rem;
    cursor: pointer;
    border-radius: 0.25rem;
    width: 3rem;
    height: 3rem;
    transition-duration: 0.3s;
  }
  .close-button:hover {
    background-color: rgb(255, 255, 255, 0.8);
  }
  .image-container {
    margin-right: 0.75rem;
    position: relative;
    display: inline-block;
    width: 13rem;
    min-width: 13rem;
  }
</style>
