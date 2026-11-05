export type VirtualMachineStatus = "running" | "stopped" | "unknown";

export type VirtualMachine = {
  id: string;
  name: string;
  status: VirtualMachineStatus;
  cpuCores: number;
  cpuUsagePercent: number | null;
  memoryGiB: number;
  memoryUsagePercent: number | null;
  diskGiB: number;
  diskUsagePercent: number | null;
};

export const demoVirtualMachines: VirtualMachine[] = [
  {
    id: "vm-100",
    name: "atlas-web-01",
    status: "running",
    cpuCores: 4,
    cpuUsagePercent: 32,
    memoryGiB: 8,
    memoryUsagePercent: 67,
    diskGiB: 80,
    diskUsagePercent: 46,
  },
  {
    id: "vm-101",
    name: "atlas-db-01",
    status: "running",
    cpuCores: 8,
    cpuUsagePercent: 58,
    memoryGiB: 16,
    memoryUsagePercent: 74,
    diskGiB: 160,
    diskUsagePercent: 82,
  },
  {
    id: "vm-102",
    name: "orion-api-02",
    status: "stopped",
    cpuCores: 2,
    cpuUsagePercent: null,
    memoryGiB: 4,
    memoryUsagePercent: null,
    diskGiB: 60,
    diskUsagePercent: null,
  },
  {
    id: "vm-103",
    name: "orion-worker-01",
    status: "running",
    cpuCores: 4,
    cpuUsagePercent: 19,
    memoryGiB: 8,
    memoryUsagePercent: 38,
    diskGiB: 100,
    diskUsagePercent: 23,
  },
  {
    id: "vm-104",
    name: "nova-staging-01",
    status: "unknown",
    cpuCores: 2,
    cpuUsagePercent: null,
    memoryGiB: 4,
    memoryUsagePercent: null,
    diskGiB: 40,
    diskUsagePercent: null,
  },
  {
    id: "vm-105",
    name: "atlas-backup-01",
    status: "stopped",
    cpuCores: 2,
    cpuUsagePercent: null,
    memoryGiB: 4,
    memoryUsagePercent: null,
    diskGiB: 120,
    diskUsagePercent: null,
  },
];
