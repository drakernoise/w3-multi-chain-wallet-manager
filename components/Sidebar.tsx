import React from 'react';
import { ViewState } from '../types';
import { useTranslation } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onLock: () => void;
  isDetached?: boolean;
  onToggleDetach?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onChangeView,
  onLock,
  isDetached = false,
  onToggleDetach
}) => {
  const { t } = useTranslation();

  return (
    <aside className="w-16 bg-dark-800 border-r border-dark-700 flex flex-col items-center py-4 gap-6 shrink-0 z-20">

      {/* App Logo */}
      <img
        src="/logowallet.png"
        alt="Gravity"
        onClick={() => onChangeView(ViewState.LANDING)}
        className="w-10 h-10 object-contain mb-2 drop-shadow-md hover:scale-110 transition-transform cursor-pointer"
      />

      {/* Home Icon */}
      <NavIcon
        active={currentView === ViewState.LANDING}
        onClick={() => onChangeView(ViewState.LANDING)}
        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />}
        label={t('sidebar.home') || "Home"}
      />

      <div className="h-px w-8 bg-dark-600" />

      {/* Feature Navigation */}
      <div className="flex flex-col gap-4 w-full items-center flex-1">
        <NavIcon
          active={currentView === ViewState.WALLET}
          onClick={() => onChangeView(ViewState.WALLET)}
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />}
          label={t('sidebar.wallet') || "Wallet"}
        />
        <NavIcon
          active={currentView === ViewState.BULK}
          onClick={() => onChangeView(ViewState.BULK)}
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />}
          label={t('sidebar.bulk') || "Bulk"}
        />
        <NavIcon
          active={currentView === ViewState.MULTISIG}
          onClick={() => onChangeView(ViewState.MULTISIG)}
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
          label={t('sidebar.multisig') || "Multi"}
        />
        <div className="h-px w-8 bg-dark-600 my-1" />
        <NavIcon
          active={currentView === ViewState.MANAGE}
          onClick={() => onChangeView(ViewState.MANAGE)}
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />}
          label={t('sidebar.manage') || "Settings"}
        />
      </div>

      <div className="mt-auto flex flex-col items-center gap-2 mb-2">
        <NavIcon
          active={currentView === ViewState.HELP}
          onClick={() => onChangeView(ViewState.HELP)}
          icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
          label={t('help.title') || "Help"}
        />

        {/* Language Toggle */}
        <LanguageToggle direction="right-up" />
      </div>

      {/* Pin/Detach Button */}
      {onToggleDetach && (
        <button
          onClick={onToggleDetach}
          className={`mb-2 p-2 transition-colors ${isDetached ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
          title={isDetached ? t('sidebar.dock') : t('sidebar.pin')}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z" /></svg>
        </button>
      )}

      {/* Lock Button */}
      <button
        onClick={onLock}
        className="mb-2 text-slate-500 hover:text-red-400 transition-colors p-2"
        title={t('sidebar.lock') || "Lock Wallet"}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
      </button>

    </aside>
  );
};

const NavIcon: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all ${active ? 'bg-dark-700 text-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.2)] scale-105 border border-dark-600' : 'text-slate-500 hover:bg-dark-700 hover:text-slate-300'}`}
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {icon}
    </svg>
    {/* Tooltip */}
    <span className="absolute left-12 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-dark-600 z-50">
      {label}
    </span>
  </button>
);