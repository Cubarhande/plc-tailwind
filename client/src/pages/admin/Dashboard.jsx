import { useEffect, useState } from "react";
import {
  Image,
  FileText,
  Layers,
  CreditCard,
  Heart,
  Handshake,
  CalendarDays,
  MessageSquare,
} from "lucide-react";

import API from "../../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    hero: 0,
    aboutCategories: 0,
    aboutCards: 0,
    categories: 0,
    cards: 0,
    causes: 0,
    partners: 0,
    events: 0,
    messages: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [
          heroRes,
          aboutCategoriesRes,
          aboutCardsRes,
          categoriesRes,
          cardsRes,
          causesRes,
          partnersRes,
          eventsRes,
          contactsRes,
        ] = await Promise.all([
          API.get("/hero"),
          API.get("/about-categories"),
          API.get("/about-cards"),
          API.get("/categories"),
          API.get("/cards"),
          API.get("/causes"),
          API.get("/partners"),
          API.get("/events"),
          API.get("/contacts"),
        ]);

        setStats({
          hero: heroRes.data?.data ? 1 : 0,

          aboutCategories:
            aboutCategoriesRes.data?.data?.length || 0,

          aboutCards:
            aboutCardsRes.data?.data?.length || 0,

          categories:
            categoriesRes.data?.data?.length || 0,

          cards:
            cardsRes.data?.data?.length || 0,

          causes:
            causesRes.data?.data?.length || 0,

          partners:
            partnersRes.data?.data?.length || 0,

          events:
            eventsRes.data?.data?.length || 0,

          messages:
            contactsRes.data?.data?.length || 0,
        });
      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statsCards = [
    {
      title: "Hero",
      value: stats.hero,
      icon: Image,
    },
    {
      title: "About Categories",
      value: stats.aboutCategories,
      icon: Layers,
    },
    {
      title: "About Cards",
      value: stats.aboutCards,
      icon: CreditCard,
    },
    {
      title: "What We Do Categories",
      value: stats.categories,
      icon: FileText,
    },
    {
      title: "What We Do Cards",
      value: stats.cards,
      icon: CreditCard,
    },
    {
      title: "Causes",
      value: stats.causes,
      icon: Heart,
    },
    {
      title: "Partners",
      value: stats.partners,
      icon: Handshake,
    },
    {
      title: "Events",
      value: stats.events,
      icon: CalendarDays,
    },
    {
      title: "Contact Messages",
      value: stats.messages,
      icon: MessageSquare,
    },
  ];

  return (
    <div>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your PLC website content.
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-xl bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {item.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {loading ? "..." : item.value}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-100 p-3 text-slate-700">
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

     
    </div>
  );
};

export default Dashboard;