import '../styles/globals.css';
import '../utils/hero-slider.js';
import { initI18n } from './i18n.js';
import '../components/room-modal/room-modal.css';
import { initRoomModal } from '../components/room-modal/room-modal.js';

console.log('Club199 Landing Page initialized.');
initI18n();
initRoomModal();

// Loader animation is now handled natively via pure CSS and vanilla JS in /utils/loader.js
