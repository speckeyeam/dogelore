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
  let popupValue: String;
  let menu: Boolean[] = [false, true, false];
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

  const togglePopupMenu = async (pu: any) => {
    if (typeof pu == "string") {
      popupMenu = true;
      switch (pu) {
        case "Sign Up": {
          signUp = true;
          logIn = otherMethods = false;
          break;
        }
        case "Log In": {
          logIn = true;
          signUp = otherMethods = false;
          break;
        }
        case "Other": {
          otherMethods = true;
          logIn = signUp = false;
          break;
        }
      }
      popupValue = pu;
    } else {
      popupMenu = false;
    }
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
      <button
        on:click={() => togglePopupMenu("Sign Up")}
        class="nav-right nav-button">Sign Up</button
      >
      <button
        on:click={() => togglePopupMenu("Log In")}
        class="nav-right nav-button">Login</button
      >

      {#if popupMenu}
        <button class="popup-background" on:click={togglePopupMenu} />
        <div class="popup-menu" id="popupMenu">
          <div class="popup-div">
            <button on:click={togglePopupMenu} class="popup-close"
              >&#x2715</button
            >
            <h1 class="popup-title">{popupValue}</h1>
            {#if logIn}
              <h2 class="popup-input-tag">email</h2>

              <input class="popup-input" placeholder="email" />
              <h2 class="popup-input-tag">password</h2>
              <input class="popup-input" placeholder="password" />
              <div class="google-sign-in-other-div">
                <button
                  on:click={() => signIn("google")}
                  type="button"
                  class="google-sign-in-button"
                >
                  Sign in with Google
                </button>
                <button
                  on:click={() => togglePopupMenu("Other")}
                  class="other-button">Other...</button
                >
              </div>

              <div class="popup-buttons">
                <button class="nav-button popup-button">Submit</button>
                <button
                  on:click={() => togglePopupMenu("Sign Up")}
                  class="nav-button popup-button">Sign Up</button
                >
              </div>
            {/if}
            {#if signUp}
              <h2 class="popup-input-tag">username</h2>
              <input class="popup-input" placeholder="username" />
              <h2 class="popup-input-tag">email</h2>
              <input class="popup-input" placeholder="email" />
              <h2 class="popup-input-tag">password</h2>
              <input class="popup-input" placeholder="password" />
              <div class="google-sign-in-other-div">
                <button
                  on:click={() => signIn("google")}
                  type="button"
                  class="google-sign-in-button"
                >
                  Sign in with Google
                </button>
                <button
                  on:click={() => togglePopupMenu("Other")}
                  class="other-button"
                >
                  Other...
                </button>
              </div>

              <div class="popup-buttons">
                <button class="nav-button popup-button">Submit</button>
                <button
                  on:click={() => togglePopupMenu("Log In")}
                  class="nav-button popup-button">Log In</button
                >
              </div>
            {/if}

            {#if otherMethods}
              <button
                on:click={() => signIn("google")}
                type="button"
                class="google-sign-in-button other"
              >
                Sign in with Google
              </button>
              <h2 class="popup-input-tag">...</h2>
              <div class="popup-buttons">
                <button
                  on:click={() => togglePopupMenu("Sign Up")}
                  class="nav-button popup-button">Sign Up</button
                >
                <button
                  on:click={() => togglePopupMenu("Log In")}
                  class="nav-button popup-button">Log In</button
                >
              </div>
            {/if}
          </div>
        </div>
      {/if}
      {#if data.session}
        <button on:click={() => signOut("google")} class="nav-right nav-button"
          >Sign out</button
        >
        <div class="pfp pfp-wrapper">
          <img
            src="https://s.yimg.com/ny/api/res/1.2/_wPmgp89IYk4DPxgi4_HzQ--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD02NzY-/https://media.zenfs.com/en/nbc_today_217/f0ecf037deda4fc7ee4fa0c1e03584e1"
            alt="Avatar"
            class="pfp nav-right"
          />
        </div>
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
    margin-right: 8rem;
    margin-left: 8rem;
    font-size: 1.5rem;
    padding-top: 0.5rem;
    padding-left: 0.5rem;
    padding-bottom: 0.5rem;
    border-color: #e2e1e5;
    color: black;
    width: 20rem;
    border-radius: 0.18rem;
  }
  .popup-input::placeholder {
    color: #d2d2d2;
  }

  .popup-input:focus {
    border-color: transparent;
  }

  .popup-input-tag {
    margin-top: 0.25rem;
    margin-right: 8rem;
    margin-left: 8rem;
    margin-bottom: 0.1rem;
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
</style>
