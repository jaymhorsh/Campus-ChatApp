// 1. confirm password
const password = document.getElementById("password");
const confirm_password = document.getElementById("confirm_password");

// Validate Password
function validatePassword() {
  if (password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    confirm_password.setCustomValidity("");
  }
}
password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;

// Registration form
const form = document.getElementById("reg-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const firstName = document.getElementById("firstname").value;
  const lastName = document.getElementById("lastname").value;
  const matricNum = document.getElementById("matricNum").value;
  const birthDate = document.getElementById("birthdate").value;
  const select = document.getElementById("department");
  const deptValue = select.options[select.selectedIndex].value;
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  // Making a request
  const result = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName,
      lastName,
      matricNum,
      birthDate,
      deptValue,
      email,
      username,
      password,
    }),
  }).then((res) => res.json());

  if (result.status === "ok") {
    alert("Registration was Successful, Proceed to Login?");
    window.location = "/";
  } else {
    alert(result.error);
  }
});

// Login
