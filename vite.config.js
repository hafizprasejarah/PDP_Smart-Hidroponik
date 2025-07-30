import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
<<<<<<< HEAD
	plugins: [
		tailwindcss(),
		sveltekit()
	],
	preview: {
    port: 4000,
    host: true,
    allowedHosts: ['udbsmartfarming.com', 'www.udbsmartfarming.com']
  }

});
