//JAVASCRIPT FUNCTIONS
//WEATHER API
function call_weather_api() {

    console.log("**** [START] call_weather_api() *****")

    // 1) API endpoint
    let api_endpoint_url = "https://api.openweathermap.org/data/2.5/weather?q=Singapore&appid=4665f83693c7ff637473b76e846e2a19";

    // 2) Use Axios to call API asynchronously
    axios.get(api_endpoint_url)
    .then(response => {

        // Inspect the response.data
        console.log(response);
        //DOM manipulation

        let body = document.getElementById("temperature");
        let temp = Number(response.data.main.temp) - 273.15
        let rounded = Math.round((temp + Number.EPSILON) * 100) / 100   //rounded to 2 decimal places
        let text = `Today's temperature is ${rounded} °C`
        body.innerText = text;
        img_text = document.getElementById("api");
        img_html = "<br><img src="
            if (temp < 5){
                img_html += " 'img/cold.jpg' height='250' width='250'>"
                img_text.innerHTML=img_html
            }
            else if (5 < temp < 25){
                img_html += " 'img/okay.jpg' height='250' width='250'>"
                img_text.innerHTML=img_html
            }
            else {
                img_html += " 'img/hot.jpg' height='250' width='250'>"
                img_text.innerHTML=img_html
            }
    }
    )
    .catch(error => {
        // In case of any error, see what it's about
        console.log(error.message)
    })

    console.log("**** [END] call_weather_api() *****")
}

//BORED API
function call_bored_api() {

    console.log("**** [START] call_bored_api() *****")

    // 1) API endpoint
    let api_endpoint_url = "http://www.boredapi.com/api/activity/";

    // 2) Use Axios to call API asynchronously
    axios.get(api_endpoint_url)
    .then(response => {

        // Inspect the response.data
        console.log(response);
        //DOM manipulation

        let body = document.getElementById("api");
        let temp = response.data.activity
        body.innerHTML = `<p style = "font-size: 30px;" class = "mt-4">${temp}</p>`;
    }
    )
    .catch(error => {
        // In case of any error, see what it's about
        console.log(error.message)
    })

    console.log("**** [END] call_bored_api() *****")
}

//QUOTE API
function call_quote_api() {

    console.log("**** [START] call_quote_api() *****")

    // 1) API endpoint
    let api_endpoint_url = "https://api.quotable.io/random";

    // 2) Use Axios to call API asynchronously
    axios.get(api_endpoint_url)
    .then(response => {

        // Inspect the response.data
        console.log(response);
        //DOM manipulation

        let body = document.getElementById("api");
        let quote = response.data.content
        let author = response.data.author
        body.innerHTML = 
        `<figure>
        <blockquote class="blockquote mt-4">
            <p style = "font-size: 25px">${quote}</p>
        </blockquote>
        <figcaption class="blockquote-footer text-italics mt-4" style = "color: white; font-size: 20px">
            ${author}
        </figcaption>
        </figure>`;
    }
    )
    .catch(error => {
        // In case of any error, see what it's about
        console.log(error.message)
    })
    console.log("**** [END] call_quote_api() *****")
}