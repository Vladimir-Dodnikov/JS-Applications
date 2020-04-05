
export function displayError() {
    const errorBox = document.getElementById("errorNotification");
    errorBox.style.display = "block";
    errorBox.textContent = "Invalid credentials! Please retry your request with correct credentials.";
    document.getElementById("inputUsername").value = "";
    document.getElementById("inputPassword").value = "";
    document.getElementById("inputRePassword").value = "";
    setTimeout(() => {
        errorBox.style.display = "none";
    }, 5000);
}

export function displaySuccess(message) {
    const errorBox = document.getElementById("successNotification");
    errorBox.style.display = "block";
    errorBox.textContent = message;
    setTimeout(() => {
        errorBox.style.display = "none";
    }, 5000);
}