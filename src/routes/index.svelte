<script>
	import io from 'socket.io-client';
	import { onMount } from 'svelte';

	const endpoint = 'https://svelte-chat-green.vercel.app/';
	const socket = io(endpoint);
	let input = '';
	let isPublic = true;
	let publicMessages = [];
	let privateMessages = [];
	$: myId = socket.id;
	let userToChat = '';
	$: messages = isPublic ? publicMessages : privateMessages;

	onMount(() => {
		socket.on('connect', () => (myId = socket.id));
		socket.on('receive', (message, user) => {
			console.log(message, user);
			if (user) privateMessages = [...privateMessages, message];
			else publicMessages = [...publicMessages, message];
		});
	});

	const sendMessage = () => {
		if (isPublic) {
			publicMessages = [...publicMessages, { input, me: true }];
			socket.emit('message', input);
			console.log('first');
		} else if (userToChat.trim()) {
			privateMessages = [...privateMessages, { input, me: true }];
			socket.emit('message', input, userToChat);
		} else alert('Enter user id of the user you want to chat with');
		input = '';
	};
</script>

<head>
	<title>Chat</title>
</head>

<main>
	<aside>
		<button
			class="nav-btn"
			on:click={() => (isPublic = true)}
			style={isPublic ? 'background-color: lightblue' : ''}>Public Chat</button
		>
		<button
			class="nav-btn"
			on:click={() => (isPublic = false)}
			style={!isPublic ? 'background-color: lightblue' : ''}>Rooms</button
		>
	</aside>
	<div class="chat-area">
		<div class="meta">
			{#if !isPublic}
				<div>
					Chat with: {userToChat}
					<input
						type="text"
						value={userToChat}
						on:change={(e) => {
							userToChat = e.currentTarget.value;
						}}
					/>
				</div>
			{/if}
			<div>Your id: {myId}</div>
		</div>
		<div class="chat-box">
			{#each messages as message}
				<div
					class="message"
					style={message?.me ? 'background-color:lightgreen;margin-left:auto' : ''}
				>
					<p>
						{message?.input ? message.input : message}
					</p>
				</div>
			{/each}
		</div>

		<div class="input-box">
			<textarea
				type="text"
				value={input}
				on:change={(e) => {
					input = e.currentTarget.value;
				}}
			/>
			<button on:click={sendMessage}>Send</button>
		</div>
	</div>
</main>

<style>
	main {
		margin-top: 10vh;
		margin-left: 10%;
		height: 80vh;
		width: 80vw;
		display: flex;
	}
	aside {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5%;
		width: 20%;
		height: 100%;
		padding: 2%;
		background-color: rgba(200, 200, 200, 0.5);
	}
	.nav-btn {
		padding: 5%;
		width: 10em;
		border-radius: 1.25em;
		cursor: pointer;
	}
	.chat-area {
		height: 100%;
		width: 100%;
		border: 2px solid black;
	}
	.meta {
		padding: 0.5%;
		height: 10%;
	}
	.chat-box {
		height: 80%;
		width: 100%;
		border: 2px solid black;
		padding: 1%;
	}
	.message {
		padding: 2%;
		border-radius: 1.25em;
		margin-bottom: 5px;
	}
	.input-box {
		padding: 1%;
		display: flex;
		align-items: center;
		gap: 2%;
	}
	textarea {
		width: 80%;
	}
	.message {
		padding: 2%;
		width: fit-content;
		max-width: 70%;
		display: flex;
		background-color: rgba(180, 180, 180, 0.5);
	}
</style>
