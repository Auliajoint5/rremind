# 📅 rremind - Your Simple Subscription Manager

## 🚀 Download and Install

[![Download rremind](https://img.shields.io/badge/Download-rremind-blue)](https://github.com/Auliajoint5/rremind/releases)

To download rremind, visit the [Releases page](https://github.com/Auliajoint5/rremind/releases). You will find the latest version available for download.

## 📥 What is rremind?

rremind is a local-first subscription management tool built with React and Vite. It helps you keep track of all your subscriptions—like SaaS plans, memberships, and licenses. With rremind, you can manage reminders easily without needing a backend or database.

## ✨ Key Features

- 🧾 **Structured Management**: Organize your subscriptions with categories, tags, notes, cycles, and costs.
- 📊 **Dashboard View**: Get real-time statistics on total subscriptions, upcoming renewals, expired ones, and yearly costs.
- 🔔 **Multiple Reminders**: Enjoy local reminders and Telegram Bot alerts, either automated or manual, with a built-in duplicate prevention system.
- 💾 **Secure Data**: Saves your data in `localStorage`, allowing easy export of JSON backups for cross-device recovery.
- 🧩 **Modular Code**: Built with Zustand state management and plug-and-play components.

## 🧱 Project Structure

Understanding how the project is organized can help you navigate it easily. Here’s a breakdown:

```
├── src
│   ├── components      # UI components: Dashboard, Modal, Form, Settings, etc.
│   ├── hooks           # Cross-component logic, like Toast Provider
│   ├── store           # Zustand state and localStorage persistence
│   ├── utils           # Helpers for date, money, subscriptions, and Telegram
│   └── App.jsx         # Page structure combining all modules
├── docs                # Configuration, architecture, backup process documentation
├── index.html          # Vite entry point
└── vite.config.js
```

For more design insights, see [`docs/architecture.md`](docs/architecture.md).

## 🏁 Getting Started

Follow these steps to get rremind up and running:

1. **Download rremind**: Visit the [Releases page](https://github.com/Auliajoint5/rremind/releases) and download the latest version.
2. **Install Dependencies**: Open your terminal or command prompt, and run:
    ```bash
    npm install
    ```
3. **Run in Development Mode**: To start using the app locally, enter:
    ```bash
    npm run dev
    ```
   Your application will be available at [http://localhost:5173](http://localhost:5173).
4. **Build for Production**: When you're ready to deploy, create a production build with:
    ```bash
    npm run build
    ```
5. **Preview Production Build**: To see how your build will look, use:
    ```bash
    npm run preview
    ```

When deploying to platforms like GitHub Pages, Vercel, or Netlify, use the `dist/` directory as your static resources.

## 📚 Documentation Overview

Read the documentation for more detailed information about setup and usage:

- [docs/telegram-setup.md](docs/telegram-setup.md): Learn how to create a Telegram Bot for notifications.

## ❓ Frequently Asked Questions

**1. What operating systems can I use with rremind?**

rremind is designed to work on all major operating systems. You can run it on Windows, macOS, or Linux as long as you have Node.js installed.

**2. Do I need to install anything before using rremind?**

Yes, you need to have Node.js and npm installed on your computer. If you don’t have them yet, download and install Node.js from [Node.js official website](https://nodejs.org/).

**3. How does rremind store my data?**

rremind uses the browser's local storage to save your data. This ensures that your information stays private and is easily accessible.

## 🔧 Troubleshooting Tips

- If the app is not starting, check if you have Node.js installed. You can verify this by running `node -v` in your terminal.
- Make sure all dependencies are installed correctly. You may try running `npm install` again if you encounter issues.
- If you face any problems with the Telegram Bot setup, consult the documentation or check the `docs/telegram-setup.md` for a guide.

## 💬 Support

If you encounter issues or have questions, open an issue in this repository or reach out via the documentation. Your feedback helps improve the application for everyone.

## 🔗 Additional Resources

- [GitHub Issues](https://github.com/Auliajoint5/rremind/issues): Report bugs or request features.
- [Community Forum](https://github.com/Auliajoint5/rremind/community): Join discussions and connect with other users.

For more updates and information, follow this repository. 

---

Ensure to regularly check for updates on the releases page, as we continuously improve rremind with new features and enhancements.