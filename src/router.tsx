import { createBrowserRouter } from "react-router";
import { SettingsView } from "./views/SettingsView/SettingsView";
import { AppLayout } from "./layout/AppLayout";
import { EventListView } from "./views/EventListView/EventListView";
import { EventView } from "./views/EventView/EventView";

const routes = [
  {
    path: "/",
    element: <EventListView />,
  },
  {
    path: "/events/:eventId",
    element: <EventView />,
  },
  {
    path: "/settings",
    element: <SettingsView />,
  },
];

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: routes,
  },
]);
