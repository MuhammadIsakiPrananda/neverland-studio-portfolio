import React from 'react';
import { SettingsCard } from './SettingsCard';

export const TermsTabContent: React.FC = () => {
  return (
    <div className="space-y-8">
      <SettingsCard
        title="Terms and Conditions"
        description="Last updated: June 10, 2024"
      >
        <div className="prose prose-invert prose-slate max-w-none text-slate-300">
          <p>Welcome to Neverland Studio!</p>
          <p>These terms and conditions outline the rules and regulations for the use of Neverland Studio's Website, located at yourwebsite.com.</p>
          <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Neverland Studio if you do not agree to take all of the terms and conditions stated on this page.</p>
          
          <h4 className="text-white">Cookies</h4>
          <p>We employ the use of cookies. By accessing Neverland Studio, you agreed to use cookies in agreement with the Neverland Studio's Privacy Policy.</p>

          <h4 className="text-white">License</h4>
          <p>Unless otherwise stated, Neverland Studio and/or its licensors own the intellectual property rights for all material on Neverland Studio. All intellectual property rights are reserved. You may access this from Neverland Studio for your own personal use subjected to restrictions set in these terms and conditions.</p>
          <p>You must not:</p>
          <ul>
            <li>Republish material from Neverland Studio</li>
            <li>Sell, rent or sub-license material from Neverland Studio</li>
            <li>Reproduce, duplicate or copy material from Neverland Studio</li>
            <li>Redistribute content from Neverland Studio</li>
          </ul>
          <p>This Agreement shall begin on the date hereof.</p>
        </div>
      </SettingsCard>
    </div>
  );
};