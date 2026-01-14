<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class CustomResetPasswordNotification extends ResetPassword
{
    /**
     * Build the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $resetUrl = $this->buildResetUrl($notifiable);

        return (new MailMessage)
            ->subject('Reset Password - ' . config('app.name'))
            ->view('emails.password-reset', [
                'resetUrl' => $resetUrl,
                'user' => $notifiable,
            ]);
    }

    /**
     * Build the password reset URL.
     *
     * @param  mixed  $notifiable
     * @return string
     */
    protected function buildResetUrl($notifiable)
    {
        // Get frontend URL from environment
        $frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5173'));
        
        // Build reset URL pointing to frontend
        return $frontendUrl . '/reset-password?token=' . $this->token . '&email=' . urlencode($notifiable->getEmailForPasswordReset());
    }
}
