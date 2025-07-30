import adapter from '@sveltejs/adapter-auto';

<<<<<<< HEAD
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			out: 'build'
		})
	}
};

export default config;
=======
export default {
  kit: {
    adapter: adapter(),
    paths: {
      base: '/hidro' // jika kamu ingin mengakses via /hidro
    }
  },
  preprocess: preprocess()
};

>>>>>>> f1f78ffe57bbc660780e39aaf399da4ef4c68b39
