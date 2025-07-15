// Okashi HVAC Services - Client-side JavaScript
// Handles weather display, testimonials carousel, form validation, and mobile menu

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Weather functionality
    const weatherAlert = document.getElementById('weather-alert');
    if (weatherAlert) {
        fetchWeather();
    }

    // Testimonials carousel functionality
    const testimonialsContainer = document.getElementById('testimonials-container');
    if (testimonialsContainer) {
        loadTestimonials();
    }

    // Contact form functionality
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        setupFormValidation();
    }
});

// Weather API integration
async function fetchWeather() {
    try {
        const response = await fetch('/api/weather?city=Dallas');
        const data = await response.json();
        
        if (data.success) {
            displayWeather(data.data);
        } else {
            displayWeatherFallback();
        }
    } catch (error) {
        console.log('Weather fetch error:', error);
        displayWeatherFallback();
    }
}

function displayWeather(weatherData) {
    const weatherIcon = document.getElementById('weather-icon');
    const weatherText = document.getElementById('weather-text');
    const weatherTip = document.getElementById('weather-tip');
    
    if (!weatherIcon || !weatherText || !weatherTip) return;
    
    const temp = weatherData.temp;
    const condition = weatherData.condition;
    
    // Set weather icon based on condition
    const iconMap = {
        'clear': '☀️',
        'clouds': '☁️',
        'rain': '🌧️',
        'snow': '❄️',
        'thunderstorm': '⛈️',
        'drizzle': '🌦️',
        'mist': '🌫️',
        'fog': '🌫️'
    };
    
    weatherIcon.textContent = iconMap[condition] || '🌡️';
    
    // Display weather text
    if (temp > 85) {
        weatherText.textContent = `Scorching day in Plano? Get your AC fixed by Raanan today with eco-tips! Current temp: ${temp}°F`;
        weatherTip.textContent = 'High humidity? Time for eco-friendly maintenance!';
        weatherTip.classList.add('text-secondary');
    } else if (temp > 70) {
        weatherText.textContent = `Warm day in DFW - ${temp}°F. Perfect time for AC maintenance!`;
        weatherTip.textContent = 'Schedule your seasonal check-up today!';
        weatherTip.classList.add('text-secondary');
    } else {
        weatherText.textContent = `Comfortable ${temp}°F in DFW. Great weather for HVAC upgrades!`;
        weatherTip.textContent = 'Consider energy-efficient upgrades for next summer!';
        weatherTip.classList.add('text-primary');
    }
}

function displayWeatherFallback() {
    const weatherText = document.getElementById('weather-text');
    const weatherTip = document.getElementById('weather-tip');
    
    if (weatherText) {
        weatherText.textContent = 'DFW weather: Perfect time for HVAC maintenance!';
    }
    if (weatherTip) {
        weatherTip.textContent = 'Contact Raanan for your seasonal check-up!';
        weatherTip.classList.add('text-secondary');
    }
}

// Testimonials carousel
let currentTestimonialIndex = 0;
let testimonials = [];

async function loadTestimonials() {
    try {
        const response = await fetch('/api/reviews');
        const data = await response.json();
        
        if (data.success) {
            testimonials = data.data;
            renderTestimonials();
            setupCarouselControls();
            startAutoSlide();
        } else {
            loadFallbackTestimonials();
        }
    } catch (error) {
        console.log('Testimonials fetch error:', error);
        loadFallbackTestimonials();
    }
}

function loadFallbackTestimonials() {
    testimonials = [
        {
            text: "Raanan fixed our AC in record time during a Dallas heatwave. Professional, affordable, and eco-friendly!",
            rating: 5,
            author: "Sarah M.",
            location: "Dallas"
        },
        {
            text: "Best HVAC service in Fort Worth! Raanan's one-man operation means personal attention to every detail.",
            rating: 5,
            author: "Mike T.",
            location: "Fort Worth"
        },
        {
            text: "Emergency repair in Plano - Raanan was here within an hour. Saved us from the Texas heat!",
            rating: 5,
            author: "Jennifer L.",
            location: "Plano"
        },
        {
            text: "Energy-efficient installation in Arlington. Our bills dropped significantly! Highly recommend.",
            rating: 5,
            author: "David R.",
            location: "Arlington"
        },
        {
            text: "Professional maintenance service in Irving. Raanan's eco-friendly approach is impressive!",
            rating: 5,
            author: "Lisa K.",
            location: "Irving"
        }
    ];
    
    renderTestimonials();
    setupCarouselControls();
    startAutoSlide();
}

function renderTestimonials() {
    const container = document.getElementById('testimonials-container');
    const dotsContainer = document.getElementById('dots-container');
    
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    if (dotsContainer) dotsContainer.innerHTML = '';
    
    testimonials.forEach((testimonial, index) => {
        // Create testimonial card
        const card = document.createElement('div');
        card.className = 'w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4';
        card.style.minWidth = '300px';
        
        const stars = '⭐'.repeat(testimonial.rating);
        
        card.innerHTML = `
            <div class="card h-full">
                <div class="flex items-center mb-4">
                    <div class="text-yellow-400 text-lg">${stars}</div>
                    <div class="ml-2 text-sm text-neutral-light">${testimonial.rating}/5</div>
                </div>
                <p class="text-neutral mb-4 italic">"${testimonial.text}"</p>
                <div class="flex justify-between items-center">
                    <div>
                        <p class="font-roboto font-bold text-primary">${testimonial.author}</p>
                        <p class="text-sm text-neutral-light">${testimonial.location}</p>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(card);
        
        // Create dot indicator
        if (dotsContainer) {
            const dot = document.createElement('button');
            dot.className = `w-3 h-3 rounded-full transition-colors ${index === 0 ? 'bg-primary' : 'bg-neutral-light'}`;
            dot.addEventListener('click', () => goToTestimonial(index));
            dotsContainer.appendChild(dot);
        }
    });
}

function setupCarouselControls() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
            updateCarousel();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
            updateCarousel();
        });
    }
}

function updateCarousel() {
    const container = document.getElementById('testimonials-container');
    const dots = document.querySelectorAll('#dots-container button');
    
    if (container) {
        const translateX = -currentTestimonialIndex * 100;
        container.style.transform = `translateX(${translateX}%)`;
    }
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.className = `w-3 h-3 rounded-full transition-colors ${index === currentTestimonialIndex ? 'bg-primary' : 'bg-neutral-light'}`;
    });
}

function goToTestimonial(index) {
    currentTestimonialIndex = index;
    updateCarousel();
}

function startAutoSlide() {
    setInterval(() => {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
        updateCarousel();
    }, 5000); // Change every 5 seconds
}

// Form validation and submission
function setupFormValidation() {
    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous errors
        clearFormErrors();
        
        // Validate form
        const validationResult = validateForm();
        if (!validationResult.isValid) {
            displayFormErrors(validationResult.errors);
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            // Validate with MCP server first
            const validationResponse = await validateWithServer();
            if (!validationResponse.success) {
                showFormMessage(validationResponse.message, 'error');
                return;
            }
            
            // Submit to Workiz
            const submissionResult = await submitToWorkiz();
            if (submissionResult.success) {
                showFormMessage('Your request is on its way to Raanan – expect a quick response!', 'success');
                form.reset();
            } else {
                showFormMessage(submissionResult.message, 'error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showFormMessage('Something went wrong. Please try again or call us directly.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Request';
        }
    });
}

function validateForm() {
    const formData = new FormData(document.getElementById('contact-form'));
    const errors = {};
    
    // Name validation
    const name = formData.get('name').trim();
    if (!name) {
        errors.name = 'Name is required';
    } else if (name.length < 2) {
        errors.name = 'Name must be at least 2 characters';
    }
    
    // Phone validation
    const phone = formData.get('phone').trim();
    if (!phone) {
        errors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''))) {
        errors.phone = 'Please enter a valid phone number';
    }
    
    // Email validation
    const email = formData.get('email').trim();
    if (!email) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    // Service validation
    const service = formData.get('service');
    if (!service) {
        errors.service = 'Please select a service type';
    }
    
    // Location validation
    const location = formData.get('location');
    if (!location) {
        errors.location = 'Please select your location';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };
}

function displayFormErrors(errors) {
    Object.keys(errors).forEach(field => {
        const errorElement = document.getElementById(`${field}-error`);
        if (errorElement) {
            errorElement.textContent = errors[field];
            errorElement.classList.remove('hidden');
        }
    });
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('[id$="-error"]');
    errorElements.forEach(element => {
        element.textContent = '';
        element.classList.add('hidden');
    });
}

async function validateWithServer() {
    const formData = new FormData(document.getElementById('contact-form'));
    
    try {
        const response = await fetch('/api/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.get('email'),
                phone: formData.get('phone')
            })
        });
        
        return await response.json();
    } catch (error) {
        console.error('Validation error:', error);
        return { success: true }; // Allow submission if validation fails
    }
}

async function submitToWorkiz() {
    const formData = new FormData(document.getElementById('contact-form'));
    
    try {
        const response = await fetch('/api/submit-lead', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                service: formData.get('service'),
                location: formData.get('location'),
                message: formData.get('message'),
                emergency: formData.get('emergency') === 'on'
            })
        });
        
        return await response.json();
    } catch (error) {
        console.error('Workiz submission error:', error);
        return { success: false, message: 'Failed to submit request. Please try again.' };
    }
}

function showFormMessage(message, type) {
    const messageElement = document.getElementById('form-message');
    if (!messageElement) return;
    
    messageElement.textContent = message;
    messageElement.className = `text-center p-4 rounded-lg ${type === 'success' ? 'bg-secondary text-white' : 'bg-red-100 text-red-700'}`;
    messageElement.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageElement.classList.add('hidden');
    }, 5000);
}

// Utility functions
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}); 