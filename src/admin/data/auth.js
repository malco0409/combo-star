// src/data/auth.js
// Foydalanuvchilar — keyinroq backendga ulash mumkin
// Rollar: "admin" | "operator" | "ishchi"
const USERS = [
  { id: "1", username: "admin",     password: "admin123",  role: "admin",    name: "Admin"     },
  { id: "abdullox", username: "abdullox",  password: "abd850",    role: "operator", name: "Abdullox"  },
  { id: "umidjon", username: "umidjon",   password: "umid132",   role: "operator", name: "Umidjon"   },
  { id: "Abdujalil", username: "abdujalil", password: "abdujalil", role: "ishchi",   name: "Abdujalil" },
  { id: "Ayubxon", username: "ayub",      password: "ayub",      role: "ishchi",   name: "Ayub"      },
  { id: "Komiljon", username: "komil",     password: "komil",     role: "ishchi",   name: "Komil"     },
  { id: "Fozil", username: "fozil",     password: "fozil",     role: "ishchi",   name: "Fozil"     },
];

// Yangi xodim qo'shish:
// { id: "8", username: "ism", password: "parol", role: "ishchi", name: "To'liq ism" },

export function login(username, password) {
  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    const session = { id: user.id, username: user.username, role: user.role, name: user.name };
    localStorage.setItem("crm_session", JSON.stringify(session));
    return session;
  }
  return null;
}

export function logout() {
  localStorage.removeItem("crm_session");
}

export function getSession() {
  try {
    const raw = localStorage.getItem("crm_session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAdmin(session) {
  return session?.role === "admin";
}

// ─── Davomat moduli uchun qo'shimcha funksiyalar ────────────────────────────

// Barcha foydalanuvchilar ro'yxati (parolsiz) — Admin panelida ism/rol ko'rsatish uchun
export function getAllUsers() {
  return USERS.map(({ id, username, role, name }) => ({ id, username, role, name }));
}

// Faqat "ishchi" rolidagilar — Davomat moduli uchun
export function getEmployees() {
  return USERS
    .filter((u) => u.role === "ishchi")
    .map(({ id, username, role, name }) => ({ id, username, role, name }));
}