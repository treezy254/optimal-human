# Daily Timebox Productivity App

A modern web application designed to enhance daily productivity through the timeboxing method. Built with vanilla JavaScript and Firebase, this app provides cloud data synchronization, full offline support, and comprehensive productivity analytics to help you optimize your time management.

**[🚀 Live Demo](https://optimal-human.web.app/)**

![App Screenshot](https://github.com/treezy254/optimal-human/blob/master/Screenshot%20from%202024-07-29%2022-49-23.png?raw=true)

## Tech Stack

- **Frontend:** Vanilla JavaScript (ES6+), Tailwind CSS
- **Backend:** Firebase (Firestore, Google Authentication)
- **Hosting:** Firebase Hosting

## Key Features

### ⏱️ Timeboxing
Allocate specific time blocks to tasks and activities, helping you maintain focus and manage your schedule effectively.

### 📊 Productivity Analytics
Track your daily, weekly, and monthly productivity patterns with detailed analytics and visualizations to identify trends and optimize your workflow.

### 📁 Project Management
Organize tasks into projects, set priorities, and monitor progress across multiple initiatives in a centralized dashboard.

## Running Locally

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/treezy254/optimal-human.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd optimal-human
    ```

3.  **Navigate to the public directory:**
    ```sh
    cd public
    ```

4.  **Install http-server globally (if not already installed):**
    ```sh
    npm install -g http-server
    ```

5.  **Start the development server:**
    ```sh
    http-server -p 8080
    ```

6.  **Open your browser and visit:**
    ```
    http://localhost:8080
    ```

### Firebase Configuration

To run the app with full functionality, you'll need to configure Firebase:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database and Google Authentication
3. Copy your Firebase configuration credentials
4. Update the Firebase config in your project's configuration file

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
