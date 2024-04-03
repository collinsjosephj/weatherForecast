// SCRIPT //

// GLOBAL ACCESS //
// const = searchLog = [];
var apiKey = '2a3b66519cce63a1a2cb339f50321024';
var ogUrl = 'https://api.openweathermap.org';
var cityId = 5722917; // depoe bay city ID

// DOM //
var searchInput = document.getElementById('search-input'); // change later?
var searchForm = document.getElementById('search-form');

// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

// EVENT LISTENERS //
searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const city = searchInput.value;
    fetchData(city);
});

// FETCH FUNCTIONS //
function fetchData(city) 
{
    console.log(city);
    //const weatherUrl = `${ogUrl}/data/2.5/forecast?lat={lat}&lon={lon}&appid=${apiKey}`'
    //const weatherUrl = `${ogUrl}/data/2.5/forecast?id=${cityId}&appid=${apiKey}`;
    const weatherUrl = `${ogUrl}/data/2.5/forecast?q=${city},USA&appid=${apiKey}`;
    console.log(weatherUrl);
    htmlOutput(weatherUrl);
};

function htmlOutput(weatherUrl) {
    const jsonArray = [];
    // loop starts here

        const temp = weatherUrl.temp;
        const wind = weatherUrl[wind];
        const hum = weather.humidity;
        // end loop
    // create variablke that is jsonArray but JSON it


}