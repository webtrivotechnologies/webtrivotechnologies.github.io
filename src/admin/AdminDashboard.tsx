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
  Users,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

type Role = "Super Admin" | "Content Manager" | "Sales Manager" | "Viewer";
type AdminPage = "dashboard" | "analytics" | "enquiries" | "content" | "team" | "settings";
type AnalyticsTab = "overview" | "traffic" | "geographic" | "pages" | "conversions" | "campaigns" | "devices";
type ContentTab = "hero" | "services" | "portfolio" | "testimonials" | "faqs" | "contact" | "seo";
type TeamTab = "users" | "activity";
type SettingsTab = "website" | "social" | "privacy" | "backup";

const roles: Role[] = ["Super Admin", "Content Manager", "Sales Manager", "Viewer"];

const roleAccess: Record<Role, AdminPage[]> = {
  "Super Admin": ["dashboard", "analytics", "enquiries", "content", "team", "settings"],
  "Content Manager": ["dashboard", "content", "settings"],
  "Sales Manager": ["dashboard", "analytics", "enquiries"],
  Viewer: ["dashboard", "analytics"],
};

const navItems: Array<{ page: AdminPage; label: string; icon: typeof Home }> = [
  { page: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { page: "analytics", label: "Analytics", icon: BarChart3 },
  { page: "enquiries", label: "Enquiries", icon: Mail },
  { page: "content", label: "Content", icon: Edit3 },
  { page: "team", label: "Team", icon: Users },
  { page: "settings", label: "Settings", icon: Settings },
];

const analyticsTabs: Array<{ id: AnalyticsTab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "traffic", label: "Traffic" },
  { id: "geographic", label: "Geographic" },
  { id: "pages", label: "Pages" },
  { id: "conversions", label: "Conversions" },
  { id: "campaigns", label: "Campaigns" },
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

const teamTabs: Array<{ id: TeamTab; label: string }> = [
  { id: "users", label: "Users & Roles" },
  { id: "activity", label: "Activity Log" },
];

const settingsTabs: Array<{ id: SettingsTab; label: string }> = [
  { id: "website", label: "Website" },
  { id: "social", label: "Social Media" },
  { id: "privacy", label: "Cookie & Privacy" },
  { id: "backup", label: "Backup & Export" },
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
  const currentLabel = navItems.find((item) => item.page === allowedPage)?.label || "Dashboard";
  const visibleItems = useMemo(() => navItems.filter((item) => canAccess(role, item.page)), [role]);

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
          {visibleItems.map((item) => (
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
          <label className="admin-role-preview">
            <span>Viewing as</span>
            <select value={role} onChange={(event) => setRole(event.target.value as Role)} aria-label="Viewing as role">
              {roles.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
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
  if (page === "analytics") return <AnalyticsWorkspace />;
  if (page === "enquiries") return <EnquiriesCRM onSelectLead={onSelectLead} />;
  if (page === "content") return <ContentWorkspace role={role} />;
  if (page === "team") return <TeamWorkspace />;
  return <SettingsWorkspace />;
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

function DashboardHome() {
  return (
    <>
      <PageHeader title="Dashboard" description="Quick operational view of analytics, enquiries, and admin activity." action="Export CSV" />
      <div className="admin-ga-banner">
        <BarChart3 size={18} />
        <span>Google Analytics is not connected yet.</span>
        <a>Connect now -&gt;</a>
      </div>
      <DateRangeFilter />
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
        <strong>-</strong>
        <small>{label}</small>
      </article>
    );
  }

  return (
    <article className="admin-kpi">
      <span className="trend up">+12%</span>
      <strong>{label === "Conversion Rate" ? "4.8%" : label === "WhatsApp Clicks" ? "184" : "27"}</strong>
      <small>{label}</small>
      <div className="sparkline" />
    </article>
  );
}

function DateRangeFilter() {
  return (
    <div className="admin-filterbar">
      <button>Today</button>
      <button className="active">7 days</button>
      <button>30 days</button>
      <button>Custom</button>
    </div>
  );
}

function AnalyticsWorkspace() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("overview");
  const [builderOpen, setBuilderOpen] = useState(false);
  const title = analyticsTabs.find((tab) => tab.id === activeTab)?.label || "Overview";

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Performance, acquisition, geography, page, conversion, campaign, and device reporting in one place."
        action={activeTab === "campaigns" ? "+ Create Campaign URL" : "Export report"}
        onAction={activeTab === "campaigns" ? () => setBuilderOpen(true) : undefined}
      />
      <DateRangeFilter />
      <UnderlineTabs tabs={analyticsTabs} active={activeTab} onChange={setActiveTab} />
      <div className="admin-kpi-grid three">
        <KpiCard label={activeTab === "campaigns" ? "Campaign Clicks" : "Sessions"} connected />
        <KpiCard label="Conversions" connected />
        <KpiCard label="Conversion Rate" connected />
      </div>
      <div className="admin-chart-grid">
        <ChartCard title={activeTab === "geographic" ? "Top countries and cities" : `${title} trend`} />
        <ChartCard title={activeTab === "conversions" ? "Visit -> Service View -> Enquiry Started -> Submitted" : `${title} breakdown`} />
      </div>
      {activeTab === "geographic" && <p className="admin-disclaimer">Location is approximate, based on IP-derived region.</p>}
      {activeTab === "campaigns" ? <CampaignTrackingTable /> : <AnalyticsTable activeTab={activeTab} />}
      {builderOpen && <CampaignUrlModal onClose={() => setBuilderOpen(false)} />}
    </>
  );
}

function AnalyticsTable({ activeTab }: { activeTab: AnalyticsTab }) {
  const firstColumn = activeTab === "pages" ? "Page" : activeTab === "devices" ? "Device" : activeTab === "traffic" ? "Source" : "Source / Page";
  return (
    <AdminTable
      columns={[firstColumn, "Sessions", "Conversions", "Rate"]}
      rows={[
        ["LinkedIn / CRM", "182", "9", "4.9%"],
        ["Google / ERP", "241", "8", "3.3%"],
      ]}
    />
  );
}

function CampaignTrackingTable() {
  return (
    <AdminTable
      columns={["Campaign", "Generated URL", "Clicks", "Enquiries", "Rate", "Actions"]}
      rows={campaigns.map((campaign) => [campaign.name, campaign.url, String(campaign.clicks), String(campaign.enquiries), campaign.rate, "Copy"])}
    />
  );
}

function CampaignUrlModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="admin-modal-backdrop" role="presentation">
      <section className="admin-modal" role="dialog" aria-label="Create campaign URL">
        <header>
          <div>
            <h2>Create campaign URL</h2>
            <p>Generate a UTM link and save it to campaign tracking.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close campaign URL builder">
            <X size={20} />
          </button>
        </header>
        <CampaignBuilder compact />
      </section>
    </div>
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
      <PageHeader title="Enquiries" description="Sort, filter, assign, score, and follow up with every captured lead." action="Bulk export" />
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
      <div className="admin-pagination">Rows per page: 10 - Page 1 of 1</div>
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
          <p>
            {lead.company} - {lead.service}
          </p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close lead details">
          <X size={20} />
        </button>
      </header>
      <section>
        <h3>Attribution</h3>
        <p>Source: {lead.source} - Campaign: July CRM push - Landing page: /#services</p>
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
          <li>Ritesh added qualification note - 10:42 AM</li>
          <li>Follow-up scheduled - Yesterday</li>
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

function CampaignBuilder({ compact = false }: { compact?: boolean }) {
  return (
    <>
      {!compact && <PageHeader title="Campaign URL Builder" description="Generate UTM links and save campaigns for ROI tracking." action="Save campaign" />}
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
    </>
  );
}

function ContentWorkspace({ role }: { role: Role }) {
  const [activeTab, setActiveTab] = useState<ContentTab>("hero");
  return (
    <>
      <PageHeader title="Content" description="Manage public website content, contact data, and SEO settings from one organized workspace." />
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
          <ContentManager tab={activeTab} role={role} />
        </div>
      </div>
    </>
  );
}

function ContentManager({ tab, role }: { tab: ContentTab; role: Role }) {
  const labels: Record<ContentTab, string> = {
    hero: "Hero",
    services: "Services",
    portfolio: "Portfolio",
    testimonials: "Testimonials",
    faqs: "FAQs",
    contact: "Contact Info",
    seo: "SEO Settings",
  };
  const title = labels[tab];
  const canEdit = role !== "Viewer";

  if (tab === "hero" || tab === "contact") {
    return (
      <>
        <PageHeader title={`${title} content`} description="Singleton settings form with unsaved change protection and live preview." action={canEdit ? "Save changes" : undefined} />
        <div className="builder-grid">
          <form className="admin-form">
            <label>
              Headline
              <input defaultValue="Transforming Ideas Into Powerful Digital Solutions" />
            </label>
            <label>
              Description
              <textarea defaultValue="Modern websites, apps, CRM, ERP, and software for businesses worldwide." />
            </label>
            <label>
              Primary CTA
              <input defaultValue="Start Your Project" />
            </label>
          </form>
          <Panel title="Live preview">
            <div className="content-preview">Public-site preview updates here before saving.</div>
          </Panel>
        </div>
      </>
    );
  }

  if (tab === "seo") return <SeoSettings />;

  return (
    <>
      <PageHeader title={`${title} content`} description="CRUD table with reorder, active toggle, edit, delete, and live preview patterns." action={canEdit ? "+ Add New" : undefined} />
      <AdminTable columns={["Order", "Title", "Active", "Updated", "Actions"]} rows={[["1", `${title} item`, "On", "Today", "Edit - Delete"], ["2", `${title} item`, "Off", "Yesterday", "Edit - Delete"]]} />
      <Panel title="Editor modal pattern">
        <div className="editor-preview-grid">
          <div className="admin-form">
            <label>
              Title
              <input defaultValue={`${title} title`} />
            </label>
            <label>
              Description
              <textarea defaultValue="Rich text or markdown editor area." />
            </label>
            <label>
              Image upload
              <div className="dropzone">Drag image here - crop guide shown</div>
            </label>
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
          <label>
            Page title <small>58 / 60</small>
            <input defaultValue="Webtrivo Technologies - Web, App, CRM & ERP Development" />
          </label>
          <label>
            Meta description <small>142 / 160</small>
            <textarea defaultValue="Custom web, mobile app, CRM, ERP, and e-commerce development for global businesses." />
          </label>
          <label>
            Keywords
            <div className="tag-row">
              <span>CRM development</span>
              <span>ERP solutions</span>
              <span>custom software</span>
            </div>
          </label>
          <label>
            Canonical URL
            <input defaultValue="https://webtrivotechnologies.github.io/" />
          </label>
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

function TeamWorkspace() {
  const [activeTab, setActiveTab] = useState<TeamTab>("users");
  return (
    <>
      <PageHeader title="Team" description="Manage users, roles, permissions, and the activity trail in one place." action={activeTab === "users" ? "Invite user" : undefined} />
      <UnderlineTabs tabs={teamTabs} active={activeTab} onChange={setActiveTab} />
      {activeTab === "users" ? <UsersRoles /> : <ActivityLog />}
    </>
  );
}

function UsersRoles() {
  return (
    <>
      <AdminTable columns={["Name", "Email", "Role", "Status", "Last login", "Actions"]} rows={[["Ritesh Kumar", "ritesh@example.com", "Super Admin", "Active", "Today", "Edit role"], ["Priya Singh", "priya@example.com", "Content Manager", "Invited", "Never", "Resend invite"]]} />
      <Panel title="Role permission matrix">
        <div className="permission-grid">
          {["Module", ...roles].map((item) => (
            <strong key={item}>{item}</strong>
          ))}
          {["Dashboard", "Analytics", "Enquiries", "Content", "Team", "Settings"].flatMap((module) => [
            <span key={module}>{module}</span>,
            ...roles.map((role) => (
              <span key={`${module}-${role}`}>{roleAccess[role].includes(module.toLowerCase() as AdminPage) ? "Yes" : "-"}</span>
            )),
          ])}
        </div>
      </Panel>
    </>
  );
}

function ActivityLog() {
  return <AdminTable columns={["Actor", "Action", "Target", "Timestamp"]} rows={[["Priya", "Updated", "FAQ #3", "Today"], ["Ritesh", "Exported", "Enquiries CSV", "Yesterday"]]} />;
}

function SettingsWorkspace() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("website");
  const action = activeTab === "backup" ? undefined : "Save settings";
  return (
    <>
      <PageHeader title="Settings" description="Website, social media, privacy, and backup utilities collected into one settings area." action={action} />
      <UnderlineTabs tabs={settingsTabs} active={activeTab} onChange={setActiveTab} />
      {activeTab === "backup" ? <BackupExport /> : <SettingsForm activeTab={activeTab} />}
    </>
  );
}

function SettingsForm({ activeTab }: { activeTab: SettingsTab }) {
  const config: Record<Exclude<SettingsTab, "backup">, Array<{ label: string; value: string; multiline?: boolean }>> = {
    website: [
      { label: "Website name", value: "Webtrivo Technologies" },
      { label: "Primary email", value: "riteshkumar7463867570@gmail.com" },
      { label: "Admin notification email", value: "admin@webtrivo.com" },
    ],
    social: [
      { label: "LinkedIn URL", value: "https://linkedin.com/company/webtrivo" },
      { label: "WhatsApp number", value: "+91 74638 67570" },
      { label: "GitHub URL", value: "https://github.com/webtrivotechnologies" },
    ],
    privacy: [
      { label: "Cookie banner copy", value: "Essential storage only; analytics-ready disclosure.", multiline: true },
      { label: "Privacy policy URL", value: "/privacy" },
      { label: "Consent mode", value: "Analytics disabled until accepted" },
    ],
  };

  return (
    <form className="admin-form single">
      {config[activeTab as Exclude<SettingsTab, "backup">].map((field) => (
        <label key={field.label}>
          {field.label}
          {field.multiline ? <textarea defaultValue={field.value} /> : <input defaultValue={field.value} />}
        </label>
      ))}
    </form>
  );
}

function BackupExport() {
  return (
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
  );
}

function RecentEnquiries() {
  return (
    <div className="recent-list">
      {enquiries.map((lead) => (
        <article key={lead.id}>
          <div>
            <strong>{lead.name}</strong>
            <span>{lead.service}</span>
          </div>
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
      {activity.map((item) => (
        <article key={item}>
          {item}
          <span>2h ago</span>
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

function AdminTable({ columns, rows }: { columns: string[]; rows: string[][] }) {
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
      <div className="admin-pagination">Rows per page: 10 - Pagination ready</div>
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
      <h1>You do not have access to this section</h1>
      <p>Your current role is {role}. Use the "Viewing as" control in the top bar to preview another permission set.</p>
    </section>
  );
}
