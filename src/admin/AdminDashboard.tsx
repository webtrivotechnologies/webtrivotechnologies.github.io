import {
  Activity,
  Archive,
  BarChart3,
  Bell,
  BookOpen,
  ChevronDown,
  Copy,
  Download,
  Edit3,
  Eye,
  FileText,
  Filter,
  Globe2,
  Home,
  Image,
  LayoutDashboard,
  Link,
  Lock,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  PieChart,
  Plus,
  Search,
  Settings,
  Shield,
  Smartphone,
  Star,
  Sun,
  Trash2,
  Users,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

type Role = "Super Admin" | "Content Manager" | "Sales Manager" | "Viewer";
type AdminPage =
  | "dashboard"
  | "analytics-overview"
  | "traffic-sources"
  | "geographic"
  | "page-performance"
  | "conversion"
  | "campaign-tracking"
  | "device-analytics"
  | "enquiries"
  | "campaign-builder"
  | "hero-content"
  | "services-content"
  | "portfolio-content"
  | "testimonials-content"
  | "faqs-content"
  | "contact-info"
  | "seo-settings"
  | "users-roles"
  | "activity-log"
  | "notifications"
  | "backup-export"
  | "website-settings"
  | "social-media"
  | "cookie-privacy";

const roles: Role[] = ["Super Admin", "Content Manager", "Sales Manager", "Viewer"];

const roleAccess: Record<Role, AdminPage[]> = {
  "Super Admin": [
    "dashboard",
    "analytics-overview",
    "traffic-sources",
    "geographic",
    "page-performance",
    "conversion",
    "campaign-tracking",
    "device-analytics",
    "enquiries",
    "campaign-builder",
    "hero-content",
    "services-content",
    "portfolio-content",
    "testimonials-content",
    "faqs-content",
    "contact-info",
    "seo-settings",
    "users-roles",
    "activity-log",
    "notifications",
    "backup-export",
    "website-settings",
    "social-media",
    "cookie-privacy",
  ],
  "Content Manager": [
    "dashboard",
    "hero-content",
    "services-content",
    "portfolio-content",
    "testimonials-content",
    "faqs-content",
    "contact-info",
    "seo-settings",
    "website-settings",
    "social-media",
    "cookie-privacy",
  ],
  "Sales Manager": [
    "dashboard",
    "analytics-overview",
    "traffic-sources",
    "conversion",
    "campaign-tracking",
    "enquiries",
    "campaign-builder",
    "notifications",
  ],
  Viewer: ["dashboard", "analytics-overview", "traffic-sources", "geographic", "page-performance", "device-analytics"],
};

const navGroups: Array<{
  title: string;
  items: Array<{ page: AdminPage; label: string; icon: typeof Home }>;
}> = [
  { title: "Overview", items: [{ page: "dashboard", label: "Dashboard home", icon: LayoutDashboard }] },
  {
    title: "Analytics",
    items: [
      { page: "analytics-overview", label: "Overview", icon: BarChart3 },
      { page: "traffic-sources", label: "Traffic Sources", icon: PieChart },
      { page: "geographic", label: "Geographic", icon: Globe2 },
      { page: "page-performance", label: "Page Performance", icon: FileText },
      { page: "conversion", label: "Conversion Analytics", icon: Activity },
      { page: "campaign-tracking", label: "Campaign Tracking", icon: Link },
      { page: "device-analytics", label: "Device Analytics", icon: Smartphone },
    ],
  },
  {
    title: "CRM",
    items: [
      { page: "enquiries", label: "Enquiries", icon: Mail },
      { page: "campaign-builder", label: "Campaign URL Builder", icon: Link },
    ],
  },
  {
    title: "Content",
    items: [
      { page: "hero-content", label: "Hero", icon: Image },
      { page: "services-content", label: "Services", icon: Settings },
      { page: "portfolio-content", label: "Portfolio", icon: BookOpen },
      { page: "testimonials-content", label: "Testimonials", icon: Star },
      { page: "faqs-content", label: "FAQs", icon: MessageCircle },
      { page: "contact-info", label: "Contact Info", icon: Mail },
      { page: "seo-settings", label: "SEO Settings", icon: Globe2 },
    ],
  },
  {
    title: "Admin",
    items: [
      { page: "users-roles", label: "Users & Roles", icon: Users },
      { page: "activity-log", label: "Activity Log", icon: Activity },
      { page: "notifications", label: "Notifications", icon: Bell },
      { page: "backup-export", label: "Backup/Export", icon: Archive },
    ],
  },
  {
    title: "Settings",
    items: [
      { page: "website-settings", label: "Website Settings", icon: Settings },
      { page: "social-media", label: "Social Media", icon: Link },
      { page: "cookie-privacy", label: "Cookie/Privacy", icon: Shield },
    ],
  },
];

const enquiries = [
  {
    id: "WT-1049",
    name: "Nadia Williams",
    company: "RetailWorks",
    service: "E-commerce",
    source: "LinkedIn",
    score: "Hot",
    scoreValue: 92,
    status: "Qualified",
    assigned: "Priya",
    created: "Jul 10, 2026",
    followUp: "Today",
  },
  {
    id: "WT-1048",
    name: "Omar Al Khalid",
    company: "PropertyHub",
    service: "CRM",
    source: "WhatsApp",
    score: "Warm",
    scoreValue: 71,
    status: "Contacted",
    assigned: "Ritesh",
    created: "Jul 9, 2026",
    followUp: "Overdue",
  },
  {
    id: "WT-1047",
    name: "Aarav Mehta",
    company: "StockLine",
    service: "ERP",
    source: "Google",
    score: "Cold",
    scoreValue: 42,
    status: "New",
    assigned: "Anika",
    created: "Jul 8, 2026",
    followUp: "Jul 14",
  },
];

const activity = [
  "Priya updated FAQ #3",
  "New enquiry from LinkedIn",
  "Ritesh exported enquiries CSV",
  "SEO title changed for homepage",
];

const campaigns = [
  { name: "LinkedIn ERP Push", url: "https://webtrivo...?utm_source=linkedin", clicks: 182, enquiries: 9, rate: "4.9%" },
  { name: "WhatsApp Retargeting", url: "https://webtrivo...?utm_source=whatsapp", clicks: 96, enquiries: 7, rate: "7.3%" },
];

function canAccess(role: Role, page: AdminPage) {
  return roleAccess[role].includes(page);
}

export default function AdminDashboard() {
  const [role, setRole] = useState<Role>("Super Admin");
  const [page, setPage] = useState<AdminPage>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [selectedLead, setSelectedLead] = useState<(typeof enquiries)[number] | null>(null);

  const allowedPage = canAccess(role, page) ? page : roleAccess[role][0];
  const currentLabel = navGroups.flatMap((group) => group.items).find((item) => item.page === allowedPage)?.label || "Dashboard";
  const visibleGroups = useMemo(
    () =>
      navGroups
        .map((group) => ({ ...group, items: group.items.filter((item) => canAccess(role, item.page)) }))
        .filter((group) => group.items.length),
    [role],
  );

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
        <nav>
          {visibleGroups.map((group) => (
            <section key={group.title}>
              {!collapsed && <p>{group.title}</p>}
              {group.items.map((item) => (
                <button
                  className={allowedPage === item.page ? "active" : ""}
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
            </section>
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
            <b>4</b>
          </button>
          <button className="admin-icon-button" type="button" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <select value={role} onChange={(event) => setRole(event.target.value as Role)} aria-label="Preview role">
            {roles.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <div className="admin-user">
            <span>RK</span>
            <div>
              <strong>Ritesh Kumar</strong>
              <small>{role}</small>
            </div>
          </div>
        </header>

        <main className="admin-page">
          {!canAccess(role, page) ? (
            <AccessDenied role={role} />
          ) : (
            <PageRenderer page={allowedPage} role={role} onSelectLead={setSelectedLead} />
          )}
        </main>
      </div>

      {sidebarOpen && <button className="admin-scrim" type="button" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}
      {selectedLead && <LeadDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} />}
    </div>
  );
}

function PageRenderer({ page, role, onSelectLead }: { page: AdminPage; role: Role; onSelectLead: (lead: (typeof enquiries)[number]) => void }) {
  if (page === "dashboard") return <DashboardHome />;
  if (page === "enquiries") return <EnquiriesCRM onSelectLead={onSelectLead} />;
  if (page === "campaign-builder") return <CampaignBuilder />;
  if (page === "users-roles") return <UsersRoles />;
  if (page === "activity-log") return <ActivityLog />;
  if (page === "notifications") return <Notifications />;
  if (page === "backup-export") return <BackupExport />;
  if (page.includes("content") || page === "hero-content" || page === "contact-info" || page === "seo-settings") {
    return <ContentManager page={page} role={role} />;
  }
  if (page.includes("settings") || page === "social-media" || page === "cookie-privacy") return <SettingsPage page={page} />;
  return <AnalyticsPage page={page} />;
}

function PageHeader({ title, description, action }: { title: string; description: string; action?: string }) {
  return (
    <div className="admin-page-header">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action && <button className="admin-primary">{action}</button>}
    </div>
  );
}

function DashboardHome() {
  return (
    <>
      <PageHeader title="Dashboard home" description="Quick operational view of analytics, enquiries, and admin activity." action="Export CSV" />
      <div className="admin-filterbar">
        <button>Today</button>
        <button className="active">7 days</button>
        <button>30 days</button>
        <button>Custom</button>
      </div>
      <div className="admin-kpi-grid">
        {["Total Users", "New Users", "Sessions", "Enquiries", "Conversion Rate", "WhatsApp Clicks"].map((label, index) => (
          <div className="admin-kpi-slot" key={label}>
            <KpiCard label={label} connected={index > 2} />
          </div>
        ))}
      </div>
      <div className="admin-two-column">
        <Panel title="Recent enquiries">
          <RecentEnquiries />
        </Panel>
        <Panel title="Recent activity">
          <ActivityFeed />
        </Panel>
      </div>
    </>
  );
}

function KpiCard({ label, connected }: { label: string; connected: boolean }) {
  if (!connected) {
    return (
      <article className="admin-kpi empty">
        <BarChart3 size={20} />
        <strong>{label}</strong>
        <span>Not connected</span>
        <a>Connect Google Analytics →</a>
      </article>
    );
  }

  return (
    <article className="admin-kpi">
      <span className="trend up">↑ 12%</span>
      <strong>{label === "Conversion Rate" ? "4.8%" : label === "WhatsApp Clicks" ? "184" : "27"}</strong>
      <small>{label}</small>
      <div className="sparkline" />
    </article>
  );
}

function AnalyticsPage({ page }: { page: AdminPage }) {
  const title = page
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
  return (
    <>
      <PageHeader title={title} description="Shared analytics layout with filters, KPI cards, chart states, and data tables." action="Export report" />
      <div className="admin-filterbar">
        <button className="active">7 days</button>
        <button>Segment: All traffic</button>
        <button>Compare previous</button>
      </div>
      <div className="admin-kpi-grid three">
        <KpiCard label="Sessions" connected />
        <KpiCard label="Conversions" connected />
        <KpiCard label="Conversion Rate" connected />
      </div>
      <div className="admin-chart-grid">
        <ChartCard title={page === "geographic" ? "Top countries and cities" : "Visitors trend"} />
        <ChartCard title={page === "conversion" ? "Visit → Service View → Enquiry Started → Submitted" : "Source breakdown"} />
      </div>
      {page === "geographic" && <p className="admin-disclaimer">Location is approximate, based on IP-derived region.</p>}
      <AdminTable columns={["Source / Page", "Sessions", "Conversions", "Rate"]} rows={[["LinkedIn / CRM", "182", "9", "4.9%"], ["Google / ERP", "241", "8", "3.3%"]]} />
    </>
  );
}

function ChartCard({ title }: { title: string }) {
  return (
    <section className="admin-chart-card">
      <h3>{title}</h3>
      <div className="chart-skeleton">
        <span />
        <span />
        <span />
        <span />
      </div>
      <small>No GA4 data? This card becomes a clear empty state instead of fake chart data.</small>
    </section>
  );
}

function EnquiriesCRM({ onSelectLead }: { onSelectLead: (lead: (typeof enquiries)[number]) => void }) {
  const [view, setView] = useState<"table" | "kanban">("table");
  return (
    <>
      <PageHeader title="Enquiry CRM" description="Sort, filter, assign, score, and follow up with every captured lead." action="Bulk export" />
      <div className="admin-filterbar">
        <button>
          <Filter size={15} /> Status
        </button>
        <button>Source</button>
        <button>Assigned</button>
        <button>Date range</button>
        <button>Lead score</button>
        <button className="ghost">Clear all</button>
        <button className="active" onClick={() => setView(view === "table" ? "kanban" : "table")}>
          {view === "table" ? "Kanban view" : "Table view"}
        </button>
      </div>
      {view === "table" ? <LeadTable onSelectLead={onSelectLead} /> : <Kanban />}
    </>
  );
}

function LeadTable({ onSelectLead }: { onSelectLead: (lead: (typeof enquiries)[number]) => void }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {["Lead ID", "Name", "Company", "Service", "Source", "Lead Score", "Status", "Assigned To", "Created", "Follow-up", ""].map((head) => (
              <th key={head}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {enquiries.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.id}</td>
              <td>{lead.name}</td>
              <td>{lead.company}</td>
              <td>{lead.service}</td>
              <td>
                <Badge type={lead.source}>{lead.source}</Badge>
              </td>
              <td>
                <Badge type={lead.score}>{lead.score}</Badge>
              </td>
              <td>
                <Badge type={lead.status}>{lead.status}</Badge>
              </td>
              <td>
                <span className="avatar">{lead.assigned[0]}</span> {lead.assigned}
              </td>
              <td>{lead.created}</td>
              <td className={lead.followUp === "Overdue" ? "overdue" : ""}>{lead.followUp}</td>
              <td>
                <button className="admin-link-button" onClick={() => onSelectLead(lead)}>
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="admin-pagination">Rows per page: 10 · Page 1 of 1</div>
    </div>
  );
}

function Kanban() {
  const columns = ["New", "Contacted", "Qualified", "Proposal Sent", "Negotiation", "Won", "Lost"];
  return (
    <div className="kanban-board">
      {columns.map((column) => (
        <section key={column}>
          <h3>{column}</h3>
          {enquiries
            .filter((lead) => lead.status === column || (column === "New" && lead.status === "New"))
            .map((lead) => (
              <article className="kanban-card" key={lead.id}>
                <strong>{lead.name}</strong>
                <span>{lead.company}</span>
                <Badge type={lead.score}>{lead.score}</Badge>
              </article>
            ))}
        </section>
      ))}
    </div>
  );
}

function LeadDrawer({ lead, onClose }: { lead: (typeof enquiries)[number]; onClose: () => void }) {
  return (
    <aside className="lead-drawer" role="dialog" aria-label={`${lead.name} lead details`}>
      <header>
        <div>
          <h2>{lead.name}</h2>
          <p>{lead.company} · {lead.service}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close lead details">
          <X size={20} />
        </button>
      </header>
      <section>
        <h3>Attribution</h3>
        <p>Source: {lead.source} · Campaign: July CRM push · Landing page: /#services</p>
      </section>
      <section>
        <h3>Status and score</h3>
        <select defaultValue={lead.status}>
          {["New", "Contacted", "Qualified", "Proposal Sent", "Negotiation", "Won", "Lost"].map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
        <p>Lead score: {lead.scoreValue}/100. Admins can adjust manually.</p>
      </section>
      <section>
        <h3>Notes timeline</h3>
        <ul>
          <li>Ritesh added qualification note · 10:42 AM</li>
          <li>Follow-up scheduled · Yesterday</li>
        </ul>
      </section>
      <div className="drawer-actions">
        <button>Open WhatsApp</button>
        <button>Send Email</button>
        <button>Copy Contact Details</button>
      </div>
    </aside>
  );
}

function CampaignBuilder() {
  return (
    <>
      <PageHeader title="Campaign URL Builder" description="Generate UTM links and save campaigns for ROI tracking." action="Save campaign" />
      <div className="builder-grid">
        <form className="admin-form">
          {["Website URL", "Source", "Medium", "Campaign", "Content", "Term"].map((field, index) => (
            <label key={field}>
              {field}
              <input placeholder={index === 0 ? "https://webtrivotechnologies.github.io/" : field.toLowerCase()} required={index < 4} />
            </label>
          ))}
        </form>
        <Panel title="Live URL preview">
          <code>https://webtrivotechnologies.github.io/?utm_source=linkedin&utm_medium=social&utm_campaign=erp</code>
          <div className="qr-placeholder">QR</div>
          <button className="admin-primary">
            <Copy size={16} /> Copy URL
          </button>
        </Panel>
      </div>
      <AdminTable columns={["Campaign", "Generated URL", "Clicks", "Enquiries", "Rate", ""]} rows={campaigns.map((campaign) => [campaign.name, campaign.url, String(campaign.clicks), String(campaign.enquiries), campaign.rate, "Delete"])} />
    </>
  );
}

function ContentManager({ page, role }: { page: AdminPage; role: Role }) {
  const title = page === "seo-settings" ? "SEO Settings" : page.split("-")[0].replace(/^\w/, (letter) => letter.toUpperCase());
  const canEdit = role !== "Viewer";
  if (page === "hero-content" || page === "contact-info") {
    return (
      <>
        <PageHeader title={`${title} content`} description="Singleton settings form with unsaved change protection and live preview." action={canEdit ? "Save changes" : undefined} />
        <div className="builder-grid">
          <form className="admin-form">
            <label>Headline<input defaultValue="Transforming Ideas Into Powerful Digital Solutions" /></label>
            <label>Description<textarea defaultValue="Modern websites, apps, CRM, ERP, and software for businesses worldwide." /></label>
            <label>Primary CTA<input defaultValue="Start Your Project" /></label>
          </form>
          <Panel title="Live preview">
            <div className="content-preview">Public-site preview updates here before saving.</div>
          </Panel>
        </div>
      </>
    );
  }
  if (page === "seo-settings") return <SeoSettings />;
  return (
    <>
      <PageHeader title={`${title} content`} description="CRUD table with reorder, active toggle, edit, delete, and live preview patterns." action={canEdit ? "+ Add New" : undefined} />
      <AdminTable columns={["Order", "Title", "Active", "Updated", "Actions"]} rows={[["1", `${title} item`, "On", "Today", "Edit · Delete"], ["2", `${title} item`, "Off", "Yesterday", "Edit · Delete"]]} />
      <Panel title="Editor modal pattern">
        <div className="editor-preview-grid">
          <div className="admin-form">
            <label>Title<input defaultValue={`${title} title`} /></label>
            <label>Description<textarea defaultValue="Rich text or markdown editor area." /></label>
            <label>Image upload<div className="dropzone">Drag image here · crop guide shown</div></label>
          </div>
          <div className="content-preview">Live public rendering preview</div>
        </div>
      </Panel>
    </>
  );
}

function SeoSettings() {
  return (
    <>
      <PageHeader title="SEO Settings" description="Manage page title, meta description, canonical URL, keywords, and social preview." action="Save SEO" />
      <div className="builder-grid">
        <form className="admin-form">
          <label>Page title <small>58 / 60</small><input defaultValue="Webtrivo Technologies - Web, App, CRM & ERP Development" /></label>
          <label>Meta description <small>142 / 160</small><textarea defaultValue="Custom web, mobile app, CRM, ERP, and e-commerce development for global businesses." /></label>
          <label>Keywords<div className="tag-row"><span>CRM development</span><span>ERP solutions</span><span>custom software</span></div></label>
          <label>Canonical URL<input defaultValue="https://webtrivotechnologies.github.io/" /></label>
        </form>
        <Panel title="Social share preview">
          <div className="og-preview">
            <div>Webtrivo Technologies</div>
            <strong>Custom Web, App, CRM & ERP Development</strong>
            <span>webtrivotechnologies.github.io</span>
          </div>
        </Panel>
      </div>
    </>
  );
}

function UsersRoles() {
  return (
    <>
      <PageHeader title="Users & Roles" description="Invite users, edit roles, disable accounts, and review permissions." action="Invite user" />
      <AdminTable columns={["Name", "Email", "Role", "Status", "Last login", "Actions"]} rows={[["Ritesh Kumar", "ritesh@example.com", "Super Admin", "Active", "Today", "Edit role"], ["Priya Singh", "priya@example.com", "Content Manager", "Invited", "Never", "Resend invite"]]} />
      <Panel title="Role permission matrix">
        <div className="permission-grid">
          {["Module", ...roles].map((item) => <strong key={item}>{item}</strong>)}
          {["Analytics", "CRM", "Content", "Admin", "Settings"].flatMap((module) => [<span key={module}>{module}</span>, ...roles.map((role) => <span key={`${module}-${role}`}>{roleAccess[role].some((page) => page.includes(module.toLowerCase().split(" ")[0]) || page === "dashboard") ? "✓" : "—"}</span>)])}
        </div>
      </Panel>
    </>
  );
}

function ActivityLog() {
  return (
    <>
      <PageHeader title="Activity Log" description="Read-only chronological audit trail, filterable by user and date range." />
      <AdminTable columns={["Actor", "Action", "Target", "Timestamp"]} rows={[["Priya", "Updated", "FAQ #3", "Today"], ["Ritesh", "Exported", "Enquiries CSV", "Yesterday"]]} />
    </>
  );
}

function Notifications() {
  return (
    <>
      <PageHeader title="Notifications" description="New enquiry, follow-up due, and campaign milestone notifications." action="Mark all as read" />
      <div className="notification-list">
        {["New enquiry from LinkedIn", "Follow-up due today for PropertyHub", "Campaign reached 100 clicks"].map((item) => <article key={item}>{item}<span>Unread</span></article>)}
      </div>
    </>
  );
}

function BackupExport() {
  return (
    <>
      <PageHeader title="Backup / Export" description="Export CRM data and content backups from the static admin UI pattern." />
      <div className="admin-kpi-grid three">
        {["Enquiries CSV", "Content JSON backup", "Campaign report"].map((item) => (
          <article className="admin-export-card" key={item}>
            <Download size={20} />
            <strong>{item}</strong>
            <span>Last export: Not yet exported</span>
            <button>Export</button>
          </article>
        ))}
      </div>
    </>
  );
}

function SettingsPage({ page }: { page: AdminPage }) {
  return (
    <>
      <PageHeader title={page.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ")} description="Settings-style form with save confirmation and validation states." action="Save settings" />
      <form className="admin-form single">
        <label>Website name<input defaultValue="Webtrivo Technologies" /></label>
        <label>Primary email<input defaultValue="riteshkumar7463867570@gmail.com" /></label>
        <label>Privacy copy<textarea defaultValue="Essential storage only; analytics-ready disclosure." /></label>
      </form>
    </>
  );
}

function RecentEnquiries() {
  return (
    <div className="recent-list">
      {enquiries.map((lead) => (
        <article key={lead.id}>
          <div><strong>{lead.name}</strong><span>{lead.service}</span></div>
          <Badge type={lead.source}>{lead.source}</Badge>
          <Badge type={lead.status}>{lead.status}</Badge>
        </article>
      ))}
    </div>
  );
}

function ActivityFeed() {
  return (
    <div className="activity-feed">
      {activity.map((item) => <article key={item}>{item}<span>2h ago</span></article>)}
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

function AdminTable({ columns, rows }: { columns: string[]; rows: string[][] }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>{row.map((cell, cellIndex) => <td key={`${index}-${cellIndex}`}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
      <div className="admin-pagination">Rows per page: 10 · Pagination ready</div>
    </div>
  );
}

function Badge({ type, children }: { type: string; children: ReactNode }) {
  return <span className={`admin-badge ${type.toLowerCase().replace(/\s+/g, "-")}`}>{children}</span>;
}

function AccessDenied({ role }: { role: Role }) {
  return (
    <section className="admin-access-denied">
      <Lock size={34} />
      <h1>You don't have access to this section</h1>
      <p>Your current role is {role}. Choose another role in the top bar to preview other permission sets.</p>
    </section>
  );
}
