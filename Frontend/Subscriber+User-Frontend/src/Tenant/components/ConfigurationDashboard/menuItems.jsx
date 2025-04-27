import {
  Home,
  BarChart3,
  CreditCard,
  Users,
  Calendar,
  MessageCircle,
  Clock,
  FileText,
  Star,
  Bell,
  SettingsIcon
} from "lucide-react";

export const MAIN_MENU_ITEMS = [
  { id: "dashboard", icon: Home, label: "Tableau de bord" },
  { id: "analytics", icon: BarChart3, label: "Analytique", enterprise: true },
  { id: "invoice", icon: CreditCard, label: "Factures", notification: 2 },
  { id: "hr", icon: Users, label: "Équipe" },
  { id: "calendar", icon: Calendar, label: "Calendrier" },
  { id: "Backup", icon: MessageCircle, label: "Backup", notification: 5 },
  { id: "break", icon: Clock, label: "Pauses" },
  { id: "information", icon: FileText, label: "Informations" },
  { id: "workinghours", icon: Clock, label: "Heures de travail" },
  { id: "services", icon: Star, label: "Services" },
];

export const SECONDARY_MENU_ITEMS = [
  { id: "notifications", icon: Bell, label: "Notifications" },
  { id: "settings", icon: SettingsIcon, label: "Paramètres" },
];

export const PAGE_TITLES = {
  dashboard: "Tableau de bord",
  analytics: "Analytique",
  invoice: "Factures",
  hr: "Équipe",
  calendar: "Calendrier",
  Backup: "Messages",
  notifications: "Notifications",
  settings: "Paramètres",
  break: "Pauses",
  information: "Informations",
  workinghours: "Heures de travail",
  services: "Services"
};