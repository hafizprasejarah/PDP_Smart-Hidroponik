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
=======
        plugins: [
                tailwindcss(),
                sveltekit()
        ],
        preview: {
>>>>>>> 1810aefee831086e437859f676b12a413278b175
    port: 4000,
    host: true,
    allowedHosts: ['udbsmartfarming.com', 'www.udbsmartfarming.com']
  }

});
