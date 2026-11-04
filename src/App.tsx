import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownUp,
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  Cloud,
  Cpu,
  HardDrive,
  LayoutDashboard,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  demoVirtualMachines,
  type VirtualMachine,
  type VirtualMachineStatus,
} from "./data/virtual-machines";

type StatusFilter = "all" | VirtualMachineStatus;

const statusLabels: Record<VirtualMachineStatus, string> = {
  running: "En cours",
  stopped: "Arrêtée",
  unknown: "Indisponible",
};

function App() {
  const [machines, setMachines] = useState(demoVirtualMachines);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [notification, setNotification] = useState("");
  const [isDemoBannerVisible, setIsDemoBannerVisible] = useState(true);

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

  function showNotification(message: string) {
    setNotification(message);
    window.setTimeout(() => setNotification(""), 3500);
  }

  function startMachine(machine: VirtualMachine) {
    setMachines((currentMachines) =>
      currentMachines.map((currentMachine) =>
        currentMachine.id === machine.id
          ? { ...currentMachine, status: "running" }
          : currentMachine,
      ),
    );
    showNotification(`${machine.name} est démarrée (simulation).`);
  }

  function refreshInventory() {
    showNotification("Inventaire de démonstration actualisé.");
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
  }

  return (
    <div className="app-shell">
      <Sidebar machineCount={machines.length} />
      <main className="main-content" id="inventory">
        <Topbar
          onHelp={() =>
            showNotification("Le centre d’aide sera disponible prochainement.")
          }
        />
        <div className="page-content">
          {isDemoBannerVisible && (
            <DemoBanner onClose={() => setIsDemoBannerVisible(false)} />
          )}
          <PageHeading
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
          <InventoryCard
            machines={machines}
            visibleMachines={visibleMachines}
            search={search}
            statusFilter={statusFilter}
            onSearchChange={setSearch}
            onStatusFilterChange={setStatusFilter}
            onRefresh={refreshInventory}
            onSort={() => setMachines((current) => [...current].reverse())}
            onStart={startMachine}
            onInfo={showNotification}
            onClearFilters={clearFilters}
          />
          <PageFooter />
        </div>
      </main>
      {notification && (
        <Toast message={notification} onClose={() => setNotification("")} />
      )}
    </div>
  );
}

function Sidebar({ machineCount }: { machineCount: number }) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#inventory" aria-label="Osea, accueil">
        <span className="brand-mark">
          <Cloud size={21} strokeWidth={2.4} />
        </span>
        <span>
          osea<span className="brand-period">.</span>
        </span>
      </a>

      <div className="workspace-switcher">
        <span className="workspace-icon">
          <LayoutDashboard size={17} />
        </span>
        <span className="workspace-name">
          <strong>Espace équipe</strong>
          <small>Infrastructure</small>
        </span>
        <ChevronDown size={15} className="muted-icon" />
      </div>

      <div className="sidebar-label">ESPACE DE TRAVAIL</div>
      <nav className="navigation" aria-label="Navigation principale">
        <a className="nav-item" href="#summary">
          <LayoutDashboard size={17} /> Vue d’ensemble
        </a>
        <a className="nav-item active" href="#inventory">
          <Server size={17} /> Machines virtuelles
          <span className="nav-count">{machineCount}</span>
        </a>
      </nav>

      <div className="sidebar-label infrastructure-label">INFRASTRUCTURE</div>
      <div className="connection-card">
        <span className="connection-indicator" />
        <div>
          <strong>Environnement de test</strong>
          <small>Mode démonstration</small>
        </div>
        <MoreHorizontal size={17} className="muted-icon" />
      </div>

      <div className="sidebar-bottom">
        <div className="profile-card">
          <div className="avatar">AD</div>
          <div className="profile-name">
            <strong>Administrateur</strong>
            <small>Compte de démonstration</small>
          </div>
          <MoreHorizontal size={17} className="muted-icon" />
        </div>
      </div>
    </aside>
  );
}

function Topbar({ onHelp }: { onHelp: () => void }) {
  return (
    <header className="topbar">
      <div className="breadcrumbs">
        <span>Infrastructure</span>
        <span className="breadcrumb-slash">/</span>
        <strong>Machines virtuelles</strong>
      </div>
      <div className="topbar-actions">
        <span className="environment-pill">
          <span className="connection-indicator" /> Démonstration
        </span>
        <button className="icon-button" aria-label="Aide" onClick={onHelp}>
          <CircleHelp size={18} />
        </button>
        <div className="topbar-avatar">AD</div>
      </div>
    </header>
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
          Ces machines sont des exemples ; aucune action ne touche un
          hyperviseur.
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

function PageHeading({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="page-heading">
      <div>
        <div className="eyebrow">
          <span className="eyebrow-dot" /> VOTRE INFRASTRUCTURE
        </div>
        <h1>Machines virtuelles</h1>
        <p>Consultez et gérez les machines de votre environnement.</p>
      </div>
      <button className="primary-button" onClick={onCreate}>
        <Plus size={17} /> Nouvelle machine
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
    <section
      className="summary-grid"
      id="summary"
      aria-label="Résumé de l’inventaire"
    >
      <SummaryCard
        label="Machines au total"
        value={total}
        caption="dans cet environnement"
        icon={<Server size={18} />}
        tone="blue"
      />
      <SummaryCard
        label="En cours d’exécution"
        value={running}
        caption="prêtes à l’emploi"
        icon={<Activity size={18} />}
        tone="green"
      />
      <SummaryCard
        label="Arrêtées"
        value={stopped}
        caption="peuvent être démarrées"
        icon={<HardDrive size={18} />}
        tone="amber"
      />
      <SummaryCard
        label="Indisponibles"
        value={unavailable}
        caption="état à vérifier"
        icon={<Cpu size={18} />}
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
  onStart,
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
  onStart: (machine: VirtualMachine) => void;
  onInfo: (message: string) => void;
  onClearFilters: () => void;
}) {
  return (
    <section className="inventory-card" aria-labelledby="inventory-heading">
      <div className="inventory-header">
        <div>
          <h2 id="inventory-heading">Inventaire</h2>
          <p>Les machines accessibles depuis votre environnement.</p>
        </div>
        <button className="secondary-button refresh-button" onClick={onRefresh}>
          <ArrowDownUp size={15} /> Actualiser
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
        onStart={onStart}
        onInfo={onInfo}
        onClearFilters={onClearFilters}
      />
    </section>
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
        <Search size={17} />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Rechercher une machine..."
          aria-label="Rechercher une machine"
        />
        <kbd>/</kbd>
      </label>
      <div className="toolbar-actions">
        <label className="filter-select">
          <SlidersHorizontal size={15} />
          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(event.target.value as StatusFilter)
            }
            aria-label="Filtrer par état"
          >
            <option value="all">Tous les états</option>
            <option value="running">En cours</option>
            <option value="stopped">Arrêtées</option>
            <option value="unknown">Indisponibles</option>
          </select>
          <ChevronDown size={14} />
        </label>
        <button className="secondary-button sort-button" onClick={onSort}>
          <ArrowDownUp size={15} /> Trier
        </button>
      </div>
    </div>
  );
}

function MachineTable({
  visibleMachines,
  totalCount,
  onStart,
  onInfo,
  onClearFilters,
}: {
  visibleMachines: VirtualMachine[];
  totalCount: number;
  onStart: (machine: VirtualMachine) => void;
  onInfo: (message: string) => void;
  onClearFilters: () => void;
}) {
  return (
    <>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  aria-label="Sélectionner toutes les machines"
                />
              </th>
              <th>
                Nom <span className="table-sort">↕</span>
              </th>
              <th>Identifiant</th>
              <th>État</th>
              <th>Type</th>
              <th className="actions-heading">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleMachines.map((machine) => (
              <MachineRow
                key={machine.id}
                machine={machine}
                onStart={onStart}
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
  onStart,
  onInfo,
}: {
  machine: VirtualMachine;
  onStart: (machine: VirtualMachine) => void;
  onInfo: (message: string) => void;
}) {
  return (
    <tr>
      <td>
        <input type="checkbox" aria-label={`Sélectionner ${machine.name}`} />
      </td>
      <td>
        <div className="machine-name">
          <span className={`machine-icon ${machine.status}`}>
            <Server size={16} />
          </span>
          <strong>{machine.name}</strong>
        </div>
      </td>
      <td>
        <span className="machine-id">{machine.id}</span>
      </td>
      <td>
        <span className={`status-badge ${machine.status}`}>
          <span />
          {statusLabels[machine.status]}
        </span>
      </td>
      <td>
        <span className="machine-type">Machine virtuelle</span>
      </td>
      <td>
        <div className="row-actions">
          {machine.status === "stopped" ? (
            <button className="start-button" onClick={() => onStart(machine)}>
              <Play size={13} fill="currentColor" /> Démarrer
            </button>
          ) : (
            <button
              className="row-arrow"
              aria-label={`Détails de ${machine.name}`}
              onClick={() =>
                onInfo(
                  `Les détails de ${machine.name} seront disponibles avec l’API du serveur Osea.`,
                )
              }
            >
              <ArrowRight size={16} />
            </button>
          )}
          <button
            className="row-menu"
            aria-label={`Autres actions pour ${machine.name}`}
            onClick={() =>
              onInfo(
                `Les actions pour ${machine.name} seront disponibles avec l’API du serveur Osea.`,
              )
            }
          >
            <MoreHorizontal size={17} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="empty-state">
      <Search size={21} />
      <strong>Aucune machine trouvée</strong>
      <span>Essayez un autre nom ou modifiez les filtres.</span>
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
        <span className="footer-status-dot" /> Mode démonstration actif
      </span>
      <span>
        Inventaire fictif <span className="footer-divider">·</span> Osea v0.1
      </span>
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
        <X size={15} />
      </button>
    </div>
  );
}

export default App;
