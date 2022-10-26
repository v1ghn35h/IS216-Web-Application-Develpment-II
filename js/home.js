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
    }
    )
    .catch(error => {
        // In case of any error, see what it's about
        console.log(error.message)
    })

    console.log("**** [END] call_weather_api() *****")
}


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
            <p style = "font-size: 30px">${quote}</p>
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

var app = Vue.createApp({
    
    // Data Properties
    data() {
        return {
            
            weather_types: [
                "Clear",
                "Clouds",
                "Haze",
                "Mist",
                "Rain",
                "Smoke",
                "Snow",
                "Thunderstorm"
            ],

            weather_type_images: {
                "Clear": "img/clear.jpg",
                "Clouds": "img/clouds.jpg",
                "Haze": "img/haze.jpg",
                "Mist": "img/mist.jpg",
                "Rain": "img/rain.jpg",
                "Smoke": "img/smoke.jpg",
                "Snow": "img/snow.jpg",
                "Thunderstorm": "img/thunderstorm.jpg"
            },

            temp_images: {
                "Hot": "img/hot.jpg",   // Celsius > 25
                "Okay": "img/okay.jpg", // Celsius 5-25
                "Cold": "img/cold.jpg"  // Celsius < 5
            },

            appid: "4665f83693c7ff637473b76e846e2a19",

            country_weather: '',
            country_temperature: '',

        }
    },

    methods: {

        check_weather() {
            let api_endpoint_url = `http://api.openweathermap.org/data/2.5/weather?q=Singapore&appid=${this.appid}&units=metric`
            
            axios.get(api_endpoint_url)
            .then(response => {
                
                // Inspect the response.data
                console.log(response.data)

                // YOUR CODE GOES HERE
                this.country_temperature =response.data.main.temp
                this.country_weather = response.data.weather
                
            })
            .catch(error => {
                console.log(error.message)
            })
        },

        
        weather_image(){
            img_html = ""
            for (weather of this.country_weather){
                image = this.weather_type_images[weather.main]
                img_html += "<img src="+image+"><br>"
            }
            return img_html
        },
        temp_image(){
            img_html = "<img src="
            console.log( this.country_temperature)
            temp_celsius = this.country_temperature
            if (temp_celsius < 5){
                img_html += this.temp_images["Cold"] + ">"
                return img_html
            }
            else if (5 < temp_celsius < 25){
                img_html += this.temp_images["Okay"] + ">"
                return img_html
            }
            else {
                img_html += this.temp_images["Hot"] + ">"
                return img_html
            }
        }
        
    }

})

app.mount("#intro")