import adapter from '@sveltejs/adapter-auto';
import { Server } from 'socket.io';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		vite: {
			plugins: [
				{
					name: 'sveltekit-socket-io',
					configureServer(server) {
						const io = new Server(server.httpServer);

						io.on('connection', (socket) => {
							socket.on('message', (message, user) => {
								if (!user) socket.broadcast.emit('receive', message);
								else socket.to(user).emit('receive', message, user);
							});
						});
					}
				}
			]
		}
	}
};

export default config;
