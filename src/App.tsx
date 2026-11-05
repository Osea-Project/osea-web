import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownUp,
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  Cloud,
  HardDrive,
  Moon,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  X,
} from "lucide-react";
import {
  demoVirtualMachines,
  type VirtualMachine,
  type VirtualMachineStatus,
} from "./data/virtual-machines";

type StatusFilter = "all" | VirtualMachineStatus;
type Theme = "light" | "dark";

const statusLabels: Record<VirtualMachineStatus, string> = {
  running: "En marche",
  stopped: "Arrêtée",
  unknown: "Inconnue",
};

function App() {
  const [machines, setMachines] = useState(demoVirtualMachines);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [notification, setNotification] = useState("");
  const [isDemoBannerVisible, setIsDemoBannerVisible] = useState(true);
  const [theme, setTheme] = useState<Theme>("light");

  const visibleMachines = useMemo(() => {
    const query = search.trim().toLowerCase();

    return machines.filter((machine) => {
      const matchesSearch =
        machine.name.toLowerCase().includes(query) ||
        machine.id.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "all" || machine.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [machines, search, statusFilter]);

  const runningCount = machines.filter(
    (machine) => machine.status === "running",
  ).length;
  const stoppedCount = machines.filter(
    (machine) => machine.status === "stopped",
  ).length;
  const unavailableCount = machines.filter(
    (machine) => machine.status === "unknown",
  ).length;
  const runningMachines = machines.filter(
    (machine) => machine.status === "running",
  );

  function showNotification(message: string) {
    setNotification(message);
    window.setTimeout(() => setNotification(""), 3500);
  }

  function changePowerState(machine: VirtualMachine) {
    const newStatus = machine.status === "running" ? "stopped" : "running";

    setMachines((currentMachines) =>
      currentMachines.map((currentMachine) =>
        currentMachine.id === machine.id
          ? { ...currentMachine, status: newStatus }
          : currentMachine,
      ),
    );
    showNotification(
      `${machine.name} ${newStatus === "running" ? "démarrée" : "arrêtée"} (simulation).`,
    );
  }

  function refreshInventory() {
    showNotification("Inventaire de démonstration actualisé.");
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
  }

  return (
    <div className="app-shell" data-theme={theme}>
      <header className="topbar">
        <a className="brand" href="#inventory" aria-label="Osea, accueil">
          <span className="brand-mark">
            <Cloud size={20} strokeWidth={2.4} />
          </span>
          <span>
            osea<span className="brand-period">.</span>
          </span>
        </a>

        <nav className="navigation" aria-label="Navigation principale">
          <a className="nav-item active" href="#inventory" aria-current="page">
            <Server size={16} /> Machines
          </a>
        </nav>

        <div className="topbar-actions">
          <span className="connection-pill">
            <span className="connection-indicator" /> Environnement local
          </span>
          <button
            className="icon-button theme-button"
            aria-label={`Activer le thème ${theme === "light" ? "sombre" : "clair"}`}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <button
            className="icon-button help-button"
            aria-label="Aide"
            onClick={() =>
              showNotification(
                "Le centre d’aide sera disponible prochainement.",
              )
            }
          >
            <CircleHelp size={17} />
          </button>
          <div className="topbar-avatar" aria-label="Profil de démonstration">
            O
          </div>
        </div>
      </header>

      <main className="page-content" id="inventory">
        {isDemoBannerVisible && (
          <DemoBanner onClose={() => setIsDemoBannerVisible(false)} />
        )}
        <PageHeading
          runningCount={runningCount}
          totalCount={machines.length}
          onCreate={() =>
            showNotification(
              "La création de VM sera disponible avec l’API du serveur Osea.",
            )
          }
        />
        <SummaryGrid
          total={machines.length}
          running={runningCount}
          stopped={stoppedCount}
          unavailable={unavailableCount}
        />
        <div className="dashboard-grid">
          <InventoryCard
            machines={machines}
            visibleMachines={visibleMachines}
            search={search}
            statusFilter={statusFilter}
            onSearchChange={setSearch}
            onStatusFilterChange={setStatusFilter}
            onRefresh={refreshInventory}
            onSort={() => setMachines((current) => [...current].reverse())}
            onChangePowerState={changePowerState}
            onInfo={showNotification}
            onClearFilters={clearFilters}
          />
          <UsageOverview machines={runningMachines} />
        </div>
        <PageFooter />
      </main>

      {notification && (
        <Toast message={notification} onClose={() => setNotification("")} />
      )}
    </div>
  );
}

function DemoBanner({ onClose }: { onClose: () => void }) {
  return (
    <div className="demo-banner">
      <div className="demo-banner-icon">
        <ShieldCheck size={16} />
      </div>
      <p>
        <strong>Mode démonstration</strong>
        <span>
          Données fictives ; les actions ne démarrent ni n’arrêtent de vraie VM.
        </span>
      </p>
      <button
        className="banner-close"
        aria-label="Fermer le message"
        onClick={onClose}
      >
        <X size={16} />
      </button>
    </div>
  );
}

function PageHeading({
  runningCount,
  totalCount,
  onCreate,
}: {
  runningCount: number;
  totalCount: number;
  onCreate: () => void;
}) {
  return (
    <section className="page-heading">
      <div>
        <div className="eyebrow">
          <span className="eyebrow-dot" /> INFRASTRUCTURE
        </div>
        <h1>Machines virtuelles</h1>
        <p>
          {totalCount} machines · {runningCount} en marche
        </p>
      </div>
      <button className="primary-button" onClick={onCreate}>
        <Plus size={16} /> Nouvelle machine
      </button>
    </section>
  );
}

function SummaryGrid({
  total,
  running,
  stopped,
  unavailable,
}: {
  total: number;
  running: number;
  stopped: number;
  unavailable: number;
}) {
  return (
    <section className="summary-grid" aria-label="Résumé de l’inventaire">
      <SummaryCard
        label="Machines"
        value={total}
        caption="dans cet environnement"
        icon={<Server size={17} />}
        tone="green"
      />
      <SummaryCard
        label="En marche"
        value={running}
        caption="état actuel"
        icon={<Activity size={17} />}
        tone="blue"
      />
      <SummaryCard
        label="Arrêtées"
        value={stopped}
        caption="peuvent démarrer"
        icon={<HardDrive size={17} />}
        tone="amber"
      />
      <SummaryCard
        label="Inconnues"
        value={unavailable}
        caption="état à vérifier"
        icon={<CircleHelp size={17} />}
        tone="slate"
      />
    </section>
  );
}

function SummaryCard({
  label,
  value,
  caption,
  icon,
  tone,
}: {
  label: string;
  value: number;
  caption: string;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <article className="summary-card">
      <div className={`summary-icon ${tone}`}>{icon}</div>
      <div className="summary-label">{label}</div>
      <div className="summary-bottom">
        <strong>{value.toString().padStart(2, "0")}</strong>
        <span>{caption}</span>
      </div>
    </article>
  );
}

function InventoryCard({
  machines,
  visibleMachines,
  search,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onRefresh,
  onSort,
  onChangePowerState,
  onInfo,
  onClearFilters,
}: {
  machines: VirtualMachine[];
  visibleMachines: VirtualMachine[];
  search: string;
  statusFilter: StatusFilter;
  onSearchChange: (search: string) => void;
  onStatusFilterChange: (status: StatusFilter) => void;
  onRefresh: () => void;
  onSort: () => void;
  onChangePowerState: (machine: VirtualMachine) => void;
  onInfo: (message: string) => void;
  onClearFilters: () => void;
}) {
  return (
    <section className="inventory-card" aria-labelledby="inventory-heading">
      <div className="inventory-header">
        <div>
          <h2 id="inventory-heading">Inventaire</h2>
          <p>Utilisation des ressources et état des machines.</p>
        </div>
        <button className="secondary-button" onClick={onRefresh}>
          <ArrowDownUp size={14} /> Actualiser
        </button>
      </div>
      <InventoryToolbar
        search={search}
        statusFilter={statusFilter}
        onSearchChange={onSearchChange}
        onStatusFilterChange={onStatusFilterChange}
        onSort={onSort}
      />
      <MachineTable
        visibleMachines={visibleMachines}
        totalCount={machines.length}
        onChangePowerState={onChangePowerState}
        onInfo={onInfo}
        onClearFilters={onClearFilters}
      />
    </section>
  );
}

function UsageOverview({ machines }: { machines: VirtualMachine[] }) {
  const metrics = [
    { label: "CPU", value: getAverageUsage(machines, "cpuUsagePercent") },
    { label: "RAM", value: getAverageUsage(machines, "memoryUsagePercent") },
    { label: "Disque", value: getAverageUsage(machines, "diskUsagePercent") },
  ];

  return (
    <aside className="usage-overview">
      <div className="usage-overview-header">
        <div>
          <h2>Ressources</h2>
          <p>Moyenne des machines actives</p>
        </div>
        <span className="live-pill">
          <span /> Démo
        </span>
      </div>
      <div
        className="usage-ring"
        style={{
          background: `conic-gradient(var(--accent) ${metrics[0].value}%, var(--surface-hover) 0)`,
        }}
      >
        <div>
          <strong>{metrics[0].value}%</strong>
          <span>CPU moyen</span>
        </div>
      </div>
      <div className="usage-metrics">
        {metrics.slice(1).map((metric) => (
          <ResourceSummary
            key={metric.label}
            label={metric.label}
            value={metric.value}
          />
        ))}
      </div>
      <div className="usage-caption">
        <span>{machines.length} machines actives</span>
        <span>Données fictives</span>
      </div>
    </aside>
  );
}

function getAverageUsage(
  machines: VirtualMachine[],
  key: "cpuUsagePercent" | "memoryUsagePercent" | "diskUsagePercent",
) {
  const values = machines
    .map((machine) => machine[key])
    .filter((value): value is number => value !== null);

  if (values.length === 0) {
    return 0;
  }

  return Math.round(
    values.reduce((total, value) => total + value, 0) / values.length,
  );
}

function ResourceSummary({ label, value }: { label: string; value: number }) {
  return (
    <div className="resource-summary">
      <div className="resource-summary-label">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <span className="summary-track">
        <span style={{ width: `${value}%` }} />
      </span>
    </div>
  );
}

function InventoryToolbar({
  search,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onSort,
}: {
  search: string;
  statusFilter: StatusFilter;
  onSearchChange: (search: string) => void;
  onStatusFilterChange: (status: StatusFilter) => void;
  onSort: () => void;
}) {
  return (
    <div className="toolbar">
      <label className="search-field">
        <Search size={16} />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Filtrer les machines"
          aria-label="Filtrer les machines"
        />
      </label>
      <div className="toolbar-actions">
        <label className="filter-select">
          <SlidersHorizontal size={14} />
          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(event.target.value as StatusFilter)
            }
            aria-label="Filtrer par état"
          >
            <option value="all">Tous les états</option>
            <option value="running">En marche</option>
            <option value="stopped">Arrêtées</option>
            <option value="unknown">Inconnues</option>
          </select>
          <ChevronDown size={13} />
        </label>
        <button className="secondary-button sort-button" onClick={onSort}>
          <ArrowDownUp size={14} /> Trier
        </button>
      </div>
    </div>
  );
}

function MachineTable({
  visibleMachines,
  totalCount,
  onChangePowerState,
  onInfo,
  onClearFilters,
}: {
  visibleMachines: VirtualMachine[];
  totalCount: number;
  onChangePowerState: (machine: VirtualMachine) => void;
  onInfo: (message: string) => void;
  onClearFilters: () => void;
}) {
  return (
    <>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Machine</th>
              <th scope="col">Ressources</th>
              <th scope="col">CPU</th>
              <th scope="col">RAM</th>
              <th scope="col">Disque</th>
              <th scope="col">État</th>
              <th scope="col" className="actions-heading">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleMachines.map((machine) => (
              <MachineRow
                key={machine.id}
                machine={machine}
                onChangePowerState={onChangePowerState}
                onInfo={onInfo}
              />
            ))}
          </tbody>
        </table>
        {visibleMachines.length === 0 && (
          <EmptyState onClearFilters={onClearFilters} />
        )}
      </div>
      <div className="table-footer">
        <span>
          Affichage de <strong>{visibleMachines.length}</strong> sur{" "}
          <strong>{totalCount}</strong> machines
        </span>
        <div className="pagination">
          <button disabled aria-label="Page précédente">
            ←
          </button>
          <button className="page-number" aria-current="page">
            1
          </button>
          <button disabled aria-label="Page suivante">
            →
          </button>
        </div>
      </div>
    </>
  );
}

function MachineRow({
  machine,
  onChangePowerState,
  onInfo,
}: {
  machine: VirtualMachine;
  onChangePowerState: (machine: VirtualMachine) => void;
  onInfo: (message: string) => void;
}) {
  const canReadMetrics = machine.status === "running";

  return (
    <tr>
      <td>
        <div className="machine-name">
          <span className={`machine-icon ${machine.status}`}>
            <Server size={16} />
          </span>
          <span>
            <strong>{machine.name}</strong>
            <small>{machine.id}</small>
          </span>
        </div>
      </td>
      <td>
        <span className="machine-resources">
          {machine.cpuCores} vCPU <span>·</span> {machine.memoryGiB} Go{" "}
          <span>·</span> {machine.diskGiB} Go
        </span>
      </td>
      <td>
        <ResourceMeter
          label="CPU"
          value={canReadMetrics ? machine.cpuUsagePercent : null}
        />
      </td>
      <td>
        <ResourceMeter
          label="RAM"
          value={canReadMetrics ? machine.memoryUsagePercent : null}
        />
      </td>
      <td>
        <ResourceMeter
          label="Disque"
          value={canReadMetrics ? machine.diskUsagePercent : null}
        />
      </td>
      <td>
        <StatusBadge status={machine.status} />
      </td>
      <td>
        <div className="row-actions">
          {machine.status === "unknown" ? (
            <button
              className="row-arrow"
              aria-label={`Détails de ${machine.name}`}
              onClick={() =>
                onInfo("Les métriques réelles attendent l’API centrale Osea.")
              }
            >
              <ArrowRight size={15} />
            </button>
          ) : (
            <button
              className={`power-button ${machine.status}`}
              onClick={() => onChangePowerState(machine)}
              aria-label={`${machine.status === "running" ? "Arrêter" : "Démarrer"} ${machine.name}`}
            >
              <Play size={13} fill="currentColor" />
              {machine.status === "running" ? "Arrêter" : "Démarrer"}
            </button>
          )}
          <button
            className="row-menu"
            aria-label={`Autres actions pour ${machine.name}`}
            onClick={() =>
              onInfo(
                "Les actions seront disponibles avec l’API du serveur Osea.",
              )
            }
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ResourceMeter({
  label,
  value,
}: {
  label: string;
  value: number | null;
}) {
  if (value === null) {
    return (
      <span className="metric-unavailable" aria-label={`${label} indisponible`}>
        —
      </span>
    );
  }

  const tone = value >= 80 ? "high" : value >= 60 ? "medium" : "normal";

  return (
    <div
      className="resource-meter"
      role="meter"
      aria-label={`${label} utilisé`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    >
      <span className="resource-track">
        <span
          className={`resource-fill ${tone}`}
          style={{ width: `${value}%` }}
        />
      </span>
      <span className="resource-value">{value} %</span>
    </div>
  );
}

function StatusBadge({ status }: { status: VirtualMachineStatus }) {
  return (
    <span className={`status-badge ${status}`}>
      <span /> {statusLabels[status]}
    </span>
  );
}

function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="empty-state">
      <Search size={20} />
      <strong>Aucune machine trouvée</strong>
      <span>Essaie un autre nom ou modifie les filtres.</span>
      <button className="text-button" onClick={onClearFilters}>
        Effacer les filtres
      </button>
    </div>
  );
}

function PageFooter() {
  return (
    <footer className="page-footer">
      <span>
        <span className="footer-status-dot" /> Interface locale
      </span>
      <span>Données de démonstration · Osea v0.1</span>
    </footer>
  );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="toast" role="status">
      <span className="toast-check">
        <Check size={14} />
      </span>
      {message}
      <button aria-label="Fermer" onClick={onClose}>
        <X size={14} />
      </button>
    </div>
  );
}

export default App;
