// Validation MCP Server for Okashi HVAC Services
// Validates email and phone numbers using Hunter.io and NumVerify APIs

const fetch = require('node-fetch');

class ValidationMCP {
    constructor() {
        this.hunterApiKey = process.env.HUNTER_API_KEY || 'YOUR_HUNTER_API_KEY'; // REPLACE_WITH_ACTUAL
        this.numverifyApiKey = process.env.NUMVERIFY_API_KEY || 'YOUR_NUMVERIFY_API_KEY'; // REPLACE_WITH_ACTUAL
    }

    async validateContact(email = null, phone = null) {
        try {
            const validationResult = {
                email_valid: true,
                phone_valid: true,
                email_details: null,
                phone_details: null,
                errors: []
            };

            // Validate email if provided
            if (email) {
                const emailValidation = await this.validateEmail(email);
                validationResult.email_valid = emailValidation.valid;
                validationResult.email_details = emailValidation.details;
                
                if (!emailValidation.valid) {
                    validationResult.errors.push(emailValidation.message);
                }
            }

            // Validate phone if provided
            if (phone) {
                const phoneValidation = await this.validatePhone(phone);
                validationResult.phone_valid = phoneValidation.valid;
                validationResult.phone_details = phoneValidation.details;
                
                if (!phoneValidation.valid) {
                    validationResult.errors.push(phoneValidation.message);
                }
            }

            // Overall validation result
            validationResult.overall_valid = validationResult.email_valid && validationResult.phone_valid;
            
            console.log(`🔍 Contact validation completed: Email=${validationResult.email_valid}, Phone=${validationResult.phone_valid}`);
            
            return validationResult;

        } catch (error) {
            console.error('Validation MCP error:', error);
            return {
                email_valid: true, // Default to true if validation fails
                phone_valid: true,
                email_details: null,
                phone_details: null,
                errors: [],
                overall_valid: true,
                fallback: true
            };
        }
    }

    async validateEmail(email) {
        try {
            // Basic email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return {
                    valid: false,
                    message: "Oops, that email doesn't look right – try again!",
                    details: { format_valid: false }
                };
            }

            // Check if we have a valid API key
            if (this.hunterApiKey === 'YOUR_HUNTER_API_KEY') {
                return this.getFallbackEmailValidation(email);
            }

            // Use Hunter.io API for email validation
            const url = `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(email)}&api_key=${this.hunterApiKey}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Hunter API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.data) {
                const emailData = data.data;
                
                // Determine if email is valid based on Hunter.io response
                const isValid = emailData.status === 'valid' || 
                               (emailData.score > 50 && emailData.regexp);
                
                return {
                    valid: isValid,
                    message: isValid ? null : "That email address doesn't seem to exist. Please check and try again.",
                    details: {
                        format_valid: emailData.regexp || false,
                        disposable: emailData.disposable || false,
                        webmail: emailData.webmail || false,
                        mx_records: emailData.mx_records || false,
                        smtp_server: emailData.smtp_server || false,
                        smtp_check: emailData.smtp_check || false,
                        score: emailData.score || 0,
                        status: emailData.status || 'unknown'
                    }
                };
            } else {
                throw new Error('Invalid response from Hunter.io API');
            }

        } catch (error) {
            console.error('Email validation error:', error);
            return this.getFallbackEmailValidation(email);
        }
    }

    getFallbackEmailValidation(email) {
        // Basic fallback validation for development or when API is unavailable
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        
        return {
            valid: isValid,
            message: isValid ? null : "Please enter a valid email address format.",
            details: {
                format_valid: isValid,
                fallback: true
            }
        };
    }

    async validatePhone(phone) {
        try {
            // Clean phone number
            const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');
            
            // Basic phone format validation
            if (!/^[\+]?[1-9][\d]{9,15}$/.test(cleanedPhone)) {
                return {
                    valid: false,
                    message: "Please enter a valid phone number with at least 10 digits.",
                    details: { format_valid: false }
                };
            }

            // Check if we have a valid API key
            if (this.numverifyApiKey === 'YOUR_NUMVERIFY_API_KEY') {
                return this.getFallbackPhoneValidation(phone);
            }

            // Use NumVerify API for phone validation
            const url = `http://apilayer.net/api/validate?access_key=${this.numverifyApiKey}&number=${cleanedPhone}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`NumVerify API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.valid) {
                return {
                    valid: true,
                    message: null,
                    details: {
                        format_valid: true,
                        country_code: data.country_code || null,
                        country_name: data.country_name || null,
                        location: data.location || null,
                        carrier: data.carrier || null,
                        line_type: data.line_type || null,
                        international_format: data.international_format || null,
                        local_format: data.local_format || null
                    }
                };
            } else {
                return {
                    valid: false,
                    message: "That phone number doesn't appear to be valid. Please check and try again.",
                    details: {
                        format_valid: false,
                        error: data.error?.info || 'Invalid phone number'
                    }
                };
            }

        } catch (error) {
            console.error('Phone validation error:', error);
            return this.getFallbackPhoneValidation(phone);
        }
    }

    getFallbackPhoneValidation(phone) {
        // Basic fallback validation for development or when API is unavailable
        const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');
        const isValid = /^[\+]?[1-9][\d]{9,15}$/.test(cleanedPhone);
        
        return {
            valid: isValid,
            message: isValid ? null : "Please enter a valid phone number with at least 10 digits.",
            details: {
                format_valid: isValid,
                fallback: true
            }
        };
    }

    // Validate multiple contacts at once
    async validateMultipleContacts(contacts) {
        try {
            const validationPromises = contacts.map(contact => 
                this.validateContact(contact.email, contact.phone)
            );
            
            const results = await Promise.allSettled(validationPromises);
            
            return results.map((result, index) => {
                if (result.status === 'fulfilled') {
                    return {
                        contact: contacts[index],
                        validation: result.value
                    };
                } else {
                    return {
                        contact: contacts[index],
                        validation: {
                            email_valid: true,
                            phone_valid: true,
                            overall_valid: true,
                            error: result.reason.message
                        }
                    };
                }
            });
        } catch (error) {
            console.error('Multiple contacts validation error:', error);
            return contacts.map(contact => ({
                contact,
                validation: {
                    email_valid: true,
                    phone_valid: true,
                    overall_valid: true,
                    error: 'Validation service unavailable'
                }
            }));
        }
    }

    // Get validation statistics
    async getValidationStats() {
        try {
            // This would typically track validation statistics over time
            return {
                total_validations: 0,
                email_validations: 0,
                phone_validations: 0,
                success_rate: 100,
                last_updated: new Date().toISOString()
            };
        } catch (error) {
            console.error('Validation stats error:', error);
            return {
                total_validations: 0,
                email_validations: 0,
                phone_validations: 0,
                success_rate: 100,
                last_updated: new Date().toISOString(),
                fallback: true
            };
        }
    }

    // Format phone number for display
    formatPhoneNumber(phone) {
        const cleaned = phone.replace(/\D/g, '');
        
        if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
            return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
        } else if (cleaned.length > 10) {
            return `+${cleaned}`;
        }
        
        return phone;
    }

    // Sanitize contact information
    sanitizeContact(contact) {
        return {
            email: contact.email ? contact.email.toLowerCase().trim() : null,
            phone: contact.phone ? this.formatPhoneNumber(contact.phone) : null
        };
    }

    // Check if email is disposable
    async isDisposableEmail(email) {
        try {
            const emailValidation = await this.validateEmail(email);
            return emailValidation.details?.disposable || false;
        } catch (error) {
            console.error('Disposable email check error:', error);
            return false;
        }
    }

    // Check if phone is mobile
    async isMobilePhone(phone) {
        try {
            const phoneValidation = await this.validatePhone(phone);
            return phoneValidation.details?.line_type === 'mobile';
        } catch (error) {
            console.error('Mobile phone check error:', error);
            return false;
        }
    }
}

module.exports = new ValidationMCP(); 