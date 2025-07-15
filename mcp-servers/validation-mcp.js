// Validation MCP Server for Okashi HVAC Services
// Validates email and phone numbers using Hunter.io and NumVerify APIs

const validationMCP = {
    async validateContact(email, phone) {
        const results = {
            email: { valid: false, message: '' },
            phone: { valid: false, message: '' },
            overall: { valid: false, message: '' }
        };
        
        try {
            // Validate email if provided
            if (email) {
                results.email = await this.validateEmail(email);
            }
            
            // Validate phone if provided
            if (phone) {
                results.phone = await this.validatePhone(phone);
            }
            
            // Determine overall validity
            const emailValid = !email || results.email.valid;
            const phoneValid = !phone || results.phone.valid;
            results.overall.valid = emailValid && phoneValid;
            
            if (!results.overall.valid) {
                results.overall.message = 'Please check your contact information and try again.';
            }
            
            return results;
            
        } catch (error) {
            console.error('Validation error:', error);
            return {
                email: { valid: true, message: 'Email validation temporarily unavailable' },
                phone: { valid: true, message: 'Phone validation temporarily unavailable' },
                overall: { valid: true, message: 'Proceeding with submission' }
            };
        }
    },
    
    async validateEmail(email) {
        try {
            // Basic email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return { valid: false, message: 'Please enter a valid email address.' };
            }
            
            // Use Hunter.io API for email validation if available
            if (process.env.HUNTER_API_KEY) {
                const response = await fetch(`https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${process.env.HUNTER_API_KEY}`);
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.data && data.data.status === 'valid') {
                        return { valid: true, message: 'Email is valid.' };
                    } else {
                        return { valid: false, message: 'Please enter a valid email address.' };
                    }
                }
            }
            
            // Fallback to basic validation
            return { valid: true, message: 'Email format appears valid.' };
            
        } catch (error) {
            console.error('Email validation error:', error);
            return { valid: true, message: 'Email validation temporarily unavailable.' };
        }
    },
    
    async validatePhone(phone) {
        try {
            // Clean phone number
            const cleanPhone = phone.replace(/\D/g, '');
            
            // Basic US phone validation (10-11 digits)
            if (cleanPhone.length < 10 || cleanPhone.length > 11) {
                return { valid: false, message: 'Please enter a valid US phone number.' };
            }
            
            // Use NumVerify API for phone validation if available
            if (process.env.NUMVERIFY_API_KEY) {
                const response = await fetch(`http://apilayer.net/api/validate?access_key=${process.env.NUMVERIFY_API_KEY}&number=${cleanPhone}&country_code=US`);
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.valid) {
                        return { valid: true, message: 'Phone number is valid.' };
                    } else {
                        return { valid: false, message: 'Please enter a valid phone number.' };
                    }
                }
            }
            
            // Fallback to basic validation
            return { valid: true, message: 'Phone number format appears valid.' };
            
        } catch (error) {
            console.error('Phone validation error:', error);
            return { valid: true, message: 'Phone validation temporarily unavailable.' };
        }
    }
};

module.exports = validationMCP; 