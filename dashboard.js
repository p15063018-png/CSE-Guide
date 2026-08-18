const userDisplay = document.getElementById("user-display");
const logoutButton = document.getElementById("logout-btn");

function loadUser() {
  const session = localStorage.getItem("user_session");
  if (!session) {
    window.location.href = "login.html";
    return null;
  }

  try {
    const user = JSON.parse(session);
    userDisplay.textContent = `${user.branch} • ${user.college}`;
    return user;
  } catch {
    window.location.href = "login.html";
    return null;
  }
}

logoutButton.addEventListener("click", function () {
  localStorage.removeItem("user_session");
  window.location.href = "login.html";
});

loadUser();
