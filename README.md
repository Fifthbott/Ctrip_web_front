# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Code Splitting Implementation

To improve performance and reduce the main JavaScript bundle size, the following code splitting strategies have been implemented:

1. **React.lazy and Suspense**:
   - Main routes (App, Login, AdminHome) are lazy loaded
   - The large AuditModal component is lazy loaded when needed
   - All lazy-loaded components use a common Loader component as fallback

2. **Webpack Optimization (via craco)**:
   - Added @craco/craco to customize webpack configuration
   - Set up split chunks with more granular control
   - Created separate vendor chunks for node_modules
   - Limited chunk sizes to improve loading time

3. **Dynamic Imports**:
   - Antd locale is loaded dynamically when needed
   - Heavy components are loaded on demand

4. **How to Build**:
   - Use `npm run build` which now uses craco for optimized builds
   - The output will contain multiple smaller JS chunks instead of one large file

These changes have significantly reduced the main bundle size and improved initial loading performance.
