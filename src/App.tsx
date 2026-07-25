/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import GlobalAuthModal from './components/layout/GlobalAuthModal';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import PackageDetails from './pages/PackageDetails';
import BookingFlow from './pages/BookingFlow';
import Wallet from './pages/Wallet';
import CreatorRewards from './pages/CreatorRewards';

import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateTrip from './pages/admin/CreateTrip';
import Agencies from './pages/admin/Agencies';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <GlobalAuthModal />
        <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="package/:id" element={<PackageDetails />} />
          <Route path="book/:id" element={<BookingFlow />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="creators" element={<CreatorRewards />} />
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
    </AuthProvider>
  );
}
