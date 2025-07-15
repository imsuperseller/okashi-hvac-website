// Weather MCP Server for Okashi HVAC Services
// Fetches real-time weather data for DFW area from OpenWeatherMap API

const fetch = require('node-fetch');

class WeatherMCP {
    constructor() {
        this.apiKey = process.env.OPENWEATHER_API_KEY || 'YOUR_OPENWEATHER_API_KEY'; // REPLACE_WITH_ACTUAL
        this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    }

    async getWeather(city = 'Dallas') {
        try {
            // Check if we have a valid API key
            if (this.apiKey === 'YOUR_OPENWEATHER_API_KEY') {
                return this.getFallbackWeather(city);
            }

            const url = `${this.baseUrl}?q=${encodeURIComponent(city)},TX,US&appid=${this.apiKey}&units=imperial`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Extract relevant weather information
            const weatherData = {
                temp: Math.round(data.main.temp),
                condition: data.weather[0].main.toLowerCase(),
                humidity: data.main.humidity,
                description: data.weather[0].description,
                city: data.name,
                timestamp: new Date().toISOString()
            };
            
            // Add eco-friendly tips based on weather conditions
            weatherData.tip = this.generateEcoTip(weatherData);
            
            console.log(`🌡️ Weather data retrieved for ${city}: ${weatherData.temp}°F, ${weatherData.condition}`);
            
            return weatherData;
            
        } catch (error) {
            console.error('Weather MCP error:', error);
            return this.getFallbackWeather(city);
        }
    }

    getFallbackWeather(city) {
        // Fallback weather data for development or when API is unavailable
        const currentHour = new Date().getHours();
        let temp, condition, tip;
        
        // Simulate realistic DFW weather patterns
        if (currentHour >= 6 && currentHour <= 18) {
            // Daytime - typically warmer
            temp = Math.floor(Math.random() * 20) + 75; // 75-95°F
            condition = Math.random() > 0.7 ? 'clouds' : 'clear';
        } else {
            // Nighttime - typically cooler
            temp = Math.floor(Math.random() * 15) + 60; // 60-75°F
            condition = 'clear';
        }
        
        tip = this.generateEcoTip({ temp, condition, humidity: 60 });
        
        return {
            temp,
            condition,
            humidity: 60,
            description: condition === 'clear' ? 'clear sky' : 'scattered clouds',
            city,
            timestamp: new Date().toISOString(),
            tip,
            fallback: true
        };
    }

    generateEcoTip(weatherData) {
        const { temp, humidity, condition } = weatherData;
        
        if (temp > 85) {
            if (humidity > 70) {
                return "High humidity and heat! Consider upgrading to a high-efficiency AC system to save energy and stay comfortable.";
            } else {
                return "Hot day ahead! Schedule your AC maintenance now to ensure peak efficiency during the summer months.";
            }
        } else if (temp > 70) {
            return "Perfect weather for AC maintenance! Regular check-ups can prevent costly repairs and improve energy efficiency.";
        } else if (temp < 50) {
            return "Cooler weather is here! Time to schedule your heating system maintenance for optimal winter performance.";
        } else {
            return "Mild weather - ideal for HVAC upgrades! Consider energy-efficient systems to reduce your carbon footprint.";
        }
    }

    // Get weather for multiple DFW cities
    async getDFWWeather() {
        const cities = ['Dallas', 'Fort Worth', 'Plano', 'Arlington', 'Irving'];
        const weatherPromises = cities.map(city => this.getWeather(city));
        
        try {
            const results = await Promise.allSettled(weatherPromises);
            const weatherData = {};
            
            cities.forEach((city, index) => {
                if (results[index].status === 'fulfilled') {
                    weatherData[city] = results[index].value;
                } else {
                    weatherData[city] = this.getFallbackWeather(city);
                }
            });
            
            return weatherData;
        } catch (error) {
            console.error('DFW weather fetch error:', error);
            return cities.reduce((acc, city) => {
                acc[city] = this.getFallbackWeather(city);
                return acc;
            }, {});
        }
    }

    // Get weather forecast (placeholder for future enhancement)
    async getForecast(city = 'Dallas', days = 5) {
        try {
            if (this.apiKey === 'YOUR_OPENWEATHER_API_KEY') {
                return this.getFallbackForecast(city, days);
            }

            const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)},TX,US&appid=${this.apiKey}&units=imperial`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Forecast API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Process forecast data
            const forecast = data.list
                .filter((item, index) => index % 8 === 0) // Daily forecast (every 8th item = 24 hours)
                .slice(0, days)
                .map(item => ({
                    date: new Date(item.dt * 1000).toLocaleDateString(),
                    temp: Math.round(item.main.temp),
                    condition: item.weather[0].main.toLowerCase(),
                    description: item.weather[0].description
                }));
            
            return {
                city,
                forecast,
                generated: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('Forecast MCP error:', error);
            return this.getFallbackForecast(city, days);
        }
    }

    getFallbackForecast(city, days) {
        const forecast = [];
        const today = new Date();
        
        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            // Simulate realistic temperature progression
            const baseTemp = 75 + (Math.random() - 0.5) * 20;
            const temp = Math.round(baseTemp + (i * 2)); // Gradual warming trend
            
            forecast.push({
                date: date.toLocaleDateString(),
                temp,
                condition: Math.random() > 0.8 ? 'clouds' : 'clear',
                description: Math.random() > 0.8 ? 'scattered clouds' : 'clear sky'
            });
        }
        
        return {
            city,
            forecast,
            generated: new Date().toISOString(),
            fallback: true
        };
    }
}

module.exports = new WeatherMCP(); 