import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
<<<<<<< HEAD
	plugins: [
		tailwindcss(),
		sveltekit()
	]
=======
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
>>>>>>> f1f78ffe57bbc660780e39aaf399da4ef4c68b39

});
