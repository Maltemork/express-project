"use strict";

window.addEventListener("load", startFunction);

function startFunction() {
    // eventlisteners
    startEventListeners();
}




function startEventListeners() {
    document.querySelector("#nav-frontpage").addEventListener("click", () => { changeView("frontpage"); });
    document.querySelector("#nav-create").addEventListener("click", () => { changeView("create"); });
    document.querySelector("#nav-edit").addEventListener("click", () => { changeView("edit"); });
    document.querySelector("#nav-favorites").addEventListener("click", () => { changeView("favorites"); });
}

function changeView(section) {
    console.log(section);
    // Hide all sections
    document.querySelector("#frontpage-section").classList.value = "hidden";
    document.querySelector("#create-section").classList.value = "hidden";
    document.querySelector("#edit-section").classList.value = "hidden";
    document.querySelector("#favorites-section").classList.value = "hidden";
    
    // Show selected section
    document.querySelector(`#${section}-section`).classList.remove("hidden");
}

