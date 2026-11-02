/*
 * Protótipo da interface do app de controle de candidaturas.
 *
 * - Telas e comportamentos: specs/design/ui.md
 * - Cores, fontes, ícones e componentes: specs/design/design.md
 * - Regras de negócio e formato dos dados: specs/domain.md e specs/api.md
 *
 * Não há servidor: os dados ficam no localStorage e a "api" abaixo imita as regras da API real
 * (mudar status gera evento, currículo em uso não pode ser excluído etc.).
 */
"use strict";

/* ==========================================================================
   Constantes
   ========================================================================== */

const STATUSES = [
  { value: "applied", label: "Inscrito", type: "active" },
  { value: "screening", label: "Em análise / Triagem", type: "active" },
  { value: "interview", label: "Entrevista", type: "active" },
  { value: "technical_test", label: "Teste técnico / Case", type: "active" },
  { value: "offer", label: "Proposta", type: "active" },
  { value: "accepted", label: "Aprovado / Aceito", type: "closed" },
  { value: "rejected", label: "Reprovado", type: "closed" },
  { value: "withdrawn", label: "Desisti", type: "closed" },
  { value: "no_response", label: "Sem retorno", type: "closed" },
];
const STATUS = Object.fromEntries(STATUSES.map((status) => [status.value, status]));

const WORK_MODELS = { remote: "Remoto", hybrid: "Híbrido", onsite: "Presencial" };

const STORAGE_KEY = "candidaturas-prototype-db-v1";
const LAST_RESUME_KEY = "candidaturas-prototype-last-resume";
const THEME_KEY = "candidaturas-prototype-theme";
const DAY = 24 * 60 * 60 * 1000;

/** Ícones do Lucide (lucide.dev, licença ISC), copiados do pacote lucide@0.460.0. */
const ICONS = {
  board: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 7v7"/><path d="M12 7v4"/><path d="M16 7v9"/>', // square-kanban
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>', // file-text
  chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>', // chart-column
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>', // plus
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>', // search
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', // x
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>', // trash-2
  pencil: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>', // pencil
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>', // arrow-right
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>', // message-square
  check: '<path d="M20 6 9 17l-5-5"/>', // check
  external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>', // external-link
  remote: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>', // house
  onsite: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>', // building-2
  hybrid: '<path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/>', // shuffle
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>', // upload
  created: '<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>', // circle-plus
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', // clock
  chevronDown: '<path d="m6 9 6 6 6-6"/>', // chevron-down
  chevronRight: '<path d="m9 18 6-6-6-6"/>', // chevron-right
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>', // info
  alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>', // triangle-alert
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>', // moon
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>', // sun
  reset: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>', // rotate-ccw
};

const icon = (name, className = "icon") =>
  `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;

/* ==========================================================================
   Utilidades
   ========================================================================== */

const esc = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char],
  );

/** "2026-11-02" na data local. */
const todayStr = () => new Date().toLocaleDateString("sv");

const daysAgoStr = (days) => new Date(Date.now() - days * DAY).toLocaleDateString("sv");

const daysAgoIso = (days, hour = 10) => {
  const date = new Date(Date.now() - days * DAY);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

/** "02/11/2026" a partir de "2026-11-02". */
const formatDate = (ymd) => {
  if (!ymd) return "";
  const [year, month, day] = ymd.split("-");
  return `${day}/${month}/${year}`;
};

const formatDateTime = (iso) =>
  new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** "hoje", "ontem", "há 3 dias", "há 2 semanas", "há 3 meses". */
const relative = (iso) => {
  const days = Math.round((startOfDay(new Date()) - startOfDay(new Date(iso))) / DAY);
  if (days <= 0) return "hoje";
  if (days === 1) return "ontem";
  if (days < 7) return `há ${days} dias`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `há ${weeks} ${weeks === 1 ? "semana" : "semanas"}`;
  }
  const months = Math.floor(days / 30);
  return `há ${months} ${months === 1 ? "mês" : "meses"}`;
};

/** Valor para <input type="datetime-local"> a partir de um ISO. */
const toLocalInput = (iso) => {
  const date = new Date(iso);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;

const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* sem armazenamento: o protótipo funciona só em memória */
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* idem */
    }
  },
};

/* ==========================================================================
   Dados de exemplo
   ========================================================================== */

function seed() {
  const db = { seq: 0, resumes: [], applications: [], events: [] };
  const id = () => ++db.seq;

  const resume = (name, description, fileName, daysAgo) => {
    const item = {
      id: id(),
      name,
      description,
      file_name: fileName,
      file_path: `exemplo-${db.seq}.pdf`,
      created_at: daysAgoIso(daysAgo),
      updated_at: daysAgoIso(daysAgo),
    };
    db.resumes.push(item);
    return item.id;
  };

  const backend = resume("Backend Sênior", "Foco em Node.js, arquitetura e mensageria", "backend-senior.pdf", 60);
  const english = resume("Fullstack — Inglês", "Versão em inglês para vagas internacionais", "fullstack-en.pdf", 40);
  resume("Tech Lead", null, "tech-lead.pdf", 5);

  const application = (data) => {
    const { history = [], notes = [], applied, ...fields } = data;
    const appId = id();
    const createdAt = daysAgoIso(applied, 9);
    let status = "applied";
    db.events.push({
      id: id(),
      application_id: appId,
      type: "created",
      from_status: null,
      to_status: status,
      note: null,
      occurred_at: createdAt,
      created_at: createdAt,
    });
    for (const [nextStatus, daysAgo] of history) {
      const at = daysAgoIso(daysAgo, 14);
      db.events.push({
        id: id(),
        application_id: appId,
        type: "status_change",
        from_status: status,
        to_status: nextStatus,
        note: null,
        occurred_at: at,
        created_at: at,
      });
      status = nextStatus;
    }
    for (const [note, daysAgo] of notes) {
      const at = daysAgoIso(daysAgo, 16);
      db.events.push({
        id: id(),
        application_id: appId,
        type: "note",
        from_status: null,
        to_status: null,
        note,
        occurred_at: at,
        created_at: at,
      });
    }
    const lastEvent = Math.min(applied, ...history.map((h) => h[1]), ...notes.map((n) => n[1]));
    db.applications.push({
      id: appId,
      job_url: null,
      source: null,
      resume_id: null,
      salary: null,
      work_model: null,
      location: null,
      contacts: null,
      notes: null,
      ...fields,
      applied_at: daysAgoStr(applied),
      status,
      created_at: createdAt,
      updated_at: daysAgoIso(lastEvent, 17),
    });
  };

  application({
    company: "Nimbus Pay",
    role: "Engenheiro de Software Sênior",
    applied: 18,
    resume_id: backend,
    work_model: "remote",
    source: "LinkedIn",
    salary: "R$ 16.000",
    job_url: "https://example.com/vagas/nimbus-pay",
    contacts: "Marina (recrutadora) — marina@nimbuspay.example",
    history: [["screening", 12], ["interview", 5]],
    notes: [["Entrevista técnica com o time de pagamentos na sexta, 10h.", 4]],
  });
  application({ company: "Pedra Fintech", role: "Desenvolvedor Backend", applied: 2, resume_id: backend, work_model: "hybrid", source: "Site da empresa", location: "São Paulo, SP" });
  application({ company: "Garfo Delivery", role: "Backend Engineer", applied: 9, resume_id: english, work_model: "remote", source: "Indicação", history: [["screening", 6]] });
  application({
    company: "Mercado Aberto",
    role: "Senior Software Engineer",
    applied: 15,
    resume_id: english,
    work_model: "remote",
    source: "LinkedIn",
    history: [["screening", 11], ["interview", 7], ["technical_test", 2]],
    notes: [["Case: API de carrinho de compras, prazo de 5 dias.", 2]],
  });
  application({
    company: "Casa Quinta",
    role: "Engenheiro de Software",
    applied: 30,
    resume_id: backend,
    work_model: "hybrid",
    location: "São Paulo, SP",
    salary: "R$ 18.000",
    history: [["screening", 25], ["interview", 20], ["technical_test", 14], ["offer", 1]],
    notes: [["Proposta: R$ 18.000 CLT, início em dezembro.", 1]],
  });
  application({ company: "Banco Horizonte", role: "Desenvolvedor Node.js", applied: 5, resume_id: backend, work_model: "onsite", location: "Rio de Janeiro, RJ", source: "Gupy" });
  application({
    company: "Crédito Fácil",
    role: "Backend Developer",
    applied: 40,
    resume_id: backend,
    work_model: "remote",
    history: [["screening", 35], ["rejected", 20]],
    notes: [["Feedback: buscavam mais experiência com Kotlin.", 20]],
  });
  application({ company: "PayFlow", role: "Software Engineer", applied: 45, resume_id: english, work_model: "remote", history: [["no_response", 10]] });
  application({
    company: "Hotlearn",
    role: "Tech Lead Backend",
    applied: 28,
    resume_id: backend,
    work_model: "hybrid",
    location: "Belo Horizonte, MG",
    history: [["screening", 22], ["withdrawn", 15]],
    notes: [["Desisti: a vaga exigia mudança para BH.", 15]],
  });
  application({ company: "Lar Imóveis", role: "Desenvolvedor Fullstack", applied: 1, work_model: "remote", source: "LinkedIn" });
  application({ company: "Vortex Commerce", role: "Backend Engineer", applied: 20, resume_id: english, work_model: "remote", history: [["screening", 14], ["interview", 6]] });
  application({
    company: "Olimpo Varejo",
    role: "Desenvolvedor Backend Pleno",
    applied: 70,
    resume_id: backend,
    work_model: "hybrid",
    history: [["screening", 65], ["interview", 60], ["offer", 55], ["accepted", 50]],
  });

  return db;
}

function loadDb() {
  const raw = storage.get(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      /* dados corrompidos: volta para o exemplo */
    }
  }
  return seed();
}

let db = loadDb();
/** PDFs enviados nesta sessão (não vão para o localStorage). */
const uploadedFiles = new Map();

const persist = () => storage.set(STORAGE_KEY, JSON.stringify(db));

/* ==========================================================================
   "API": as mesmas regras da API real, em memória
   ========================================================================== */

class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const notFound = (what) => new ApiError(404, "not_found", `${what} não encontrado(a).`);
const nowIso = () => new Date().toISOString();
const nextId = () => ++db.seq;

const findApplication = (id) => db.applications.find((application) => application.id === id);
const findResume = (id) => db.resumes.find((resume) => resume.id === id);
const eventsOf = (applicationId) =>
  db.events
    .filter((event) => event.application_id === applicationId)
    .sort((a, b) => b.occurred_at.localeCompare(a.occurred_at) || b.id - a.id);
const lastEventAt = (application) => eventsOf(application.id)[0]?.occurred_at ?? application.created_at;
const usageOf = (resumeId) => db.applications.filter((application) => application.resume_id === resumeId);

const touch = (application) => {
  application.updated_at = nowIso();
};

const createEvent = (applicationId, data) => {
  const event = {
    id: nextId(),
    application_id: applicationId,
    from_status: null,
    to_status: null,
    note: null,
    occurred_at: nowIso(),
    created_at: nowIso(),
    ...data,
  };
  db.events.push(event);
  return event;
};

const api = {
  createApplication(input) {
    const details = {};
    const company = (input.company ?? "").trim();
    const role = (input.role ?? "").trim();
    if (!company) details["body.company"] = "Informe a empresa.";
    if (!role) details["body.role"] = "Informe o cargo.";
    if (input.resume_id && !findResume(input.resume_id)) details["body.resume_id"] = "Currículo não encontrado.";
    if (Object.keys(details).length > 0) throw new ApiError(400, "validation_error", "Dados inválidos.", details);

    const status = input.status || "applied";
    const application = {
      id: nextId(),
      company,
      role,
      job_url: input.job_url || null,
      source: input.source || null,
      applied_at: input.applied_at || todayStr(),
      status,
      resume_id: input.resume_id || null,
      salary: input.salary || null,
      work_model: input.work_model || null,
      location: input.location || null,
      contacts: input.contacts || null,
      notes: input.notes || null,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    db.applications.push(application);
    createEvent(application.id, { type: "created", to_status: status });
    persist();
    return application;
  },

  updateApplication(id, changes) {
    const application = findApplication(id);
    if (!application) throw notFound("Candidatura");
    const details = {};
    for (const field of ["company", "role"]) {
      if (field in changes) {
        changes[field] = (changes[field] ?? "").trim();
        if (!changes[field]) details[`body.${field}`] = field === "company" ? "A empresa não pode ficar vazia." : "O cargo não pode ficar vazio.";
      }
    }
    if (changes.resume_id && !findResume(changes.resume_id)) details["body.resume_id"] = "Currículo não encontrado.";
    if (Object.keys(details).length > 0) throw new ApiError(400, "validation_error", "Dados inválidos.", details);
    Object.assign(application, changes);
    touch(application);
    persist();
    return application;
  },

  changeStatus(id, status, note = null) {
    const application = findApplication(id);
    if (!application) throw notFound("Candidatura");
    if (application.status === status) return { application, event: null };
    const event = createEvent(id, { type: "status_change", from_status: application.status, to_status: status, note });
    application.status = status;
    touch(application);
    persist();
    return { application, event };
  },

  deleteApplication(id) {
    if (!findApplication(id)) throw notFound("Candidatura");
    db.applications = db.applications.filter((application) => application.id !== id);
    db.events = db.events.filter((event) => event.application_id !== id);
    persist();
  },

  createNote(applicationId, note, occurredAt) {
    const application = findApplication(applicationId);
    if (!application) throw notFound("Candidatura");
    if (!note.trim()) throw new ApiError(400, "validation_error", "Dados inválidos.", { "body.note": "Escreva a nota." });
    const event = createEvent(applicationId, { type: "note", note: note.trim(), occurred_at: occurredAt || nowIso() });
    touch(application);
    persist();
    return event;
  },

  updateEvent(eventId, changes) {
    const event = db.events.find((item) => item.id === eventId);
    if (!event) throw notFound("Evento");
    if ("note" in changes) {
      changes.note = (changes.note ?? "").trim() || null;
      if (event.type === "note" && !changes.note) {
        throw new ApiError(400, "validation_error", "Dados inválidos.", { "body.note": "A nota não pode ficar vazia." });
      }
    }
    Object.assign(event, changes);
    persist();
    return event;
  },

  deleteEvent(eventId) {
    const event = db.events.find((item) => item.id === eventId);
    if (!event) throw notFound("Evento");
    if (event.type === "created") throw new ApiError(400, "validation_error", "O evento de criação não pode ser excluído.");
    db.events = db.events.filter((item) => item.id !== eventId);
    persist();
  },

  async createResume(name, file) {
    if (!(await isPdf(file))) {
      throw new ApiError(400, "validation_error", "O arquivo precisa ser um PDF.", { file: "O arquivo precisa ser um PDF." });
    }
    const resume = {
      id: nextId(),
      name: name.trim() || "Currículo",
      description: null,
      file_name: file.name,
      file_path: `upload-${db.seq}.pdf`,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    db.resumes.push(resume);
    uploadedFiles.set(resume.id, URL.createObjectURL(file));
    persist();
    return resume;
  },

  updateResume(id, changes) {
    const resume = findResume(id);
    if (!resume) throw notFound("Currículo");
    if ("name" in changes) {
      changes.name = (changes.name ?? "").trim();
      if (!changes.name) throw new ApiError(400, "validation_error", "Dados inválidos.", { "body.name": "O nome não pode ficar vazio." });
    }
    Object.assign(resume, changes, { updated_at: nowIso() });
    persist();
    return resume;
  },

  async replaceResumeFile(id, file) {
    const resume = findResume(id);
    if (!resume) throw notFound("Currículo");
    if (!(await isPdf(file))) throw new ApiError(400, "validation_error", "O arquivo precisa ser um PDF.");
    Object.assign(resume, { file_name: file.name, file_path: `upload-${nextId()}.pdf`, updated_at: nowIso() });
    uploadedFiles.set(id, URL.createObjectURL(file));
    persist();
    return resume;
  },

  deleteResume(id) {
    const resume = findResume(id);
    if (!resume) throw notFound("Currículo");
    const count = usageOf(id).length;
    if (count > 0) throw new ApiError(409, "conflict", `O currículo está em uso por ${plural(count, "candidatura", "candidaturas")}.`);
    db.resumes = db.resumes.filter((item) => item.id !== id);
    uploadedFiles.delete(id);
    persist();
  },
};

/** Todo PDF começa com "%PDF-" (mesma regra do use case da API). */
async function isPdf(file) {
  const head = await file.slice(0, 5).text();
  return head === "%PDF-";
}

/* ==========================================================================
   Estado da interface e URL
   ========================================================================== */

const ui = {
  route: "candidaturas",
  q: "",
  application: null,
  loading: true,
  expandedColumns: new Set(),
  confirm: null,
  highlight: null,
  saved: null,
  fieldErrors: {},
  drafts: {},
  editingEvent: null,
  noteAt: null,
  focusComposer: false,
  expandedResume: null,
  replace: null,
  focusResumeName: null,
};

const ROUTES = ["candidaturas", "curriculos", "painel"];

function readUrl() {
  const [path, query = ""] = location.hash.replace(/^#\/?/, "").split("?");
  const params = new URLSearchParams(query);
  ui.route = ROUTES.includes(path) ? path : "candidaturas";
  ui.q = params.get("q") ?? "";
  const applicationId = Number(params.get("application"));
  ui.application = applicationId > 0 ? applicationId : null;
}

function buildHash() {
  const params = new URLSearchParams();
  if (ui.route === "candidaturas" && ui.q) params.set("q", ui.q);
  if (ui.application) params.set("application", ui.application);
  const query = params.toString();
  return `#/${ui.route}${query ? `?${query}` : ""}`;
}

/** Aplica mudanças no estado, atualiza a URL e redesenha. */
function navigate(changes, { push = false } = {}) {
  Object.assign(ui, changes);
  const hash = buildHash();
  if (hash !== location.hash) history[push ? "pushState" : "replaceState"](null, "", hash);
  render();
}

window.addEventListener("popstate", () => {
  readUrl();
  render();
});

/* Re-render adiado enquanto o mouse está pressionado, para não perder o clique quando um campo
   salva ao perder o foco. */
let pointerDown = false;
let pendingRender = false;
document.addEventListener("mousedown", () => {
  pointerDown = true;
});
document.addEventListener("mouseup", () => {
  setTimeout(() => {
    pointerDown = false;
    if (pendingRender) {
      pendingRender = false;
      render();
    }
  }, 0);
});
const requestRender = () => {
  if (pointerDown) pendingRender = true;
  else render();
};

/* ==========================================================================
   Consultas usadas pelas telas
   ========================================================================== */

function filterApplications() {
  const q = ui.q.trim().toLowerCase();
  return db.applications.filter(
    (application) => !q || `${application.company} ${application.role}`.toLowerCase().includes(q),
  );
}

function dashboardData() {
  const byStatus = Object.fromEntries(STATUSES.map((status) => [status.value, 0]));
  for (const application of db.applications) byStatus[application.status] += 1;
  const active = STATUSES.filter((status) => status.type === "active").reduce((sum, status) => sum + byStatus[status.value], 0);
  const since = daysAgoStr(30);
  const recent = [...db.events]
    .sort((a, b) => b.occurred_at.localeCompare(a.occurred_at) || b.id - a.id)
    .slice(0, 10)
    .map((event) => ({ event, application: findApplication(event.application_id) }))
    .filter((item) => item.application);
  return {
    total: db.applications.length,
    active,
    closed: db.applications.length - active,
    byStatus,
    last30: db.applications.filter((application) => application.applied_at >= since).length,
    recent,
  };
}

/* ==========================================================================
   Pedaços de interface
   ========================================================================== */

const statusBadge = (value) =>
  `<span class="badge" data-status="${value}">${esc(STATUS[value].label)}</span>`;

const workModelIcon = (value) =>
  value ? `<span title="${WORK_MODELS[value]}">${icon(value)}${WORK_MODELS[value]}</span>` : "";

const emptyState = (title, text, action = "") =>
  `<div class="empty"><p class="t-heading">${esc(title)}</p><p>${esc(text)}</p>${action}</div>`;

const newApplicationButton = (primary = true) =>
  `<button type="button" class="button ${primary ? "button--primary" : "button--secondary"}" data-action="open-modal">
     ${icon("plus")}Nova candidatura <span class="kbd">N</span>
   </button>`;

const searchField = () =>
  `<label class="search">
     ${icon("search")}
     <span class="visually-hidden">Buscar por empresa ou cargo</span>
     <input class="input" id="search" type="search" placeholder="Buscar empresa ou cargo" value="${esc(ui.q)}" autocomplete="off" />
     <span class="kbd" aria-hidden="true">/</span>
   </label>`;

const resumeOptions = (selected, emptyLabel) =>
  `<option value="">${esc(emptyLabel)}</option>` +
  db.resumes
    .map((resume) => `<option value="${resume.id}" ${String(selected) === String(resume.id) ? "selected" : ""}>${esc(resume.name)}</option>`)
    .join("");

/* ==========================================================================
   Navegação
   ========================================================================== */

function renderNav() {
  const items = [
    ["candidaturas", "Candidaturas", "board"],
    ["curriculos", "Currículos", "file"],
    ["painel", "Painel", "chart"],
  ];
  const theme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
  document.getElementById("nav-logo").src = theme === "light" ? "../assets/logo.svg" : "../assets/logo-on-dark.svg";
  document.getElementById("theme-toggle").innerHTML =
    theme === "light" ? `${icon("moon")}Usar tema escuro` : `${icon("sun")}Usar tema claro`;
  document.getElementById("reset-data").innerHTML = `${icon("reset")}Restaurar dados de exemplo`;
  document.getElementById("nav-list").innerHTML = items
    .map(
      ([route, label, iconName]) =>
        `<li><a class="nav__item" href="#/${route}" data-route="${route}" ${ui.route === route ? 'aria-current="page"' : ""}>${icon(iconName)}${label}</a></li>`,
    )
    .join("");
}

/* ==========================================================================
   Tela: Candidaturas (kanban)
   ========================================================================== */

function renderCandidaturas() {
  const header = `
    <header class="header">
      <h1 class="t-display header__title">Candidaturas</h1>
      <div class="header__spacer"></div>
      ${searchField()}
      ${newApplicationButton()}
    </header>`;

  return `${header}<div class="content content--board">${ui.loading ? boardSkeleton() : renderBoard()}</div>`;
}

function boardSkeleton() {
  return `<div class="board">${STATUSES.slice(0, 5)
    .map(
      () =>
        `<div class="column"><div class="column__header"><span class="skeleton" style="width:120px;height:16px"></span></div>
         <div class="column__cards"><div class="skeleton skeleton--card"></div><div class="skeleton skeleton--card"></div></div></div>`,
    )
    .join("")}</div>`;
}

function renderBoard() {
  const applications = filterApplications();
  const columns = STATUSES.map((status) => {
    const cards = applications
      .filter((application) => application.status === status.value)
      .map((application) => ({ application, last: lastEventAt(application) }))
      .sort((a, b) => b.last.localeCompare(a.last));

    const collapsed = status.type === "closed" && !ui.expandedColumns.has(status.value);
    if (collapsed) {
      return `
        <section class="column column--collapsed" data-status="${status.value}" data-column="${status.value}"
                 data-action="expand-column" title="Abrir a coluna ${esc(status.label)}" role="button" tabindex="0"
                 aria-label="${esc(status.label)}: ${plural(cards.length, "candidatura", "candidaturas")}. Abrir coluna">
          <span class="dot"></span>
          <span class="t-label column__count tabular">${cards.length}</span>
          <span class="column__vertical">${esc(status.label)}</span>
        </section>`;
    }

    const body = cards.length
      ? cards.map(({ application, last }) => renderCard(application, last)).join("")
      : `<p class="column__empty">Arraste um card para cá</p>`;

    return `
      <section class="column" data-status="${status.value}" data-column="${status.value}" aria-label="${esc(status.label)}">
        <header class="column__header">
          <span class="dot"></span>
          <h2 class="t-heading column__title">${esc(status.label)}</h2>
          <span class="t-caption column__count tabular">${cards.length}</span>
          ${status.type === "closed" ? `<button type="button" class="button button--ghost button--icon" data-action="collapse-column" data-status-value="${status.value}" aria-label="Recolher coluna" title="Recolher coluna">${icon("chevronRight")}</button>` : ""}
        </header>
        <div class="column__cards">${body}</div>
      </section>`;
  }).join("");

  const noData = db.applications.length === 0;
  return `${noData ? `<div class="page">${emptyState("Nenhuma candidatura ainda", "Crie a primeira com o botão abaixo.", newApplicationButton())}</div>` : ""}
          <div class="board">${columns}</div>`;
}

function renderCard(application, last) {
  const resume = application.resume_id ? findResume(application.resume_id) : null;
  const classes = ["card"];
  if (ui.highlight === application.id) classes.push("card--highlight");
  if (ui.application === application.id) classes.push("card--open");
  return `
    <article class="${classes.join(" ")}" data-status="${application.status}" data-card="${application.id}" draggable="true" tabindex="0"
             aria-label="${esc(application.company)}, ${esc(application.role)}">
      <span class="t-body-strong card__company">${esc(application.company)}</span>
      <span class="card__role">${esc(application.role)}</span>
      <span class="card__meta">
        ${workModelIcon(application.work_model)}
        ${resume ? `<span>${icon("file")}${esc(resume.name)}</span>` : ""}
        <span title="Último evento: ${formatDateTime(last)}">${icon("clock")}${relative(last)}</span>
      </span>
    </article>`;
}

/* ==========================================================================
   Tela: Currículos
   ========================================================================== */

function renderCurriculos() {
  const header = `
    <header class="header">
      <h1 class="t-display header__title">Currículos</h1>
      <div class="header__spacer"></div>
      ${searchField()}
      ${newApplicationButton(false)}
      <button type="button" class="button button--primary" data-action="pick-file">${icon("upload")}Enviar PDF</button>
    </header>`;

  const resumes = [...db.resumes].sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  if (resumes.length === 0) {
    return `${header}<div class="content"><div class="page">
      <div class="dropzone">${icon("upload")}<p class="t-heading">Arraste um PDF aqui</p><p>ou use o botão "Enviar PDF".</p></div>
    </div></div>`;
  }

  const cards = resumes.map((resume) => renderResumeCard(resume)).join("");
  return `${header}<div class="content"><div class="page">
    <p class="c-secondary" style="margin-bottom:var(--space-md)">Arraste um PDF para qualquer lugar da tela para cadastrar um currículo, ou sobre um card para trocar o arquivo dele.</p>
    <div class="resumes">${cards}</div>
  </div></div>`;
}

function renderResumeCard(resume) {
  const usage = usageOf(resume.id);
  const expanded = ui.expandedResume === resume.id;
  const confirmKey = `resume:${resume.id}`;
  const replacing = ui.replace && ui.replace.id === resume.id;
  const savedName = ui.saved === `resume:${resume.id}:name`;
  const savedDescription = ui.saved === `resume:${resume.id}:description`;
  const error = ui.fieldErrors[`resume:${resume.id}:name`];

  const usageList = expanded
    ? `<div class="resume__usage">${
        usage.length
          ? usage
              .map(
                (application) =>
                  `<button type="button" data-open="${application.id}"><span>${esc(application.company)} <span class="c-secondary">· ${esc(application.role)}</span></span>${statusBadge(application.status)}</button>`,
              )
              .join("")
          : `<p class="c-secondary" style="padding:4px 8px">Ainda não foi usado em nenhuma candidatura.</p>`
      }</div>`
    : "";

  const deleteButton = usage.length
    ? `<span data-tooltip="Em uso por ${plural(usage.length, "candidatura", "candidaturas")}"><button type="button" class="button button--danger" disabled>${icon("trash")}Excluir</button></span>`
    : ui.confirm === confirmKey
      ? `<button type="button" class="button button--danger-confirm" data-action="delete-resume" data-id="${resume.id}" data-confirm-key="${confirmKey}">Confirmar exclusão?</button>`
      : `<button type="button" class="button button--danger" data-action="delete-resume" data-id="${resume.id}" data-confirm-key="${confirmKey}">${icon("trash")}Excluir</button>`;

  return `
    <article class="resume ${replacing ? "resume--drop" : ""}" data-resume="${resume.id}">
      <div class="props__row">
        <input class="inline inline--strong" data-resume-field="name" data-id="${resume.id}" value="${esc(resume.name)}" placeholder="Ex.: Backend Sênior" aria-label="Nome do currículo" />
        ${savedName ? `<span class="saved">${icon("check")}</span>` : ""}
      </div>
      ${error ? `<p class="field__error" style="padding:0 8px">${esc(error)}</p>` : ""}
      <div class="props__row">
        <textarea class="inline c-secondary" rows="2" data-resume-field="description" data-id="${resume.id}" placeholder="Adicionar descrição ou foco" aria-label="Descrição">${esc(resume.description ?? "")}</textarea>
        ${savedDescription ? `<span class="saved">${icon("check")}</span>` : ""}
      </div>
      <a class="resume__file" href="#" data-action="open-pdf" data-id="${resume.id}">${icon("file")}${esc(resume.file_name)}</a>
      <p class="resume__meta">Atualizado em ${formatDate(resume.updated_at.slice(0, 10))}</p>
      ${
        replacing
          ? `<div class="resume__confirm">${icon("alert")}<span>Trocar o PDF por <strong>${esc(ui.replace.file.name)}</strong>? O arquivo atual será apagado.</span>
               <button type="button" class="button button--danger-confirm" data-action="confirm-replace">Trocar arquivo</button>
               <button type="button" class="button button--ghost" data-action="cancel-replace">Cancelar</button></div>`
          : ""
      }
      ${usageList}
      <div class="resume__footer">
        <button type="button" class="button button--ghost" data-action="toggle-usage" data-id="${resume.id}" aria-expanded="${expanded}">
          ${icon(expanded ? "chevronDown" : "chevronRight")}Usado em ${plural(usage.length, "candidatura", "candidaturas")}
        </button>
        ${deleteButton}
      </div>
    </article>`;
}

/* ==========================================================================
   Tela: Painel
   ========================================================================== */

function renderPainel() {
  const data = dashboardData();
  const max = Math.max(1, ...Object.values(data.byStatus));
  const header = `
    <header class="header">
      <h1 class="t-display header__title">Painel</h1>
      <div class="header__spacer"></div>
      ${searchField()}
      ${newApplicationButton()}
    </header>`;

  const stats = [
    ["Total", data.total],
    ["Ativas", data.active],
    ["Encerradas", data.closed],
    ["Últimos 30 dias", data.last30],
  ]
    .map(([label, value]) => `<div class="stat"><span class="t-number">${value}</span><span class="c-secondary">${label}</span></div>`)
    .join("");

  const bars = STATUSES.map((status) => {
    const count = data.byStatus[status.value];
    return `<button type="button" class="bar" data-status="${status.value}" data-action="dashboard-status" data-status-value="${status.value}" title="Ver candidaturas em ${esc(status.label)}">
      <span class="bar__label"><span class="dot"></span>${esc(status.label)}</span>
      <span class="bar__track"><span class="bar__fill" style="width:${(count / max) * 100}%"></span></span>
      <span class="bar__count tabular">${count}</span>
    </button>`;
  }).join("");

  const recent = data.recent.length
    ? data.recent.map(({ event, application }) => recentItem(event, application)).join("")
    : `<p class="c-secondary">Nenhum evento ainda.</p>`;

  const empty =
    data.total === 0
      ? `<div style="margin-top:var(--space-md)">${emptyState("Nenhuma candidatura ainda", "Os números aparecem aqui conforme você registra candidaturas.", newApplicationButton())}</div>`
      : "";

  return `${header}<div class="content"><div class="page">
    <div class="stats">${stats}</div>
    ${empty}
    <div class="dashboard">
      <section class="panel"><h2 class="t-heading section-title">Por status</h2><div class="bars">${bars}</div></section>
      <section class="panel"><h2 class="t-heading section-title">Eventos recentes</h2><div class="recent">${recent}</div></section>
    </div>
  </div></div>`;
}

function recentItem(event, application) {
  const description =
    event.type === "created"
      ? "Candidatura criada"
      : event.type === "status_change"
        ? `Mudou para ${statusBadge(event.to_status)}`
        : "Nota adicionada";
  const iconName = event.type === "created" ? "created" : event.type === "status_change" ? "arrow" : "message";
  return `<button type="button" data-open="${application.id}">
    <span class="timeline__icon">${icon(iconName)}</span>
    <span><span class="t-body-strong">${esc(application.company)}</span> <span class="c-secondary">· ${esc(application.role)}</span><br />
      <span class="c-secondary">${description}</span> <span class="t-caption c-muted">· ${relative(event.occurred_at)}</span></span>
  </button>`;
}

/* ==========================================================================
   Painel lateral: detalhe da candidatura
   ========================================================================== */

function renderDrawer() {
  const drawer = document.getElementById("drawer");
  const application = ui.application ? findApplication(ui.application) : null;
  if (!application) {
    drawer.hidden = true;
    drawer.innerHTML = "";
    return;
  }

  const active = document.activeElement;
  const keepFocus = active && drawer.contains(active) && active.dataset.field ? active.dataset.field : null;

  const field = (name, label, { type = "text", placeholder = "Vazio", multiline = false, extra = "" } = {}) => {
    const error = ui.fieldErrors[name];
    const value = ui.drafts[name] ?? application[name] ?? "";
    const control = multiline
      ? `<textarea class="inline ${error ? "inline--error" : ""}" data-field="${name}" rows="2" placeholder="${esc(placeholder)}" aria-label="${esc(label)}">${esc(value)}</textarea>`
      : `<input class="inline ${error ? "inline--error" : ""}" data-field="${name}" type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}" aria-label="${esc(label)}" />`;
    return `<span class="props__label">${esc(label)}${ui.saved === name ? `<span class="saved">${icon("check")}</span>` : ""}</span>
      <span class="props__value"><span class="props__row">${control}${extra}</span>${error ? `<span class="field__error">${esc(error)}</span>` : ""}</span>`;
  };

  const selectField = (name, label, options) =>
    `<span class="props__label">${esc(label)}${ui.saved === name ? `<span class="saved">${icon("check")}</span>` : ""}</span>
     <span class="props__value"><select class="inline" data-field="${name}" aria-label="${esc(label)}">${options}</select></span>`;

  const workModelOptions =
    `<option value="">Selecione o modelo</option>` +
    Object.entries(WORK_MODELS)
      .map(([value, label]) => `<option value="${value}" ${application.work_model === value ? "selected" : ""}>${label}</option>`)
      .join("");

  const resume = application.resume_id ? findResume(application.resume_id) : null;
  const jobLink = application.job_url
    ? `<a class="button button--ghost button--icon" href="${esc(application.job_url)}" target="_blank" rel="noopener" title="Abrir a vaga" aria-label="Abrir a vaga">${icon("external")}</a>`
    : "";
  const resumeLink = resume
    ? `<a class="button button--ghost button--icon" href="#" data-action="open-pdf" data-id="${resume.id}" title="Abrir o PDF" aria-label="Abrir o PDF">${icon("external")}</a>`
    : "";

  const companyError = ui.fieldErrors.company;
  const roleError = ui.fieldErrors.role;
  const deleteKey = `application:${application.id}`;

  drawer.innerHTML = `
    <div class="drawer__header" data-status="${application.status}">
      <div class="drawer__top">
        <div>
          <input class="inline inline--title ${companyError ? "inline--error" : ""}" data-field="company" value="${esc(ui.drafts.company ?? application.company)}" placeholder="Ex.: Acme Tecnologia" aria-label="Empresa" />
          ${companyError ? `<p class="field__error">${esc(companyError)}</p>` : ""}
          <input class="inline c-secondary ${roleError ? "inline--error" : ""}" data-field="role" value="${esc(ui.drafts.role ?? application.role)}" placeholder="Ex.: Desenvolvedora Backend Sênior" aria-label="Cargo" />
          ${roleError ? `<p class="field__error">${esc(roleError)}</p>` : ""}
        </div>
        <button type="button" class="button button--ghost button--icon" data-action="close-drawer" aria-label="Fechar" title="Fechar (Esc)">${icon("x")}</button>
      </div>
      <div class="props__row" style="padding:0 8px">
        <label class="status-select" data-status="${application.status}">
          <span class="dot"></span>
          <span class="visually-hidden">Status</span>
          <select data-action="change-status">${STATUSES.map((status) => `<option value="${status.value}" ${status.value === application.status ? "selected" : ""}>${esc(status.label)}</option>`).join("")}</select>
          ${icon("chevronDown")}
        </label>
        ${ui.saved === "status" ? `<span class="saved">${icon("check")}</span>` : ""}
      </div>
    </div>
    <div class="drawer__body">
      <h3 class="t-heading section-title">Dados</h3>
      <div class="props">
        ${field("job_url", "Link da vaga", { type: "url", placeholder: "Colar o link da vaga", extra: jobLink })}
        ${field("source", "Onde se candidatou", { placeholder: "Ex.: LinkedIn, site da empresa, indicação" })}
        ${field("applied_at", "Data", { type: "date" })}
        <span class="props__label">Currículo${ui.saved === "resume_id" ? `<span class="saved">${icon("check")}</span>` : ""}</span>
        <span class="props__value"><span class="props__row"><select class="inline" data-field="resume_id" aria-label="Currículo">${resumeOptions(application.resume_id ?? "", "Selecione o currículo")}</select>${resumeLink}</span></span>
        ${field("salary", "Salário", { placeholder: "Adicionar faixa ou pretensão" })}
        ${selectField("work_model", "Modelo", workModelOptions)}
        ${field("location", "Localização", { placeholder: "Adicionar localização" })}
        ${field("contacts", "Contatos", { placeholder: "Adicionar nome, e-mail ou telefone do recrutador", multiline: true })}
        ${field("notes", "Anotações", { placeholder: "Adicionar anotações", multiline: true })}
      </div>

      <h3 class="t-heading section-title">Histórico</h3>
      ${renderComposer()}
      <ol class="timeline">${eventsOf(application.id).map((event) => renderEvent(event)).join("")}</ol>
    </div>
    <div class="drawer__footer">
      ${
        ui.confirm === deleteKey
          ? `<button type="button" class="button button--danger-confirm" data-action="delete-application" data-confirm-key="${deleteKey}">Confirmar exclusão?</button>`
          : `<button type="button" class="button button--danger" data-action="delete-application" data-confirm-key="${deleteKey}">${icon("trash")}Excluir candidatura</button>`
      }
    </div>`;
  drawer.hidden = false;

  if (keepFocus) drawer.querySelector(`[data-field="${keepFocus}"]`)?.focus();
  if (ui.focusComposer) {
    ui.focusComposer = false;
    drawer.querySelector("#composer")?.focus();
  }
  const editing = drawer.querySelector("[data-event-edit] textarea");
  if (editing && document.activeElement === document.body) {
    editing.focus();
    editing.setSelectionRange(editing.value.length, editing.value.length);
  }
}

function renderComposer() {
  const error = ui.fieldErrors.note;
  return `<form class="composer" id="composer-form">
    <div class="composer__row">
      <input class="input ${error ? "input--error" : ""}" id="composer" placeholder="Adicionar nota (entrevista marcada, feedback...)" autocomplete="off" aria-label="Adicionar nota" />
    </div>
    ${error ? `<span class="field__error">${esc(error)}</span>` : ""}
    <div class="composer__row t-caption c-muted">
      ${icon("clock")}
      ${
        ui.noteAt !== null
          ? `<input class="input input--compact" type="datetime-local" id="composer-at" value="${esc(ui.noteAt)}" aria-label="Data da nota" />
             <button type="button" class="link-button" data-action="note-now">usar agora</button>`
          : `<button type="button" class="link-button" data-action="note-pick-date" title="Registrar com outra data">agora</button>`
      }
      <span><span class="kbd">Enter</span> salva</span>
    </div>
    <button type="submit" class="visually-hidden" tabindex="-1">Salvar nota</button>
  </form>`;
}

function renderEvent(event) {
  const editing = ui.editingEvent === event.id;
  const deleteKey = `event:${event.id}`;
  const iconName = event.type === "created" ? "created" : event.type === "status_change" ? "arrow" : "message";

  let text;
  if (event.type === "created") {
    text = `<span>Candidatura criada em</span>${statusBadge(event.to_status)}`;
  } else if (event.type === "status_change") {
    text = `${statusBadge(event.from_status)}${icon("arrow")}${statusBadge(event.to_status)}`;
  } else {
    text = "";
  }

  const noteText = event.note ? `<p class="timeline__note">${esc(event.note)}</p>` : "";
  const error = ui.fieldErrors[`event:${event.id}`];

  const body = editing
    ? `<div class="timeline__edit" data-event-edit="${event.id}">
         <textarea class="input textarea ${error ? "input--error" : ""}" rows="2" name="note" placeholder="${event.type === "note" ? "Escreva a nota" : "Nota opcional"}" aria-label="Nota">${esc(event.note ?? "")}</textarea>
         ${error ? `<span class="field__error">${esc(error)}</span>` : ""}
         <input class="input input--compact" type="datetime-local" name="occurred_at" value="${toLocalInput(event.occurred_at)}" aria-label="Data do evento" />
         <span class="t-caption c-muted"><span class="kbd">Enter</span> salva · <span class="kbd">Esc</span> cancela</span>
       </div>`
    : `${text}${noteText}<span class="timeline__date" title="${formatDateTime(event.occurred_at)}">${formatDateTime(event.occurred_at)} · ${relative(event.occurred_at)}</span>`;

  const actions = editing
    ? ""
    : `<div class="timeline__actions ${ui.confirm === deleteKey ? "is-visible" : ""}">
         <button type="button" class="button button--ghost button--icon" data-action="edit-event" data-id="${event.id}" aria-label="Editar evento" title="Editar">${icon("pencil")}</button>
         ${
           event.type === "created"
             ? ""
             : ui.confirm === deleteKey
               ? `<button type="button" class="button button--danger-confirm" data-action="delete-event" data-id="${event.id}" data-confirm-key="${deleteKey}">Excluir?</button>`
               : `<button type="button" class="button button--ghost button--icon" data-action="delete-event" data-id="${event.id}" data-confirm-key="${deleteKey}" aria-label="Excluir evento" title="Excluir">${icon("trash")}</button>`
         }
       </div>`;

  return `<li class="timeline__item">
    <span class="timeline__icon">${icon(iconName)}</span>
    <div class="timeline__text">${body}</div>
    ${actions}
  </li>`;
}

/* ==========================================================================
   Modal: nova candidatura
   ========================================================================== */

function openModal() {
  const modal = document.getElementById("modal");
  const lastResume = storage.get(LAST_RESUME_KEY) ?? "";
  const defaultResume = findResume(Number(lastResume)) ? lastResume : "";
  modal.innerHTML = `
    <form class="modal" id="new-application" role="dialog" aria-modal="true" aria-labelledby="modal-title" novalidate>
      <h2 class="t-title" id="modal-title">Nova candidatura</h2>
      <div class="modal__grid">
        <label class="field"><span class="field__label">Empresa *</span><input class="input" name="company" placeholder="Ex.: Acme Tecnologia" autocomplete="off" /><span class="field__error" data-error="company"></span></label>
        <label class="field"><span class="field__label">Cargo *</span><input class="input" name="role" placeholder="Ex.: Desenvolvedora Backend Sênior" autocomplete="off" /><span class="field__error" data-error="role"></span></label>
        <label class="field field--full"><span class="field__label">Link da vaga</span><input class="input" name="job_url" type="url" placeholder="https://..." /></label>
      </div>
      <details>
        <summary>${icon("chevronRight")}Mais detalhes</summary>
        <div class="modal__grid">
          <label class="field"><span class="field__label">Onde se candidatou</span><input class="input" name="source" placeholder="Ex.: LinkedIn, site da empresa, indicação" /></label>
          <label class="field"><span class="field__label">Data</span><input class="input" name="applied_at" type="date" value="${todayStr()}" /></label>
          <label class="field"><span class="field__label">Status</span><select class="select" name="status">${STATUSES.map((status) => `<option value="${status.value}">${esc(status.label)}</option>`).join("")}</select></label>
          <label class="field"><span class="field__label">Currículo</span><select class="select" name="resume_id">${resumeOptions(defaultResume, "Selecione o currículo")}</select><span class="field__error" data-error="resume_id"></span></label>
          <label class="field"><span class="field__label">Salário</span><input class="input" name="salary" placeholder="Ex.: R$ 15.000 ou R$ 12–15 mil" /></label>
          <label class="field"><span class="field__label">Modelo</span><select class="select" name="work_model"><option value="">Selecione o modelo</option>${Object.entries(WORK_MODELS).map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}</select></label>
          <label class="field field--full"><span class="field__label">Localização</span><input class="input" name="location" placeholder="Ex.: São Paulo, SP" /></label>
          <label class="field field--full"><span class="field__label">Contatos</span><textarea class="textarea" name="contacts" rows="2" placeholder="Nome, e-mail ou telefone do recrutador"></textarea></label>
          <label class="field field--full"><span class="field__label">Anotações</span><textarea class="textarea" name="notes" rows="2" placeholder="Algo para lembrar sobre a vaga"></textarea></label>
        </div>
      </details>
      <div class="modal__footer">
        <span class="t-caption c-muted"><span class="kbd">Enter</span> salva · <span class="kbd">Esc</span> fecha</span>
        <button type="button" class="button button--secondary" data-action="close-modal">Cancelar</button>
        <button type="submit" class="button button--primary">Salvar</button>
      </div>
    </form>`;
  modal.hidden = false;
  modal.querySelector('[name="company"]').focus();
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.hidden = true;
  modal.innerHTML = "";
}

function submitModal(form) {
  const data = Object.fromEntries(new FormData(form));
  form.querySelectorAll("[data-error]").forEach((element) => (element.textContent = ""));
  form.querySelectorAll(".input--error").forEach((element) => element.classList.remove("input--error"));
  try {
    const application = api.createApplication({ ...data, resume_id: data.resume_id ? Number(data.resume_id) : null });
    if (application.resume_id) storage.set(LAST_RESUME_KEY, String(application.resume_id));
    closeModal();
    flashHighlight(application.id);
    navigate({ route: "candidaturas" }, { push: ui.route !== "candidaturas" });
    toast({ type: "success", message: `Candidatura em ${application.company} criada.` });
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    showFormErrors(form, error);
  }
}

function showFormErrors(form, error) {
  let first = null;
  for (const [path, message] of Object.entries(error.details ?? {})) {
    const name = path.replace(/^body\./, "");
    const slot = form.querySelector(`[data-error="${name}"]`);
    const input = form.querySelector(`[name="${name}"]`);
    if (slot) slot.textContent = message;
    if (input) {
      input.classList.add("input--error");
      first ??= input;
    }
  }
  if (first) first.focus();
  else toast({ type: "danger", message: error.message });
}

/* ==========================================================================
   Avisos
   ========================================================================== */

function toast({ type = "info", message, actions = [], timeout = 5000 }) {
  const container = document.getElementById("toasts");
  const element = document.createElement("div");
  element.className = `toast toast--${type}`;
  element.setAttribute("role", type === "danger" ? "alert" : "status");
  const iconName = type === "success" ? "check" : type === "danger" || type === "warning" ? "alert" : "info";
  element.innerHTML = `<span class="toast__icon">${icon(iconName)}</span><span class="toast__message">${message}</span>
    <span class="toast__actions">${actions.map((action, index) => `<button type="button" class="button button--ghost" data-index="${index}">${esc(action.label)}</button>`).join("")}</span>`;
  const close = () => element.remove();
  element.querySelectorAll("[data-index]").forEach((button) =>
    button.addEventListener("click", () => {
      close();
      actions[Number(button.dataset.index)].run();
    }),
  );
  container.append(element);
  setTimeout(close, timeout);
}

function showError(error) {
  if (!(error instanceof ApiError)) {
    console.error(error);
    toast({ type: "danger", message: "Algo deu errado, tente de novo." });
    return;
  }
  if (error.status === 404 && ui.application) navigate({ application: null });
  toast({ type: error.status === 409 ? "warning" : "danger", message: esc(error.message) });
}

/* ==========================================================================
   Render geral
   ========================================================================== */

function render() {
  const main = document.getElementById("main");
  const active = document.activeElement;
  const searchFocused = active?.id === "search";
  const caret = searchFocused ? active.selectionStart : null;

  renderNav();
  main.innerHTML =
    ui.route === "curriculos" ? renderCurriculos() : ui.route === "painel" ? renderPainel() : renderCandidaturas();
  renderDrawer();

  if (searchFocused) {
    const search = document.getElementById("search");
    search.focus();
    search.setSelectionRange(caret, caret);
  }
  if (ui.focusResumeName) {
    const input = main.querySelector(`[data-resume-field="name"][data-id="${ui.focusResumeName}"]`);
    ui.focusResumeName = null;
    input?.focus();
    input?.select();
  }
  if (ui.highlight) main.querySelector(`[data-card="${ui.highlight}"]`)?.scrollIntoView({ block: "nearest", inline: "nearest" });
  ui.saved = null;
}

function flashHighlight(id) {
  ui.highlight = id;
  setTimeout(() => {
    if (ui.highlight === id) {
      ui.highlight = null;
      requestRender();
    }
  }, 2000);
}

function markSaved(key) {
  ui.saved = key;
}

/* ==========================================================================
   Ações
   ========================================================================== */

function openApplication(id) {
  ui.fieldErrors = {};
  ui.drafts = {};
  ui.editingEvent = null;
  ui.noteAt = null;
  navigate({ application: id }, { push: ui.application === null });
}

function closeDrawer() {
  ui.fieldErrors = {};
  ui.drafts = {};
  ui.editingEvent = null;
  navigate({ application: null });
}

function moveApplication(id, status) {
  const application = findApplication(id);
  if (!application || application.status === status) return;
  const previous = application.status;
  try {
    api.changeStatus(id, status);
  } catch (error) {
    showError(error);
    return;
  }
  render();
  toast({
    type: "info",
    message: `<strong>${esc(application.company)}</strong> foi para ${statusBadge(status)}`,
    actions: [
      {
        label: "Desfazer",
        run: () => {
          api.changeStatus(id, previous);
          render();
        },
      },
      {
        label: "Adicionar nota",
        run: () => {
          ui.focusComposer = true;
          openApplication(id);
        },
      },
    ],
  });
}

function commitField(input) {
  const application = findApplication(ui.application);
  if (!application) return;
  const name = input.dataset.field;
  let value = input.value;
  if (name === "resume_id") value = value ? Number(value) : null;
  else if (name === "applied_at") value = value || application.applied_at;
  else if (name !== "company" && name !== "role") value = value.trim() || null;

  if ((application[name] ?? null) === value) {
    if (ui.fieldErrors[name]) {
      delete ui.fieldErrors[name];
      delete ui.drafts[name];
      requestRender();
    }
    return;
  }
  try {
    api.updateApplication(application.id, { [name]: value });
    delete ui.fieldErrors[name];
    delete ui.drafts[name];
    markSaved(name);
    if (name === "resume_id" && value) storage.set(LAST_RESUME_KEY, String(value));
  } catch (error) {
    if (error instanceof ApiError && error.details) {
      ui.fieldErrors[name] = Object.values(error.details)[0];
      ui.drafts[name] = input.value;
    } else {
      showError(error);
    }
  }
  requestRender();
}

function addNote(form) {
  const input = form.querySelector("#composer");
  const at = form.querySelector("#composer-at")?.value;
  try {
    api.createNote(ui.application, input.value, at ? new Date(at).toISOString() : null);
    delete ui.fieldErrors.note;
    ui.noteAt = null;
    ui.focusComposer = true;
  } catch (error) {
    if (error instanceof ApiError && error.details) ui.fieldErrors.note = Object.values(error.details)[0];
    else showError(error);
    ui.focusComposer = true;
  }
  render();
}

function saveEventEdit(container) {
  const id = Number(container.dataset.eventEdit);
  const note = container.querySelector('[name="note"]').value;
  const at = container.querySelector('[name="occurred_at"]').value;
  try {
    api.updateEvent(id, { note, ...(at ? { occurred_at: new Date(at).toISOString() } : {}) });
    delete ui.fieldErrors[`event:${id}`];
    ui.editingEvent = null;
  } catch (error) {
    if (error instanceof ApiError && error.details) ui.fieldErrors[`event:${id}`] = Object.values(error.details)[0];
    else showError(error);
  }
  render();
}

async function createResumeFromFile(file) {
  try {
    const resume = await api.createResume(file.name.replace(/\.pdf$/i, ""), file);
    ui.focusResumeName = resume.id;
    render();
    toast({ type: "success", message: `Currículo <strong>${esc(resume.name)}</strong> cadastrado. Ajuste o nome se quiser.` });
  } catch (error) {
    showError(error);
  }
}

/** Confirmação em dois cliques: o primeiro arma, o segundo executa. */
function confirmed(key) {
  if (ui.confirm === key) {
    ui.confirm = null;
    return true;
  }
  ui.confirm = key;
  render();
  setTimeout(() => {
    if (ui.confirm === key) {
      ui.confirm = null;
      requestRender();
    }
  }, 4000);
  return false;
}

const actions = {
  "open-modal": () => openModal(),
  "close-modal": () => closeModal(),
  "expand-column": (element) => {
    ui.expandedColumns.add(element.dataset.column);
    render();
  },
  "collapse-column": (element) => {
    ui.expandedColumns.delete(element.dataset.statusValue);
    render();
  },
  "close-drawer": () => closeDrawer(),
  "delete-application": (element) => {
    if (!confirmed(element.dataset.confirmKey)) return;
    const application = findApplication(ui.application);
    api.deleteApplication(ui.application);
    closeDrawer();
    toast({ type: "info", message: `Candidatura em <strong>${esc(application.company)}</strong> excluída.` });
  },
  "edit-event": (element) => {
    ui.editingEvent = Number(element.dataset.id);
    render();
    document.querySelector(`[data-event-edit="${ui.editingEvent}"] textarea`)?.focus();
  },
  "delete-event": (element) => {
    if (!confirmed(element.dataset.confirmKey)) return;
    try {
      api.deleteEvent(Number(element.dataset.id));
    } catch (error) {
      showError(error);
    }
    render();
  },
  "note-pick-date": () => {
    ui.noteAt = toLocalInput(nowIso());
    render();
    document.getElementById("composer-at")?.focus();
  },
  "note-now": () => {
    ui.noteAt = null;
    ui.focusComposer = true;
    render();
  },
  "dashboard-status": (element) => {
    const value = element.dataset.statusValue;
    if (STATUS[value].type === "closed") ui.expandedColumns.add(value);
    navigate({ route: "candidaturas", q: "" }, { push: true });
    document.querySelector(`[data-column="${value}"]`)?.scrollIntoView({ block: "nearest", inline: "nearest" });
  },
  "pick-file": () => document.getElementById("file-input").click(),
  "toggle-usage": (element) => {
    const id = Number(element.dataset.id);
    ui.expandedResume = ui.expandedResume === id ? null : id;
    render();
  },
  "delete-resume": (element) => {
    if (!confirmed(element.dataset.confirmKey)) return;
    try {
      const resume = findResume(Number(element.dataset.id));
      api.deleteResume(Number(element.dataset.id));
      toast({ type: "info", message: `Currículo <strong>${esc(resume.name)}</strong> excluído.` });
    } catch (error) {
      showError(error);
    }
    render();
  },
  "open-pdf": (element) => {
    const url = uploadedFiles.get(Number(element.dataset.id));
    if (url) window.open(url, "_blank", "noopener");
    else toast({ type: "info", message: "No protótipo, os PDFs dos dados de exemplo não existem. Envie um PDF para testar." });
  },
  "confirm-replace": async () => {
    const { id, file } = ui.replace;
    ui.replace = null;
    try {
      await api.replaceResumeFile(id, file);
      toast({ type: "success", message: "Arquivo do currículo trocado." });
    } catch (error) {
      showError(error);
    }
    render();
  },
  "cancel-replace": () => {
    ui.replace = null;
    render();
  },
  "toggle-theme": () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    storage.set(THEME_KEY, next);
    renderNav();
  },
  "reset-data": () => {
    if (!confirmed("reset")) {
      toast({ type: "warning", message: "Clique de novo em “Restaurar dados de exemplo” para confirmar." });
      return;
    }
    db = seed();
    persist();
    storage.remove(LAST_RESUME_KEY);
    uploadedFiles.clear();
    navigate({ application: null });
    toast({ type: "success", message: "Dados de exemplo restaurados." });
  },
};

/* ==========================================================================
   Eventos
   ========================================================================== */

document.addEventListener("click", (event) => {
  const target = event.target;

  // Clicar fora de um botão de confirmação desarma a confirmação.
  if (ui.confirm && !target.closest(`[data-confirm-key="${ui.confirm}"]`) && ui.confirm !== "reset") {
    ui.confirm = null;
    requestRender();
  }

  const actionElement = target.closest("[data-action]");
  if (actionElement && actionElement.tagName !== "SELECT") {
    const run = actions[actionElement.dataset.action];
    if (run) {
      event.preventDefault();
      run(actionElement);
      return;
    }
  }

  const routeLink = target.closest("[data-route]");
  if (routeLink) {
    event.preventDefault();
    navigate({ route: routeLink.dataset.route }, { push: true });
    return;
  }

  const opener = target.closest("[data-open], [data-card]");
  if (opener) {
    openApplication(Number(opener.dataset.open ?? opener.dataset.card));
    return;
  }

  // Clicar no fundo do modal fecha o modal.
  if (target.id === "modal") closeModal();
});

document.addEventListener("input", (event) => {
  if (event.target.id === "search") {
    const q = event.target.value;
    if (ui.route !== "candidaturas") navigate({ route: "candidaturas", q }, { push: true });
    else navigate({ q });
  }
});

document.addEventListener("change", (event) => {
  const target = event.target;
  if (target.dataset.action === "change-status") {
    try {
      api.changeStatus(ui.application, target.value);
      markSaved("status");
    } catch (error) {
      showError(error);
    }
    render();
    return;
  }
  if (target.matches("select[data-field], input[type='date'][data-field]")) {
    commitField(target);
  }
});

document.addEventListener("focusin", (event) => {
  const target = event.target;
  if (target.dataset.field || target.dataset.resumeField) target.dataset.original = target.value;
});

document.addEventListener("focusout", (event) => {
  const target = event.target;
  if (target.dataset.cancelled) {
    delete target.dataset.cancelled;
    return;
  }
  if (target.dataset.field && !target.matches("select, input[type='date']")) {
    commitField(target);
    return;
  }
  if (target.dataset.resumeField) {
    const id = Number(target.dataset.id);
    const field = target.dataset.resumeField;
    const resume = findResume(id);
    const value = field === "description" ? target.value.trim() || null : target.value;
    if (!resume || (resume[field] ?? null) === value) return;
    try {
      api.updateResume(id, { [field]: value });
      delete ui.fieldErrors[`resume:${id}:name`];
      markSaved(`resume:${id}:${field}`);
    } catch (error) {
      if (error instanceof ApiError && error.details) ui.fieldErrors[`resume:${id}:name`] = Object.values(error.details)[0];
      else showError(error);
    }
    requestRender();
  }
});

document.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;
  if (form.id === "new-application") submitModal(form);
  else if (form.id === "composer-form") addNote(form);
});

document.addEventListener("keydown", (event) => {
  const target = event.target;
  const typing = target.matches("input, textarea, select, [contenteditable]");

  if (event.key === "Escape") {
    if (!document.getElementById("modal").hidden) {
      closeModal();
    } else if (target.closest?.("[data-event-edit]")) {
      ui.editingEvent = null;
      delete ui.fieldErrors[`event:${target.closest("[data-event-edit]").dataset.eventEdit}`];
      render();
    } else if (target.dataset.field || target.dataset.resumeField) {
      // Esc desfaz a edição do campo.
      target.value = target.dataset.original ?? target.value;
      target.dataset.cancelled = "true";
      delete ui.fieldErrors[target.dataset.field];
      delete ui.drafts[target.dataset.field];
      target.blur();
      render();
    } else if (ui.application) {
      closeDrawer();
    } else if (target.id === "search" && target.value) {
      navigate({ q: "" });
    }
    return;
  }

  if (event.key === "Enter") {
    if (target.closest?.("[data-event-edit]") && !event.shiftKey) {
      event.preventDefault();
      saveEventEdit(target.closest("[data-event-edit]"));
      return;
    }
    if ((target.dataset.field || target.dataset.resumeField) && (target.tagName !== "TEXTAREA" || event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      target.blur();
      return;
    }
    if (target.closest?.("#new-application") && target.tagName === "TEXTAREA" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      submitModal(target.closest("form"));
      return;
    }
  }

  // Cards: Enter abre o detalhe.
  if (event.key === "Enter" && target.dataset.card) {
    openApplication(Number(target.dataset.card));
    return;
  }
  if ((event.key === "Enter" || event.key === " ") && target.dataset.action === "expand-column") {
    event.preventDefault();
    actions["expand-column"](target);
    return;
  }

  if (typing || event.ctrlKey || event.metaKey || event.altKey) return;

  if (event.key === "n" || event.key === "N") {
    event.preventDefault();
    openModal();
  } else if (event.key === "/") {
    event.preventDefault();
    document.getElementById("search")?.focus();
  }
});

/* Arrastar cards entre colunas */
let draggedId = null;

document.addEventListener("dragstart", (event) => {
  const card = event.target.closest?.("[data-card]");
  if (!card) return;
  draggedId = Number(card.dataset.card);
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", String(draggedId));
  requestAnimationFrame(() => card.classList.add("card--dragging"));
});

document.addEventListener("dragend", (event) => {
  event.target.closest?.("[data-card]")?.classList.remove("card--dragging");
  document.querySelectorAll(".column--over").forEach((column) => column.classList.remove("column--over"));
  draggedId = null;
});

const isFileDrag = (event) => [...(event.dataTransfer?.types ?? [])].includes("Files");
const dropOverlay = () => document.getElementById("drop-overlay");
let fileDragDepth = 0;

document.addEventListener("dragenter", (event) => {
  if (isFileDrag(event) && ui.route === "curriculos") {
    fileDragDepth += 1;
    dropOverlay().hidden = false;
  }
});

document.addEventListener("dragleave", (event) => {
  if (isFileDrag(event) && ui.route === "curriculos") {
    fileDragDepth = Math.max(0, fileDragDepth - 1);
    if (fileDragDepth === 0) dropOverlay().hidden = true;
  }
  const column = event.target.closest?.("[data-column]");
  if (column && !column.contains(event.relatedTarget)) column.classList.remove("column--over");
});

document.addEventListener("dragover", (event) => {
  if (isFileDrag(event)) {
    event.preventDefault();
    event.dataTransfer.dropEffect = ui.route === "curriculos" ? "copy" : "none";
    document.querySelectorAll(".resume--drop").forEach((card) => card.classList.remove("resume--drop"));
    event.target.closest?.("[data-resume]")?.classList.add("resume--drop");
    return;
  }
  const column = event.target.closest?.("[data-column]");
  if (column && draggedId !== null) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    column.classList.add("column--over");
  }
});

document.addEventListener("drop", (event) => {
  if (isFileDrag(event)) {
    event.preventDefault();
    fileDragDepth = 0;
    dropOverlay().hidden = true;
    if (ui.route !== "curriculos") return;
    const file = event.dataTransfer.files[0];
    if (!file) return;
    const card = event.target.closest?.("[data-resume]");
    if (card) {
      ui.replace = { id: Number(card.dataset.resume), file };
      render();
    } else {
      createResumeFromFile(file);
    }
    return;
  }
  const column = event.target.closest?.("[data-column]");
  if (column && draggedId !== null) {
    event.preventDefault();
    column.classList.remove("column--over");
    moveApplication(draggedId, column.dataset.column);
  }
});

document.getElementById("file-input").addEventListener("change", (event) => {
  const file = event.target.files[0];
  event.target.value = "";
  if (file) createResumeFromFile(file);
});

/* ==========================================================================
   Início
   ========================================================================== */

readUrl();
render();
setTimeout(() => {
  ui.loading = false;
  render();
}, 350);
