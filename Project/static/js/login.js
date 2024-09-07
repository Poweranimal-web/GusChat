const loginForm = document.forms.loginForm;
loginForm.addEventListener("submit", async(event) => {
    event.preventDefault();
    await submitData();
});
async function submitData(){
    let response = await fetch("/login",{
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
           "tag": document.getElementsByName("username")[0].value,
           "password": document.getElementsByName("password")[0].value,
        }),
    });
    let status_response = response.status;
    console.log(status_response);
    if (status_response == "401"){
        const error = document.querySelector(".data-invalid");
        error.style.display = 'block'; 
    }
    else{
        let text_response = await response.text();
        console.log(text_response);
        localStorage.setItem("jwt", text_response);
        window.location.href = "/";
    }

}