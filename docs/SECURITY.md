# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do NOT Open a Public Issue

Please do not report security vulnerabilities through public GitHub issues.

### 2. Report Privately

Send an email to: **muhammadisakiprananda88@gmail.com**

Include:
- Type of vulnerability
- Full paths of affected source files
- Location of the affected code (tag/branch/commit)
- Step-by-step instructions to reproduce
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability

### 3. Response Timeline

- **24 hours**: Initial acknowledgment
- **7 days**: Detailed response with assessment
- **30 days**: Fix implementation and testing
- **After fix**: Public disclosure (coordinated)

## Security Measures

### Application Security

#### Authentication & Authorization
- Laravel Sanctum token-based authentication
- OAuth 2.0 for social login (Google, GitHub)
- Password hashing with Bcrypt
- Google 2FA support
- Session management and tracking
- Role-based access control (RBAC)

#### Data Protection
- CSRF protection on all forms
- XSS prevention via input sanitization
- SQL injection protection (Eloquent ORM)
- Secure HTTP-only cookies
- Environment variables for secrets
- API rate limiting
- Database encryption for sensitive data

#### Infrastructure Security
- Nginx security headers
- SSL/TLS encryption (HTTPS)
- Docker container isolation
- Secure CORS configuration
- Database access controls
- Regular dependency updates

### Best Practices

#### For Developers
- Never commit secrets to repository
- Use environment variables for configuration
- Validate and sanitize all user inputs
- Use parameterized queries (Eloquent ORM)
- Keep dependencies up to date
- Follow OWASP security guidelines
- Implement proper error handling
- Use HTTPS in production

#### For Users
- Use strong, unique passwords
- Enable 2FA when available
- Keep browser and system updated
- Be cautious with OAuth permissions
- Report suspicious activities
- Regularly review active sessions

## Security Features

### OAuth Security
- State parameter for CSRF prevention
- Token validation on callback
- Secure token storage
- Auto-expiring access tokens
- Refresh token rotation

### API Security
- Token-based authentication
- Rate limiting per IP/user
- Request validation
- Response sanitization
- CORS restrictions
- API versioning

### Database Security
- Encrypted connections
- Prepared statements only
- Limited user privileges
- Regular backups
- Audit logging
- Data validation

## Known Security Considerations

### OAuth Cancellation Flow
- Users canceling OAuth redirected securely
- No sensitive data in redirect URLs
- Session state maintained properly

### Admin Dashboard
- Separate authentication from website users
- Username/password only (no OAuth)
- Session timeout after inactivity
- IP-based access restrictions (optional)

## Security Updates

We monitor security advisories for:
- React & npm packages
- Laravel & Composer packages
- Docker base images
- Third-party services

Updates are applied promptly and tested thoroughly.

## Acknowledgments

We appreciate security researchers who responsibly disclose vulnerabilities. Contributors will be acknowledged (with permission) in release notes.

## Contact

**Security Email**: muhammadisakiprananda88@gmail.com

**PGP Key**: Available upon request

---

Last Updated: December 27, 2025
