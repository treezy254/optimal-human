
# Daily Timebox Productivity App

A modern web application built to enhance daily productivity using the timeboxing method. This app features cloud data synchronization with Firebase, full offline support, and a dynamic productivity dashboard.

**[➡️ Live Demo Link Here]** `[ADD YOUR LIVE DEMO LINK HERE]`

## Tech Stack

  - **Frontend:** Vanilla JavaScript (ES6+), Tailwind CSS
  - **Backend & Database:** Firebase (Firestore, Google Authentication)
  - **Libraries:** Chart.js, Flatpickr
  - **Tooling:** Vite (for local development)

## Key Features

  - **Cloud Synchronization:** Seamlessly saves all tasks, schedules, and projects to Firestore, enabling data persistence across multiple devices.
  - **Offline-First Support:** The app gracefully falls back to Local Storage, allowing for full functionality even without an internet connection. Data is synced with Firestore upon reconnection.
  - **User Authentication:** Secure Google Sign-In to keep user data private and synchronized to their account.
  - **Productivity Dashboard:** A dynamic dashboard built with Chart.js that visualizes task completion rates and productivity trends on a weekly or monthly basis.
  - **MVC Architecture:** The codebase is structured using a Model-View-Controller (MVC) pattern for clean separation of concerns, scalability, and maintainability.
  - **Project Management:** Users can create and manage distinct projects, linking tasks to specific goals to track progress more effectively.

## Project Structure

The application follows a Model-View-Controller (MVC) pattern to ensure a clean separation of concerns:

```
/js
├── controller.js       # Handles user input and application logic
├── model.js            # Manages state and communication with Firebase/localStorage
├── view.js             # Manages the Timebox view rendering
├── dashboard.js        # Manages the Dashboard view and chart logic
├── projects.js         # Manages the Projects model and view
└── firebase.js         # Firebase configuration and SDK exports
/index.html             # Main application entry point
```

## Running Locally

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/optimal-human.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd optimal-human
    ```
3.  **Start a local server:**
    This project uses modern JavaScript modules (`import`/`export`). For them to work correctly, you must run the files from a local server.
    ```sh
    # If you have Node.js installed, you can use npx serve
    npx serve
    ```
    Then open your browser to the URL provided (e.g., `http://localhost:3000`).

## License

This project is licensed under the MIT License.