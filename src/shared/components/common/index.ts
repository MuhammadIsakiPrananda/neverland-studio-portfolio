/**
 * Shared Common Components - Public API
 */

// Common Components
export { default as FloatingButtons } from "./FloatingButtons";
export { default as VideoModal } from "./VideoModal";
export { Placeholder } from "./Placeholder";
export { default as Footer } from "./Footer";

// Route Guards
export { ProtectedRoute, AdminRoute, GuestRoute } from "./RouteGuards";

// Context & Hooks
export { ChatbotProvider, useChatbot } from "./ChatbotContext";
