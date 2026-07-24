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
import CreateTrip from './pages/admin/CreateTrip';

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
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100"><h2 className="text-xl font-bold">Dashboard Overview</h2><p className="text-gray-500 mt-2">Welcome to the Trioo Admin Dashboard.</p></div>} />
          <Route path="agencies" element={<div>Agencies List</div>} />
          <Route path="trips" element={<div><h2 className="text-2xl font-bold mb-4">Trips Management</h2><CreateTrip /></div>} />
          <Route path="settings" element={<div>Settings</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}
