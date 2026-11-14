/* ============================================================
   app.js — connects the page to the logic in tickets.js.

   1. STATE    the list of tickets, loaded from / saved to localStorage
   2. RENDER   draws the numbers and the ticket list from the state
   3. EVENTS   form submit, filters, status buttons, export, sample data

   Every change follows the same path:
       change the state -> save() -> render()
   ============================================================ */
import {
  PRIORITIES, STATUSES, CATEGORIES,
  createTicket, validate, setStatus, isOverdue, slaText,
  filterTickets, sortTickets, stats, toCsv, sampleTickets,
} from "./tickets.js";

/* ---------- 1. STATE ---------- */
const STORAGE_KEY = "helpdesk-tickets-v1";
let tickets = load();
const filters = { status: "", priority: "", query: "" };

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (e) {
    return [];               // nothing saved yet, or storage is blocked
  }
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets)); } catch (e) { /* private mode */ }
}

/* ---------- small helpers ---------- */
const $ = (id) => document.getElementById(id);

/* Create an element. Text always goes through textContent, never innerHTML,
   so whatever a user types in a ticket can never run as HTML or script. */
function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === "text") node.textContent = value;
    else if (key === "class") node.className = value;
    else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value);
  }
  children.forEach((c) => c && node.append(c));
  return node;
}

const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

/* ---------- 2. RENDER ---------- */
function renderStats() {
  const s = stats(tickets);
  $("stat-open").textContent = s.open;
  $("stat-progress").textContent = s.inProgress;
  $("stat-overdue").textContent = s.overdue;
  $("stat-sla").textContent = s.slaRate === null ? "–" : s.slaRate + "%";
}

function ticketCard(t) {
  const overdue = isOverdue(t);
  // The buttons offered depend on the current status.
  const actions = {
    open: [["Start work", "in_progress"], ["Resolve", "resolved"]],
    in_progress: [["Resolve", "resolved"], ["Back to open", "open"]],
    resolved: [["Reopen", "open"]],
  }[t.status];

  return el("li", { class: `ticket ${t.status}${overdue ? " overdue" : ""}` }, [
    el("div", { class: "ticket-top" }, [
      el("span", { class: "id", text: t.id }),
      el("span", { class: `pill ${t.priority}`, text: PRIORITIES[t.priority].label }),
      el("span", { class: "pill status", text: STATUSES[t.status].label }),
      el("span", { class: "sla", text: slaText(t) }),
    ]),
    el("h3", { text: t.title }),
    t.description ? el("p", { class: "desc", text: t.description }) : null,
    el("p", { class: "meta", text: `${t.requester} · ${t.category} · opened ${formatDate(t.createdAt)} · due ${formatDate(t.dueAt)}` }),
    el("div", { class: "actions" }, [
      ...actions.map(([label, status]) =>
        el("button", { type: "button", text: label, onclick: () => changeStatus(t.id, status) })),
      el("button", { type: "button", class: "danger", text: "Delete", onclick: () => removeTicket(t.id) }),
    ]),
  ]);
}

function render() {
  renderStats();
  const visible = sortTickets(filterTickets(tickets, filters));
  const list = $("list");
  list.replaceChildren(...visible.map(ticketCard));
  $("empty").hidden = visible.length > 0;
  $("empty").textContent = tickets.length
    ? "No tickets match these filters."
    : "No tickets yet. Create one, or load the sample data.";
  $("count").textContent = `${visible.length} of ${tickets.length}`;
}

/* ---------- 3. EVENTS ---------- */
function changeStatus(id, status) {
  tickets = tickets.map((t) => (t.id === id ? setStatus(t, status) : t));
  save(); render();
}

function removeTicket(id) {
  tickets = tickets.filter((t) => t.id !== id);
  save(); render();
}

$("form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = Object.fromEntries(new FormData(event.target));
  const errors = validate(input);
  $("errors").textContent = errors.join(" ");
  if (errors.length) return;
  tickets = [...tickets, createTicket(input, tickets)];
  save(); render();
  event.target.reset();
  $("priority").value = "medium";     // reset() goes back to the first option, so set the default again
  $("title").focus();
});

$("f-status").addEventListener("change", (e) => { filters.status = e.target.value; render(); });
$("f-priority").addEventListener("change", (e) => { filters.priority = e.target.value; render(); });
$("f-query").addEventListener("input", (e) => { filters.query = e.target.value; render(); });

$("sample").addEventListener("click", () => {
  tickets = sampleTickets();
  save(); render();
});

$("export").addEventListener("click", () => {
  // Build the CSV in memory and hand it to the browser as a download.
  const blob = new Blob(["﻿" + toCsv(tickets)], { type: "text/csv;charset=utf-8" });
  const link = el("a", { href: URL.createObjectURL(blob), download: "tickets.csv" });
  link.click();
  URL.revokeObjectURL(link.href);
});

/* Fill the dropdowns from the same lists the logic uses, so they can never disagree. */
function fillSelect(id, entries, placeholder) {
  $(id).replaceChildren(
    ...(placeholder ? [el("option", { value: "", text: placeholder })] : []),
    ...entries.map(([value, label]) => el("option", { value, text: label })));
}
const priorityEntries = Object.entries(PRIORITIES).map(([k, v]) => [k, `${v.label} (${v.slaHours}h)`]);
fillSelect("priority", priorityEntries);
fillSelect("category", CATEGORIES.map((c) => [c, c]));
fillSelect("f-priority", Object.entries(PRIORITIES).map(([k, v]) => [k, v.label]), "All priorities");
fillSelect("f-status", Object.entries(STATUSES).map(([k, v]) => [k, v.label]), "All statuses");
$("priority").value = "medium";

render();
setInterval(render, 60 * 1000);   // keep the "time left" text up to date
