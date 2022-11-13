//JAVASCRIPT FUNCTIONS
//WEATHER API
function call_weather_api() {

    // 1) API endpoint
    let api_endpoint_url = "https://api.openweathermap.org/data/2.5/weather?q=Singapore&appid=4665f83693c7ff637473b76e846e2a19";

    // 2) Use Axios to call API asynchronously
    axios.get(api_endpoint_url)
    .then(response => {

        //DOM manipulation
        let weather_type_images = {
            "Clouds": "img/temperature/clouds.jpg",
            "Clear": "img/temperature/clear.png",
            "Haze": "img/temperature/haze.jpg",
            "Mist": "img/temperature/mist.png",
            "Rain": "img/temperature/rain.png",
            "Smoke": "img/temperature/smoke.png",
            "Snow": "img/temperature/snow.jpg",
            "Thunderstorm": "img/temperature/thunderstorm.jpg",
        }
        let body = document.getElementById("temperature");
        let temp = Number(response.data.main.temp) - 273.15
        let rounded = Math.round((temp + Number.EPSILON) * 100) / 100   //rounded to 2 decimal places
        let country_weather = response.data.weather
        let text = `Current temperature is ${rounded} °C`
        body.innerText = text;
        img_text = document.getElementById("api");
        weather_text = `<div style = "color: white">`
            if (temp < 5){
                weather_text += "<span class= 'lead my-5' style = 'font-size:30px;'>Temperature: Cold  <img src='img/temperature/cold.png' height='30' width='30'></span><br>"
            }
            else if (temp > 5 && temp < 25){
                weather_text += "<span class= 'lead mt-5' style = 'font-size:30px'>Temperature: Normal  <img src='img/temperature/okay.jpg' height='30' width='30'></span><br>"
            }
            else {
                weather_text += "<span class= 'lead my-5' style = 'font-size:30px'>Temperature: Hot  <img src='img/temperature/hot.png' height='30' width='30'></span><br>"
            }
            let counter = 0
            for (let weather of country_weather){
                image = weather_type_images[weather.main]
                if (counter==0){
                    weather_text += `<span class= 'lead mt-5' style = 'font-size:30px'>Weather: ${weather.main}  <img src='${image}' height='30' width='30'></span>`
                    counter += 1
                }
                else {
                    weather_text += `<span class= 'lead my-5' style = 'font-size:30px'>,<img src='${image}' height='30' width='30'></span>`
                }
            }
            weather_text += `</div>`
            img_text.innerHTML= weather_text

    }
    )
    .catch(error => {
        // In case of any error, see what it's about
        console.log(error.message)
    })
}

//BORED API
function call_bored_api() {

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
}

//QUOTE API
function call_quote_api() {

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
}