"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CyberpunkRainScene from "../components/CyberpunkRainScene";
import {
  getSettings,
  saveSettings,
  DEFAULTS,
  type Settings,
} from "../utils/settings";
import { TRANSLATIONS } from "../utils/traductions/settings";
import Section from "../components/Section";
import Toggle from "../components/Toggle";
import Slider from "../components/Slider";
import Field from "../components/Field";

export default function SettingsPage() {
  const [loaded, setLoaded] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Cargar configuración
  useEffect(() => {
    const s = getSettings();
    setSettings(s);
    setLoaded(true);
  }, []);

  // Guardar cambios
  const handleSave = () => {
    setSaving(true);
    try {
      saveSettings(settings);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 1600);
    } finally {
      setTimeout(() => setSaving(false), 500);
    }
  };

  const canNotify = useMemo(() => settings.chatEnabled, [settings.chatEnabled]);

  // Traducciones según idioma actual
  const t = TRANSLATIONS[settings.language] || TRANSLATIONS.es;

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center font-body text-[#cfd8ff] bg-[#050510]/95 backdrop-blur overflow-hidden">
      <CyberpunkRainScene />

      <section
        className="relative z-10 flex flex-row items-stretch
        w-full max-w-5xl h-[82vh] mx-auto
        bg-[#0b0e1a]/80 border-2 border-[#25b6f8]
        shadow-[0_0_80px_#00eaff50,0_0_10px_#03173750_inset]
        rounded-3xl overflow-hidden pointer-events-auto"
      >
        {/* HUD IZQUIERDA */}
        <aside className="hidden md:flex flex-col justify-between items-center w-24 bg-gradient-to-b from-[#07264b80] to-transparent border-r border-[#2adbf555]">
          <div className="mt-7 flex flex-col items-center gap-4">
            <span className="px-2 py-1 rounded bg-[#111f3344] text-cyan-300 text-xs font-mono tracking-wider">
              AJUSTES
            </span>
            <span className="text-[11px] text-[#38e0ff]">NODE_21</span>
            <span className="w-5 h-5 rounded-full border-[2.5px] border-[#2adbf8] bg-[#151f3250] shadow-[0_0_13px_#0bbfff] animate-pulse" />
            <span className="block mt-12 border-b border-[#2adbf555] w-10 opacity-40" />
            <span className="text-xs text-[#0deaffaa]">canal cifrado</span>
          </div>
          <div className="mb-6 text-cyan-800 text-[10px] font-mono opacity-60">
            <span>●</span> <span className="blink">cfg</span>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <div className="flex-1 flex flex-col h-full px-6 md:px-8 py-7 md:py-10">
          <h1
            className="text-2xl md:text-4xl font-title uppercase font-bold tracking-[0.15em]
            text-transparent bg-clip-text bg-gradient-to-r from-[#25b6f8] via-[#55d9fb] to-[#bbfafe]
            drop-shadow-[0_0_25px_#00eaffcc] mb-4 text-center"
          >
            {t.title}
          </h1>

          <div className="overflow-y-auto max-h-[58vh] pr-1 md:pr-2 space-y-7">
            {/* PERFIL */}
            <Section title={t.profile}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label={t.fieldUsername}>
                  <input
                    type="text"
                    value={settings.username}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        username: e.target.value.slice(0, 24),
                      }))
                    }
                    placeholder={t.fieldUsername}
                    className="w-full bg-[#0e1c33]/70 border border-[#1aa8e255] focus:border-[#25b6f8] rounded-md px-3 py-2 outline-none transition text-[#e6f5ff] placeholder:text-[#87b6d8aa] shadow-[inset_0_0_12px_rgba(0,200,255,0.08)]"
                  />
                  <p className="text-[11px] text-[#8bc9ff99] mt-1">
                    {t.usernameHint}
                  </p>
                </Field>

                <Field label={t.fieldLanguage}>
                  <select
                    value={settings.language}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        language: e.target.value as Settings["language"],
                      }))
                    }
                    className="w-full bg-[#0e1c33]/70 border border-[#1aa8e255] focus:border-[#25b6f8] rounded-md px-3 py-2 outline-none transition text-[#e6f5ff] shadow-[inset_0_0_12px_rgba(0,200,255,0.08)]"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="pt">Português</option>
                  </select>
                </Field>
              </div>
            </Section>

            {/* AUDIO */}
            <Section title={t.audio}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Slider
                  label={t.volume}
                  value={settings.audio.master}
                  onChange={(v) =>
                    setSettings((s) => ({
                      ...s,
                      audio: { ...s.audio, master: v },
                    }))
                  }
                />
              </div>
              <p className="text-[11px] text-[#8bc9ff88] mt-2">
                {t.audioHint}
              </p>
            </Section>

            {/* CHAT */}
            <Section title={t.chat}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Toggle
                  label={t.chatEnable}
                  checked={settings.chatEnabled}
                  onChange={(checked) =>
                    setSettings((s) => ({
                      ...s,
                      chatEnabled: checked,
                      chatNotifications: checked
                        ? s.chatNotifications
                        : false,
                    }))
                  }
                />
                <Toggle
                  label={t.chatNotif}
                  checked={settings.chatNotifications && canNotify}
                  disabled={!canNotify}
                  onChange={(checked) =>
                    setSettings((s) => ({
                      ...s,
                      chatNotifications: checked,
                    }))
                  }
                />
              </div>
              {!canNotify && (
                <p className="text-[11px] text-[#ffddb0aa] mt-1">
                  {t.notifHint}
                </p>
              )}
            </Section>
          </div>

          {/* BOTONES */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving || !loaded}
              className="relative px-8 py-3 font-title uppercase tracking-widest text-base text-[#e8f0ff]
                bg-gradient-to-r from-[#00b3ff] via-[#13f3c3] to-[#49ff9a]
                rounded-md shadow-[0_0_30px_rgba(0,255,255,0.15)]
                hover:shadow-[0_0_57px_rgba(0,255,255,0.37)]
                transition-all duration-400 transform hover:-translate-y-1 overflow-hidden
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {saving ? t.saving : t.save}
              </span>
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0)_40%,rgba(255,255,255,0.13)_100%)] animate-shine" />
            </button>

            <Link
              href="/home"
              className="relative px-7 py-3 font-title uppercase tracking-widest text-sm text-[#b8d9ff]
                bg-gradient-to-r from-[#091b2a] via-[#0e2a47] to-[#091b2a]
                rounded-md border border-[#1a6f9d55]
                hover:border-[#25b6f8aa] hover:text-[#eaf7ff]
                shadow-[0_0_15px_rgba(0,100,200,0.15)]
                hover:shadow-[0_0_30px_rgba(0,180,255,0.25)]
                transition-all duration-300 transform hover:-translate-y-1"
            >
              {t.back}
            </Link>
          </div>
        </div>

        {/* HUD DERECHA */}
        <aside className="hidden md:flex flex-col justify-between items-center w-24 bg-gradient-to-t from-[#07264b80] to-transparent border-l border-[#2adbf555]">
          <div className="mt-7 flex flex-col items-center gap-3">
            <span className="w-5 h-5 bg-[#00eaff] rounded-full shadow-[0_0_13px_#26e4ff80]" />
            <span className="text-xs text-[#55e2ff99] font-mono tracking-tight">
              estado
            </span>
            <span className="w-4 h-4 rounded bg-[#14f2d066] mb-6" />
            <span className="border-t border-[#2adbf555] w-10 opacity-40" />
            <span className="mt-8 text-xs text-[#0deaff88] text-center">
              user
              <br />
              prefs
            </span>
          </div>
          <div className="mb-6 text-cyan-800 text-[10px] font-mono opacity-60">
            <span>●</span> <span className="blink">sync</span>
          </div>
        </aside>
      </section>

      {/* Toast de guardado */}
      {savedToast && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
          <span className="px-4 py-2 font-mono text-xs text-cyan-200 bg-[#031737dd] rounded-xl border border-[#00aaff55] backdrop-blur-md tracking-wider shadow-[0_0_16px_#00d7ff29]">
            {t.saved}
          </span>
        </div>
      )}
    </div>
  );
}
