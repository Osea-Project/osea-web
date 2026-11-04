export type VirtualMachineStatus = "running" | "stopped" | "unknown";

export type VirtualMachine = {
  id: string;
  name: string;
  status: VirtualMachineStatus;
};

export const demoVirtualMachines: VirtualMachine[] = [
  { id: "vm-100", name: "atlas-web-01", status: "running" },
  { id: "vm-101", name: "atlas-db-01", status: "running" },
  { id: "vm-102", name: "orion-api-02", status: "stopped" },
  { id: "vm-103", name: "orion-worker-01", status: "running" },
  { id: "vm-104", name: "nova-staging-01", status: "unknown" },
  { id: "vm-105", name: "atlas-backup-01", status: "stopped" },
];
