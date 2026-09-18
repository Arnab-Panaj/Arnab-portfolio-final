// make toggle theme work

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark-theme");

  if (document.body.classList.contains("dark-theme")) {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");

    //save dark theme
    localStorage.setItem("theme", "dark");
  } else {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");

    //save light them
    localStorage.setItem("theme", "light");
  }
});

//load the previous theme after refresh
const savedTheme = localStorage.getItem("theme");
if (savedTheme == "dark") {
  document.body.classList.add("dark-theme");
  themeIcon.classList.remove("fa-sun");
  themeIcon.classList.add("fa-moon");
}
//handle all button works

const navigationButtons = document.querySelectorAll(".navigation-button");

navigationButtons.forEach(function (button) {
  button.addEventListener("click", function (event) {
    event.preventDefault();

    // Get the container ID from data-target
    const targetId = button.dataset.target;

    // Hide all containers
    document.getElementById("home-container").style.display = "none";
    document.getElementById("personal-details-container").style.display =
      "none";
    document.getElementById("education-container").style.display = "none";
    document.getElementById("internship-container").style.display = "none";
    document.getElementById("project-container").style.display = "none";
    document.getElementById("skill-container").style.display = "none";
    document.getElementById("contact-me-container").style.display = "none";
    document.getElementById("admin-login-container").style.display = "none";
    document.getElementById("user-response").style.display = "none";

    // Remove underline from all navigation buttons
    navigationButtons.forEach(function (btn) {
      btn.style.textDecoration = "none";
    });

    // Show selected container
    document.getElementById(targetId).style.display = "block";

    // Underline selected button
    button.style.textDecoration = "underline";

    //save the currently selected container to the local storage
    localStorage.setItem("activeContainer", targetId);
  });
});

//load the previous page after refresh
const containers = [
  document.getElementById("home-container"),
  document.getElementById("personal-details-container"),
  document.getElementById("education-container"),
  document.getElementById("internship-container"),
  document.getElementById("project-container"),
  document.getElementById("skill-container"),
  document.getElementById("contact-me-container"),
  document.getElementById("admin-login-container"),
];
const savedContainer = localStorage.getItem("activeContainer");

if (savedContainer) {
  containers.forEach(function (container) {
    container.style.display = "none";
  });

  document.getElementById(savedContainer).style.display = "block";
  navigationButtons.forEach(function (button) {
    if (button.dataset.target === savedContainer) {
      button.style.textDecoration = "underline";
    }
  });
} else {
  document.getElementById("home-container").style.display = "block";
}

// datbase url
const db_url =
  "https://script.google.com/macros/s/AKfycbzOS3hfE11_tuXH6ZZmZoscOPYwM3_M3E0-K7MuA3M7yElcNRMzw47hQFV1nxAWLyNhbw/exec";

// Contact Me Form

const control_of_contact_form = document.getElementById("contact-form");

control_of_contact_form.addEventListener("submit", async function (event) {
  event.preventDefault();

  let name = document.getElementById("input-name").value;

  let email = document.getElementById("input-email").value;

  let msg = document.getElementById("input-message").value;

  try {
    let response = await fetch(db_url, {
      method: "POST",

      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },

      body: JSON.stringify({
        action: "save_message",
        name: name,
        email: email,
        msg: msg,
      }),
    });

    let result = await response.json();

    if (result.success) {
      alert("Message submitted, will get back shortly");

      control_of_contact_form.reset();
    } else {
      alert("Message could not be saved");
    }
  } catch (error) {
    console.error(error);

    alert("There was a problem submitting the message!");
  }
});

// Admin Login

const control_of_admin_form = document.getElementById("admin-form");

const control_of_admin_login_section = document.getElementById(
  "admin-login-container",
);

const control_of_user_response_section =
  document.getElementById("user-response");

control_of_admin_form.addEventListener("submit", async function (event) {
  event.preventDefault();

  let username = document.getElementById("input-username").value;

  let password = document.getElementById("input-password").value;

  try {
    let response = await fetch(db_url, {
      method: "POST",

      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },

      body: JSON.stringify({
        action: "login",
        username: username,
        password: password,
      }),
    });

    let result = await response.json();

    if (result.success) {
      alert("Login successful");

      control_of_admin_login_section.style.display = "none";

      control_of_user_response_section.style.display = "block";

      getUserMessages();
    } else {
      alert("Access denied, please try again");
    }
  } catch (error) {
    console.error(error);

    alert("There was a problem with login!");
  }
});

// Get User Messages

async function getUserMessages() {
  try {
    let response = await fetch(db_url);

    let result = await response.json();

    if (!result.success) {
      alert("Could not fetch the messages");

      return;
    }

    const control_of_user_messages_div =
      document.getElementById("user-messages");

    control_of_user_messages_div.innerHTML = "";

    result.messages.forEach(function (responses) {
      let control_of_new_div = document.createElement("div");

      let nameParagraph = document.createElement("p");

      nameParagraph.textContent = "Name: " + responses.name;

      let emailParagraph = document.createElement("p");

      emailParagraph.textContent = "Email: " + responses.email;

      let messageParagraph = document.createElement("p");

      messageParagraph.textContent = "Message: " + responses.msg;

      let dateParagraph = document.createElement("p");

      dateParagraph.textContent = "Date: " + responses.date;

      let seperater = document.createElement("hr");

      control_of_new_div.appendChild(nameParagraph);

      control_of_new_div.appendChild(emailParagraph);

      control_of_new_div.appendChild(messageParagraph);

      control_of_new_div.appendChild(dateParagraph);

      // control_of_new_div.appendChild(seperater);

      control_of_user_messages_div.appendChild(control_of_new_div);
    });
  } catch (error) {
    console.error(error);

    alert("There was a problem in fetching messages from Data Base!");
  }
}
