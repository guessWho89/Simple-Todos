const includeHTML = () => {
    var all, i, el, file, http;
    all = document.getElementsByTagName("*");
    for (i = 0; i < all.length; i++) {
        el = all[i];
        file = el.getAttribute("include-html");
        if (file) {
            http = new XMLHttpRequest();
            http.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { el.innerHTML = this.responseText; }
                    if (this.status == 404) { el.innerHTML = "Page not found."; }
                    el.removeAttribute("include-html");
                    includeHTML();
                }
            }
            http.open("GET", file, true);
            http.send();
            return;
        }
    }
}
includeHTML();