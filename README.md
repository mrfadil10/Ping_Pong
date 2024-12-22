# ft_transcendence

## Overview

**ft_transcendence** is a web-based application designed to showcase advanced web development skills, integrating both front-end and back-end technologies. As part of the 42 curriculum, this project highlights expertise in creating modern, scalable, and feature-rich applications. The platform includes user authentication, real-time communication, a classic multiplayer game, and social features—all wrapped in a responsive design.

## Features

### Core Features
- **Authentication**
  - Secure login and registration.
  - OAuth2.0 integration for third-party authentication.
  - Two-Factor Authentication (2FA) for enhanced security.
- **User Profiles**
  - Editable user profiles with avatars.
  - Detailed user statistics (e.g., game history, win/loss records).
- **Social Features**
  - Friend system: add, accept, decline, and block users.
  - Real-time chat with private and group messaging.
- **Game**
  - Classic Pong game with customizable settings.
  - Multiplayer capabilities with matchmaking.
  - Spectator mode to watch live games.
- **Responsive Design**
  - Mobile-first design with seamless desktop experience.

### Technical Features
- **Real-Time Communication**
  - Powered by Django Channels and WebSockets.
  - Instant messaging and live game updates.
- **Security**
  - CSRF protection, encrypted passwords, and JWT for secure sessions.
  - Input validation and robust error handling.
- **Deployment**
  - Scalable and containerized setup using Docker.
  - Reverse proxy with Nginx for handling requests.

---

## Tech Stack

| Layer        | Technology              |
|--------------|-------------------------|
| **Front-End**| React.js/Vue.js, Tailwind CSS, Bootstrap |
| **Back-End** | Django, Django Rest Framework (DRF) |
| **Database** | PostgreSQL |
| **Real-Time**| Django Channels (WebSockets) |
| **Authentication** | OAuth2.0, JWT, 2FA |
| **Deployment** | Docker, Nginx, CI/CD (e.g., GitHub Actions) |

---

## Installation and Setup

### Prerequisites
Ensure you have the following installed:
- Python 3.9+
- Node.js (latest stable version)
- PostgreSQL
- Docker & Docker Compose (for production setup)

### Clone the Repository
```bash
git clone https://github.com/yourusername/ft_transcendence.git
cd ft_transcendence
