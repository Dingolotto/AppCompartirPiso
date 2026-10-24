import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import CreateListing from '@/pages/CreateListing';
import SearchListings from '@/pages/SearchListings';
import ListingDetail from '@/pages/ListingDetail';
import MyListings from '@/pages/MyListings';
import ContactRequests from '@/pages/ContactRequests';
import MyRadar from '@/pages/MyRadar';
import Admin from '@/pages/Admin';

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route element={<AppLayout />}>
              {/* Navegable sin cuenta */}
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchListings />} />
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Requiere sesión iniciada */}
              <Route path="/create" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
              <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
              <Route path="/contacts" element={<ProtectedRoute><ContactRequests /></ProtectedRoute>} />
              <Route path="/radar" element={<ProtectedRoute><MyRadar /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
