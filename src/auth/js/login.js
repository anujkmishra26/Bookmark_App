
const API_BASE_URL = "VITE_API_BASE_URL";

const error = document.querySelector("#error");

//Get DOM element
const loginForm = document.getElementById("login-form");
const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");

//Function to check if the given information is true or false
const formValidation = () =>{
    if(!email.value && !password.value){
        error.innerHTML = "* All Input Fields Are Mendatory"
        return false;
    }
    else{
        error.innerHTML = null;
        return true;
    }
};

document.addEventListener("DOMContentLoaded", ()=>{

    if(localStorage.getItem("authToken")){
        window.location.href = "/bookmarks/bookmarks.html";
    }

    
    //Function to login 
    const loginFunc = async (e)=>{
        e.preventDefault();
        const userBody = {
            email: email.value,
            password: password.value,
        };
        console.log(userBody);
        if(formValidation()){
            try{
                error.innerHTML = null;
                const res = await fetch(`${API_BASE_URL}/users/login`, {
                    method: "POST",
                    headers: {
                        "content-Type": "application/json",
                    },
                    body: JSON.stringify(userBody),
                });
                const data = await res.json();
                console.log(data);
                if(data.status != 200){
                    throw new Error(data.message);
                }
                else if(data.token){
                    localStorage.setItem("authToken",JSON.stringify(data.token));
                    localStorage.setItem("userDetails",JSON.stringify(data.userDetails));
                    window.location.href = "/bookmarks/bookmarks.html";
                }
            }
            catch(e){
                error.innerHTML = `${e.message}`;
                console.log(e);
                email.value="";
                password.value="";
            }
        }
        else{
            error.innerHTML="Please fill mendatory Fields."
        }
    };

    loginForm.addEventListener("submit", loginFunc);
});