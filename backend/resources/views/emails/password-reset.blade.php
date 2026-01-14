<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - {{ config('app.name') }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .email-wrapper {
            width: 100%;
            background-color: #f3f4f6;
            padding: 40px 20px;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .header {
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
            color: #ffffff;
            padding: 50px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: pulse 15s ease-in-out infinite;
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        .header-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            position: relative;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -0.5px;
            position: relative;
        }
        .content {
            padding: 50px 40px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 24px;
            line-height: 1.7;
        }
        .message strong {
            color: #1f2937;
            font-weight: 600;
        }
        .button-container {
            text-align: center;
            margin: 40px 0;
        }
        .reset-button {
            display: inline-block;
            padding: 18px 40px;
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 700;
            font-size: 16px;
            letter-spacing: 0.3px;
            transition: all 0.3s ease;
            box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.3);
            text-transform: uppercase;
        }
        .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 30px -5px rgba(59, 130, 246, 0.4);
        }
        .info-banner {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-left: 4px solid #f59e0b;
            padding: 20px;
            margin: 30px 0;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .info-banner-icon {
            font-size: 24px;
            flex-shrink: 0;
        }
        .info-banner-content {
            flex: 1;
        }
        .info-banner-title {
            font-weight: 700;
            color: #92400e;
            margin-bottom: 4px;
            font-size: 15px;
        }
        .info-banner-text {
            font-size: 14px;
            color: #78350f;
            margin: 0;
        }
        .security-section {
            background: #f9fafb;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 24px;
            margin: 30px 0;
        }
        .security-title {
            font-size: 16px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .security-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .security-list li {
            padding: 8px 0 8px 28px;
            font-size: 14px;
            color: #4b5563;
            position: relative;
        }
        .security-list li:before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #10b981;
            font-weight: bold;
            font-size: 16px;
        }
        .link-section {
            background: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }
        .link-label {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 10px;
            font-weight: 600;
        }
        .link-text {
            font-size: 13px;
            color: #3b82f6;
            word-break: break-all;
            font-family: 'Courier New', monospace;
            background: #ffffff;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
        }
        .divider {
            height: 2px;
            background: linear-gradient(90deg, transparent 0%, #e5e7eb 50%, transparent 100%);
            margin: 40px 0;
        }
        .footer {
            background: #f9fafb;
            padding: 40px;
            text-align: center;
            border-top: 2px solid #e5e7eb;
        }
        .footer-text {
            font-size: 13px;
            color: #6b7280;
            margin: 8px 0;
        }
        .footer-link {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 600;
        }
        .footer-link:hover {
            color: #2563eb;
            text-decoration: underline;
        }
        .social-links {
            margin-top: 20px;
        }
        .social-links a {
            display: inline-block;
            margin: 0 8px;
            color: #9ca3af;
            text-decoration: none;
            font-size: 20px;
            transition: color 0.3s ease;
        }
        .social-links a:hover {
            color: #3b82f6;
        }
        .copyright {
            margin-top: 20px;
            font-size: 12px;
            color: #9ca3af;
        }
        @media only screen and (max-width: 600px) {
            .email-wrapper {
                padding: 20px 10px;
            }
            .header {
                padding: 40px 24px;
            }
            .header h1 {
                font-size: 26px;
            }
            .content {
                padding: 30px 24px;
            }
            .reset-button {
                display: block;
                width: 100%;
                padding: 16px 20px;
            }
            .footer {
                padding: 30px 24px;
            }
            .info-banner {
                flex-direction: column;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <!-- Header -->
            <div class="header">
                <div class="header-icon">
                    🔐
                </div>
                <h1>Password Reset Request</h1>
            </div>
            
            <!-- Content -->
            <div class="content">
                <p class="greeting">Hello there! 👋</p>
                
                <p class="message">
                    We received a request to reset the password for your <strong>{{ config('app.name') }}</strong> account. 
                    If you made this request, click the button below to create a new password.
                </p>
                
                <!-- Reset Button -->
                <div class="button-container">
                    <a href="{{ $resetUrl }}" class="reset-button">
                        Reset My Password
                    </a>
                </div>
                
                <!-- Expiry Warning -->
                <div class="info-banner">
                    <div class="info-banner-icon">⏰</div>
                    <div class="info-banner-content">
                        <div class="info-banner-title">Time-Sensitive Link</div>
                        <p class="info-banner-text">
                            This reset link will expire in <strong>{{ config('auth.passwords.users.expire', 60) }} minutes</strong> for your security.
                        </p>
                    </div>
                </div>
                
                <!-- Security Tips -->
                <div class="security-section">
                    <div class="security-title">
                        <span>🛡️</span> Security Best Practices
                    </div>
                    <ul class="security-list">
                        <li>Use a strong password with at least 8 characters</li>
                        <li>Include uppercase, lowercase, numbers, and symbols</li>
                        <li>Don't reuse passwords from other accounts</li>
                        <li>Never share your password with anyone</li>
                        <li>This link can only be used once</li>
                    </ul>
                </div>
                
                <div class="divider"></div>
                
                <!-- Alternative Link -->
                <div class="link-section">
                    <p class="link-label">If the button doesn't work, copy and paste this link:</p>
                    <div class="link-text">{{ $resetUrl }}</div>
                </div>
                
                <!-- Warning -->
                <p class="message" style="margin-top: 30px; padding: 16px; background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 6px;">
                    <strong style="color: #991b1b;">⚠️ Didn't request this?</strong><br>
                    <span style="color: #7f1d1d; font-size: 14px;">
                        If you didn't request a password reset, please ignore this email or 
                        <a href="{{ config('app.url') }}/contact" style="color: #dc2626; text-decoration: underline;">contact support</a> 
                        if you're concerned about your account security.
                    </span>
                </p>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <p class="footer-text">
                    This email was sent by <strong>{{ config('app.name') }}</strong>
                </p>
                <p class="footer-text">
                    <a href="{{ config('app.url') }}" class="footer-link">Visit our website</a> 
                    • 
                    <a href="{{ config('app.url') }}/help" class="footer-link">Get Help</a>
                </p>
                
                <div class="social-links">
                    <a href="#" title="Twitter">🐦</a>
                    <a href="#" title="Facebook">📘</a>
                    <a href="#" title="Instagram">📷</a>
                    <a href="#" title="LinkedIn">💼</a>
                </div>
                
                <p class="copyright">
                    &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
                </p>
                
                <p class="footer-text" style="margin-top: 16px; font-size: 11px;">
                    You're receiving this email because a password reset was requested for your account.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
