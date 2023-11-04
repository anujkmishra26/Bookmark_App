import "../css/auth.css"

const API_BASE_URL = "VITE_API_BASE_URL";

//Get all DOM elements
const registerForm = document.getElementById("register-form");
const name = document.getElementById("name");
const email = document.getElementById("email");
const username = document.getElementById("username");
const password = document.getElementById("password");
const mobile = document.getElementById("mobile");
const error = document.getElementById("error");
const registerBtn = document.getElementById("register-btn");

document.addEventListener("DOMContentLoaded", ()=>{
    if(localStorage.getItem("authToken")){
        window.location.href = "/bookmarks/bookmarks.html";
    }

    //Check if the information filled in the form is correct
    const formValidation = ()=>{
        if(!name.value && !email.value && !username.value && !password.value && !mobile.value){
            error.innerHTML = "* All Input Fields Are Mendatory";
            return false;
        }
        else{
            error.innerHTML = null;
            return true;
        }
    };
    
    //After click on submit button this function get calls
    const signupFunc = async (event) =>{
        event.preventDefault();
        if(formValidation()){
            const userBody = {
                name: name.value,
                email: email.value,
                password: password.value,
                username: username.value,
                phoneNo: mobile.value,
            };
            console.log(userBody);
            try{
                registerBtn.disabled = true;
                const res = await fetch(`${API_BASE_URL}/users/register`, {
                    method: "POST",
                    headers: {
                        "content-Type" : "application/json",
                    },
                    body: JSON.stringify(userBody),
                });
                const data = await res.json();
                console.log(data);
                localStorage.setItem("authToken", JSON.stringify(data.token));

                localStorage.setItem("userDetails",JSON.stringify(data.userDetails));

                window.location.href = "/bookmarks/bookmarks.html";
            }
            catch(error){
                registerBtn.disabled=false;
                console.log(error);
            }
        }
        else{
            alert("Fill all required Data.");
        }
    };

    registerForm.addEventListener("submit",signupFunc);
});