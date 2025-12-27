<?php

/**
 * Generate a default avatar URL for a user
 * Uses DiceBear Avatars API to create consistent, unique avatars
 * 
 * @param string $identifier - Name or email to generate avatar from
 * @param string $style - Avatar style (avataaars, bottts, personas, etc.)
 * @return string - Avatar URL
 */
function generateDefaultAvatar($identifier, $style = 'avataaars')
{
    // Clean the identifier
    $seed = urlencode(strtolower(trim($identifier)));

    // DiceBear API endpoint
    // Available styles: avataaars, bottts, personas, initials, etc.
    return "https://api.dicebear.com/7.x/{$style}/svg?seed={$seed}&backgroundColor=b6e3f4,c0aede,d1d4f9";
}
