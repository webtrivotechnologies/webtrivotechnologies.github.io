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
import type { FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

type AdminPage = "dashboard" | "analytics" | "enquiries" | "content" | "settings";
type AnalyticsTab = "overview" | "traffic" | "geographic" | "pages" | "conversions" | "devices";
type ContentTab = "hero" | "services" | "portfolio" | "testimonials" | "faqs" | "contact" | "seo";
type SettingsTab = "website" | "social" | "privacy" | "campaignBuilder" | "backup" | "admins";
type DateRange = "today" | "7d" | "30d" | "custom";

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

type GaReport = {
  connected: boolean;
  rows: string[][];
  metrics: Record<string, string>;
  message?: string;
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

const gaReportEndpoint = import.meta.env.VITE_GA4_REPORT_ENDPOINT as string | undefined;
const adminUsersEndpoint = import.meta.env.VITE_ADMIN_USERS_ENDPOINT as string | undefined;
const firebaseReady = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId);

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
  if (!firebaseReady) return null;
  if (!servicesCache) {
    const app = initializeApp(firebaseConfig);
    servicesCache = { app, auth: getAuth(app), db: getFirestore(app) };
  }
  return servicesCache;
}

function dateFromRange(range: DateRange) {
  const date = new Date();
  if (range === "today") date.setHours(0, 0, 0, 0);
  if (range === "7d") date.setDate(date.getDate() - 7);
  if (range === "30d") date.setDate(date.getDate() - 30);
  return date;
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
  const services = useMemo(getFirebaseServices, []);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(Boolean(services));
  const [page, setPage] = useState<AdminPage>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [selectedLead, setSelectedLead] = useState<Enquiry | null>(null);

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

  if (!services) return <AdminSetupNotice />;
  if (authLoading) return <AdminLoading />;
  if (!user) return <AdminLogin services={services} />;

  const currentLabel = navItems.find((item) => item.page === page)?.label || "Dashboard";

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
            <input placeholder="Search enquiries or content..." />
          </label>
          <button className="admin-icon-button" type="button" aria-label="Notifications">
            <Bell size={18} />
          </button>
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
          <AdminWorkspace page={page} services={services} onSelectLead={setSelectedLead} />
        </main>
      </div>

      {sidebarOpen && <button className="admin-scrim" type="button" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}
      {selectedLead && <LeadDrawer services={services} lead={selectedLead} onClose={() => setSelectedLead(null)} />}
    </div>
  );
}

function AdminWorkspace({ page, services, onSelectLead }: { page: AdminPage; services: FirebaseServices; onSelectLead: (lead: Enquiry) => void }) {
  const [range, setRange] = useState<DateRange>("7d");
  const { data, loading, error, reload } = useAdminData(services, range);

  if (page === "dashboard") return <DashboardHome data={data} range={range} onRangeChange={setRange} loading={loading} error={error} onExport={() => exportCsv(data.enquiries)} />;
  if (page === "analytics") return <AnalyticsWorkspace data={data} range={range} onRangeChange={setRange} />;
  if (page === "enquiries") return <EnquiriesCRM services={services} enquiries={data.enquiries} loading={loading} error={error} onSelectLead={onSelectLead} onReload={reload} onExport={() => exportCsv(data.enquiries)} />;
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
    const start = dateFromRange(range);

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [enquirySnapshots, activitySnapshots, conversionSnapshots, campaignSnapshots] = await Promise.all([
          getDocs(query(collection(services.db, "enquiries"), where("createdAt", ">=", start), orderBy("createdAt", "desc"), limit(100))),
          getDocs(query(collection(services.db, "activity"), orderBy("createdAt", "desc"), limit(20))),
          getDocs(query(collection(services.db, "conversions"), where("createdAt", ">=", start), orderBy("createdAt", "desc"), limit(500))),
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

function DashboardHome({ data, range, onRangeChange, loading, error, onExport }: { data: AdminData; range: DateRange; onRangeChange: (range: DateRange) => void; loading: boolean; error: string | null; onExport: () => void }) {
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
          <RecentEnquiries enquiries={data.enquiries} loading={loading} />
        </Panel>
        <Panel title="Recent activity">
          <ActivityFeed items={data.activities} loading={loading} />
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
      {!gaReportEndpoint && <a>Connect GA4 through a secure Cloud Function</a>}
    </div>
  );
}

function DateRangeFilter({ range, onChange }: { range: DateRange; onChange: (range: DateRange) => void }) {
  return (
    <div className="admin-filterbar">
      {[
        ["today", "Today"],
        ["7d", "7 days"],
        ["30d", "30 days"],
        ["custom", "Custom"],
      ].map(([value, label]) => (
        <button className={range === value ? "active" : ""} type="button" key={value} onClick={() => onChange(value as DateRange)}>
          {label}
        </button>
      ))}
    </div>
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
        const response = await fetch(`${gaReportEndpoint}?tab=${tab}&range=${range}`);
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

function EnquiriesCRM({ services, enquiries, loading, error, onSelectLead, onReload, onExport }: { services: FirebaseServices; enquiries: Enquiry[]; loading: boolean; error: string | null; onSelectLead: (lead: Enquiry) => void; onReload: () => void; onExport: () => void }) {
  const [view, setView] = useState<"table" | "kanban">("table");
  return (
    <>
      <PageHeader title="Enquiries" description="Live Firestore enquiries with status updates persisted back to the database." action="Bulk export" onAction={onExport} />
      <div className="admin-filterbar">
        <button>
          <Filter size={15} /> Status
        </button>
        <button>Source</button>
        <button>Date range</button>
        <button className="ghost">Clear all</button>
        <button className="active" onClick={() => setView(view === "table" ? "kanban" : "table")}>
          {view === "table" ? "Kanban view" : "Table view"}
        </button>
      </div>
      {error && <Notice tone="error">{error}</Notice>}
      {view === "table" ? <LeadTable services={services} enquiries={enquiries} loading={loading} onSelectLead={onSelectLead} onReload={onReload} /> : <Kanban enquiries={enquiries} />}
    </>
  );
}

function LeadTable({ services, enquiries, loading, onSelectLead, onReload }: { services: FirebaseServices; enquiries: Enquiry[]; loading: boolean; onSelectLead: (lead: Enquiry) => void; onReload: () => void }) {
  if (loading) return <LoadingPanel label="Loading Firestore enquiries..." />;
  if (!enquiries.length) return <EmptyState title="No enquiries yet" message="When the public contact form writes to the Firestore enquiries collection, rows will appear here." />;

  async function updateStatus(lead: Enquiry, status: string) {
    await updateDoc(doc(services.db, "enquiries", lead.id), { status, updatedAt: serverTimestamp() });
    onReload();
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {["Lead ID", "Name", "Company", "Service", "Source", "Status", "Created", "Follow-up", ""].map((head) => (
              <th key={head}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {enquiries.map((lead) => (
            <tr key={lead.id}>
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
  );
}

function Kanban({ enquiries }: { enquiries: Enquiry[] }) {
  const columns = ["New", "Contacted", "Qualified", "Proposal Sent", "Negotiation", "Won", "Lost"];
  if (!enquiries.length) return <EmptyState title="No enquiries for Kanban" message="Kanban cards are created from real Firestore enquiry documents." />;
  return (
    <div className="kanban-board">
      {columns.map((column) => (
        <section key={column}>
          <h3>{column}</h3>
          {enquiries
            .filter((lead) => (lead.status || "New") === column)
            .map((lead) => (
              <article className="kanban-card" key={lead.id}>
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
  const [note, setNote] = useState("");

  async function saveNote() {
    if (!note.trim()) return;
    await addDoc(collection(services.db, "enquiries", lead.id, "notes"), { note, createdAt: serverTimestamp() });
    setNote("");
  }

  return (
    <aside className="lead-drawer" role="dialog" aria-label={`${lead.name || lead.id} lead details`}>
      <header>
        <div>
          <h2>{lead.name || "Enquiry"}</h2>
          <p>{lead.company || lead.service || lead.email || lead.id}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close lead details">
          <X size={20} />
        </button>
      </header>
      <section>
        <h3>Contact</h3>
        <p>Email: {lead.email || "-"}</p>
        <p>Phone: {lead.phone || "-"}</p>
      </section>
      <section>
        <h3>Attribution</h3>
        <p>Source: {lead.source || "-"}</p>
      </section>
      <section>
        <h3>Notes</h3>
        <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add a real note to Firestore..." />
      </section>
      <div className="drawer-actions">
        <button onClick={saveNote}>Save Note</button>
        <button>Open WhatsApp</button>
        <button>Send Email</button>
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
      {activeTab === "backup" && <BackupExport campaigns={campaigns} />}
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
  const generatedUrl = useMemo(() => {
    const url = new URL(baseUrl || "https://webtrivotechnologies.github.io/");
    if (source) url.searchParams.set("utm_source", source);
    if (medium) url.searchParams.set("utm_medium", medium);
    if (name) url.searchParams.set("utm_campaign", name);
    return url.toString();
  }, [baseUrl, source, medium, name]);

  async function save() {
    await addDoc(collection(services.db, "campaigns"), { name, url: generatedUrl, source, medium, createdAt: serverTimestamp() });
    onReload();
  }

  return (
    <>
      <PageHeader title="Campaign URL Builder" description="Generate UTM URLs and persist saved campaigns to Firestore." action="Save campaign" onAction={save} />
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
          <code>{generatedUrl}</code>
          <button className="admin-primary" onClick={() => navigator.clipboard.writeText(generatedUrl)}>
            <Copy size={16} /> Copy URL
          </button>
        </Panel>
      </div>
      <AdminTable columns={["Campaign", "Generated URL", "Created"]} rows={campaigns.map((campaign) => [campaign.name || "-", campaign.url || "-", formatDate(campaign.createdAt)])} emptyTitle="No campaigns saved yet" />
    </>
  );
}

function BackupExport({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <div className="admin-kpi-grid three">
      {["Enquiries CSV", "Content JSON backup", "Campaign report"].map((item) => (
        <article className="admin-export-card" key={item}>
          <Download size={20} />
          <strong>{item}</strong>
          <span>{item === "Campaign report" ? `${campaigns.length} Firestore campaigns available` : "Export uses live Firestore data only"}</span>
          <button>Export</button>
        </article>
      ))}
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

function RecentEnquiries({ enquiries, loading }: { enquiries: Enquiry[]; loading: boolean }) {
  if (loading) return <LoadingPanel label="Loading recent enquiries..." />;
  if (!enquiries.length) return <EmptyState title="No recent enquiries" message="Real enquiry documents from Firestore will appear here." compact />;
  return (
    <div className="recent-list">
      {enquiries.slice(0, 5).map((lead) => (
        <article key={lead.id}>
          <div>
            <strong>{lead.name || lead.id}</strong>
            <span>{lead.service || lead.email || "-"}</span>
          </div>
          {lead.source && <Badge type={lead.source}>{lead.source}</Badge>}
          {lead.status && <Badge type={lead.status}>{lead.status}</Badge>}
        </article>
      ))}
    </div>
  );
}

function ActivityFeed({ items, loading }: { items: ActivityItem[]; loading: boolean }) {
  if (loading) return <LoadingPanel label="Loading recent activity..." />;
  if (!items.length) return <EmptyState title="No activity yet" message="Activity documents from Firestore will appear here." compact />;
  return (
    <div className="activity-feed">
      {items.map((item) => (
        <article key={item.id}>
          {item.action || "Activity"}
          <span>{formatDate(item.createdAt)}</span>
        </article>
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

function AdminSetupNotice() {
  return (
    <div className="admin-login-page">
      <section className="admin-login-card">
        <h1>Firebase admin setup required</h1>
        <p>The admin panel no longer renders fake data. Add Firebase Auth and Firestore Vite environment variables to enable login and live data.</p>
        <code>VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID</code>
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
