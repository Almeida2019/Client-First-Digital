# Design Document

## Overview

This design outlines the implementation of a robust contact form email integration system for the Client-First Digital website. The solution will replace the current mailto-based approach with a server-side email delivery system that integrates seamlessly with the existing Zoho Mail infrastructure. The design prioritizes reliability, user experience, and maintainability while leveraging the existing DKIM configuration and domain verification.

## Architecture

### High-Level Architecture

```mermaid
graph TD
    A[Contact Form Frontend] --> B[Form Validation]
    B --> C[AJAX Submission]
    C --> D[Backend API Endpoint]
    D --> E[Email Service Layer]
    E --> F[Zoho SMTP Server]
    F --> G[info@clientfirstdigital.com]
    
    D --> H[Response Handler]
    H --> I[Success/Error UI Feedback]
    
    D --> J[Rate Limiting]
    D --> K[Spam Protection]
    D --> L[Error Logging]
```

### Technology Stack

**Frontend:**
- Existing HTML contact form (minimal modifications required)
- Enhanced JavaScript for AJAX submission and user feedback
- CSS for loading states and success/error messages

**Backend Options (Recommended: Node.js):**
- **Node.js with Express** - Lightweight, fast deployment
- **Alternative: PHP** - If hosting environment requires
- **Alternative: Python Flask** - For more complex processing needs

**Email Service:**
- Zoho Mail SMTP (smtp.zoho.com:587)
- Existing DKIM authentication
- TLS encryption for secure transmission

**Hosting:**
- Backend API can be deployed on Vercel, Netlify Functions, or traditional hosting
- Static frontend remains on current hosting

## Components and Interfaces

### 1. Frontend Form Enhancement

**Modified Contact Form (index.html):**
```html
<form id="contact-form" novalidate>
    <!-- Existing form fields remain unchanged -->
    <div id="form-feedback" class="form-feedback hidden"></div>
    <button type="submit" class="btn-cta" id="submit-btn">
        <span class="btn-text">Book Strategy Call</span>
        <span class="btn-loading hidden">Sending...</span>
    </button>
</form>
```

**Enhanced JavaScript (js/script.js):**
```javascript
// Enhanced contact form handler
async function submitContactForm(formData) {
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        return { success: response.ok, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
```

### 2. Backend API Endpoint

**API Structure:**
```
POST /api/contact
Content-Type: application/json

Request Body:
{
    "name": "string",
    "email": "string",
    "service": "string", 
    "message": "string"
}

Response (Success):
{
    "success": true,
    "message": "Email sent successfully"
}

Response (Error):
{
    "success": false,
    "error": "Error description"
}
```

**Node.js Implementation Structure:**
```javascript
const express = require('express');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

// SMTP Configuration for Zoho Mail
const transporter = nodemailer.createTransporter({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD
    }
});
```

### 3. Email Service Layer

**Email Template Structure:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Website Inquiry - Client-First Digital</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #10b981;">New Website Inquiry</h2>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Contact Details:</h3>
            <p><strong>Name:</strong> {{name}}</p>
            <p><strong>Email:</strong> {{email}}</p>
            <p><strong>Service Interest:</strong> {{service}}</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
            <h3>Message:</h3>
            <p>{{message}}</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
            <p>This email was sent from the Client-First Digital website contact form.</p>
            <p>Timestamp: {{timestamp}}</p>
        </div>
    </div>
</body>
</html>
```

### 4. Security and Validation Layer

**Input Validation:**
- Email format validation (RFC 5322 compliant)
- Name field sanitization (remove HTML/script tags)
- Message length limits (max 2000 characters)
- Service selection validation against allowed options

**Security Measures:**
- Rate limiting: 5 submissions per IP per hour
- CSRF protection for form submissions
- Input sanitization to prevent XSS attacks
- Environment variables for sensitive credentials

**Spam Protection:**
- Honeypot field (hidden from users)
- Time-based submission validation (minimum 3 seconds)
- Duplicate submission prevention (same email/message within 24 hours)

## Data Models

### Contact Submission Model
```javascript
{
    id: String,                    // Unique identifier
    name: String,                  // Required, 2-100 characters
    email: String,                 // Required, valid email format
    service: String,               // Required, from predefined list
    message: String,               // Required, 10-2000 characters
    timestamp: Date,               // Auto-generated
    ipAddress: String,             // For rate limiting
    userAgent: String,             // For analytics
    status: String,                // 'pending', 'sent', 'failed'
    emailId: String                // SMTP message ID for tracking
}
```

### Service Options Enum
```javascript
const SERVICE_OPTIONS = [
    'ai-automation',
    'web-development', 
    'creative-design',
    'business-integration',
    'e-commerce',
    'digital-marketing',
    'premium-support',
    'other'
];
```

## Error Handling

### Frontend Error States

**Network Errors:**
- Display: "Connection error. Please check your internet and try again."
- Action: Preserve form data, enable retry

**Server Errors (5xx):**
- Display: "Server temporarily unavailable. Please try again in a few minutes."
- Action: Preserve form data, suggest alternative contact methods

**Validation Errors (4xx):**
- Display: Specific field-level error messages
- Action: Highlight problematic fields, maintain other data

**Timeout Errors:**
- Display: "Request timed out. Please try again."
- Action: Preserve form data, enable immediate retry

### Backend Error Handling

**SMTP Connection Failures:**
- Log error details for debugging
- Return generic error message to user
- Implement retry mechanism (3 attempts with exponential backoff)

**Authentication Failures:**
- Log security alert
- Check credential configuration
- Return generic error to prevent information disclosure

**Rate Limit Exceeded:**
- Return 429 status with retry-after header
- Log potential abuse attempts
- Display user-friendly rate limit message

## Testing Strategy

### Unit Tests

**Frontend Testing:**
- Form validation logic
- AJAX submission handling
- Error state management
- Success state management

**Backend Testing:**
- API endpoint functionality
- Email template rendering
- Input validation and sanitization
- Rate limiting behavior
- SMTP connection handling

### Integration Tests

**End-to-End Flow:**
- Complete form submission process
- Email delivery verification
- Error handling scenarios
- Cross-browser compatibility

**Email Delivery Testing:**
- Test email formatting and content
- Verify DKIM signature preservation
- Check spam score and deliverability
- Validate reply-to functionality

### Performance Tests

**Load Testing:**
- Concurrent form submissions
- Rate limiting effectiveness
- Server response times under load

**Email Service Testing:**
- Zoho SMTP connection reliability
- Email delivery speed
- Daily sending limit monitoring

### Security Tests

**Vulnerability Testing:**
- XSS prevention validation
- CSRF protection verification
- Input sanitization effectiveness
- Rate limiting bypass attempts

**Penetration Testing:**
- API endpoint security
- Authentication mechanism testing
- Data exposure prevention

## Deployment Considerations

### Environment Configuration

**Production Environment Variables:**
```
ZOHO_EMAIL=info@clientfirstdigital.com
ZOHO_PASSWORD=[secure_app_password]
RATE_LIMIT_WINDOW=3600000
RATE_LIMIT_MAX=5
NODE_ENV=production
CORS_ORIGIN=https://clientfirstdigital.co.za
```

**Development Environment:**
- Use test email account for development
- Lower rate limits for testing
- Enhanced logging for debugging

### Hosting Options

**Recommended: Vercel Serverless Functions**
- Automatic scaling
- Built-in security features
- Easy deployment from Git
- Cost-effective for low-medium traffic

**Alternative: Traditional VPS**
- Full control over environment
- Suitable for high traffic volumes
- Requires server maintenance

**Alternative: Netlify Functions**
- Similar to Vercel
- Good integration with static sites
- Built-in form handling features

### Monitoring and Maintenance

**Email Delivery Monitoring:**
- Track successful/failed email sends
- Monitor Zoho SMTP response codes
- Alert on delivery failures

**Performance Monitoring:**
- API response times
- Error rates and types
- Form submission success rates

**Security Monitoring:**
- Rate limiting triggers
- Suspicious submission patterns
- Failed authentication attempts

### Backup and Recovery

**Configuration Backup:**
- Environment variables documentation
- SMTP configuration details
- DNS record requirements

**Failure Recovery:**
- Fallback to mailto links if API fails
- Email queue for retry mechanisms
- Alternative SMTP provider configuration