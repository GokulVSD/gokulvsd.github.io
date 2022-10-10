const darkcss = document.getElementById("darkcss");
if (localStorage.getItem('theme') !== 'dark') {
        darkcss.disabled = "disabled";
}

document.addEventListener("DOMContentLoaded", function (event) {
    function switchTheme(e) {
        const darkcss = document.getElementById("darkcss");
        if (e.target.checked) {
            darkcss.disabled = "disabled";
            localStorage.setItem('theme', "light");
        } else {
            darkcss.disabled = undefined;
            localStorage.setItem('theme', "dark");
        }
    }
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', switchTheme, false);
        if (localStorage.getItem('theme') !== 'dark') {
            toggleSwitch.checked = "checked";
        }
    }
});