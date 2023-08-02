<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Jost:wght@700&display=swap"
    rel="stylesheet"
  />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  />
  <!--https://fonts.google.com/specimen/Jost download later maybe?-->
</head>
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
    <h2 class="nav-right nav-button">Sign Up</h2>
    <h2 class="nav-right nav-button">Login</h2>

    <img
      src="https://s.yimg.com/ny/api/res/1.2/_wPmgp89IYk4DPxgi4_HzQ--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD02NzY-/https://media.zenfs.com/en/nbc_today_217/f0ecf037deda4fc7ee4fa0c1e03584e1"
      alt="Avatar"
      class="pfp nav-right"
    />
  </ul>
</nav>

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
  }
  .nav-links {
    display: flex;
    justify-content: flex-end;
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
    font-size: 1.8rem;
    margin-left: 1rem;
    /* font family is bold 700*/
  }
  .pfp {
    vertical-align: middle;
    width: 4rem;
    height: 4rem;
    border: double 0.2rem transparent;
    object-fit: cover;
    background-image: linear-gradient(white, white),
      radial-gradient(circle at bottom right, #f4b43e, white);
    background-origin: border-box;
    background-clip: content-box, border-box;
    border-radius: 50%;
  }
  .pfp:hover {
    /* background-image: linear-gradient(white, white),
      radial-gradient(circle at top left, #f4b43e, white); */
    /* chatgpt says that making a gradient image would be better but im too lazy to make it now*/
  }
  .nav-button {
    padding: 0.2rem 1rem 0.2rem 1rem;
    border-radius: 1000rem;
    font-size: 1.25rem;
    background-color: #3a71d4;
    color: white;
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
  }
  .nav-search-input {
    width: 23rem;
    background-color: transparent;
    border-style: none;
    font-size: 1.2rem;
    /*change font size */
  }
  .nav-search-icon {
    margin-right: 1rem;
    fill: #9b9b9b;
    width: 1.8rem;
    height: 1.8rem;
  }
</style>
