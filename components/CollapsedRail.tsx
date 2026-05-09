"use client";

import { LogoMark, SparklesIcon, SearchIcon, LayersIcon, DatabaseIcon, PanelOpenIcon, SettingsIcon } from "./icons";

interface CollapsedRailProps {
  onExpand: () => void;
  onOpenSettings: () => void;
}

export function CollapsedRail({ onExpand, onOpenSettings }: CollapsedRailProps) {
  return (
    <nav className="rail">
      <button className="rail-logo" onClick={onExpand} title="Open chat">
        <LogoMark size={26} />
      </button>
      <button className="rail-btn rail-active" title="Dashboard">
        <SparklesIcon size={16} />
      </button>
      <button className="rail-btn" title="Search">
        <SearchIcon size={16} />
      </button>
      <button className="rail-btn" title="History">
        <LayersIcon size={16} />
      </button>
      <button className="rail-btn" title="Live data">
        <DatabaseIcon size={16} />
      </button>
      <span className="rail-divider" />
      <button className="rail-btn" title="Open chat" onClick={onExpand}>
        <PanelOpenIcon size={16} />
      </button>
      <span className="rail-spacer" />
      <button className="rail-btn" title="Settings" onClick={onOpenSettings}>
        <SettingsIcon size={16} />
      </button>
    </nav>
  );
}
