import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { useState,useEffect } from "react";

import BuyerLayout from "./layouts/BuyerLayout";
import ArtistLayout from "./layouts/ArtistLayout";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./context/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ArtistApplication from "./pages/artworks/ArtistApplication";

import BuyerDashboard from "./pages/BuyerDashboard";
import ArtistDashboard from "./pages/ArtistDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import BrowseArt from "./pages/artworks/BrowseArt";
import Cart from "./pages/artworks/Cart";
import CheckOut from "./pages/artworks/CheckOut";
import ArtDetail from "./pages/artworks/ArtDetail";
import ArtworkModeration from "./pages/admin/ArtworkModeration";
import Reports from "./pages/admin/Reports";
import UserManagement from "./pages/admin/UserManagement";
import Disputes from "./pages/admin/Disputes";
import ApplicationsApproval from "./pages/admin/ApplicationsApproval";
import ExhibitionManagement from "./pages/curator/ExhibitionManagement";
import CurationStudio from "./pages/curator/CurationStudio";
import ArtworkSelection from "./pages/curator/ArtworkSelection";
import FeaturedArtists from "./pages/curator/FeaturedArtists";
import VisitorAnalytics from "./pages/curator/VisitorAnalytics";
import CuratorDashboard from "./pages/CuratorDashboard";
import GalleryManager from "./pages/admin/GalleryManager";
import AdminLayout from "./layouts/AdminLayout";
import CuratorLayout from "./layouts/CuratorLayout";
import ArtistProfile from "./pages/artworks/ArtistProfile";
import Analytics from "./pages/artist/Analytics";
import Orders from "./pages/artist/Orders";
import Support from "./pages/artist/Support";
import UploadArtwork from "./pages/artist/UploadArtwork";
import Address from "./pages/customer/Address";
import Tickets from "./pages/customer/Tickets";
import CustomerSupport from "./pages/customer/CustomerSupport";
import SavedIteams from "./pages/customer/SavedItems";
import CuratorApplication from "./pages/exhibitions/CuratorApplication";
import Exhibitions from "./pages/exhibitions/Exhibitions";
import ReportsCenter from "./pages/customer/ReportsCenter";
import DisputeCenter from "./pages/customer/DisputeCenter";
import TicketsManagement from "./pages/admin/TicketsManagement";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import ForgotPassword from "./pages/ForgotPassword";
import BookTicket from "./pages/exhibitions/BookTicket";
import TicketSuccess from "./pages/exhibitions/TicketSuccess";

const router = createBrowserRouter([
  {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      },
      { path:"/forgot-password" ,
         element:<ForgotPassword />
      },
      {
        path: "apply-artist",
        element: <ProtectedRoute>
                   <ArtistApplication />
                </ProtectedRoute>
      },
      {
        path : "artist-profile",
        element: <ProtectedRoute>
                   <ArtistProfile />
                </ProtectedRoute>
      },
      {
        path : "curator-application",
        element : <ProtectedRoute>
                    <CuratorApplication/>
                  </ProtectedRoute>
      },
      { path: "exhibitions",
        element: <ProtectedRoute>
                     <Exhibitions/>
                 </ProtectedRoute>
      },

  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,  
        element: <Home />
      },
    ]
  },

  {
    path: "/buyer",
    element: 
            <ProtectedRoute> 
               <BuyerLayout /> 
            </ProtectedRoute>,
    children: [
      { path: "dashboard", element: <BuyerDashboard /> },
      { path: "browse", element: <BrowseArt /> },
      { path: "artDetail", element: <ArtDetail /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <CheckOut /> },
      { path: "address",element:<Address/> },
      { path: "tickets",element:<Tickets/>},
      { path: "contactSupport" ,element:<CustomerSupport/> },
      { path: "reportCenter",element:<ReportsCenter/> },
      { path:"disputeCenter",element:<DisputeCenter/> },
      { path: "saved-item",element: <SavedIteams/> },
      { path:"exhibitions/:id/book",element:<BookTicket/> },
      { path:"ticket-success" , element:<TicketSuccess/> }
    ]
  },

  {
    path: "/artist",
    element: 
          <ProtectedRoute role="ROLE_ARTIST">
            <ArtistLayout />
          </ProtectedRoute>,
    children: [
      { path: "dashboard", element: <ArtistDashboard /> },
      { path : "analytics", element: <Analytics/>},
      { path : "orders",element: <Orders/>},
      { path : "support" ,element: <Support/>},
      { path : "upload-artwork",element: <UploadArtwork/>}
    ]
  },
  {
    path: "/curator",
    element:
      <ProtectedRoute role="ROLE_CURATOR">
        <CuratorLayout/>
      </ProtectedRoute>,
    children: [
      { path: "dashboard", element: <CuratorDashboard /> },
      { path : "dashboard/exhibitions",element: <ExhibitionManagement/> },
      { path : "dashboard/curation-studio",element: <CurationStudio/> },
      { path : "dashboard/artwork-selection",element: <ArtworkSelection/> },
      { path : "dashboard/featured-artists",element: <FeaturedArtists/> },
      { path : "dashboard/analytics",element: <VisitorAnalytics/> }
    ]
  },
  {
    path: "/admin",
    element :
       <ProtectedRoute role="ROLE_ADMIN">
        <AdminLayout/>
      </ProtectedRoute>,
    children: [
      { path:  "dashboard", element: <AdminDashboard /> },
      { path : "dashboard/application-approval",element:<ApplicationsApproval/> },
      { path:  "dashboard/gallary-manager" , element:<GalleryManager/> },
      { path : "dashboard/artwork-moderation",element:<ArtworkModeration/>},
      { path:  "dashboard/tickets" ,element:<TicketsManagement/>},
      { path : "dashboard/disputes" , element: <Disputes/> },
      { path : "dashboard/analytics" ,element:<AdminAnalytics/>},
      { path : "dashboard/reports",element:<Reports/>},
      { path : "dashboard/user-management",element:<UserManagement/>}
    ]
  }
]);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-8 border-cyan-400"></div>
      </div>
    );
  }
  return <RouterProvider router={router} /> ;
}

export default App;