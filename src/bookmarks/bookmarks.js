const API_BASE_URL = "https://bookmarkapi.vercel.app";

//Get all DOM elements
const allBookmarks = document.querySelector(".all-bookmarks");
const titleInput = document.querySelector("#title");
const urlInput = document.querySelector("#url");
const bookmarkForm = document.querySelector("#bookmark-form");
const addBtn = document.querySelector("#add-btn");
const userProfile = document.querySelector(".user-profile");
const logoutBtn = document.querySelector("#logout-btn");
const bookmarkSearchBtn = document.querySelector("#bookmark-search-btn");
const searchBookmarkInput = document.querySelector("#search-bookmark-input");
const addBookmarkError = document.querySelector(".add-bookmark-error");

// console.log(logoutBtn)


// Check the validation of form
const validateBookmarkForm = () => {
    if (!titleInput || !urlInput || titleInput.value.length >= 15) {
        return false;
    }
    else {
        return true;
    }
};


document.addEventListener("DOMContentLoaded", () => {
    //check if no authToken direct to the login page
    if (!localStorage.getItem("authToken")) {
        window.location.href = "/auth/login.html";
    }

    //Take userDetails from Localstorage and make it an object with the help of JSON.parse()
    const savedUserDetails = JSON.parse(localStorage.getItem("userDetails"));
    console.log(savedUserDetails);
    userProfile.innerHTML = savedUserDetails.name;


    // Update the DOM
    const updateDom = (bookmarkDetails) => {
        allBookmarks.insertAdjacentHTML("beforeend",
        `
        <div class="ind-bookmark-container">
            <a href=${bookmarkDetails.url} target="_blank" class="ind-bookmark">
                <img src="https://www.google.com/s2/favicons?domain=${bookmarkDetails.url}&sz=256" alt="">
                 <p>${bookmarkDetails.title}</p>
            </a>
            <div class="icons">
                
 

        </div>

        `)
    }

    // Fetch all Bookmarks
    const fetchBookmarks = async () => {
        const authToken = JSON.parse(localStorage.getItem("authToken"));
        if (!authToken) {
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/bookmarks`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: authToken,
                },
            });
            const data = await res.json();

            console.log(data);

            if (data.bookmarks.length) {
                allBookmarks.innerHTML = null;
                data.bookmarks.forEach((bookmark) => updateDom(bookmark));
            }
            else {
                allBookmarks.innerHTML = "No Bookmark Added";
            }
        }
        catch (error) {
            console.log(error);
        }

    }

    fetchBookmarks();

    // add new Bookmark
    const addNewBookmark = async (e) => {
        e.preventDefault();
        const authToken = JSON.parse(localStorage.getItem("authToken"));
        if (!authToken) {
            return;
        }

        if (validateBookmarkForm()) {
            try {
                // Make title body
                const titleBody = {
                    title: titleInput.value,
                    url: urlInput.value,
                };
                console.log(titleBody);

                addBookmarkError.innerHTML = null;
                addBtn.disabled = true;
                const res = await fetch(`${API_BASE_URL}/bookmarks`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: authToken,
                    },
                    body: JSON.stringify(titleBody),
                });
                const data = await res.json();
                console.log(data);
                titleInput.value = "";
                urlInput.value = "";
                fetchBookmarks();
            }
            catch (error) {
                console.log(error);
            }
        }
        else {
            addBtn.disabled = false;
            addBookmarkError.innerHTML = "* Please Fill Valid Title & URL. Title length should be less than 15."
        }
    }

    // Search Bookmark By Title
    const searchBookmarksByTitle = async (e) => {
        e.preventDefault();
        const authToken = JSON.parse(localStorage.getItem("authToken"));
        if (!authToken) {
            return;
        }
        if (searchBookmarkInput.value) {
            const response = await fetch(`${API_BASE_URL}/bookmarks/${searchBookmarkInput.value}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: authToken,
                },
            });
            const data = await response.json();
            console.log(data);

            if (data.bookmarks.length) {
                allBookmarks.innerHTML = null;
                data.bookmarks.forEach((bookmark) => updateDom(bookmark));
            }
            else {
                allBookmarks.innerHTML = `No Bookmark Found with title: ${searchBookmarkInput.value}`;
            }
        }
        else {
            alert("Please add Title");
        }
    };

    // Function for Logout
    const logoutUser = () => {
        // alert("Click hua");
        localStorage.removeItem("authToken");
        localStorage.removeItem("userDetails");
        window.location.href = "/auth/login.html";
    };


    // EventListener to Add Bookmark
    bookmarkForm.addEventListener("submit", addNewBookmark);


    // EventListener to Search Bookmark
    bookmarkSearchBtn.addEventListener("click", searchBookmarksByTitle);

    // EventListener for Logout
    logoutBtn.addEventListener("click", logoutUser);
});