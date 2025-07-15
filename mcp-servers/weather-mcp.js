// Weather MCP Server for Okashi HVAC Services
// Fetches real-time weather data for DFW area from OpenWeatherMap API

const weatherMCP = {
    async getWeather(city = 'Dallas') {
        try {
            // Check if API key exists
            if (!process.env.OPENWEATHER_API_KEY) {
                console.log('OpenWeather API key not found, using fallback data');
                return this.getFallbackWeather(city);
            }
            
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
            // Return fallback data for DFW area
            return this.getFallbackWeather(city);
        }
    },
    
    getFallbackWeather(city) {
        // Generate realistic fallback weather data
        const currentHour = new Date().getHours();
        let temp, condition, tip;
        
        if (currentHour >= 6 && currentHour <= 18) {
            // Daytime - typically warmer
            temp = Math.floor(Math.random() * 20) + 75; // 75-95°F
            condition = Math.random() > 0.7 ? 'Clouds' : 'Clear';
        } else {
            // Nighttime - typically cooler
            temp = Math.floor(Math.random() * 15) + 60; // 60-75°F
            condition = 'Clear';
        }
        
        tip = this.generateEcoTip(temp, condition);
        
        return {
            temperature: temp,
            condition: condition,
            description: condition === 'Clear' ? 'clear sky' : 'scattered clouds',
            humidity: 60,
            tip: tip,
            city: city,
            fallback: true
        };
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