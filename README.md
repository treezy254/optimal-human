# Daily Timebox App

Welcome to the **Daily Timebox App**! This application is designed to help you manage your daily tasks and schedule efficiently by using the timeboxing method.

[![Daily Timebox Screenshot](https://github.com/treezy254/optimal-human/blob/master/Screenshot%20from%202024-07-29%2022-49-23.png)](https://github.com/treezy254/optimal-human/blob/master/Screenshot%20from%202024-07-29%2022-49-23.png)


## Features
 
- **Date Selection**: Easily navigate through different dates to plan your tasks.
- **Top Tasks**: Prioritize your three most important tasks for the day.
- **Secondary Tasks**: List additional tasks that you aim to complete.
- **Task Brain Dump**: Capture all tasks you want to complete, ensuring nothing is forgotten. 
- **Timebox Schedule**: Allocate specific time slots for tasks to maintain a structured day.

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge).
- An internet connection to load external libraries.

### Installation

1. Clone or download this repository.
2. Open the `index.html` file in your preferred web browser.

### Usage

1. **Open the App**: Load `index.html` in your web browser.
2. **Select Date**: Use the date input to pick a date or navigate using the previous and next buttons.
3. **Enter Tasks**: Fill in your top tasks, secondary tasks, and brain dump tasks.
4. **Allocate Time**: Use the timebox section to allocate specific times for your tasks.
5. **Save Progress**: Your tasks and schedule are automatically saved in local storage.

## File Structure

- `index.html`: The main HTML file containing the structure of the app.
- `script.js`: JavaScript file handling the app’s logic and interactions.
- `styles.css`: (Optional) Custom styles for the app (if you decide to use external CSS).

### External Libraries

- **Tailwind CSS**: For quick and responsive styling.
- **Font Awesome**: For icons.
- **Flatpickr**: For date picking functionality.
- **Firebase**: For potential backend functionalities (currently used for Firestore and Auth, but not yet implemented in this script).

## Customization

You can customize the app by editing the HTML, CSS, and JavaScript files. 

### Switching to External CSS

1. Create a `styles.css` file.
2. Move all inline styles or internal styles from `index.html` to `styles.css`.
3. Link the `styles.css` file in the `head` section of `index.html`:
   ```html
   <link rel="stylesheet" href="styles.css">
   ```

### Example Task Entry

```html
<ul class="space-y-2">
    <li class="flex items-center border-b border-gray-200">
        <input type="checkbox" class="mr-2">
        <input type="text" class="w-full py-1 focus:outline-none" placeholder="Enter top task 1">
    </li>
</ul>
```

## Contributing

Feel free to fork this repository, make your changes, and submit a pull request. Any improvements or bug fixes are welcome!

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Acknowledgements

- Tailwind CSS for the styling framework.
- Font Awesome for the icons.
- Flatpickr for the date picker functionality.
- Firebase for backend services.

---

Thank you for using the Daily Timebox App! We hope it helps you manage your day more effectively. If you have any feedback or suggestions, please reach out.

