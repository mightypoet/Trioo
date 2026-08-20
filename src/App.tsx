/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LocationProvider } from './contexts/LocationContext';
import GlobalAuthModal from './components/layout/GlobalAuthModal';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import PackageDetails from './pages/PackageDetails';
import BookingFlow from './pages/BookingFlow';
import Wallet from './pages/Wallet';
import CreatorRewards from './pages/CreatorRewards';
import UserProfile from './pages/UserProfile';
import GoSolo from './pages/GoSolo';
import Tripboards from './pages/Tripboards';
import TripboardDetail from './pages/TripboardDetail';
import CreateTripboard from './pages/CreateTripboard';

import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateTrip from './pages/admin/CreateTrip';
import Agencies from './pages/admin/Agencies';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
import AgencyDashboard from './pages/AgencyDashboard';

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
      <BrowserRouter>
        <GlobalAuthModal />
        <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
                    <Route path="tripboards" element={<Tripboards />} />
          <Route path="tripboards/:id" element={<TripboardDetail />} />
          <Route path="create-tripboard" element={<CreateTripboard />} />
          <Route path="package/:id" element={<PackageDetails />} />
          <Route path="book/:id" element={<BookingFlow />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="go-solo" element={<GoSolo />} />
          <Route path="creators" element={<CreatorRewards />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="agency-dashboard" element={<AgencyDashboard />} />
        </Route>
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="agencies" element={<Agencies />} />
          <Route path="trips" element={<div><h2 className="text-2xl font-bold mb-4">Trips Management</h2><CreateTrip /></div>} />
          <Route path="settings" element={<div>Settings</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </LocationProvider>
    </AuthProvider>
  );
}
