/* ============================================================
   tickets.js — the "business logic" of the help desk.

   Nothing in this file touches the page (no document, no
   localStorage). Every function takes data in and returns data
   out, which is why it can be tested with plain Node:

       node --test

   app.js is the only file that reads the form, draws the list
   and saves to the browser.
   ============================================================ */

/* Each priority has a target resolution time (SLA) in hours. */
export const PRIORITIES = {
  critical: { label: "Critical", slaHours: 4, rank: 0 },
  high:     { label: "High",     slaHours: 8, rank: 1 },
  medium:   { label: "Medium",   slaHours: 24, rank: 2 },
  low:      { label: "Low",      slaHours: 72, rank: 3 },
};

export const STATUSES = {
  open:        { label: "Open" },
  in_progress: { label: "In progress" },
  resolved:    { label: "Resolved" },
};

export const CATEGORIES = ["Hardware", "Software", "Network", "Account & access", "Email", "Other"];

const HOUR = 60 * 60 * 1000;

/* Next ticket number: INC-0001, INC-0002 ... based on the highest existing one. */
export function nextId(tickets) {
  const highest = tickets.reduce((max, t) => Math.max(max, Number(t.id.replace("INC-", "")) || 0), 0);
  return "INC-" + String(highest + 1).padStart(4, "0");
}

/* Check the form values. Returns a list of problems; an empty list means "valid". */
export function validate(input) {
  const errors = [];
  if (!input.title || input.title.trim().length < 5) errors.push("Title must be at least 5 characters.");
  if (!input.requester || !input.requester.trim()) errors.push("Requester is required.");
  if (!PRIORITIES[input.priority]) errors.push("Choose a priority.");
  if (!CATEGORIES.includes(input.category)) errors.push("Choose a category.");
  return errors;
}

/* Build a new ticket. The due time comes from the priority's SLA. */
export function createTicket(input, tickets, now = new Date()) {
  const errors = validate(input);
  if (errors.length) throw new Error(errors.join(" "));
  return {
    id: nextId(tickets),
    title: input.title.trim(),
    requester: input.requester.trim(),
    category: input.category,
    priority: input.priority,
    description: (input.description || "").trim(),
    status: "open",
    createdAt: now.toISOString(),
    dueAt: new Date(now.getTime() + PRIORITIES[input.priority].slaHours * HOUR).toISOString(),
    resolvedAt: null,
  };
}

/* Return a copy of the ticket with a new status (the original is not changed). */
export function setStatus(ticket, status, now = new Date()) {
  if (!STATUSES[status]) throw new Error("Unknown status: " + status);
  return { ...ticket, status, resolvedAt: status === "resolved" ? now.toISOString() : null };
}

/* A ticket is overdue when it is not resolved and its due time has passed. */
export function isOverdue(ticket, now = new Date()) {
  return ticket.status !== "resolved" && new Date(ticket.dueAt) < now;
}

/* Did a resolved ticket meet its SLA? */
export function metSla(ticket) {
  return ticket.status === "resolved" && new Date(ticket.resolvedAt) <= new Date(ticket.dueAt);
}

/* "3h 20m left", "overdue by 1h 05m", "resolved in time", "resolved late" */
export function slaText(ticket, now = new Date()) {
  if (ticket.status === "resolved") return metSla(ticket) ? "Resolved within SLA" : "Resolved after SLA";
  const diff = new Date(ticket.dueAt) - now;
  const mins = Math.floor(Math.abs(diff) / 60000);
  const text = `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, "0")}m`;
  return diff >= 0 ? `${text} left` : `Overdue by ${text}`;
}

/* Keep only the tickets that match the filters. Empty filter = no restriction. */
export function filterTickets(tickets, { status = "", priority = "", query = "" } = {}) {
  const q = query.trim().toLowerCase();
  return tickets.filter((t) =>
    (!status || t.status === status) &&
    (!priority || t.priority === priority) &&
    (!q || [t.id, t.title, t.requester, t.category, t.description].some((v) => v.toLowerCase().includes(q))));
}

/* Order of work: unresolved first, then overdue, then highest priority, then earliest due. */
export function sortTickets(tickets, now = new Date()) {
  return [...tickets].sort((a, b) =>
    (a.status === "resolved") - (b.status === "resolved") ||
    isOverdue(b, now) - isOverdue(a, now) ||
    PRIORITIES[a.priority].rank - PRIORITIES[b.priority].rank ||
    new Date(a.dueAt) - new Date(b.dueAt));
}

/* The numbers shown at the top of the page. */
export function stats(tickets, now = new Date()) {
  const resolved = tickets.filter((t) => t.status === "resolved");
  return {
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in_progress").length,
    overdue: tickets.filter((t) => isOverdue(t, now)).length,
    resolved: resolved.length,
    // percentage of resolved tickets that met their SLA (null when nothing is resolved yet)
    slaRate: resolved.length ? Math.round((resolved.filter(metSla).length / resolved.length) * 100) : null,
  };
}

/* One CSV cell. Quotes are doubled, and a cell that starts with = + - @ gets a
   leading apostrophe so Excel does not run it as a formula (CSV injection). */
function csvCell(value) {
  let text = String(value ?? "");
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return '"' + text.replace(/"/g, '""') + '"';
}

export function toCsv(tickets) {
  const columns = ["id", "title", "requester", "category", "priority", "status", "createdAt", "dueAt", "resolvedAt", "description"];
  const rows = tickets.map((t) => columns.map((c) => csvCell(t[c])).join(","));
  return [columns.join(","), ...rows].join("\r\n");
}

/* Example tickets for the "Load sample data" button. Times are relative to now. */
export function sampleTickets(now = new Date()) {
  const ago = (hours) => new Date(now.getTime() - hours * HOUR);
  const list = [];
  const add = (input, hoursAgo, status, resolvedHoursAgo) => {
    let t = createTicket(input, list, ago(hoursAgo));
    if (status !== "open") t = setStatus(t, status, ago(resolvedHoursAgo ?? 0));
    list.push(t);
  };
  add({ title: "Cannot connect to the office VPN", requester: "Maria P.", category: "Network", priority: "high", description: "Error 809 since this morning, working from home." }, 3, "in_progress");
  add({ title: "Finance shared mailbox not receiving email", requester: "Nikos K.", category: "Email", priority: "critical", description: "No new messages since 09:00." }, 5, "open");
  add({ title: "New starter needs laptop and accounts", requester: "HR", category: "Account & access", priority: "medium", description: "Starts Monday. Needs M365 licence and Teams." }, 20, "open");
  add({ title: "Printer on 2nd floor jams on duplex", requester: "Eleni S.", category: "Hardware", priority: "low", description: "" }, 30, "open");
  add({ title: "Excel crashes when opening large files", requester: "Giorgos T.", category: "Software", priority: "medium", description: "Repaired Office, fixed." }, 26, "resolved", 10);
  add({ title: "Password reset for locked account", requester: "Anna D.", category: "Account & access", priority: "high", description: "Unlocked in Active Directory." }, 12, "resolved", 1);
  return list;
}
