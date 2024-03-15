const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token
const token = 'YOUR_TELEGRAM_BOT_TOKEN';

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Function to send a welcome message when user starts conversation
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to the bot! Use /help to see available commands.');
});

// Function to display help information
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `
    Available commands:
    /joke - Get a random joke
    /weather - Get the weather forecast (provide your location)
    `;
    bot.sendMessage(chatId, helpMessage);
});

// Function to handle the /joke command
bot.onText(/\/joke/, async (msg) => {
    const chatId = msg.chat.id;
    try {
        // Fetch a random joke from an API
        const response = await axios.get('https://official-joke-api.appspot.com/jokes/random');
        const joke = response.data;
        bot.sendMessage(chatId, joke.setup + '\n' + joke.punchline);
    } catch (error) {
        console.error('Error fetching joke:', error);
        bot.sendMessage(chatId, 'Failed to fetch joke. Please try again later.');
    }
});

// Function to handle the /weather command
bot.onText(/\/weather/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Please provide your location to get the weather forecast.');
});

// Event listener for location messages
bot.on('location', async (msg) => {
    const chatId = msg.chat.id;
    const { latitude, longitude } = msg.location;
    try {
        // Use latitude and longitude to fetch weather data from an API
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=YOUR_OPENWEATHERMAP_API_KEY`);
        const weatherData = response.data;
        // Extract relevant information from weather data and send it to the user
        const cityName = weatherData.name;
        const temperature = Math.round(weatherData.main.temp - 273.15); // Convert temperature to Celsius
        const description = weatherData.weather[0].description;
        const message = `Weather forecast for ${cityName}: ${description}, Temperature: ${temperature}°C`;
        bot.sendMessage(chatId, message);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        bot.sendMessage(chatId, 'Failed to fetch weather data. Please try again later.');
    }
});

// Handle unsupported commands with a random response
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const unsupportedMessages = [
        'Sorry, I didn\'t get that. Use /help to see available commands.',
        'I\'m not sure what you mean. Try using /help.',
        'Hmmm, that command doesn\'t seem familiar. Use /help for assistance.'
    ];
    // Choose a random message from the array
    const randomMessage = unsupportedMessages[Math.floor(Math.random() * unsupportedMessages.length)];
    bot.sendMessage(chatId, randomMessage);
});
