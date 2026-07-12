import {
  Archive,
  BarChart3,
  Bell,
  BookOpen,
  ChevronDown,
  Copy,
  Download,
  Edit3,
  Filter,
  Globe2,
  Home,
  Image,
  LayoutDashboard,
  Link,
  Loader2,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  Moon,
  Search,
  Settings,
  Shield,
  Smartphone,
  Star,
  Sun,
  Users,
  X,
} from "lucide-react";
import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Firestore,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import type { DragEvent, FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type AdminPage = "dashboard" | "analytics" | "enquiries" | "content" | "settings";
type AnalyticsTab = "overview" | "traffic" | "geographic" | "pages" | "conversions" | "devices";
type ContentTab = "hero" | "services" | "portfolio" | "testimonials" | "faqs" | "contact" | "seo";
type SettingsTab = "website" | "social" | "privacy" | "campaignBuilder" | "backup" | "admins";
type DateRangePreset = "today" | "7d" | "30d" | "custom";
type DateRange = { preset: DateRangePreset; startDate: string; endDate: string };

type Enquiry = {
  id: string;
  name?: string;
  company?: string;
  service?: string;
  source?: string;
  score?: string;
  scoreValue?: number;
  status?: string;
  assignedTo?: string;
  createdAt?: unknown;
  followUpAt?: unknown;
  email?: string;
  phone?: string;
  notes?: string;
};

type ActivityItem = {
  id: string;
  action?: string;
  actor?: string;
  target?: string;
  enquiryId?: string;
  page?: AdminPage;
  createdAt?: unknown;
};

type ConversionItem = {
  id: string;
  type?: string;
  source?: string;
  createdAt?: unknown;
};

type Campaign = {
  id: string;
  name?: string;
  url?: string;
  createdAt?: unknown;
};

type AdminNotification = {
  id: string;
  title?: string;
  message?: string;
  read?: boolean;
  enquiryId?: string;
  page?: AdminPage;
  createdAt?: unknown;
};

type NoteItem = {
  id: string;
  note?: string;
  createdAt?: unknown;
};

type AdminData = {
  enquiries: Enquiry[];
  activities: ActivityItem[];
  conversions: ConversionItem[];
  campaigns: Campaign[];
};

type FirebaseServices = {
  app: FirebaseApp;
  auth: ReturnType<typeof getAuth>;
  db: Firestore;
};

type FirebaseWebConfig = {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
};

type GaReport = {
  connected: boolean;
  rows: string[][];
  metrics: Record<string, string>;
  message?: string;
};

const envFirebaseConfig: FirebaseWebConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined,
};

const gaReportEndpoint = import.meta.env.VITE_GA4_REPORT_ENDPOINT as string | undefined;
const adminUsersEndpoint = import.meta.env.VITE_ADMIN_USERS_ENDPOINT as string | undefined;
const firebaseConfigStorageKey = "webtrivo-firebase-config";

let servicesCache: FirebaseServices | null = null;

const navItems: Array<{ page: AdminPage; label: string; icon: typeof Home }> = [
  { page: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { page: "analytics", label: "Analytics", icon: BarChart3 },
  { page: "enquiries", label: "Enquiries", icon: Mail },
  { page: "content", label: "Content", icon: Edit3 },
  { page: "settings", label: "Settings", icon: Settings },
];

const analyticsTabs: Array<{ id: AnalyticsTab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "traffic", label: "Traffic" },
  { id: "geographic", label: "Geographic" },
  { id: "pages", label: "Pages" },
  { id: "conversions", label: "Conversions" },
  { id: "devices", label: "Devices" },
];

const contentTabs: Array<{ id: ContentTab; label: string; icon: typeof Home }> = [
  { id: "hero", label: "Hero", icon: Image },
  { id: "services", label: "Services", icon: Settings },
  { id: "portfolio", label: "Portfolio", icon: BookOpen },
  { id: "testimonials", label: "Testimonials", icon: Star },
  { id: "faqs", label: "FAQs", icon: MessageCircle },
  { id: "contact", label: "Contact Info", icon: Mail },
  { id: "seo", label: "SEO Settings", icon: Globe2 },
];

const settingsTabs: Array<{ id: SettingsTab; label: string }> = [
  { id: "website", label: "Website" },
  { id: "social", label: "Social Media" },
  { id: "privacy", label: "Cookie/Privacy" },
  { id: "campaignBuilder", label: "Campaign URL Builder" },
  { id: "backup", label: "Backup & Export" },
  { id: "admins", label: "Admin Users" },
];

function getFirebaseServices() {
  const firebaseConfig = resolveFirebaseConfig();
  if (!isFirebaseConfigReady(firebaseConfig)) return null;
  if (!servicesCache) {
    const app = initializeApp(firebaseConfig);
    servicesCache = { app, auth: getAuth(app), db: getFirestore(app) };
  }
  return servicesCache;
}

function isFirebaseConfigReady(config: FirebaseWebConfig) {
  return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
}

function readStoredFirebaseConfig() {
  try {
    return JSON.parse(localStorage.getItem(firebaseConfigStorageKey) || "{}") as FirebaseWebConfig;
  } catch {
    return {};
  }
}

function resolveFirebaseConfig() {
  const storedConfig = readStoredFirebaseConfig();
  return {
    apiKey: envFirebaseConfig.apiKey || storedConfig.apiKey,
    authDomain: envFirebaseConfig.authDomain || storedConfig.authDomain,
    projectId: envFirebaseConfig.projectId || storedConfig.projectId,
    storageBucket: envFirebaseConfig.storageBucket || storedConfig.storageBucket,
    messagingSenderId: envFirebaseConfig.messagingSenderId || storedConfig.messagingSenderId,
    appId: envFirebaseConfig.appId || storedConfig.appId,
    measurementId: envFirebaseConfig.measurementId || storedConfig.measurementId,
  };
}

function defaultDateRange(): DateRange {
  return { preset: "7d", startDate: "", endDate: "" };
}

function dateBoundsFromRange(range: DateRange) {
  const date = new Date();
  if (range.preset === "custom" && range.startDate) {
    const start = new Date(`${range.startDate}T00:00:00`);
    const end = range.endDate ? new Date(`${range.endDate}T23:59:59`) : undefined;
    return { start, end };
  }
  if (range.preset === "today") date.setHours(0, 0, 0, 0);
  if (range.preset === "7d") date.setDate(date.getDate() - 7);
  if (range.preset === "30d") date.setDate(date.getDate() - 30);
  return { start: date, end: undefined };
}

function snapshotId<T>(snapshot: QueryDocumentSnapshot): T & { id: string } {
  return { id: snapshot.id, ...snapshot.data() } as T & { id: string };
}

function formatDate(value: unknown) {
  if (!value) return "-";
  if (typeof value === "object" && value !== null && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate().toLocaleDateString();
  }
  if (typeof value === "string" || typeof value === "number") return new Date(value).toLocaleDateString();
  return "-";
}

function formatInputDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function searchable(value: unknown) {
  return String(value ?? "").toLowerCase();
}

function countByType(items: ConversionItem[], type: string) {
  return items.filter((item) => item.type === type).length;
}

function buildCsv(enquiries: Enquiry[]) {
  const headers = ["id", "name", "company", "service", "source", "status", "email", "phone", "createdAt"];
  const rows = enquiries.map((enquiry) =>
    headers
      .map((header) => {
        const value = header === "createdAt" ? formatDate(enquiry.createdAt) : String(enquiry[header as keyof Enquiry] ?? "");
        return `"${value.replace(/"/g, '""')}"`;
      })
      .join(","),
  );
  return [headers.join(","), ...rows].join("\n");
}

export default function AdminDashboard() {
  const [configVersion, setConfigVersion] = useState(0);
  const services = useMemo(getFirebaseServices, [configVersion]);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(Boolean(services));
  const [page, setPage] = useState<AdminPage>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => (localStorage.getItem("webtrivo-admin-theme") === "dark" ? "dark" : "light"));
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<Enquiry | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.warn("[admin] Mock data is disabled. Configure Firebase/GA4 env vars to show live data.");
    }
    if (!services) return;
    return onAuthStateChanged(services.auth, (nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);
    });
  }, [services]);

  useEffect(() => {
    localStorage.setItem("webtrivo-admin-theme", theme);
  }, [theme]);

  if (!services) return <AdminSetupNotice onSaved={() => setConfigVersion((value) => value + 1)} />;
  if (authLoading) return <AdminLoading />;
  if (!user) return <AdminLogin services={services} />;

  const currentLabel = navItems.find((item) => item.page === page)?.label || "Dashboard";
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useNotifications(services, user);

  return (
    <div className={`admin-shell ${theme === "dark" ? "admin-dark" : ""}`}>
      <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""} ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-brand">
          <span>W</span>
          {!collapsed && <strong>Webtrivo Admin</strong>}
          <button type="button" onClick={() => setCollapsed((value) => !value)} aria-label="Collapse sidebar">
            <ChevronDown size={16} />
          </button>
        </div>
        <nav aria-label="Admin navigation">
          {navItems.map((item) => (
            <button
              className={page === item.page ? "active" : ""}
              type="button"
              key={item.page}
              onClick={() => {
                setPage(item.page);
                setSidebarOpen(false);
              }}
            >
              <item.icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu" type="button" onClick={() => setSidebarOpen(true)} aria-label="Open admin menu">
            <Menu size={20} />
          </button>
          <div>
            <span>Webtrivo Admin</span>
            <strong>{currentLabel}</strong>
          </div>
          <label className="admin-search">
            <Search size={17} />
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search enquiries or content..." />
          </label>
          <div className="admin-notification-wrap">
            <button className="admin-icon-button" type="button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((value) => !value)}>
              <Bell size={18} />
              {unreadCount > 0 && <b>{unreadCount}</b>}
            </button>
            {notificationsOpen && (
              <NotificationsPanel
                notifications={notifications}
                onClose={() => setNotificationsOpen(false)}
                onMarkAll={markAllNotificationsRead}
                onOpen={async (notification) => {
                  await markNotificationRead(notification.id);
                  setNotificationsOpen(false);
                  if (notification.enquiryId) {
                    setPage("enquiries");
                    setSelectedLead({ id: notification.enquiryId });
                  } else if (notification.page) {
                    setPage(notification.page);
                  }
                }}
              />
            )}
          </div>
          <button className="admin-icon-button" type="button" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <div className="admin-user">
            <span>{(user.displayName || user.email || "A").slice(0, 1).toUpperCase()}</span>
            <div>
              <strong>{user.displayName || "Admin"}</strong>
              <small>{user.email}</small>
            </div>
          </div>
          <button className="admin-icon-button" type="button" onClick={() => signOut(services.auth)} aria-label="Log out">
            <LogOut size={18} />
          </button>
        </header>

        <main className="admin-page">
          <AdminWorkspace page={page} services={services} searchTerm={searchTerm} onPageChange={setPage} onSelectLead={setSelectedLead} />
        </main>
      </div>

      {sidebarOpen && <button className="admin-scrim" type="button" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}
      {selectedLead && <LeadDrawer services={services} lead={selectedLead} onClose={() => setSelectedLead(null)} />}
    </div>
  );
}

function AdminWorkspace({
  page,
  services,
  searchTerm,
  onPageChange,
  onSelectLead,
}: {
  page: AdminPage;
  services: FirebaseServices;
  searchTerm: string;
  onPageChange: (page: AdminPage) => void;
  onSelectLead: (lead: Enquiry) => void;
}) {
  const [range, setRange] = useState<DateRange>(() => defaultDateRange());
  const { data, loading, error, reload } = useAdminData(services, range);

  if (page === "dashboard") return <DashboardHome data={data} range={range} onRangeChange={setRange} loading={loading} error={error} onSelectLead={(lead) => {
    onPageChange("enquiries");
    onSelectLead(lead);
  }} onActivityOpen={(activity) => activity.page && onPageChange(activity.page)} onExport={() => exportCsv(data.enquiries)} />;
  if (page === "analytics") return <AnalyticsWorkspace data={data} range={range} onRangeChange={setRange} />;
  if (page === "enquiries") return <EnquiriesCRM services={services} enquiries={data.enquiries} searchTerm={searchTerm} loading={loading} error={error} onSelectLead={onSelectLead} onReload={reload} onExport={() => exportCsv(data.enquiries)} />;
  if (page === "content") return <ContentWorkspace services={services} />;
  return <SettingsWorkspace services={services} campaigns={data.campaigns} onReload={reload} />;
}

function useAdminData(services: FirebaseServices, range: DateRange) {
  const [data, setData] = useState<AdminData>({ enquiries: [], activities: [], conversions: [], campaigns: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    const { start, end } = dateBoundsFromRange(range);

    async function load() {
      setLoading(true);
      setError(null);
      if (import.meta.env.DEV) {
        console.info("[admin] Firestore date range", { preset: range.preset, start, end });
      }
      try {
        const dateConstraints = end ? [where("createdAt", ">=", start), where("createdAt", "<=", end)] : [where("createdAt", ">=", start)];
        const [enquirySnapshots, activitySnapshots, conversionSnapshots, campaignSnapshots] = await Promise.all([
          getDocs(query(collection(services.db, "enquiries"), ...dateConstraints, orderBy("createdAt", "desc"), limit(100))),
          getDocs(query(collection(services.db, "activity"), ...dateConstraints, orderBy("createdAt", "desc"), limit(20))),
          getDocs(query(collection(services.db, "conversions"), ...dateConstraints, orderBy("createdAt", "desc"), limit(500))),
          getDocs(query(collection(services.db, "campaigns"), orderBy("createdAt", "desc"), limit(50))),
        ]);

        if (!ignore) {
          setData({
            enquiries: enquirySnapshots.docs.map((item) => snapshotId<Enquiry>(item)),
            activities: activitySnapshots.docs.map((item) => snapshotId<ActivityItem>(item)),
            conversions: conversionSnapshots.docs.map((item) => snapshotId<ConversionItem>(item)),
            campaigns: campaignSnapshots.docs.map((item) => snapshotId<Campaign>(item)),
          });
        }
      } catch (currentError) {
        if (!ignore) {
          setError(currentError instanceof Error ? currentError.message : "Unable to load Firestore admin data.");
          setData({ enquiries: [], activities: [], conversions: [], campaigns: [] });
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [services, range, reloadKey]);

  return { data, loading, error, reload: () => setReloadKey((value) => value + 1) };
}

function exportCsv(enquiries: Enquiry[]) {
  if (!enquiries.length) return;
  const blob = new Blob([buildCsv(enquiries)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "webtrivo-enquiries.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function exportJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function useNotifications(services: FirebaseServices, user: User | null) {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  useEffect(() => {
    if (!user) return;
    let ignore = false;
    async function load() {
      const snapshots = await getDocs(query(collection(services.db, "notifications"), orderBy("createdAt", "desc"), limit(20)));
      if (!ignore) setNotifications(snapshots.docs.map((item) => snapshotId<AdminNotification>(item)));
    }
    load().catch((error) => {
      if (import.meta.env.DEV) console.warn("[admin] Unable to load notifications", error);
    });
    return () => {
      ignore = true;
    };
  }, [services, user]);

  async function markNotificationRead(id: string) {
    await updateDoc(doc(services.db, "notifications", id), { read: true, readAt: serverTimestamp() });
    setNotifications((current) => current.map((item) => (item.id === id ? { ...item, read: true } : item)));
  }

  async function markAllNotificationsRead() {
    await Promise.all(notifications.filter((item) => !item.read).map((item) => updateDoc(doc(services.db, "notifications", item.id), { read: true, readAt: serverTimestamp() })));
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  }

  return {
    notifications,
    unreadCount: notifications.filter((item) => !item.read).length,
    markNotificationRead,
    markAllNotificationsRead,
  };
}

function NotificationsPanel({
  notifications,
  onClose,
  onMarkAll,
  onOpen,
}: {
  notifications: AdminNotification[];
  onClose: () => void;
  onMarkAll: () => void;
  onOpen: (notification: AdminNotification) => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) onClose();
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="admin-notification-panel" ref={panelRef}>
      <header>
        <strong>Notifications</strong>
        <button type="button" onClick={onMarkAll} disabled={!notifications.some((item) => !item.read)}>
          Mark all read
        </button>
      </header>
      {notifications.length ? (
        <div className="notification-list">
          {notifications.map((notification) => (
            <button className={notification.read ? "" : "unread"} type="button" key={notification.id} onClick={() => onOpen(notification)}>
              <strong>{notification.title || "Notification"}</strong>
              <span>{notification.message || formatDate(notification.createdAt)}</span>
            </button>
          ))}
        </div>
      ) : (
        <EmptyState title="No notifications" message="Unread badges only appear when Firestore notification documents exist." compact />
      )}
    </div>
  );
}

function PageHeader({ title, description, action, onAction }: { title: string; description: string; action?: string; onAction?: () => void }) {
  return (
    <div className="admin-page-header">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action && (
        <button className="admin-primary" type="button" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
}

function DashboardHome({
  data,
  range,
  onRangeChange,
  loading,
  error,
  onSelectLead,
  onActivityOpen,
  onExport,
}: {
  data: AdminData;
  range: DateRange;
  onRangeChange: (range: DateRange) => void;
  loading: boolean;
  error: string | null;
  onSelectLead: (lead: Enquiry) => void;
  onActivityOpen: (activity: ActivityItem) => void;
  onExport: () => void;
}) {
  return (
    <>
      <PageHeader title="Dashboard" description="Live operational view of connected Firestore data and GA4 setup state." action="Export CSV" onAction={onExport} />
      <IntegrationBanner />
      <DateRangeFilter range={range} onChange={onRangeChange} />
      {error && <Notice tone="error">{error}</Notice>}
      <div className="admin-kpi-grid">
        <KpiCard label="Total Users" source="GA4" value={null} loading={false} />
        <KpiCard label="New Users" source="GA4" value={null} loading={false} />
        <KpiCard label="Sessions" source="GA4" value={null} loading={false} />
        <KpiCard label="Enquiries" source="Firestore" value={data.enquiries.length} loading={loading} />
        <KpiCard label="WhatsApp Clicks" source="Firestore" value={countByType(data.conversions, "whatsapp_click")} loading={loading} />
        <KpiCard label="Email Clicks" source="Firestore" value={countByType(data.conversions, "email_click")} loading={loading} />
      </div>
      <div className="admin-two-column">
        <Panel title="Recent enquiries">
          <RecentEnquiries enquiries={data.enquiries} loading={loading} onSelectLead={onSelectLead} />
        </Panel>
        <Panel title="Recent activity">
          <ActivityFeed items={data.activities} loading={loading} onOpen={onActivityOpen} />
        </Panel>
      </div>
    </>
  );
}

function KpiCard({ label, source, value, loading }: { label: string; source: "GA4" | "Firestore"; value: number | null; loading: boolean }) {
  if (source === "GA4" && !gaReportEndpoint) {
    return (
      <article className="admin-kpi empty">
        <BarChart3 size={20} />
        <strong>-</strong>
        <small>{label}</small>
        <span>GA4 not connected</span>
      </article>
    );
  }

  return (
    <article className="admin-kpi">
      {loading ? <Loader2 className="admin-spin" size={18} /> : <strong>{value ?? 0}</strong>}
      <small>{label}</small>
      <span>{source}</span>
    </article>
  );
}

function IntegrationBanner() {
  return (
    <div className="admin-ga-banner">
      <BarChart3 size={18} />
      <span>{gaReportEndpoint ? "GA4 reporting endpoint configured." : "Google Analytics is not connected yet."}</span>
      {!gaReportEndpoint && (
        <a href="https://developers.google.com/analytics/devguides/reporting/data/v1" target="_blank" rel="noreferrer">
          Connect GA4 through a secure Cloud Function
        </a>
      )}
    </div>
  );
}

function DateRangeFilter({ range, onChange }: { range: DateRange; onChange: (range: DateRange) => void }) {
  const [customStart, setCustomStart] = useState(range.startDate);
  const [customEnd, setCustomEnd] = useState(range.endDate);

  function setPreset(preset: DateRangePreset) {
    if (preset === "custom") {
      const end = formatInputDate(new Date());
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      const start = formatInputDate(startDate);
      setCustomStart(range.startDate || start);
      setCustomEnd(range.endDate || end);
      onChange({ preset, startDate: range.startDate || start, endDate: range.endDate || end });
      return;
    }
    onChange({ preset, startDate: "", endDate: "" });
  }

  return (
    <>
      <div className="admin-filterbar">
        {[
          ["today", "Today"],
          ["7d", "7 days"],
          ["30d", "30 days"],
          ["custom", "Custom"],
        ].map(([value, label]) => (
          <button className={range.preset === value ? "active" : ""} type="button" key={value} onClick={() => setPreset(value as DateRangePreset)}>
            {label}
          </button>
        ))}
      </div>
      {range.preset === "custom" && (
        <div className="admin-custom-range">
          <label>
            Start
            <input type="date" value={customStart} onChange={(event) => setCustomStart(event.target.value)} />
          </label>
          <label>
            End
            <input type="date" value={customEnd} onChange={(event) => setCustomEnd(event.target.value)} />
          </label>
          <button className="admin-primary" type="button" onClick={() => onChange({ preset: "custom", startDate: customStart, endDate: customEnd })}>
            Apply
          </button>
        </div>
      )}
    </>
  );
}

function AnalyticsWorkspace({ data, range, onRangeChange }: { data: AdminData; range: DateRange; onRangeChange: (range: DateRange) => void }) {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("overview");
  const { report, loading } = useGaReport(activeTab, range);

  return (
    <>
      <PageHeader title="Analytics" description="GA4 metrics load only from the configured secure reporting endpoint." action="Export report" />
      <DateRangeFilter range={range} onChange={onRangeChange} />
      <UnderlineTabs tabs={analyticsTabs} active={activeTab} onChange={setActiveTab} />
      {!report.connected && <EmptyState title="GA4 is not connected" message={report.message || "Set VITE_GA4_REPORT_ENDPOINT to a secure Cloud Function that proxies the Google Analytics Data API."} />}
      {report.connected && (
        <>
          <div className="admin-kpi-grid three">
            <KpiCard label="Sessions" source="GA4" value={Number(report.metrics.sessions || 0)} loading={loading} />
            <KpiCard label="Conversions" source="GA4" value={Number(report.metrics.conversions || 0)} loading={loading} />
            <KpiCard label="Active Users" source="GA4" value={Number(report.metrics.activeUsers || 0)} loading={loading} />
          </div>
          <AdminTable columns={["Dimension", "Sessions", "Conversions", "Rate"]} rows={report.rows} emptyTitle="No GA4 rows returned" />
        </>
      )}
      {activeTab === "conversions" && (
        <Panel title="Firestore conversion events">
          <AdminTable columns={["Type", "Source", "Created"]} rows={data.conversions.map((item) => [item.type || "-", item.source || "-", formatDate(item.createdAt)])} emptyTitle="No conversion events found for this range" />
        </Panel>
      )}
    </>
  );
}

function useGaReport(tab: AnalyticsTab, range: DateRange) {
  const [report, setReport] = useState<GaReport>({ connected: Boolean(gaReportEndpoint), rows: [], metrics: {} });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!gaReportEndpoint) {
      setReport({ connected: false, rows: [], metrics: {}, message: "GA4 endpoint is not configured." });
      return;
    }

    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ tab, range: range.preset });
        if (range.preset === "custom") {
          params.set("startDate", range.startDate);
          params.set("endDate", range.endDate);
        }
        const response = await fetch(`${gaReportEndpoint}?${params.toString()}`);
        if (!response.ok) throw new Error(`GA4 endpoint returned ${response.status}`);
        const body = (await response.json()) as GaReport;
        if (!ignore) setReport({ connected: true, rows: body.rows || [], metrics: body.metrics || {} });
      } catch (error) {
        if (!ignore) setReport({ connected: false, rows: [], metrics: {}, message: error instanceof Error ? error.message : "Unable to load GA4 data." });
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [tab, range]);

  return { report, loading };
}

function EnquiriesCRM({
  services,
  enquiries,
  searchTerm,
  loading,
  error,
  onSelectLead,
  onReload,
  onExport,
}: {
  services: FirebaseServices;
  enquiries: Enquiry[];
  searchTerm: string;
  loading: boolean;
  error: string | null;
  onSelectLead: (lead: Enquiry) => void;
  onReload: () => void;
  onExport: () => void;
}) {
  const [view, setView] = useState<"table" | "kanban">("table");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const sources = Array.from(new Set(enquiries.map((lead) => lead.source).filter(Boolean))) as string[];
  const filteredEnquiries = enquiries.filter((lead) => {
    const matchesStatus = !statusFilter || (lead.status || "New") === statusFilter;
    const matchesSource = !sourceFilter || lead.source === sourceFilter;
    const needle = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !needle ||
      [lead.id, lead.name, lead.company, lead.service, lead.source, lead.email, lead.phone].some((value) => searchable(value).includes(needle));
    return matchesStatus && matchesSource && matchesSearch;
  });

  return (
    <>
      <PageHeader title="Enquiries" description="Live Firestore enquiries with status updates persisted back to the database." action="Bulk export" onAction={onExport} />
      <div className="admin-filterbar">
        <label>
          <Filter size={15} /> Status
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All statuses</option>
            {["New", "Contacted", "Qualified", "Proposal Sent", "Negotiation", "Won", "Lost"].map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
        <label>
          Source
          <select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)}>
            <option value="">All sources</option>
            {sources.map((source) => (
              <option key={source}>{source}</option>
            ))}
          </select>
        </label>
        <button className="ghost" onClick={() => {
          setStatusFilter("");
          setSourceFilter("");
        }}>
          Clear all
        </button>
        <button className="active" onClick={() => setView(view === "table" ? "kanban" : "table")}>
          {view === "table" ? "Kanban view" : "Table view"}
        </button>
      </div>
      {error && <Notice tone="error">{error}</Notice>}
      {view === "table" ? (
        <LeadTable services={services} enquiries={filteredEnquiries} loading={loading} onSelectLead={onSelectLead} onReload={onReload} />
      ) : (
        <Kanban services={services} enquiries={filteredEnquiries} onReload={onReload} />
      )}
    </>
  );
}

function LeadTable({ services, enquiries, loading, onSelectLead, onReload }: { services: FirebaseServices; enquiries: Enquiry[]; loading: boolean; onSelectLead: (lead: Enquiry) => void; onReload: () => void }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (loading) return <LoadingPanel label="Loading Firestore enquiries..." />;
  if (!enquiries.length) return <EmptyState title="No enquiries yet" message="When the public contact form writes to the Firestore enquiries collection, rows will appear here." />;

  async function updateStatus(lead: Enquiry, status: string) {
    await updateDoc(doc(services.db, "enquiries", lead.id), { status, updatedAt: serverTimestamp() });
    onReload();
  }

  async function bulkStatus(status: string) {
    await Promise.all(selectedIds.map((id) => updateDoc(doc(services.db, "enquiries", id), { status, updatedAt: serverTimestamp() })));
    setSelectedIds([]);
    onReload();
  }

  const selectedEnquiries = enquiries.filter((lead) => selectedIds.includes(lead.id));

  return (
    <>
      {selectedIds.length > 0 && (
        <div className="admin-bulkbar">
          <strong>{selectedIds.length} selected</strong>
          <select onChange={(event) => event.target.value && bulkStatus(event.target.value)} defaultValue="">
            <option value="">Change status</option>
            {["New", "Contacted", "Qualified", "Proposal Sent", "Negotiation", "Won", "Lost"].map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <button type="button" onClick={() => exportCsv(selectedEnquiries)}>
            Export selected
          </button>
          <button type="button" onClick={() => setSelectedIds([])}>
            Clear
          </button>
        </div>
      )}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedIds.length === enquiries.length}
                  onChange={(event) => setSelectedIds(event.target.checked ? enquiries.map((lead) => lead.id) : [])}
                  aria-label="Select all enquiries"
                />
              </th>
              {["Lead ID", "Name", "Company", "Service", "Source", "Status", "Created", "Follow-up", ""].map((head) => (
                <th key={head}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {enquiries.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(lead.id)}
                    onChange={(event) =>
                      setSelectedIds((current) => (event.target.checked ? [...current, lead.id] : current.filter((id) => id !== lead.id)))
                    }
                    aria-label={`Select ${lead.name || lead.id}`}
                  />
                </td>
                <td>{lead.id}</td>
                <td>{lead.name || "-"}</td>
                <td>{lead.company || "-"}</td>
                <td>{lead.service || "-"}</td>
                <td>{lead.source ? <Badge type={lead.source}>{lead.source}</Badge> : "-"}</td>
                <td>
                  <select defaultValue={lead.status || "New"} onChange={(event) => updateStatus(lead, event.target.value)}>
                    {["New", "Contacted", "Qualified", "Proposal Sent", "Negotiation", "Won", "Lost"].map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td>{formatDate(lead.createdAt)}</td>
                <td>{formatDate(lead.followUpAt)}</td>
                <td>
                  <button className="admin-link-button" onClick={() => onSelectLead(lead)}>
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="admin-pagination">Rows loaded from Firestore: {enquiries.length}</div>
      </div>
    </>
  );
}

function Kanban({ services, enquiries, onReload }: { services: FirebaseServices; enquiries: Enquiry[]; onReload: () => void }) {
  const columns = ["New", "Contacted", "Qualified", "Proposal Sent", "Negotiation", "Won", "Lost"];
  if (!enquiries.length) return <EmptyState title="No enquiries for Kanban" message="Kanban cards are created from real Firestore enquiry documents." />;
  async function dropLead(event: DragEvent<HTMLElement>, status: string) {
    const id = event.dataTransfer.getData("text/plain");
    if (!id) return;
    await updateDoc(doc(services.db, "enquiries", id), { status, updatedAt: serverTimestamp() });
    onReload();
  }
  return (
    <div className="kanban-board">
      {columns.map((column) => (
        <section key={column} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropLead(event, column)}>
          <h3>{column}</h3>
          {enquiries
            .filter((lead) => (lead.status || "New") === column)
            .map((lead) => (
              <article className="kanban-card" key={lead.id} draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", lead.id)}>
                <strong>{lead.name || lead.id}</strong>
                <span>{lead.company || lead.service || "-"}</span>
                {lead.source && <Badge type={lead.source}>{lead.source}</Badge>}
              </article>
            ))}
        </section>
      ))}
    </div>
  );
}

function LeadDrawer({ services, lead, onClose }: { services: FirebaseServices; lead: Enquiry; onClose: () => void }) {
  const [currentLead, setCurrentLead] = useState(lead);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [followUpDate, setFollowUpDate] = useState("");

  useEffect(() => {
    let ignore = false;
    async function load() {
      const leadSnapshot = await getDoc(doc(services.db, "enquiries", lead.id));
      if (!ignore && leadSnapshot.exists()) setCurrentLead({ id: leadSnapshot.id, ...leadSnapshot.data() } as Enquiry);
      const noteSnapshots = await getDocs(query(collection(services.db, "enquiries", lead.id, "notes"), orderBy("createdAt", "desc"), limit(20)));
      if (!ignore) setNotes(noteSnapshots.docs.map((item) => snapshotId<NoteItem>(item)));
    }
    load();
    return () => {
      ignore = true;
    };
  }, [services, lead.id]);

  async function saveNote() {
    if (!note.trim()) return;
    await addDoc(collection(services.db, "enquiries", lead.id, "notes"), { note, createdAt: serverTimestamp() });
    const noteSnapshots = await getDocs(query(collection(services.db, "enquiries", lead.id, "notes"), orderBy("createdAt", "desc"), limit(20)));
    setNotes(noteSnapshots.docs.map((item) => snapshotId<NoteItem>(item)));
    setNote("");
  }

  async function saveFollowUp() {
    if (!followUpDate) return;
    await updateDoc(doc(services.db, "enquiries", lead.id), { followUpAt: new Date(`${followUpDate}T09:00:00`), updatedAt: serverTimestamp() });
    setCurrentLead((current) => ({ ...current, followUpAt: followUpDate }));
  }

  function openWhatsApp() {
    const phone = String(currentLead.phone || "").replace(/\D/g, "");
    if (phone) window.open(`https://wa.me/${phone}`, "_blank", "noopener,noreferrer");
  }

  function sendEmail() {
    if (currentLead.email) window.location.href = `mailto:${currentLead.email}`;
  }

  function copyContact() {
    navigator.clipboard.writeText([currentLead.name, currentLead.email, currentLead.phone].filter(Boolean).join(" | "));
  }

  return (
    <aside className="lead-drawer" role="dialog" aria-label={`${currentLead.name || currentLead.id} lead details`}>
      <header>
        <div>
          <h2>{currentLead.name || "Enquiry"}</h2>
          <p>{currentLead.company || currentLead.service || currentLead.email || currentLead.id}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close lead details">
          <X size={20} />
        </button>
      </header>
      <section>
        <h3>Contact</h3>
        <p>Email: {currentLead.email || "-"}</p>
        <p>Phone: {currentLead.phone || "-"}</p>
      </section>
      <section>
        <h3>Attribution</h3>
        <p>Source: {currentLead.source || "-"}</p>
      </section>
      <section>
        <h3>Follow-up</h3>
        <input type="date" value={followUpDate} onChange={(event) => setFollowUpDate(event.target.value)} />
        <button type="button" onClick={saveFollowUp}>Save follow-up date</button>
      </section>
      <section>
        <h3>Notes</h3>
        <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add a real note to Firestore..." />
        <div className="admin-note-list">
          {notes.length ? notes.map((item) => <article key={item.id}>{item.note || "-"}<span>{formatDate(item.createdAt)}</span></article>) : <p>No notes saved yet.</p>}
        </div>
      </section>
      <div className="drawer-actions">
        <button onClick={saveNote}>Save Note</button>
        <button onClick={openWhatsApp} disabled={!currentLead.phone}>Open WhatsApp</button>
        <button onClick={sendEmail} disabled={!currentLead.email}>Send Email</button>
        <button onClick={copyContact}>Copy contact</button>
      </div>
    </aside>
  );
}

function ContentWorkspace({ services }: { services: FirebaseServices }) {
  const [activeTab, setActiveTab] = useState<ContentTab>("hero");
  return (
    <>
      <PageHeader title="Content" description="Content reads and saves to Firestore; blank fields mean no published document exists yet." />
      <div className="admin-content-workspace">
        <aside className="admin-secondary-nav" aria-label="Content sections">
          {contentTabs.map((tab) => (
            <button className={activeTab === tab.id ? "active" : ""} type="button" key={tab.id} onClick={() => setActiveTab(tab.id)}>
              <tab.icon size={17} />
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>
        <div className="admin-secondary-panel">
          {activeTab === "seo" ? <SeoSettings services={services} /> : <ContentEditor services={services} tab={activeTab} />}
        </div>
      </div>
    </>
  );
}

function ContentEditor({ services, tab }: { services: FirebaseServices; tab: ContentTab }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let ignore = false;
    getDoc(doc(services.db, "content", tab)).then((snapshot) => {
      if (!ignore && snapshot.exists()) {
        const data = snapshot.data();
        setTitle(String(data.title || ""));
        setDescription(String(data.description || ""));
      }
    });
    return () => {
      ignore = true;
    };
  }, [services, tab]);

  async function save() {
    setSaving(true);
    await setDoc(doc(services.db, "content", tab), { title, description, updatedAt: serverTimestamp() }, { merge: true });
    setSaving(false);
  }

  return (
    <>
      <PageHeader title={`${contentTabs.find((item) => item.id === tab)?.label} content`} description="Loaded from Firestore content collection." action={saving ? "Saving..." : "Save changes"} onAction={save} />
      <div className="builder-grid">
        <form className="admin-form">
          <label>
            Title
            <input value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>
          <label>
            Description
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
          </label>
        </form>
        <Panel title="Live preview">
          <div className="content-preview">{title || description ? `${title} ${description}` : "No Firestore content saved for this section yet."}</div>
        </Panel>
      </div>
    </>
  );
}

function SeoSettings({ services }: { services: FirebaseServices }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    getDoc(doc(services.db, "content", "seo")).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setTitle(String(data.title || ""));
        setDescription(String(data.description || ""));
      }
    });
  }, [services]);

  async function save() {
    await setDoc(doc(services.db, "content", "seo"), { title, description, updatedAt: serverTimestamp() }, { merge: true });
  }

  return (
    <>
      <PageHeader title="SEO Settings" description="Manage SEO values from Firestore." action="Save SEO" onAction={save} />
      <div className="builder-grid">
        <form className="admin-form">
          <label>
            Page title
            <input value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>
          <label>
            Meta description
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
          </label>
        </form>
        <Panel title="Social share preview">
          <div className="og-preview">
            <strong>{title || "No SEO title saved"}</strong>
            <span>{description || "No meta description saved"}</span>
          </div>
        </Panel>
      </div>
    </>
  );
}

function SettingsWorkspace({ services, campaigns, onReload }: { services: FirebaseServices; campaigns: Campaign[]; onReload: () => void }) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("website");
  return (
    <>
      <PageHeader title="Settings" description="Website settings, campaign tooling, exports, and admin access setup." />
      <UnderlineTabs tabs={settingsTabs} active={activeTab} onChange={setActiveTab} />
      {activeTab === "campaignBuilder" && <CampaignBuilder services={services} campaigns={campaigns} onReload={onReload} />}
      {activeTab === "backup" && <BackupExport services={services} campaigns={campaigns} />}
      {activeTab === "admins" && <AdminUsers />}
      {["website", "social", "privacy"].includes(activeTab) && <SettingsForm services={services} activeTab={activeTab as "website" | "social" | "privacy"} />}
    </>
  );
}

function SettingsForm({ services, activeTab }: { services: FirebaseServices; activeTab: "website" | "social" | "privacy" }) {
  const [fields, setFields] = useState<Record<string, string>>({});
  const labels: Record<typeof activeTab, string[]> = {
    website: ["websiteName", "primaryEmail", "notificationEmail"],
    social: ["linkedinUrl", "whatsappNumber", "githubUrl"],
    privacy: ["cookieBannerCopy", "privacyPolicyUrl", "consentMode"],
  };

  useEffect(() => {
    getDoc(doc(services.db, "settings", activeTab)).then((snapshot) => {
      setFields(snapshot.exists() ? (snapshot.data() as Record<string, string>) : {});
    });
  }, [services, activeTab]);

  async function save() {
    await setDoc(doc(services.db, "settings", activeTab), { ...fields, updatedAt: serverTimestamp() }, { merge: true });
  }

  return (
    <>
      <PageHeader title={settingsTabs.find((item) => item.id === activeTab)?.label || "Settings"} description="Values are loaded from and saved to Firestore settings documents." action="Save settings" onAction={save} />
      <form className="admin-form single">
        {labels[activeTab].map((field) => (
          <label key={field}>
            {field}
            <input value={fields[field] || ""} onChange={(event) => setFields((current) => ({ ...current, [field]: event.target.value }))} />
          </label>
        ))}
      </form>
    </>
  );
}

function CampaignBuilder({ services, campaigns, onReload }: { services: FirebaseServices; campaigns: Campaign[]; onReload: () => void }) {
  const [baseUrl, setBaseUrl] = useState("https://webtrivotechnologies.github.io/");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const generatedUrl = useMemo(() => {
    try {
      const url = new URL(baseUrl || "https://webtrivotechnologies.github.io/");
      if (source) url.searchParams.set("utm_source", source);
      if (medium) url.searchParams.set("utm_medium", medium);
      if (name) url.searchParams.set("utm_campaign", name);
      return url.toString();
    } catch {
      return "";
    }
  }, [baseUrl, source, medium, name]);

  async function save() {
    if (!generatedUrl || !name.trim()) {
      setError("Add a valid website URL and campaign name before saving.");
      return;
    }
    setError("");
    await addDoc(collection(services.db, "campaigns"), { name, url: generatedUrl, source, medium, createdAt: serverTimestamp() });
    onReload();
  }

  async function copyUrl() {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <>
      <PageHeader title="Campaign URL Builder" description="Generate UTM URLs and persist saved campaigns to Firestore." action="Save campaign" onAction={save} />
      {error && <Notice tone="error">{error}</Notice>}
      <div className="builder-grid">
        <form className="admin-form">
          <label>
            Website URL
            <input value={baseUrl} onChange={(event) => setBaseUrl(event.target.value)} />
          </label>
          <label>
            Source
            <input value={source} onChange={(event) => setSource(event.target.value)} />
          </label>
          <label>
            Medium
            <input value={medium} onChange={(event) => setMedium(event.target.value)} />
          </label>
          <label>
            Campaign
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
        </form>
        <Panel title="Live URL preview">
          <code>{generatedUrl || "Enter a valid URL to generate a campaign link."}</code>
          <button className="admin-primary" onClick={copyUrl} disabled={!generatedUrl}>
            <Copy size={16} /> {copied ? "Copied" : "Copy URL"}
          </button>
        </Panel>
      </div>
      <AdminTable columns={["Campaign", "Generated URL", "Created"]} rows={campaigns.map((campaign) => [campaign.name || "-", campaign.url || "-", formatDate(campaign.createdAt)])} emptyTitle="No campaigns saved yet" />
    </>
  );
}

function BackupExport({ services, campaigns }: { services: FirebaseServices; campaigns: Campaign[] }) {
  async function exportCollection(collectionName: string) {
    const snapshots = await getDocs(collection(services.db, collectionName));
    exportJson(`${collectionName}.json`, snapshots.docs.map((item) => ({ id: item.id, ...item.data() })));
  }

  return (
    <div className="admin-kpi-grid three">
      <article className="admin-export-card">
        <Download size={20} />
        <strong>Enquiries JSON</strong>
        <span>Exports the current Firestore enquiries collection.</span>
        <button onClick={() => exportCollection("enquiries")}>Export</button>
      </article>
      <article className="admin-export-card">
        <Download size={20} />
        <strong>Content JSON backup</strong>
        <span>Exports the Firestore content collection.</span>
        <button onClick={() => exportCollection("content")}>Export</button>
      </article>
      <article className="admin-export-card">
        <Download size={20} />
        <strong>Campaign report</strong>
        <span>{campaigns.length} Firestore campaigns available.</span>
        <button onClick={() => exportJson("campaigns.json", campaigns)}>Export</button>
      </article>
    </div>
  );
}

function AdminUsers() {
  return adminUsersEndpoint ? (
    <EmptyState title="Admin users endpoint configured" message="Connect this tab to your secure user-management Cloud Function response." />
  ) : (
    <EmptyState title="Admin users require a secure backend" message="Firebase client apps cannot list or create Auth users safely. Configure VITE_ADMIN_USERS_ENDPOINT with a protected Cloud Function." />
  );
}

function RecentEnquiries({ enquiries, loading, onSelectLead }: { enquiries: Enquiry[]; loading: boolean; onSelectLead: (lead: Enquiry) => void }) {
  if (loading) return <LoadingPanel label="Loading recent enquiries..." />;
  if (!enquiries.length) return <EmptyState title="No recent enquiries" message="Real enquiry documents from Firestore will appear here." compact />;
  return (
    <div className="recent-list">
      {enquiries.slice(0, 5).map((lead) => (
        <button type="button" key={lead.id} onClick={() => onSelectLead(lead)}>
          <div>
            <strong>{lead.name || lead.id}</strong>
            <span>{lead.service || lead.email || "-"}</span>
          </div>
          {lead.source && <Badge type={lead.source}>{lead.source}</Badge>}
          {lead.status && <Badge type={lead.status}>{lead.status}</Badge>}
        </button>
      ))}
    </div>
  );
}

function ActivityFeed({ items, loading, onOpen }: { items: ActivityItem[]; loading: boolean; onOpen: (item: ActivityItem) => void }) {
  if (loading) return <LoadingPanel label="Loading recent activity..." />;
  if (!items.length) return <EmptyState title="No activity yet" message="Activity documents from Firestore will appear here." compact />;
  return (
    <div className="activity-feed">
      {items.map((item) => (
        <button type="button" key={item.id} onClick={() => onOpen(item)}>
          {item.action || "Activity"}
          <span>{formatDate(item.createdAt)}</span>
        </button>
      ))}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="admin-panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function UnderlineTabs<T extends string>({ tabs, active, onChange }: { tabs: Array<{ id: T; label: string }>; active: T; onChange: (tab: T) => void }) {
  return (
    <div className="admin-tabs" role="tablist">
      {tabs.map((tab) => (
        <button className={active === tab.id ? "active" : ""} type="button" role="tab" aria-selected={active === tab.id} key={tab.id} onClick={() => onChange(tab.id)}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function AdminTable({ columns, rows, emptyTitle }: { columns: string[]; rows: string[][]; emptyTitle?: string }) {
  if (!rows.length) return <EmptyState title={emptyTitle || "No records found"} message="This table only renders real connected data." />;
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={`${index}-${cellIndex}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="admin-pagination">Rows loaded: {rows.length}</div>
    </div>
  );
}

function Badge({ type, children }: { type: string; children: ReactNode }) {
  return <span className={`admin-badge ${type.toLowerCase().replace(/\s+/g, "-")}`}>{children}</span>;
}

function EmptyState({ title, message, compact = false }: { title: string; message: string; compact?: boolean }) {
  return (
    <section className={`admin-empty-state ${compact ? "compact" : ""}`}>
      <strong>{title}</strong>
      <p>{message}</p>
    </section>
  );
}

function LoadingPanel({ label }: { label: string }) {
  return (
    <section className="admin-empty-state">
      <Loader2 className="admin-spin" size={22} />
      <strong>{label}</strong>
    </section>
  );
}

function Notice({ tone, children }: { tone: "error" | "info"; children: ReactNode }) {
  return <div className={`admin-notice ${tone}`}>{children}</div>;
}

function AdminSetupNotice({ onSaved }: { onSaved: () => void }) {
  const [config, setConfig] = useState<FirebaseWebConfig>(() => readStoredFirebaseConfig());
  const [message, setMessage] = useState("");

  function update(field: keyof FirebaseWebConfig, value: string) {
    setConfig((current) => ({ ...current, [field]: value }));
  }

  function save() {
    const cleanedConfig = Object.fromEntries(Object.entries(config).map(([key, value]) => [key, String(value || "").trim()])) as FirebaseWebConfig;
    if (!isFirebaseConfigReady(cleanedConfig)) {
      setMessage("apiKey, authDomain, projectId, and appId are required.");
      return;
    }
    localStorage.setItem(firebaseConfigStorageKey, JSON.stringify(cleanedConfig));
    setMessage("Firebase config saved in this browser. Opening admin login...");
    onSaved();
  }

  return (
    <div className="admin-login-page">
      <section className="admin-login-card">
        <h1>Firebase admin setup required</h1>
        <p>Add your Firebase web app config to enable Auth and Firestore. This does not create fake data; it only connects the admin to your real project.</p>
        {message && <Notice tone={message.includes("saved") ? "info" : "error"}>{message}</Notice>}
        <div className="admin-setup-grid">
          <label>
            apiKey
            <input value={config.apiKey || ""} onChange={(event) => update("apiKey", event.target.value)} />
          </label>
          <label>
            authDomain
            <input value={config.authDomain || ""} onChange={(event) => update("authDomain", event.target.value)} placeholder="your-project.firebaseapp.com" />
          </label>
          <label>
            projectId
            <input value={config.projectId || ""} onChange={(event) => update("projectId", event.target.value)} />
          </label>
          <label>
            appId
            <input value={config.appId || ""} onChange={(event) => update("appId", event.target.value)} />
          </label>
          <label>
            storageBucket
            <input value={config.storageBucket || ""} onChange={(event) => update("storageBucket", event.target.value)} />
          </label>
          <label>
            messagingSenderId
            <input value={config.messagingSenderId || ""} onChange={(event) => update("messagingSenderId", event.target.value)} />
          </label>
          <label>
            measurementId
            <input value={config.measurementId || ""} onChange={(event) => update("measurementId", event.target.value)} />
          </label>
        </div>
        <button className="admin-primary" type="button" onClick={save}>
          Save Firebase config
        </button>
        <a className="admin-help-link" href="https://console.firebase.google.com/" target="_blank" rel="noreferrer">
          Open Firebase Console
        </a>
        <small>For permanent deployment, add the same values as GitHub Actions secrets or Vite env vars before building.</small>
      </section>
    </div>
  );
}

function AdminLoading() {
  return (
    <div className="admin-login-page">
      <section className="admin-login-card">
        <Loader2 className="admin-spin" />
        <p>Checking Firebase authentication...</p>
      </section>
    </div>
  );
}

function AdminLogin({ services }: { services: FirebaseServices }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function login(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(services.auth, email, password);
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={login}>
        <h1>Webtrivo Admin</h1>
        <p>Sign in with Firebase Auth to manage the website.</p>
        {error && <Notice tone="error">{error}</Notice>}
        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" />
        </label>
        <label>
          Password
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" />
        </label>
        <button className="admin-primary" type="submit">
          {loading ? "Signing in..." : "Log in"}
        </button>
      </form>
    </div>
  );
}
