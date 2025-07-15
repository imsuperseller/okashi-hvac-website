// Weather MCP Server for Okashi HVAC Services
// Fetches real-time weather data for DFW area from OpenWeatherMap API

const weatherMCP = {
    async getWeather(city = 'Dallas') {
        try {
            // Use native fetch instead of node-fetch
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=imperial`);
            
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Generate eco-friendly tips based on weather
            const temp = Math.round(data.main.temp);
            const weatherTip = this.generateEcoTip(temp, data.weather[0].main);
            
            return {
                temperature: temp,
                condition: data.weather[0].main,
                description: data.weather[0].description,
                humidity: data.main.humidity,
                tip: weatherTip,
                city: city
            };
        } catch (error) {
            console.error('Weather API error:', error);
            // Fallback data for DFW area
            return {
                temperature: 75,
                condition: 'Clear',
                description: 'Comfortable weather in DFW',
                humidity: 60,
                tip: 'Great weather for HVAC maintenance and energy-efficient upgrades!',
                city: city
            };
        }
    },
    
    generateEcoTip(temp, condition) {
        if (temp > 85) {
            return 'High temperatures! Consider scheduling AC maintenance to ensure optimal efficiency.';
        } else if (temp > 70) {
            return 'Perfect weather for HVAC upgrades and energy-efficient installations.';
        } else if (temp < 50) {
            return 'Cooler weather ahead! Time to check your heating system for winter readiness.';
        } else {
            return 'Mild weather - ideal for preventive HVAC maintenance and system checks.';
        }
    }
};

module.exports = weatherMCP; 