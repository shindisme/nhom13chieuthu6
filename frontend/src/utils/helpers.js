export const AVATAR_COLORS = [
  "bg-indigo-600",
  "bg-emerald-600",
  "bg-orange-500",
  "bg-rose-500",
  "bg-cyan-600",
  "bg-violet-600",
  "bg-amber-600",
  "bg-teal-600",
];

export const getAvatarColor = (id) => AVATAR_COLORS[(id ?? 0) % AVATAR_COLORS.length];

export const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (name.charAt(0) || "U").toUpperCase();
};

export const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

export const formatMoney = (value) =>
  Number(value || 0)
    .toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 })
    .replace("₫", "đ");

export const formatShortMoney = (value) => {
  if (value >= 1e9) return (value / 1e9).toFixed(1).replace(".", ",") + " tỷ đ";
  if (value >= 1e6) return (value / 1e6).toFixed(1).replace(".", ",") + " tr. đ";
  return formatMoney(value);
};

export const removeAccents = (str) => {
  if (!str) return "";
  return String(str).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};
