import './App.css';
import Login from './components/Login/Login';
import Signup from './components/SignUp/Signup';
import Dashboard from './components/Dashboard/Dashboard/Dashboard';
import Home from './components/Dashboard/Home/Home';
import Upload from './components/Dashboard/Video/Upload';
import MyVideos from './components/Dashboard/Video/MyVideos';
import VideoDetail from './components/Dashboard/Video/Videodetail';
import ProtectedRoute from './components/ProtectedRoute';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const myRoutes = createBrowserRouter([
    // Public Routes
    { path: '/', Component: Home },
    { path: '/signup', Component: Signup },
    { path: '/login', Component: Login },

    // Protected Routes (Dashboard + children)
    {
      element: <ProtectedRoute />, // 👈 Wraps protected routes
      children: [
        {
          path: '/Dashboard',
          Component: Dashboard,
          children: [
            {index:true, Component:Home},
            { path: 'Home', Component: Home },
            { path: 'Upload', Component: Upload },
            { path: 'MyVideos', Component: MyVideos },
            { path: 'Video/:videoId', Component: VideoDetail },
          ],
        },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={myRoutes} />
      <ToastContainer />
    </div>
  );
}

export default App;
