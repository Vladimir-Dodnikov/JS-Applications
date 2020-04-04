
export function displayError() {
    const errorBox = document.getElementById("errorBox");
    errorBox.style.display = "block";
    errorBox.textContent = "Invalid credentials! Please retry your request with correct credentials.";
    document.getElementById("inputUsername").value = "";
    document.getElementById("inputPassword").value = "";
    document.getElementById("inputRePassword").value = "";
    setTimeout(() => {
        errorBox.style.display = "none";
    }, 6000);
}

export function displaySuccess(message) {
    const errorBox = document.getElementById("successBox");
    errorBox.style.display = "block";
    errorBox.textContent = message;
    setTimeout(() => {
        errorBox.style.display = "none";
    }, 5000);
}
{/* <div id="notifications">
<div id="successBox" class="alert alert-success" role="alert">{Success Message...}</div>
<div id="loadingBox" class="alert alert-info" role="alert">Loading...</div>
<div id="errorBox" class="alert alert-danger" role="alert">{Error Message...}</div>
</div> */}