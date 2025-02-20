# Next.js 15 ChatApp

## Getting Started

### Installation

1. **Clone this repository:**
   ```sh
   git clone https://github.com/kVarunkk/Simple-Nextjs-ChatApp.git
   cd Simple-Nextjs-ChatApp
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the Next.js app:**
   ```sh
   npm run dev
   ```
4. **Start the WebSocket server:**
   ```sh
   cd server
   node websocket-server.js
   ```
5. **Open the app in your browser:**
   - Navigate to: [http://localhost:3000](http://localhost:3000)
   - Go to `/chat` to start chatting.

## Project Structure

```
Simple-Nextjs-ChatApp/
│── app/                 # Next.js routes
│── components/          # React components used in the app
│── global/types.ts      # Types
│── server/              # Node.js WebSocket server
│── package.json         # Project dependencies and scripts
│── next.config.js       # Next.js configuration
│── README.md            # Project documentation
```

## Features

✅ **Real-time Chat:** Uses WebSockets for instant messaging.
✅ **Next.js 15 Support:** Optimized performance with the latest Next.js features.
✅ **Modular Codebase:** Well-structured for scalability and maintainability.
✅ **Simple UI:** Clean and minimal design for a better user experience.
✅ **Node.js WebSocket Server:** Lightweight and efficient for handling multiple connections.

## Technologies Used

- **Frontend:** Next.js 15 (React), Tailwind CSS
- **Backend:** Node.js, WebSocket (Socket.io)

## Usage

- Open multiple tabs or devices and navigate to `/chat` to test real-time messaging.
- Modify `server/websocket-server.js` if needed to add more features.
- Customize the UI in `components/`.

## Contributing

Feel free to submit issues and pull requests to improve this project!

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
