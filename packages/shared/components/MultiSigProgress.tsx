import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { MultiSigAuthority, MultisigProgress } from '../services/chainService';

interface MultiSigProgressProps {
    authority: MultiSigAuthority;
    progress: MultisigProgress;
    currentUser: string;
    currentUserWeight: number;
}

export const MultiSigProgress: React.FC<MultiSigProgressProps> = ({
    authority,
    progress,
    currentUser,
    currentUserWeight
}) => {
    const { t } = useTranslation();
    const percentage = Math.min(100, (progress.currentWeight / progress.threshold) * 100);

    const isDone = progress.canBroadcast;

    return (
        <div className={`w-full bg-dark-800 rounded-xl p-6 border transition-all duration-500 shadow-lg animate-fade-in ${isDone ? 'border-green-500/50 bg-green-500/5' : 'border-dark-600'}`}>
            <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-6 text-center">
                {t('multisig.progress_title')}
            </h3>

            {/* Threshold Meter */}
            <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                    <div>
                        <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full transition-colors duration-500 ${isDone ? 'text-green-600 bg-green-200' : 'text-blue-600 bg-blue-200'}`}>
                            {isDone ? t('multisig.success_done') : t('multisig.status_collecting')}
                        </span>
                    </div>
                    <div className="text-right">
                        <span className={`text-xs font-semibold inline-block transition-colors duration-500 ${isDone ? 'text-green-400' : 'text-blue-400'}`}>
                            {progress.currentWeight} / {progress.threshold} {t('multisig.weight_label')}
                        </span>
                    </div>
                </div>

                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-dark-900 border border-dark-700">
                    {/* Accumulated Weight */}
                    <div
                        style={{ width: `${percentage}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-700 ${isDone ? 'bg-green-500' : 'bg-blue-500'}`}
                    ></div>

                    {/* Current User Potential Contribution */}
                    {!isDone && currentUserWeight > 0 && (
                        <div
                            style={{ width: `${Math.min(100 - percentage, (currentUserWeight / progress.threshold) * 100)}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-400/30 animate-pulse border-l border-blue-400/50"
                        ></div>
                    )}
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 px-1">
                    <span>0</span>
                    <span className={`${isDone ? 'text-green-400' : 'text-blue-400'} font-bold transition-colors duration-500`}>
                        {t('multisig.threshold_label')}: {progress.threshold}
                    </span>
                </div>
            </div>

            {/* Participants List */}
            <div className="mt-8 space-y-3">
                <p className="text-[10px] uppercase text-slate-500 border-b border-dark-700 pb-2 mb-2">
                    {t('multisig.authorities_title')}
                </p>

                {authority.keyAuths.map(([key, weight]) => (
                    <div key={key} className="flex justify-between items-center bg-dark-900/50 p-2 rounded-lg group hover:bg-dark-900 transition-colors">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                            <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-300 truncate w-32">
                                {key.substring(0, 8)}...{key.substring(key.length - 8)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold transition-colors ${isDone ? 'text-green-400' : 'text-slate-300'}`}>+{weight}</span>
                        </div>
                    </div>
                ))}

                {authority.accountAuths.map(([acc, weight]) => (
                    <div key={acc} className="flex justify-between items-center bg-dark-900/50 p-2 rounded-lg group hover:bg-dark-900 transition-colors">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${acc === currentUser ? (isDone ? 'bg-green-500' : 'bg-blue-500 animate-pulse') : 'bg-slate-600'}`}></div>
                            <span className={`text-xs ${acc === currentUser ? (isDone ? 'text-green-400 font-bold' : 'text-blue-400 font-bold') : 'text-slate-400 group-hover:text-slate-200'}`}>
                                @{acc} {acc === currentUser && t('multisig.you_label')}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold transition-colors ${isDone ? 'text-green-400' : 'text-slate-300'}`}>+{weight}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Didactic Hint */}
            <div className={`mt-6 p-4 rounded-lg border transition-colors duration-500 ${isDone ? 'bg-green-500/5 border-green-500/10' : 'bg-blue-500/5 border-blue-500/10'}`}>
                <p className={`text-[10px] leading-relaxed italic transition-colors duration-500 ${isDone ? 'text-green-400' : 'text-blue-400'}`}>
                    {t('multisig.how_it_works', { threshold: progress.threshold })}
                </p>
            </div>
        </div>
    );
};

