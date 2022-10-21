window.onload = function() {
    let baseUrl = "https://wikidegrees.onrender.com/get_links";

    document.getElementById("submit").addEventListener("click", function () {
        let userQuery = document.getElementById("initial").value;
        let url = `${baseUrl}/${userQuery}`;
        request = sendGetRequest(url);
        updateView({progress: true})
        request.onload = function () {
            if (request.response && request.status == 200) {
                let urls = request.response;
                updateView({results: true})
                for (var i=0; i<urls.length; i++) {
                    let text = decodeURIComponent(urls[i].split("/wiki/")[1]);
                    document.getElementById(`link${i}`).innerHTML = `<a href="${urls[i]}">${text}<\a>`;
                }
            } else {
                updateView({error: true})
           }
        }
    })
}

function sendGetRequest(url) {
    const request = new XMLHttpRequest();
    request.open("GET", url);
    request.responseType = "json";
    request.send();
    return request;
}

function updateView({progress=false, results=false, error=false} = {}) {
    document.getElementById("progress").style.display = progress ? "block" : "none";
    document.getElementById("results").style.display = results ? "block" : "none";
    document.getElementById("error").style.display = error ? "block" : "none";
}
