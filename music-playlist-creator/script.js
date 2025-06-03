function hideModalOverlay(){
    document.getElementById('modal-overlay').style.display = "none";
}
function modalContentClicked(event){
    event.stopPropagation();
}