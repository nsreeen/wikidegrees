window.onload = function() {
    let baseUrl = "http://0.0.0.0:3000/get_links";

    document.getElementById("submit").addEventListener("click", function () {
        let initialUrl = document.getElementById("initial").value;
        const request = new XMLHttpRequest();
        let url = `${baseUrl}/${initialUrl}`;
        console.log(`GET to ${url}`);
        request.open("GET", url);
        request.responseType = "json";
        request.send();
        document.getElementById("error").style.display = "none";
        document.getElementById("results").style.display = "none";
        document.getElementById("progress").style.display = "block";
        request.onload = function () {
            if (request.response) {
                console.log("response: ", request.response);
                let urls = request.response;
                document.getElementById("progress").style.display = "none";
                document.getElementById("results").style.display = "block";
                for (var i=0; i<urls.length; i++) {
                    let url = urls[i];
                    let text = decodeURIComponent(url.split("/wiki/")[1]);
                    document.getElementById(`link${i}`).innerHTML = `<a href="${url}">${text}<\a>`;
                }
            } else {
                console.log("no response");
                document.getElementById("progress").style.display = "none";
                document.getElementById("error").style.display = "block";
           }


        }


    })
}