declare const chrome: any;

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple translations dictionary (extensible)
const translations: Record<Language, Record<string, string>> = {
    en: {
        'landing.welcome': 'Welcome Back',
        'landing.subtitle': 'Select a network to manage your assets',
        'landing.manage_keys': 'Manage Keys',
        'landing.dapp_browser': 'dApp Browser',
        'wallet.active_key_tooltip': 'Active Key Present',
        'wallet.posting_key_tooltip': 'Posting Key Present',
        'wallet.refresh_tooltip': 'Refresh Balances',
        'wallet.send': 'Send',
        'wallet.receive': 'Receive',
        'wallet.history': 'History',
        'wallet.keys': 'Keys',
        'wallet.network_label': 'Active Network',
        'bulk.analyze': 'Analyze Security',
        'bulk.analyzing': 'Analyzing...',
        'bulk.success': 'Analysis: No risks found.',
        'bulk.switch_network': 'Switch Network',
        // Sidebar
        'sidebar.home': 'Home',
        'sidebar.wallet': 'Wallet',
        'sidebar.bulk': 'Bulk Transfers',
        'sidebar.multisig': 'MultiSig',
        'sidebar.manage': 'Settings',
        'sidebar.lock': 'Lock Wallet',
        'sidebar.pin': 'Detach Window',
        'sidebar.dock': 'Dock Window',
        // Actions
        'action.select_network': 'Select Network',
        'action.manage_keys': 'Manage Keys',
        // Header
        'header.add': '+ Add',
        // Import
        'import.title': 'Import Wallet',
        'import.manual': 'Manual Entry',
        'import.file': 'Upload File',
        'import.select_chain': 'Select Chain',
        'import.username': 'Username',
        'import.checking': 'Checking chain...',
        'import.found': '✓ Found on Chain',
        'import.not_found': 'Account not found',
        'import.private_keys': 'Private Keys (Paste at least one)',
        'import.key_posting': 'POSTING KEY',
        'import.key_active': 'ACTIVE KEY',
        'import.key_memo': 'MEMO KEY',
        'import.invalid_format': 'Invalid Format',
        'import.save': 'Save Account',
        'import.verifying': 'Verifying Keys...',
        'import.placeholder_username': 'username',
        'import.placeholder_key': 'Starts with 5...',
        // Settings
        'settings.title': 'Configure your wallet',
        'settings.accounts_title': 'Managed Accounts',
        'settings.remove': 'Remove',
        'settings.add_new': 'Add New Account',
        'settings.no_accounts': 'No accounts found.',
        'settings.security_title': 'Security',
        'settings.change_password': 'Change Access Password',
        'settings.biometrics': 'Use Biometrics',
        'settings.reset': 'Reset Wallet',
        // MultiSig
        'multisig.title': 'MultiSig Wallet',
        'multisig.initiator': 'Initiator',
        'multisig.threshold': 'Threshold',
        'multisig.signers': 'Signers',
        'multisig.proposal': 'Proposal',
        'multisig.expiration': 'Expiration',
        'multisig.create': 'Create Proposal',
        'multisig.approve': 'Approve',
        'multisig.construction_title': 'Under Construction...',
        'multisig.construction_desc': 'We are currently building this feature to ensure maximum security and functionality.',
        // Bulk
        'bulk.title': 'Bulk Transfer',
        'bulk.recipients': 'Recipients',
        'bulk.count': 'Count',
        'bulk.check': 'Check Validity',
        'bulk.checking': 'Checking...',
        'bulk.amount': 'Amount',
        'bulk.memo': 'Memo',
        'bulk.same_amount': 'Same Amount',
        'bulk.diff_amount': 'Different Amounts',
        'bulk.add_row': '+ Add Row',
        'bulk.verify': 'Verify',
        'bulk.import': 'Import CSV/TXT',
        'bulk.total': 'Total',
        'bulk.sign_broadcast': 'Sign & Broadcast',
        // Lock Screen
        'lock.title': 'Welcome Back',
        'lock.unlock': 'Unlock Wallet',
        'lock.password_placeholder': 'Enter Password',
        'lock.pin_placeholder': 'Enter 6-digit PIN',
        'lock.use_pin': 'Use PIN',
        'lock.use_password': 'Use Password',
        'lock.biometrics': 'Unlock with Biometrics',
        'lock.reset': 'Reset Wallet',
        'lock.confirm_reset': 'Are you sure? This will wipe all data!',
        'lock.create_title': 'Create Master Password',
        'lock.unlock_title': 'Unlock Your Wallet',
        'lock.create_btn': 'Create Wallet',
        'lock.unlock_btn': 'Unlock',
        'lock.processing': 'Processing...',
        'lock.placeholder_create': 'Set Master Password',
        'lock.placeholder_enter': 'Enter Master Password',
        'lock.error_length': 'Password must be at least 8 characters',
        'lock.or_sign_up': 'Or sign up with',
        'lock.or_unlock': 'Or unlock with',
        'lock.clear_reset': 'Clear Local Data & Reset',
        'lock.session_expired': 'Session expired. Please unlock to save changes.',
        // Sidebar
        'sidebar.language': 'Language',
        // Manage Account
        'manage.title': 'Manage Account',
        'manage.subtitle': '@{name} • {chain}',
        'manage.invalid_posting': 'Invalid Posting Key format',
        'manage.invalid_active': 'Invalid Active Key format',
        'manage.invalid_memo': 'Invalid Memo Key format',
        'manage.validating': 'Validating Keys...',
        'manage.save_verify': 'Save & Verify',
        'manage.remove_link': 'Remove Account',
        'manage.verify_fail': 'Key Validation Failed: ',
        'manage.success': 'Account verified and saved!',
        'manage.confirm_remove_title': 'Remove @{name}?',
        'manage.confirm_remove_desc': 'This will remove the account keys. Cannot be undone.',
        'manage.cancel': 'Cancel',
        'manage.confirm_remove': 'Remove',
        'manage.add_posting': 'Add Posting Private Key',
        'manage.add_active': 'Add Active Private Key',
        'manage.add_memo': 'Add Memo Private Key',
        // New Import Keys
        'import.success_file_parsed': 'File parsed. Accounts found: ',
        'import.error_file_read': 'Error reading file.',
        'import.drag_drop': 'Drag & Drop JSON/CSV/TXT file',
        'import.click_upload': 'or click to upload',
        'import.processing': 'Processing...',
        'import.bulk_summary': 'Imported {count} accounts.',
        'import.no_valid_accounts': 'No valid accounts found in file.',
        // Security
        'security.analysis_prompt': 'Please analyze this crypto transaction for safety risks in English: ',

        'history.title': 'History: {user}',
        'history.loading': 'Loading history...',
        'history.empty': 'No transfers found in recent history.',
        'history.received': 'Received',
        'history.sent': 'Sent',
        'history.from': 'From',
        'history.to': 'To',

        // Sign Request
        'sign.title': 'Signature Request',
        'sign.transfer_title': 'Transfer Request',
        'sign.vote_title': 'Vote Request',
        'sign.custom_json_title': 'Custom JSON',
        'sign.operation': 'Operation',
        'sign.params': 'Parameters',
        'sign.author': 'Author',
        'sign.weight': 'Weight',
        'sign.id': 'ID',
        'sign.json_payload': 'Payload',
        'sign.from': 'From',
        'sign.to': 'To',
        'sign.reject': 'Reject',
        'sign.confirm': 'Confirm',
        'sign.signing': 'Signing...',
        'sign.local_file': 'Local File',
        'sign.unknown_source': 'Unknown Source',
        'sign.loading': 'Loading request...',
        'sign.error': 'Error',
        'sign.account_not_found': 'Account not found in this wallet.',
        'sign.keys_missing': 'Keys missing for this account.',
        'sign.user_rejected': 'User rejected request',
        'sign.success': 'Signed successfully',
        'sign.trust_domain': 'Trust this site (Don\'t ask again)',

        // Errors
        'validation.invalid_amount': 'Please enter a valid amount greater than 0.',
        'validation.required': 'All fields are required.',
        'validation.account_not_found': 'Account not found on {chain}',

        // Transfer Review
        'transfer.available': 'Available:',
        'transfer.memo_placeholder': 'Public note',
        'transfer.review_title': 'Confirm Transfer',
        'transfer.review_btn': 'Review Transfer',
        'transfer.back': 'Back',
        'transfer.total_amount': 'Total Amount',
        'transfer.per_user': 'Per User:',
        'transfer.please_review': 'Please review carefully.',
        'transfer.operations': 'Operations',
    },
    es: {
        'landing.welcome': 'Bienvenido',
        'landing.subtitle': 'Selecciona una red para gestionar tus activos',
        'landing.manage_keys': 'Gestionar Llaves',
        'landing.dapp_browser': 'Navegador dApp',
        'wallet.active_key_tooltip': 'Llave Activa Presente',
        'wallet.posting_key_tooltip': 'Llave Posting Presente',
        'wallet.refresh_tooltip': 'Actualizar Saldos',
        'wallet.send': 'Enviar',
        'wallet.receive': 'Recibir',
        'wallet.history': 'Historial',
        'wallet.keys': 'LLAVES',
        'wallet.no_accounts_chain': 'No hay cuentas añadidas para {chain}',
        'wallet.add_one': 'Añadir Cuenta',
        'wallet.network_label': 'Red Activa',
        'bulk.analyze': 'Analizar Seguridad',
        'bulk.analyzing': 'Analizando...',
        'bulk.success': 'Análisis: Sin riesgos detectados.',
        'bulk.switch_network': 'Cambiar Red',
        // Sidebar
        'sidebar.home': 'Inicio',
        'sidebar.wallet': 'Billetera',
        'sidebar.bulk': 'Transf. Masiva',
        'sidebar.multisig': 'Multi-firma',
        'sidebar.manage': 'Configuración',
        'sidebar.lock': 'Bloquear',
        'sidebar.pin': 'Desanclar Ventana',
        'sidebar.dock': 'Anclar Ventana',
        // Actions
        'action.select_network': 'Seleccionar Red',
        'action.manage_keys': 'Administrar Llaves',
        // Header
        'header.add': '+ Añadir',
        // Import
        'import.title': 'Importar Billetera',
        'import.manual': 'Entrada Manual',
        'import.file': 'Subir Archivo',
        'import.select_chain': 'Seleccionar Red',
        'import.username': 'Usuario',
        'import.checking': 'Comprobando red...',
        'import.found': '✓ Encontrado',
        'import.not_found': 'Cuenta no encontrada',
        'import.private_keys': 'Llaves Privadas (Pegar al menos una)',
        'import.key_posting': 'LLAVE POSTING',
        'import.key_active': 'LLAVE ACTIVA',
        'import.key_memo': 'LLAVE MEMO',
        'import.invalid_format': 'Formato Inválido',
        'import.save': 'Guardar Cuenta',
        'import.verifying': 'Verificando...',
        'import.placeholder_username': 'nombre de usuario',
        'import.placeholder_key': 'Comienza con 5...',
        // Settings
        'settings.title': 'Configura tu wallet',
        'settings.accounts_title': 'Cuentas Gestionadas',
        'settings.remove': 'Eliminar',
        'settings.add_new': 'Añadir Nueva Cuenta',
        'settings.no_accounts': 'No hay cuentas encontradas.',
        'settings.security_title': 'Seguridad',
        'settings.change_password': 'Cambiar Contraseña',
        'settings.biometrics': 'Usar Biometría',
        'settings.reset': 'Reiniciar Billetera',
        // MultiSig
        'multisig.title': 'Billetera Multi-firma',
        'multisig.initiator': 'Iniciador',
        'multisig.threshold': 'Umbral',
        'multisig.signers': 'Firmantes',
        'multisig.proposal': 'Propuesta',
        'multisig.expiration': 'Expiración',
        'multisig.create': 'Crear Propuesta',
        'multisig.approve': 'Aprobar',
        'multisig.construction_title': 'En Construcción...',
        'multisig.construction_desc': 'Estamos construyendo esta funcionalidad para asegurar la máxima seguridad.',
        // Bulk
        'bulk.title': 'Transferencia Masiva',
        'bulk.recipients': 'Destinatarios',
        'bulk.count': 'Recuento',
        'bulk.check': 'Verificar Validez',
        'bulk.checking': 'Comprobando...',
        'bulk.amount': 'Cantidad',
        'bulk.memo': 'Memo',
        'bulk.same_amount': 'Misma Cantidad',
        'bulk.diff_amount': 'Cantidades Diferentes',
        'bulk.add_row': '+ Añadir Fila',
        'bulk.verify': 'Verificar',
        'bulk.import': 'Importar CSV/TXT',
        'bulk.total': 'Total',
        'bulk.sign_broadcast': 'Firmar y Transmitir',
        // Lock Screen
        'lock.title': 'Bienvenido',
        'lock.unlock': 'Desbloquear',
        'lock.password_placeholder': 'Contraseña',
        'lock.pin_placeholder': 'PIN de 6 dígitos',
        'lock.use_pin': 'Usar PIN',
        'lock.use_password': 'Usar Contraseña',
        'lock.biometrics': 'Usar Biometría',
        'lock.reset': 'Reiniciar Billetera',
        'lock.confirm_reset': '¿Seguro? ¡Se borrarán los datos!',
        'lock.create_title': 'Crear Contraseña Maestra',
        'lock.unlock_title': 'Desbloquear Billetera',
        'lock.create_btn': 'Crear Billetera',
        'lock.unlock_btn': 'Desbloquear',
        'lock.processing': 'Procesando...',
        'lock.placeholder_create': 'Establecer Contraseña',
        'lock.placeholder_enter': 'Introducir Contraseña',
        'lock.error_length': 'La contraseña debe tener al menos 8 caracteres',
        'lock.or_sign_up': 'O regístrate con',
        'lock.or_unlock': 'O desbloquea con',
        'lock.clear_reset': 'Borrar Datos Locales y Reiniciar',
        'lock.session_expired': 'Sesión expirada. Desbloquea para guardar cambios.',
        // Sidebar
        'sidebar.language': 'Idioma',
        // Manage Account
        'manage.title': 'Gestionar Cuenta',
        'manage.subtitle': '@{name} • {chain}',
        'manage.invalid_posting': 'Formato de Llave Posting Inválido',
        'manage.invalid_active': 'Formato de Llave Activa Inválido',
        'manage.invalid_memo': 'Formato de Llave Memo Inválido',
        'manage.validating': 'Validando Llaves...',
        'manage.save_verify': 'Guardar y Verificar',
        'manage.remove_link': 'Eliminar Cuenta',
        'manage.verify_fail': 'Validación Fallida: ',
        'manage.success': '¡Cuenta verificada y guardada!',
        'manage.confirm_remove_title': '¿Eliminar @{name}?',
        'manage.confirm_remove_desc': 'Esto eliminará las llaves de la cuenta. No se puede deshacer.',
        'manage.cancel': 'Cancelar',
        'manage.confirm_remove': 'Eliminar',
        'manage.add_posting': 'Añadir Llave Privada Posting',
        'manage.add_active': 'Añadir Llave Privada Activa',
        'manage.add_memo': 'Añadir Llave Privada Memo',
        // New Import Keys
        'import.success_file_parsed': 'Archivo analizado. Cuentas: ',
        'import.error_file_read': 'Error al leer archivo.',
        'import.drag_drop': 'Arrastra archivo JSON/CSV/TXT',
        'import.click_upload': 'o click para subir',
        'import.processing': 'Procesando...',
        'import.bulk_summary': 'Importadas {count} cuentas.',
        'import.no_valid_accounts': 'No se encontraron cuentas válidas.',
        // Security
        'security.analysis_prompt': 'Por favor analiza esta transacción en busca de riesgos en Español: ',

        'history.title': 'Historial: {user}',
        'history.loading': 'Cargando historial...',
        'history.empty': 'No se encontraron transferencias recientes.',
        'history.received': 'Recibido',
        'history.sent': 'Enviado',
        'history.from': 'De',
        'history.to': 'Para',

        // Sign Request
        'sign.title': 'Solicitud de Firma',
        'sign.transfer_title': 'Solicitud de Transferencia',
        'sign.vote_title': 'Solicitud de Voto',
        'sign.custom_json_title': 'JSON Personalizado',
        'sign.operation': 'Operación',
        'sign.params': 'Parámetros',
        'sign.author': 'Autor',
        'sign.weight': 'Peso',
        'sign.id': 'ID',
        'sign.json_payload': 'Contenido (Payload)',
        'sign.from': 'De',
        'sign.to': 'Para',
        'sign.reject': 'Rechazar',
        'sign.confirm': 'Confirmar',
        'sign.signing': 'Firmando...',
        'sign.local_file': 'Archivo Local',
        'sign.unknown_source': 'Fuente Desconocida',
        'sign.loading': 'Cargando solicitud...',
        'sign.error': 'Error',
        'sign.account_not_found': 'Cuenta no encontrada en esta billetera.',
        'sign.keys_missing': 'Faltan llaves para esta cuenta.',
        'sign.user_rejected': 'El usuario rechazó la solicitud',
        'sign.success': 'Firmado exitosamente',
        'sign.trust_domain': 'Confiar en este sitio (No volver a preguntar)',

        // Errors
        'validation.invalid_amount': 'Por favor ingresa una cantidad válida mayor a 0.',
        'validation.required': 'Todos los campos son obligatorios.',
        'validation.account_not_found': 'Cuenta no encontrada en {chain}',

        // Transfer Review
        'transfer.available': 'Disponible:',
        'transfer.memo_placeholder': 'Nota pública',
        'transfer.review_title': 'Confirmar Envío',
        'transfer.review_btn': 'Revisar Transferencia',
        'transfer.back': 'Atrás',
        'transfer.total_amount': 'Cantidad Total',
        'transfer.per_user': 'Por Usuario:',
        'transfer.please_review': 'Por favor revisa atentamente.',
        'transfer.operations': 'Operaciones',
    }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

    // Load verified language from storage if available
    useEffect(() => {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get(['language'], (res: any) => {
                if (res.language && (res.language === 'en' || res.language === 'es')) {
                    setLanguage(res.language);
                }
            });
        }
    }, []);

    const changeLanguage = (lang: Language) => {
        setLanguage(lang);
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.set({ language: lang });
        }
    };

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};
