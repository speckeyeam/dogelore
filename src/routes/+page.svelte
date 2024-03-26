<script lang="ts">
  import { onMount } from "svelte";
  import { signIn, signOut } from "@auth/sveltekit/client";
  import { text, redirect } from "@sveltejs/kit";
  import { page } from "$app/stores";
  import NavBar from "$lib/components/NavBar.svelte";
  import Post from "$lib/components/Post.svelte";
  import "$lib/styles/style.css";
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
  let currentView: string = "Option2";

  const toggleOption = async () => {
    switch (currentView) {
      case "Option1":
        currentView = "Option2";
        break;
      case "Option2":
        currentView = "Option3";
        break;
      case "Option3":
        currentView = "Option1";
        break;
    }
  };

  const toggleMenu = async (section: string) => {
    switch (section) {
      case "hot": {
        if (!hot) {
          hot = memes = series = false;
          hot = true;
        } else {
          toggleOption();
        }
        break;
      }
      case "memes": {
        if (!memes) {
          hot = memes = series = false;
          memes = true;
        } else {
          toggleOption();
        }
        break;
      }
      case "series": {
        if (!series) {
          hot = memes = series = false;
          series = true;
        } else {
          toggleOption();
        }
        break;
      }
    }
  };

  let prevScrollPos = 0;
  let isScrollingUp = false;
  let isNavVisible = true;
  let loadmore = false;
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
    console.log(data.posts);
    fetch("/api/post/load", {
      method: "POST",
      body: JSON.stringify({
        id: data.posts[data.posts.length - 1].id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.posts.length > 0) {
          data.posts.push(...res.posts);
          data.posts = data.posts;
          loadmore = false;
        } else {
          loadmore = false;
        }
      })
      .catch((e) => console.log(e.message));
  };

  const toggleDropdown = async (dd: any) => {
    dropdown = !dropdown;
    if (typeof dd == "string") {
      dropdownValue = dd;
    }
  };

  let y: any;
  export let data;
  console.log(data.posts.Files);
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
<body style="margin: 0rem !important">
  <NavBar {data} />
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

  <div class="posts-div">
    {#if currentView == "Option1"}
      <div class="masonry">
        {#each data.posts as post, i}
          <Post
            userId={data.session ? data?.session?.user?.id : null}
            {post}
            type={currentView}
          />
        {/each}
      </div>
    {:else if currentView == "Option2"}
      <div class="twoRow">
        {#each data.posts as post, i}
          <Post
            userId={data.session ? data?.session?.user?.id : null}
            {post}
            type={currentView}
          />
        {/each}
      </div>
    {:else if currentView == "Option3"}
      <div class="rows">
        {#each data.posts as post, i}
          <Post
            userId={data.session ? data?.session?.user?.id : null}
            {post}
            type={currentView}
          />
        {/each}
      </div>
    {/if}
  </div>
</body>
