import { createBrowserRouter } from "react-router";
import { SettingsView } from "./views/SettingsView";
import { AppLayout } from "./layout/AppLayout";
import { EventsView } from "./views/EventsView/EventsView";

const routes = [
  {
    path: "/",
    element: (
      <EventsView />
    ),
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
  }
]);
