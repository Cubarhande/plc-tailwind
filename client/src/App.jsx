import { Routes, Route } from "react-router-dom";

// Public Components
import Navbar from "./components/public/Navbar";
import Footer from "./components/public/Footer";

// Admin Components
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";

// Public Pages
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import WhatWeDo from "./pages/public/WhatWeDo";
import Causes from "./pages/public/Causes";
import Events from "./pages/public/Events";
import Contact from "./pages/public/Contact";

// Admin Pages
import Login from "./pages/admin/Login";
import Register from "./pages/admin/Register";
import Dashboard from "./pages/admin/Dashboard";
import Hero from "./pages/admin/Hero";
import AboutAdmin from "./pages/admin/AboutAdmin";
import AboutCategories from "./pages/admin/AboutCategories";
import AboutCards from "./pages/admin/AboutCards";
import Categories from "./pages/admin/Categories";
import Cards from "./pages/admin/Cards";
import CausesAdmin from "./pages/admin/CausesAdmin";
import PartnersAdmin from "./pages/admin/PartnersAdmin";
import Profile from "./pages/admin/Profile";

// Events - Independent
import EventsAdmin from "./pages/admin/EventsAdmin";
import EventCardsAdmin from "./pages/admin/EventCardsAdmin";

import ContactsAdmin from "./pages/admin/ContactsAdmin";
import SettingsAdmin from "./pages/admin/SettingsAdmin";

// =========================
// PUBLIC LAYOUT
// =========================

const PublicLayout = ({ children }) => {
  return (
    <>
      <Navbar />

      <main>{children}</main>

      <Footer />
    </>
  );
};

// =========================
// APP ROUTES
// =========================

const App = () => {
  return (
    <Routes>
      {/* =========================
          PUBLIC WEBSITE
      ========================= */}

      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />

      <Route
        path="/about"
        element={
          <PublicLayout>
            <About />
          </PublicLayout>
        }
      />

      <Route
        path="/what-we-do"
        element={
          <PublicLayout>
            <WhatWeDo />
          </PublicLayout>
        }
      />

      <Route
        path="/causes"
        element={
          <PublicLayout>
            <Causes />
          </PublicLayout>
        }
      />

      {/* Public Events */}
      <Route
        path="/events"
        element={
          <PublicLayout>
            <Events />
          </PublicLayout>
        }
      />

      <Route
        path="/contact"
        element={
          <PublicLayout>
            <Contact />
          </PublicLayout>
        }
      />

      {/* =========================
          ADMIN AUTH
      ========================= */}

      <Route path="/admin/login" element={<Login />} />

      <Route path="/admin/register" element={<Register />} />

      {/* =========================
          PROTECTED ADMIN
      ========================= */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<Dashboard />} />

        {/* Hero */}
        <Route path="hero" element={<Hero />} />

        {/* =========================
            ABOUT
        ========================= */}

        <Route path="about" element={<AboutAdmin />} />

        <Route path="about/categories" element={<AboutCategories />} />

        <Route path="about/cards" element={<AboutCards />} />

        {/* =========================
            WHAT WE DO
        ========================= */}

        <Route path="categories" element={<Categories />} />

        <Route path="cards" element={<Cards />} />

        {/* =========================
            CAUSES
        ========================= */}

        <Route path="causes" element={<CausesAdmin />} />

        {/* =========================
            PARTNERS
        ========================= */}

        <Route path="partners" element={<PartnersAdmin />} />

        {/* =========================
            EVENTS
            COMPLETELY INDEPENDENT
        ========================= */}

        <Route path="events" element={<EventsAdmin />} />

        <Route path="event-cards" element={<EventCardsAdmin />} />

        {/* =========================
            CONTACTS
        ========================= */}

        <Route path="contacts" element={<ContactsAdmin />} />

        {/* =========================
            SETTINGS
        ========================= */}

        <Route path="settings" element={<SettingsAdmin />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default App;
