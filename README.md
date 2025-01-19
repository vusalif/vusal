# Modern Portfolio Website

A clean, responsive portfolio website template built with HTML, CSS, and JavaScript.

## Features

- 📱 Fully responsive design
- 🎨 Modern and clean UI
- 🚀 Smooth scrolling navigation
- 📝 Contact form
- 💫 Scroll-based animations
- 🎯 Project showcase section
- 📊 Skills display
- 📱 Mobile-friendly navigation

## Getting Started

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Customize the content to make it your own!

## Customization

### Changing Content

1. Open `index.html` and modify the text content, links, and images
2. Update your personal information in the following sections:
   - Hero section (name and tagline)
   - About section
   - Projects section
   - Contact section

### Styling

1. Open `style.css` to customize the look and feel
2. Main colors can be changed in the `:root` section:
   ```css
   :root {
       --primary-color: #2563eb;
       --secondary-color: #1e40af;
       --text-color: #1f2937;
       --bg-color: #ffffff;
       --accent-color: #f3f4f6;
   }
   ```

### Adding Projects

To add a new project, copy and paste the following structure in the projects section of `index.html`:

```html
<div class="project-card">
    <div class="project-image">
        <img src="path/to/your/image.jpg" alt="Project Name">
    </div>
    <div class="project-info">
        <h3>Project Name</h3>
        <p>Project description goes here.</p>
        <div class="project-links">
            <a href="#" class="btn">View Project</a>
            <a href="#" class="btn">GitHub</a>
        </div>
    </div>
</div>
```

## Contact Form

The contact form is currently set up to log form submissions to the console. To make it functional:

1. Set up a backend server to handle form submissions
2. Update the form submission code in `script.js`
3. Add your server endpoint URL
4. Handle the response appropriately

## Browser Support

This template works in all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## License

This project is open source and available under the MIT License.

## Credits

- Font Awesome for icons
- Inter font family
- Images should be replaced with your own 