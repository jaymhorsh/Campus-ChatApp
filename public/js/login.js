const login = document.getElementById("login-form");
login.addEventListener("submit", async (e) =>{
  e.preventDefault();
  const username = document.getElementById("username").value;
  const select = document.getElementById("room");
  const deptValue = select.options[select.selectedIndex].value;  
  const password = document.getElementById("password").value;
  
  const result = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      deptValue
    }),
  }).then((res) => res.json());

  if (result.status === "ok") {
    // console.log('Got the token:', result.data)
    // saving login details to localStorage
    localStorage.setItem('data', JSON.stringify({username,deptValue},))
    alert("Login Successful");
    window.location = '/chat'
  } else {
    alert(result.error);
  }
});