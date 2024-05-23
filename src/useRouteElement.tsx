import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./contexts/app.context";
import Home from "./pages/Home";
import RegisterLayout from "./Layout/RegisterLayout";
import SignInWithGoogle from "./pages/SignInWithGoogle";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MainLayout from "./Layout/MainLayout";
import PostDetail from "./pages/PostDetails";
import ProfileDetail from "./pages/ProfileDetail";
import FollowersList from "./pages/ProfileDetail/components/FollowersList";
import FollowingList from "./pages/ProfileDetail/components/FollowingList";

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext);
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}
export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: "",
      element: <RejectedRoute />,
      children: [
        {
          path: "/register",
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          ),
        },
        {
          path: "/login",
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          ),
        },
      ],
    },

    {
      path: '/posts/:id',
      index: true,

      element: (
        <MainLayout>
          <PostDetail />,
        </MainLayout>
      )
    },
    {
      path: '/profile/:id',
      index: true,

      element: (
        <MainLayout>
          <ProfileDetail />,
        </MainLayout>
      )
    },
    {
      path: '/profile/:id/followers',
      index: true,

      element: (
        <MainLayout>
          <FollowersList />
        </MainLayout>
      )
    },
    {
      path: '/profile/:id/following',
      index: true,

      element: (
        <MainLayout>
          <FollowingList />
        </MainLayout>
      )
    },
    {
      path: '',
      index: true,
      element: (
        <MainLayout>
              <Home />
        </MainLayout>
      )
    }
  ]);
  return routeElements;
}
