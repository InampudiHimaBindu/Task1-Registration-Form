document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.getElementById("registrationForm");

  registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    document.getElementById("submit").innerHTML = "Registering...";

    const formData = new FormData(registrationForm);
    const userData = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const isUserExists = await checkUserExists(userData.email);

    if (isUserExists) {
      alert("User with the same email already exists.");
      document.getElementById("submit").innerHTML = "Register";
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        registrationForm.reset();
        document.getElementById("submit").innerHTML = "Register";
      } else {
        const errorResult = await response.json();
        alert(`Error: ${errorResult.error || "Unknown error"}`);
        registrationForm.reset();
        document.getElementById("submit").innerHTML = "Register";
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to register user. Please try again later.");
      registrationForm.reset();
      document.getElementById("submit").innerHTML = "Register";
    }
  });

  async function checkUserExists(email) {
    try {
      const response = await fetch(`http://localhost:3000/checkUser?email=${email}`);
      const result = await response.json();
      return result.exists;
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false;
    }
  }
});
