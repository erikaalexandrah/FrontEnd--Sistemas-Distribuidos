// utils/settings.ts
export type Settings = {
  username: string;
  language: "es" | "en" | "pt";
  audio: {
    master: number;
    music: number;
    sfx: number;
  };
  chatEnabled: boolean;
  chatNotifications: boolean;
};

const LS_KEY = "eow_settings_v1";

export const DEFAULTS: Settings = {
  username: "Operador_21",
  language: "es",
  audio: { master: 80, music: 60, sfx: 85 },
  chatEnabled: true,
  chatNotifications: true,
};

// Leer configuraciones
export function getSettings(): Settings {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULTS,
      ...parsed,
      audio: { ...DEFAULTS.audio, ...(parsed.audio || {}) },
    };
  } catch {
    return DEFAULTS;
  }
}

// Guardar configuraciones
export function saveSettings(settings: Settings) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error("Error guardando configuración:", err);
  }
}

//  Obtener solo el idioma
export function getLanguage(): "es" | "en" | "pt" {
  return getSettings().language || "es";
}

// Obtener solo el nombre de jugador
export function getUsername(): string {
  return getSettings().username || "Operador_21";
}
