const menu = document.getElementById("menu"),
  drop = document.getElementById("drop");

const toggleDropdown = () => {
  menu.classList.toggle("open");
  drop.innerHTML = !menu.classList.contains("open") ?
    "expand_more" :
    "close";
};

