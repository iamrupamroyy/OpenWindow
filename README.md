# OpenWindow Chat

OpenWindow is a real-time, room-based chat application built with Node.js and Socket.IO. It provides a clean, responsive interface for users to communicate in public or private chat rooms.

## Features

- **Real-time Messaging:** Instantaneous message delivery using WebSockets.
- **Chat Rooms:** Users can create new chat rooms or join existing ones.
- **Active Room Discovery:** See a list of active rooms and their current participant count before joining.
- **User Presence:** Real-time notifications when users join or leave a room.
- **Unique Usernames:** Usernames are unique on a per-room basis.
- **Emoji Support:** An integrated emoji picker to add emojis to messages.
- **Responsive Design:** A mobile-first design that works seamlessly on both desktop and mobile devices.
- **Light & Dark Mode:** A theme switcher to toggle between light and dark modes, with the user's preference saved locally.
- **Persistent Connections:** Automatically rejoins a user to their last room upon reconnecting, providing a more stable experience on mobile devices.
- **Custom Logo:** Features a scalable SVG logo for a personalized look.

## Technologies Used

### Backend
- **[Node.js](https://nodejs.org/):** A JavaScript runtime environment for the server-side logic.
- **[Express.js](https://expressjs.com/):** A web framework for Node.js, used to serve static files.
- **[Socket.IO](https://socket.io/):** A library that enables real-time, bidirectional and event-based communication.

### Frontend
- **HTML5**
- **CSS3:** (Flexbox, Grid, CSS Variables for theming)
- **JavaScript:** (DOM manipulation, event handling, client-side socket communication)

### Key Libraries
- **[moment.js](https://momentjs.com/):** Used for formatting message timestamps.
- **[emoji-picker-element](https://github.com/nolanlawson/emoji-picker-element):** A lightweight web component for the emoji picker.

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You must have [Node.js](https://nodejs.org/) installed on your system (which includes npm). This project has been tested with Node.js v18.x and later.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd OpenWindow
    ```
3.  **Install the dependencies:**
    ```sh
    npm install
    ```

### Running the Application

1.  **Start the server:**
    ```sh
    npm start
    ```
2.  **Open the application in your browser:**
    Navigate to `http://localhost:3000`

---

## Deployment

This application is ready to be deployed on modern hosting platforms that support Node.js. The code is configured to use the port provided by the hosting service's environment variable.

For a free and easy deployment, services like **[Render](https://render.com/)** or **[Glitch](https://glitch.com/)** are excellent choices. The general steps involve linking your GitHub repository to the service and letting it run the `npm install` and `npm start` commands.

---

## Author

All rights reserved by Rupam Roy &copy; 2025
