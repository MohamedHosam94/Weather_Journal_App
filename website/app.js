/* Global Variables */

const zipInputEl = document.getElementById('zip');
const feelingEl = document.getElementById('feelings'); 
const submitBtn = document.getElementById('generate');

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+1 +'.'+ d.getDate()+'.'+ d.getFullYear();

//  OpenWeatherMap API key  
const weatherApiKey = '87f29f8bb8a5dbd5294f66738aa00366';


/* Build functions  */

const buildApiUrl = (zipCode) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${weatherApiKey}&units=metric` ;
  
  return apiUrl;
} 

const getWeatherTemp = async (apiUrl) => {
  const response = await fetch(apiUrl);
  const parsedRes = await response.json();
  
  return parsedRes.main.temp;
}

const buildDataObj = (temp , feel) => {
  const data = {
    date : newDate ,
    feeling : feel ,
    temperature : temp
  }

  return data;
}

//  Post weather data to the server
const postWeatherData = async ( url = '' , data = {}) => {
 
  await fetch( url , {
    method : 'POST' ,
    credentials : 'same-origin' ,
    headers : {
      'Content-Type': 'application/json',
     },
     body : JSON.stringify(data)
  });  
}

// Get last weather data from the server
const fetchWeatherData = async ( url= '' ) => {
  
  const data = await fetch( url );
  const parsedData = await data.json();
  
  return parsedData ;
}

// Select Dom elements and update them
const updateUi = (weatherData) => {

  document.getElementById('date').innerHTML = `Today's date is : ${weatherData.date}`;
  document.getElementById('temp').innerHTML = `Today's temprature is : 
  ${weatherData.temperature} Celsius`;
  document.getElementById('content').innerHTML = `Today's weather feeling is : 
  ${weatherData.feeling}`; 
  
}


const runApp = async () => {

  const zipVal = zipInputEl.value;
  const feelingVal = feelingEl.value;

  const apiUrl = buildApiUrl(zipVal) ;
 
  try {
  const tempForecast = await getWeatherTemp(apiUrl);

  const weatherObj = buildDataObj(tempForecast , feelingVal);
  
    await postWeatherData('/createWeatherForecast' , weatherObj);
   
  const weatherData = await fetchWeatherData('/weatherForecast');
  
    updateUi(weatherData);
  } catch (error) {
   console.log(error);
  } 
 
};



submitBtn.addEventListener( 'click' , runApp );