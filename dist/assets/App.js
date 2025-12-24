import { r as reactExports, j as jsxRuntimeExports } from './vendor.js';
import { j as isBiometricsAvailable, k as getTOTPSecret, v as verifyTOTP, l as hasPinProtectedKey, m as initVaultWithGeneratedKey, n as loadInternalKeyWithPin, u as unlockVault, o as getInternalKey, r as registerBiometrics, p as initVault, q as hasTOTPConfigured, t as authenticateWithBiometrics, V as ViewState, C as Chain, w as generateSetup, x as saveTOTPSecret, y as enablePasswordless, e as broadcastPowerUp, f as broadcastPowerDown, h as broadcastDelegation, z as broadcastSavingsDeposit, A as broadcastSavingsWithdraw, B as fetchAccountData, D as broadcastRCDelegate, E as broadcastRCUndelegate, F as broadcastBulkTransfer, G as validateUsername, H as validatePrivateKey, I as verifyKeyAgainstChain, J as validateAccountKeys, K as fetchAccountHistory, b as broadcastTransfer, a as broadcastVote, c as broadcastCustomJson, s as signMessage, d as broadcastOperations, L as chatService, M as saveVault, N as fetchBalances, O as clearCryptoCache, P as getVault, Q as tryRestoreSession, R as detectWeb3Context, S as benchmarkNodes } from './chainService.js';

const calculatePasswordStrength = (password) => {
  let score = 0;
  if (!password) return 0;
  if (password.length > 8) score += 1;
  if (password.length > 12) score += 1;
  if (/[A-Z]/.test(password)) score += 0.5;
  if (/[0-9]/.test(password)) score += 0.5;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.floor(Math.min(4, score));
};
const getStrengthLabel = (score) => {
  switch (score) {
    case 0:
    case 1:
      return { label: "Weak", color: "bg-red-500" };
    case 2:
      return { label: "Medium", color: "bg-yellow-500" };
    case 3:
      return { label: "Strong", color: "bg-green-500" };
    case 4:
      return { label: "Very Strong", color: "bg-emerald-500" };
    default:
      return { label: "Weak", color: "bg-slate-500" };
  }
};

const LanguageContext = reactExports.createContext(void 0);
const translations = {
  en: {
    "landing.welcome": "Welcome Back",
    "landing.subtitle": "Select a network to manage your assets",
    "landing.manage_keys": "Manage Keys",
    "landing.dapp_browser": "dApp Browser",
    "wallet.active_key_tooltip": "Active Key Present",
    "wallet.posting_key_tooltip": "Posting Key Present",
    "wallet.refresh_tooltip": "Refresh Balances",
    "wallet.send": "Send",
    "wallet.receive": "Receive",
    "wallet.history": "History",
    "wallet.keys": "Keys",
    "wallet.network_label": "Active Network",
    "bulk.analyze": "Analyze Security",
    "bulk.analyzing": "Analyzing...",
    "bulk.success": "Analysis: No risks found.",
    "bulk.switch_network": "Switch Network",
    // Sidebar
    "sidebar.home": "Home",
    "sidebar.wallet": "Wallet",
    "sidebar.bulk": "Bulk Transfers",
    "sidebar.multisig": "MultiSig",
    "sidebar.manage": "Settings",
    "sidebar.lock": "Lock Wallet",
    "sidebar.pin": "Detach Window",
    "sidebar.dock": "Dock Window",
    // Actions
    "action.select_network": "Select Network",
    "action.manage_keys": "Manage Keys",
    // Header
    "header.add": "Add Account",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.close": "Close",
    "common.processing": "Processing...",
    "common.recent_recipients": "Recent Recipients",
    "common.account_not_found": "Account not found",
    // Import
    "import.title": "Import Wallet",
    "import.manual": "Manual Entry",
    "import.file": "Upload File",
    "import.select_chain": "Select Chain",
    "import.username": "Username",
    "import.checking": "Checking chain...",
    "import.found": "✓ Found on Chain",
    "import.not_found": "Account not found",
    "import.private_keys": "Private Keys (Paste at least one)",
    "import.key_posting": "POSTING KEY",
    "import.key_active": "ACTIVE KEY",
    "import.key_memo": "MEMO KEY",
    "import.invalid_format": "Invalid Format",
    "import.save": "Save Account",
    "import.verifying": "Verifying Keys...",
    "import.placeholder_username": "username",
    "import.placeholder_key": "Starts with 5...",
    // Settings
    "settings.title": "Configure your wallet",
    "settings.accounts_title": "Managed Accounts",
    "settings.remove": "Remove",
    "settings.add_new": "Add New Account",
    "settings.no_accounts": "No accounts found.",
    "settings.security_title": "Security",
    "settings.change_password": "Change Access Password",
    "settings.biometrics": "Use Biometrics",
    "settings.reset": "Reset Wallet",
    // MultiSig
    "multisig.title": "MultiSig Wallet",
    "multisig.initiator": "Initiator",
    "multisig.threshold": "Threshold",
    "multisig.signers": "Signers",
    "multisig.proposal": "Proposal",
    "multisig.expiration": "Expiration",
    "multisig.create": "Create Proposal",
    "multisig.approve": "Approve",
    "multisig.construction_title": "Under Construction...",
    "multisig.construction_desc": "We are currently building this feature to ensure maximum security and functionality.",
    // Bulk
    "bulk.title": "Bulk Transfer",
    "bulk.recipients": "Recipients",
    "bulk.count": "Count",
    "bulk.check": "Check Validity",
    "bulk.checking": "Checking...",
    "bulk.amount": "Amount",
    "bulk.memo": "Memo",
    "bulk.same_amount": "Same Amount",
    "bulk.diff_amount": "Different Amounts",
    "bulk.add_row": "+ Add Row",
    "bulk.verify": "Verify",
    "bulk.import": "Import CSV/TXT",
    "bulk.total": "Total",
    "bulk.sign_broadcast": "Sign & Broadcast",
    "bulk.no_accounts": "No {chain} accounts found.",
    "bulk.sending_from": "Sending from",
    "bulk.asset": "Asset:",
    "bulk.available": "Available:",
    "bulk.title_single": "Same Amount Distribution",
    "bulk.title_multi": "Multi-Amount Distribution",
    "bulk.validation_error": "Validation Error",
    "bulk.error_remove_invalid": "Please remove invalid accounts before sending.",
    "bulk.success_title": "Success!",
    "bulk.success_msg": "Sent {n} transfers successfully. TXID: {txid}...",
    "bulk.error_title": "Error",
    "bulk.error_failed": "Failed to send",
    "bulk.warn_not_found": "⚠ Warning: {n} username(s) not found on {chain} chain.",
    "bulk.error_no_active": "Active key not found for this account.",
    // Lock Screen
    "lock.title": "Welcome Back",
    "lock.unlock": "Unlock Wallet",
    "lock.password_placeholder": "Enter Password",
    "lock.pin_placeholder": "Enter 6-digit PIN",
    "lock.use_pin": "Use PIN",
    "lock.use_password": "Use Password",
    "lock.biometrics": "Unlock with Biometrics",
    "lock.reset": "Reset Wallet",
    "lock.confirm_reset": "Are you sure? This will wipe all data!",
    "lock.create_title": "Create Master Password",
    "lock.unlock_title": "Unlock Your Wallet",
    "lock.create_btn": "Create Wallet",
    "lock.unlock_btn": "Unlock",
    "lock.processing": "Processing...",
    "lock.placeholder_create": "Set Master Password",
    "lock.placeholder_enter": "Enter Master Password",
    "lock.error_length": "Password must be at least 8 characters",
    "lock.or_sign_up": "Or sign up with",
    "lock.or_unlock": "Or unlock with",
    "lock.clear_reset": "Clear Local Data & Reset",
    "lock.session_expired": "Session expired. Please unlock to save changes.",
    "lock.confirm_password": "Confirm Password",
    "lock.passwords_not_match": "Passwords do not match",
    "lock.weak": "Weak",
    "lock.medium": "Medium",
    "lock.strong": "Strong",
    "lock.very_strong": "Very Strong",
    "lock.security_strength": "Security",
    // Auth
    "auth.authenticator": "Authenticator App (2FA)",
    "auth.configure_title": "Setup Authenticator",
    "auth.scan_qr": "Scan this QR code with Aegis or Google Auth.",
    "auth.enter_code": "Enter the 6-digit code to verify.",
    "auth.verify": "Verify",
    "auth.success": "Authenticator configured successfully!",
    "auth.backup_code": "Backup Key (Manual Entry)",
    "auth.configure_desc": "Configure Aegis, Google Auth, or Authy",
    // Sidebar
    "sidebar.language": "Language",
    // Manage Account
    "manage.title": "Manage Account",
    "manage.subtitle": "@{name} • {chain}",
    "manage.invalid_posting": "Invalid Posting Key format",
    "manage.invalid_active": "Invalid Active Key format",
    "manage.invalid_memo": "Invalid Memo Key format",
    "manage.validating": "Validating Keys...",
    "manage.save_verify": "Save & Verify",
    "manage.remove_link": "Remove Account",
    "manage.verify_fail": "Key Validation Failed: ",
    "manage.success": "Account verified and saved!",
    "manage.confirm_remove_title": "Remove @{name}?",
    "manage.confirm_remove_desc": "This will remove the account keys. Cannot be undone.",
    "manage.cancel": "Cancel",
    "manage.confirm_remove": "Remove",
    "manage.add_posting": "Add Posting Private Key",
    "manage.add_active": "Add Active Private Key",
    "manage.add_memo": "Add Memo Private Key",
    // New Import Keys
    "import.success_file_parsed": "File parsed. Accounts found: ",
    "import.error_file_read": "Error reading file.",
    "import.drag_drop": "Drag & Drop JSON/CSV/TXT file",
    "import.click_upload": "or click to upload",
    "import.processing": "Processing...",
    "import.bulk_summary": "Imported {count} accounts.",
    "import.no_valid_accounts": "No valid accounts found in file.",
    // Security
    "security.analysis_prompt": "Please analyze this crypto transaction for safety risks in English: ",
    "history.title": "History: {user}",
    "history.loading": "Loading history...",
    "history.empty": "No transfers found in recent history.",
    "history.received": "Received",
    "history.sent": "Sent",
    "history.from": "From",
    "history.to": "To",
    // Sign Request
    "sign.title": "Signature Request",
    "sign.transfer_title": "Transfer Request",
    "sign.vote_title": "Vote Request",
    "sign.custom_json_title": "Custom JSON",
    "sign.operation": "Operation",
    "sign.params": "Parameters",
    "sign.author": "Author",
    "sign.weight": "Weight",
    "sign.id": "ID",
    "sign.json_payload": "Payload",
    "sign.from": "From",
    "sign.to": "To",
    "sign.reject": "Reject",
    "sign.confirm": "Confirm",
    "sign.signing": "Signing...",
    "sign.local_file": "Local File",
    "sign.unknown_source": "Unknown Source",
    "sign.loading": "Loading request...",
    "sign.error": "Error",
    "sign.account_not_found": "Account not found in this wallet.",
    "sign.keys_missing": "Keys missing for this account.",
    "sign.user_rejected": "User rejected request",
    "sign.success": "Signed successfully",
    "sign.trust_domain": "Trust this site (Don't ask again)",
    // Errors
    "validation.invalid_amount": "Please enter a valid amount greater than 0.",
    "validation.required": "All fields are required.",
    "validation.account_not_found": "Account not found on {chain}",
    // Transfer Review
    "transfer.available": "Available:",
    "transfer.memo_placeholder": "Public note",
    "transfer.review_title": "Confirm Transfer",
    "transfer.review_btn": "Review Transfer",
    "transfer.back": "Back",
    "transfer.total_amount": "Total Amount",
    "transfer.per_user": "Per User:",
    "transfer.please_review": "Please review carefully.",
    "transfer.operations": "Operations",
    "transfer.no_memo": "No Memo",
    "transfer.optional": "(Optional)",
    // Receive Modal
    "receive.title": "Receive Funds",
    "receive.scan_qr": "Scan QR to send {chain} to this account",
    "receive.account_name": "Account Name",
    "receive.copied": "Copied!",
    "receive.copy": "Copy",
    "receive.close": "Close",
    // Manage Keys Extra
    "manage.label_posting": "Posting Key",
    "manage.label_active": "Active Key",
    "manage.label_memo": "Memo Key",
    // Import Errors Extra
    "import.error_username": "Please enter a valid, existing username.",
    "import.error_format": "One or more keys have an invalid format.",
    "import.error_missing_key": "You must provide at least one private key.",
    "import.match_error_posting": "Posting Key does not match the account on chain.",
    "import.match_error_active": "Active Key does not match the account on chain.",
    "import.match_error_memo": "Memo Key does not match the account on chain.",
    // Sign Request Extra
    "sign.expired": "Request expired or not found",
    "sign.active_key_missing": "Active Key missing",
    "sign.key_missing_type": "{type} key missing for this account",
    "sign.key_missing_generic": "{type} key missing",
    "sign.buffer_title": "Sign Message",
    "sign.message_label": "Message",
    "sign.key_type": "Key",
    // Help Guide
    "help.title": "User Guide",
    "help.keys_title": "Managing Keys",
    "help.keys_desc": "Your account security depends on your keys. Never share your Master Password or Private Keys.",
    "help.posting_key_label": "Posting Key",
    "help.posting_key_desc": "Use this for social actions like voting, posting, and following.",
    "help.active_key_label": "Active Key",
    "help.active_key_desc": "Required for financial transactions like transfers and power ups.",
    "help.memo_key_label": "Memo Key",
    "help.memo_key_desc": "Used to encrypt and decrypt private messages.",
    "help.transactions_title": "Transactions",
    "help.transactions_desc": "Easily manage your assets across multiple chains.",
    "help.transfers_point": "Send funds to any user securely.",
    "help.history_point": "View incoming and outgoing transfers.",
    "help.bulk_point": "Use Bulk Transfer for mass distributions.",
    "help.power_title": "Power & Staking",
    "help.power_desc": "Put your tokens to work by staking them (Powering Up).",
    "help.power_point": "Power Up to increase your voting influence and earn more rewards.",
    "help.power_down_point": "Power Down converts Power back to tokens over 13 weeks.",
    "help.delegate_point": "Delegate Power to others without losing ownership.",
    "help.savings_title": "Savings & RCs",
    "help.savings_desc": "Advanced chain features for Hive and Steem.",
    "help.savings_point": "Deposit HBD/SBD to Savings to earn interest (3-day withdraw notice).",
    "help.rc_point": "Delegate Resource Credits (Hive only) to help new users transacting.",
    "help.security_title": "Security First",
    "help.security_desc": "Transactions are signed locally. Your keys never leave your device unencrypted.",
    "help.chat_title": "Gravity Live Chat",
    "help.chat_desc": "Real-time messaging with custom rooms and DMs.",
    "help.chat_warning": "This chat uses a unique ID separate from your blockchain wallets.",
    "help.chat_cost": "Free & Instant (Off-chain)",
    // Help Buttons
    "help.btn_home": "Return to the main screen to select a network.",
    "help.btn_wallet": "Access your accounts, balances, and actions.",
    "help.btn_bulk": "Send funds to multiple accounts in a single transaction.",
    "help.btn_multisig": "Manage multi-signature accounts (Coming Soon).",
    "help.btn_settings": "Configure accounts, security, and preferences.",
    "help.btn_lock": "Lock your wallet immediately.",
    "help.btn_detach": "Open the wallet in a separate floating window.",
    "help.btn_send": "Transfer funds to another user.",
    "help.btn_receive": "Show QR code to receive funds.",
    "help.btn_history": "View your recent transaction history.",
    "help.btn_keys": "View and manage your private keys.",
    "help.btn_powerup": "Convert tokens to Power to increase voting influence.",
    "help.btn_powerdown": "Start the 13-week power down process.",
    "help.btn_delegate": "Delegate your Power to another account.",
    "help.btn_savings": "Deposit stablecoins to earn interest (Hive/Steem only).",
    "help.btn_rc": "Delegate Resource Credits to help others transact (Hive only).",
    // Power Operations
    "power.powerup_title": "Power Up",
    "power.powerdown_title": "Power Down",
    "power.delegate_title": "Delegate Power",
    "power.powerup_desc": "Convert {token} to {power} to increase your voting power",
    "power.powerdown_desc": "Start powering down your {power} (13 weeks process)",
    "power.delegate_desc": "Delegate your {power} to another account",
    "power.from_account": "From Account",
    "power.recipient": "Recipient",
    "power.recipient_placeholder": "username",
    "power.recipient_hint": "Leave as your username to power up yourself",
    "power.delegatee": "Delegate To",
    "power.delegatee_placeholder": "username",
    "power.amount_token": "Amount ({token})",
    "power.amount_vests": "Amount ({power})",
    "power.powerup_hint": "This will convert {token} to {power}",
    "power.powerdown_hint": "Enter amount in {power} to power down",
    "power.delegate_hint": "Enter amount in {power} to delegate",
    "power.invalid_amount": "Please enter a valid amount",
    "power.invalid_recipient": "Please enter a valid recipient",
    "power.active_key_required": "Active key is required for this operation",
    "power.operation_failed": "Operation failed",
    "power.success": "Operation successful!",
    "power.stop_powerdown": "Stop Power Down",
    "power.stop_powerdown_warning": "This will cancel your active power down. Click Confirm to proceed.",
    "power.available_power": "Available {power}",
    // Savings Operations
    "savings.deposit_title": "Deposit to Savings",
    "savings.withdraw_title": "Withdraw from Savings",
    "savings.deposit_desc": "Earn interest by depositing {token} to savings",
    "savings.withdraw_desc": "Withdraw {token} from savings (3 days waiting period)",
    "savings.account": "Account",
    "savings.amount": "Amount ({token})",
    "savings.deposit_hint": "Funds will be available for withdrawal after 3 days",
    "savings.withdraw_hint": "Withdrawal will be processed after 3 days",
    "savings.deposit_info": "Savings earn interest and have a 3-day withdrawal period for security",
    "savings.withdraw_info": "Withdrawals take 3 days to process. You can cancel during this time.",
    "savings.invalid_amount": "Please enter a valid amount",
    "savings.active_key_required": "Active key is required for this operation",
    "savings.operation_failed": "Operation failed",
    "savings.success": "Operation successful!",
    "savings.not_available": "Not Available",
    "savings.blurt_not_supported": "Blurt does not support savings feature",
    // RC Operations
    "rc.hive_only": "Resource Credits (RC) delegation is only available on the Hive blockchain.",
    "rc.delegate_title": "Delegate Resource Credits",
    "rc.undelegate_title": "Undelegate Resource Credits",
    "rc.delegate_desc": "Help new accounts by delegating them Resource Credits.",
    "rc.undelegate_desc": "Stop delegating RC to an account.",
    "rc.from_account": "From Account",
    "rc.delegatee": "Delegate To",
    "rc.delegatee_placeholder": "username",
    "rc.max_rc": "RC Amount",
    "rc.max_rc_hint": "Enter the amount of RC you want to delegate.",
    "rc.invalid_delegatee": "Please enter a valid delegatee username",
    "rc.invalid_amount": "Please enter a valid RC amount",
    "rc.active_key_required": "Active key is required for RC delegation",
    "rc.operation_failed": "RC Operation failed",
    "rc.success": "RC delegation updated successfully!",
    "rc.not_available": "RC Not Available",
    "rc.delegate_info": "Delegating RC allows accounts to perform more operations on Hive.",
    "rc.undelegate_info": "This will remove the RC delegation from this account."
  },
  es: {
    "landing.welcome": "Bienvenido",
    "landing.subtitle": "Selecciona una red para gestionar tus activos",
    "landing.manage_keys": "Gestionar Llaves",
    "landing.dapp_browser": "Navegador dApp",
    "wallet.active_key_tooltip": "Llave Activa Presente",
    "wallet.posting_key_tooltip": "Llave Posting Presente",
    "wallet.refresh_tooltip": "Actualizar Saldos",
    "wallet.send": "Enviar",
    "wallet.receive": "Recibir",
    "wallet.history": "Historial",
    "wallet.keys": "LLAVES",
    "wallet.no_accounts_chain": "No hay cuentas añadidas para {chain}",
    "wallet.add_one": "Añadir Cuenta",
    "wallet.network_label": "Red Activa",
    "bulk.analyze": "Analizar Seguridad",
    "bulk.analyzing": "Analizando...",
    "bulk.success": "Análisis: Sin riesgos detectados.",
    "bulk.switch_network": "Cambiar Red",
    // Sidebar
    "sidebar.home": "Inicio",
    "sidebar.wallet": "Billetera",
    "sidebar.bulk": "Transf. Masiva",
    "sidebar.multisig": "Multi-firma",
    "sidebar.manage": "Configuración",
    "sidebar.lock": "Bloquear",
    "sidebar.pin": "Desanclar Ventana",
    "sidebar.dock": "Anclar Ventana",
    // Actions
    "action.select_network": "Seleccionar Red",
    "action.manage_keys": "Administrar Llaves",
    // Header
    "header.add": "Añadir Cuenta",
    "common.cancel": "Cancelar",
    "common.confirm": "Confirmar",
    "common.close": "Cerrar",
    "common.processing": "Procesando...",
    "common.recent_recipients": "Recipientes Recientes",
    "common.account_not_found": "Cuenta no encontrada",
    // Import
    "import.title": "Importar Billetera",
    "import.manual": "Entrada Manual",
    "import.file": "Subir Archivo",
    "import.select_chain": "Seleccionar Red",
    "import.username": "Usuario",
    "import.checking": "Comprobando red...",
    "import.found": "✓ Encontrado",
    "import.not_found": "Cuenta no encontrada",
    "import.private_keys": "Llaves Privadas (Pegar al menos una)",
    "import.key_posting": "LLAVE POSTING",
    "import.key_active": "LLAVE ACTIVA",
    "import.key_memo": "LLAVE MEMO",
    "import.invalid_format": "Formato Inválido",
    "import.save": "Guardar Cuenta",
    "import.verifying": "Verificando...",
    "import.placeholder_username": "nombre de usuario",
    "import.placeholder_key": "Comienza con 5...",
    // Settings
    "settings.title": "Configura tu wallet",
    "settings.accounts_title": "Cuentas Gestionadas",
    "settings.remove": "Eliminar",
    "settings.add_new": "Añadir Nueva Cuenta",
    "settings.no_accounts": "No hay cuentas encontradas.",
    "settings.security_title": "Seguridad",
    "settings.change_password": "Cambiar Contraseña",
    "settings.biometrics": "Usar Biometría",
    "settings.reset": "Reiniciar Billetera",
    // MultiSig
    "multisig.title": "Billetera Multi-firma",
    "multisig.initiator": "Iniciador",
    "multisig.threshold": "Umbral",
    "multisig.signers": "Firmantes",
    "multisig.proposal": "Propuesta",
    "multisig.expiration": "Expiración",
    "multisig.create": "Crear Propuesta",
    "multisig.approve": "Aprobar",
    "multisig.construction_title": "En Construcción...",
    "multisig.construction_desc": "Estamos construyendo esta funcionalidad para asegurar la máxima seguridad.",
    // Bulk
    "bulk.title": "Transferencia Masiva",
    "bulk.recipients": "Destinatarios",
    "bulk.count": "Recuento",
    "bulk.check": "Verificar Validez",
    "bulk.checking": "Comprobando...",
    "bulk.amount": "Cantidad",
    "bulk.memo": "Memo",
    "bulk.same_amount": "Misma Cantidad",
    "bulk.diff_amount": "Cantidades Diferentes",
    "bulk.add_row": "+ Añadir Fila",
    "bulk.verify": "Verificar",
    "bulk.import": "Importar CSV/TXT",
    "bulk.total": "Total",
    "bulk.sign_broadcast": "Firmar y Transmitir",
    "bulk.no_accounts": "No se encontraron cuentas de {chain}.",
    "bulk.sending_from": "Enviando desde",
    "bulk.asset": "Activo:",
    "bulk.available": "Disponible:",
    "bulk.title_single": "Distribución Misma Cantidad",
    "bulk.title_multi": "Distribución Cantidades Múltiples",
    "bulk.validation_error": "Error de Validación",
    "bulk.error_remove_invalid": "Por favor elimina las cuentas inválidas antes de enviar.",
    "bulk.success_title": "¡Éxito!",
    "bulk.success_msg": "Enviadas {n} transferencias exitosamente. TXID: {txid}...",
    "bulk.error_title": "Error",
    "bulk.error_failed": "Error al enviar",
    "bulk.warn_not_found": "⚠ Advertencia: {n} usuario(s) no encontrado(s) en la red {chain}.",
    "bulk.error_no_active": "No se encontró llave activa para esta cuenta.",
    // Lock Screen
    "lock.title": "Bienvenido",
    "lock.unlock": "Desbloquear",
    "lock.password_placeholder": "Contraseña",
    "lock.pin_placeholder": "PIN de 6 dígitos",
    "lock.use_pin": "Usar PIN",
    "lock.use_password": "Usar Contraseña",
    "lock.biometrics": "Usar Biometría",
    "lock.reset": "Reiniciar Billetera",
    "lock.confirm_reset": "¿Seguro? ¡Se borrarán los datos!",
    "lock.create_title": "Crear Contraseña Maestra",
    "lock.unlock_title": "Desbloquear Billetera",
    "lock.create_btn": "Crear Billetera",
    "lock.unlock_btn": "Desbloquear",
    "lock.processing": "Procesando...",
    "lock.placeholder_create": "Establecer Contraseña",
    "lock.placeholder_enter": "Introducir Contraseña",
    "lock.error_length": "La contraseña debe tener al menos 8 caracteres",
    "lock.or_sign_up": "O regístrate con",
    "lock.or_unlock": "O desbloquea con",
    "lock.clear_reset": "Borrar Datos Locales y Reiniciar",
    "lock.session_expired": "Sesión expirada. Desbloquea para guardar cambios.",
    "lock.confirm_password": "Confirmar Contraseña",
    "lock.passwords_not_match": "Las contraseñas no coinciden",
    "lock.weak": "Débil",
    "lock.medium": "Media",
    "lock.strong": "Fuerte",
    "lock.very_strong": "Muy Fuerte",
    "lock.security_strength": "Seguridad",
    // Auth
    "auth.authenticator": "Aplicación Autenticadora (2FA)",
    "auth.configure_title": "Configurar Autenticador",
    "auth.scan_qr": "Escanea este QR con Aegis o Google Auth.",
    "auth.enter_code": "Ingresa el código de 6 dígitos para verificar.",
    "auth.verify": "Verificar",
    "auth.success": "¡Autenticador configurado exitosamente!",
    "auth.backup_code": "Clave de Respaldo (Entrada Manual)",
    "auth.configure_desc": "Configura Aegis, Google Auth, o Authy",
    // Sidebar
    "sidebar.language": "Idioma",
    // Manage Account
    "manage.title": "Gestionar Cuenta",
    "manage.subtitle": "@{name} • {chain}",
    "manage.invalid_posting": "Formato de Llave Posting Inválido",
    "manage.invalid_active": "Formato de Llave Activa Inválido",
    "manage.invalid_memo": "Formato de Llave Memo Inválido",
    "manage.validating": "Validando Llaves...",
    "manage.save_verify": "Guardar y Verificar",
    "manage.remove_link": "Eliminar Cuenta",
    "manage.verify_fail": "Validación Fallida: ",
    "manage.success": "¡Cuenta verificada y guardada!",
    "manage.confirm_remove_title": "¿Eliminar @{name}?",
    "manage.confirm_remove_desc": "Esto eliminará las llaves de la cuenta. No se puede deshacer.",
    "manage.cancel": "Cancelar",
    "manage.confirm_remove": "Eliminar",
    "manage.add_posting": "Añadir Llave Privada Posting",
    "manage.add_active": "Añadir Llave Privada Activa",
    "manage.add_memo": "Añadir Llave Privada Memo",
    // New Import Keys
    "import.success_file_parsed": "Archivo analizado. Cuentas: ",
    "import.error_file_read": "Error al leer archivo.",
    "import.drag_drop": "Arrastra archivo JSON/CSV/TXT",
    "import.click_upload": "o click para subir",
    "import.processing": "Procesando...",
    "import.bulk_summary": "Importadas {count} cuentas.",
    "import.no_valid_accounts": "No se encontraron cuentas válidas.",
    // Security
    "security.analysis_prompt": "Por favor analiza esta transacción en busca de riesgos en Español: ",
    "history.title": "Historial: {user}",
    "history.loading": "Cargando historial...",
    "history.empty": "No se encontraron transferencias recientes.",
    "history.received": "Recibido",
    "history.sent": "Enviado",
    "history.from": "De",
    "history.to": "Para",
    // Sign Request
    "sign.title": "Solicitud de Firma",
    "sign.transfer_title": "Solicitud de Transferencia",
    "sign.vote_title": "Solicitud de Voto",
    "sign.custom_json_title": "JSON Personalizado",
    "sign.operation": "Operación",
    "sign.params": "Parámetros",
    "sign.author": "Autor",
    "sign.weight": "Peso",
    "sign.id": "ID",
    "sign.json_payload": "Contenido (Payload)",
    "sign.from": "De",
    "sign.to": "Para",
    "sign.reject": "Rechazar",
    "sign.confirm": "Confirmar",
    "sign.signing": "Firmando...",
    "sign.local_file": "Archivo Local",
    "sign.unknown_source": "Fuente Desconocida",
    "sign.loading": "Cargando solicitud...",
    "sign.error": "Error",
    "sign.account_not_found": "Cuenta no encontrada en esta billetera.",
    "sign.keys_missing": "Faltan llaves para esta cuenta.",
    "sign.user_rejected": "El usuario rechazó la solicitud",
    "sign.success": "Firmado exitosamente",
    "sign.trust_domain": "Confiar en este sitio (No volver a preguntar)",
    // Errors
    "validation.invalid_amount": "Por favor ingresa una cantidad válida mayor a 0.",
    "validation.required": "Todos los campos son obligatorios.",
    "validation.account_not_found": "Cuenta no encontrada en {chain}",
    // Transfer Review
    "transfer.available": "Disponible:",
    "transfer.memo_placeholder": "Nota pública",
    "transfer.review_title": "Confirmar Envío",
    "transfer.review_btn": "Revisar Transferencia",
    "transfer.back": "Atrás",
    "transfer.total_amount": "Cantidad Total",
    "transfer.per_user": "Por Usuario:",
    "transfer.please_review": "Por favor revisa atentamente.",
    "transfer.operations": "Operaciones",
    "transfer.no_memo": "Sin Memo",
    "transfer.optional": "(Opcional)",
    // Receive Modal
    "receive.title": "Recibir Fondos",
    "receive.scan_qr": "Escanea el QR para recibir {chain} en esta cuenta",
    "receive.account_name": "Nombre de Cuenta",
    "receive.copied": "¡Copiado!",
    "receive.copy": "Copiar",
    "receive.close": "Cerrar",
    // Manage Keys Extra
    "manage.label_posting": "Clave Posting",
    "manage.label_active": "Clave Active",
    "manage.label_memo": "Clave Memo",
    // Import Errors Extra
    "import.error_username": "Ingresa un usuario válido y existente.",
    "import.error_format": "Una o más claves tienen un formato inválido.",
    "import.error_missing_key": "Debes proveer al menos una clave privada.",
    "import.match_error_posting": "La Clave Posting no coincide con la cuenta.",
    "import.match_error_active": "La Clave Active no coincide con la cuenta.",
    "import.match_error_memo": "La Clave Memo no coincide con la cuenta.",
    // Sign Request Extra
    "sign.expired": "Solicitud expirada o no encontrada",
    "sign.active_key_missing": "Falta Clave Activa",
    "sign.key_missing_type": "Falta clave {type} para esta cuenta",
    "sign.key_missing_generic": "Falta clave {type}",
    "sign.buffer_title": "Firmar Mensaje",
    "sign.message_label": "Mensaje",
    "sign.key_type": "Clave",
    // Ayuda
    "help.title": "Guía de Usuario",
    "help.keys_title": "Gestión de Llaves",
    "help.keys_desc": "La seguridad de su cuenta depende de sus llaves. Nunca comparta su Contraseña Maestra ni sus Llaves Privadas.",
    "help.posting_key_label": "Llave Posting",
    "help.posting_key_desc": "Úsela para acciones sociales como votar, publicar y seguir.",
    "help.active_key_label": "Llave Activa",
    "help.active_key_desc": "Necesaria para transacciones financieras como transferencias.",
    "help.memo_key_label": "Llave Memo",
    "help.memo_key_desc": "Utilizada para cifrar y descifrar mensajes privados.",
    "help.transactions_title": "Transacciones",
    "help.transactions_desc": "Gestione fácilmente sus activos en múltiples redes.",
    "help.transfers_point": "Envíe fondos a cualquier usuario de forma segura.",
    "help.history_point": "Vea transferencias entrantes y salientes.",
    "help.bulk_point": "Use Transferencia Masiva para distribuciones múltiples.",
    "help.power_title": "Poder (Power) y Staking",
    "help.power_desc": "Ponga sus tokens a trabajar haciendo Staking (Power Up).",
    "help.power_point": "Haga Power Up para aumentar su influencia de voto y ganar más recompensas.",
    "help.power_down_point": "El Power Down convierte su Poder de nuevo en tokens durante 13 semanas.",
    "help.delegate_point": "Delegue Poder a otros sin perder la propiedad de sus activos.",
    "help.savings_title": "Ahorros y RCs",
    "help.savings_desc": "Funciones avanzadas para Hive y Steem.",
    "help.savings_point": "Deposite HBD/SBD en Ahorros para ganar intereses (aviso de retiro de 3 días).",
    "help.rc_point": "Delegue Créditos de Recursos (solo Hive) para ayudar a otros usuarios.",
    "help.security_title": "Seguridad ante todo",
    "help.security_desc": "Las transacciones se firman localmente. Sus llaves nunca salen de su dispositivo sin cifrar.",
    "help.chat_title": "Messenger Seguro",
    "help.chat_desc": "Envía mensajes encriptados en la cadena.",
    "help.chat_warning": "Mensajes públicos pero encriptados. Solo emisor/receptor pueden leer.",
    "help.chat_cost": "Costo por mensaje: 0.001 (transferencia min)",
    // Help Buttons
    "help.btn_home": "Volver a la pantalla principal para seleccionar red.",
    "help.btn_wallet": "Acceder a sus cuentas, saldos y acciones.",
    "help.btn_bulk": "Enviar fondos a múltiples cuentas en una sola transacción.",
    "help.btn_multisig": "Gestionar cuentas multi-firma (Próximamente).",
    "help.btn_settings": "Configurar cuentas, seguridad y preferencias.",
    "help.btn_lock": "Bloquear su billetera inmediatamente.",
    "help.btn_detach": "Abrir la billetera en una ventana flotante separada.",
    "help.btn_send": "Transferir fondos a otro usuario.",
    "help.btn_receive": "Mostrar código QR para recibir fondos.",
    "help.btn_history": "Ver su historial de transacciones recientes.",
    "help.btn_keys": "Ver y gestionar sus llaves privadas.",
    "help.btn_powerup": "Convertir tokens a Power para aumentar influencia de voto.",
    "help.btn_powerdown": "Iniciar el proceso de power down de 13 semanas.",
    "help.btn_delegate": "Delegar tu Power a otra cuenta.",
    "help.btn_savings": "Depositar stablecoins para ganar intereses (solo Hive/Steem).",
    "help.btn_rc": "Delegar Créditos de Recursos para ayudar a otros a transaccionar (solo Hive).",
    // Operaciones de Power
    "power.powerup_title": "Power Up",
    "power.powerdown_title": "Power Down",
    "power.delegate_title": "Delegar Power",
    "power.powerup_desc": "Convertir {token} a {power} para aumentar tu poder de voto",
    "power.powerdown_desc": "Iniciar power down de tu {power} (proceso de 13 semanas)",
    "power.delegate_desc": "Delegar tu {power} a otra cuenta",
    "power.from_account": "Desde Cuenta",
    "power.recipient": "Destinatario",
    "power.recipient_placeholder": "usuario",
    "power.recipient_hint": "Deja tu usuario para hacer power up a ti mismo",
    "power.delegatee": "Delegar A",
    "power.delegatee_placeholder": "usuario",
    "power.amount_token": "Cantidad ({token})",
    "power.amount_vests": "Cantidad ({power})",
    "power.powerup_hint": "Esto convertirá {token} a {power}",
    "power.powerdown_hint": "Ingrese la cantidad en {power} para retirar",
    "power.delegate_hint": "Ingrese la cantidad en {power} para delegar",
    "power.invalid_amount": "Por favor ingresa una cantidad válida",
    "power.invalid_recipient": "Por favor ingresa un destinatario válido",
    "power.active_key_required": "Se requiere la clave activa para esta operación",
    "power.operation_failed": "Operación fallida",
    "power.success": "¡Operación exitosa!",
    "power.stop_powerdown": "Detener Power Down",
    "power.stop_powerdown_warning": "Esto cancelará tu power down activo. Haz clic en Confirmar para proceder.",
    "power.available_power": "{power} Disponible",
    // Operaciones de Ahorros
    "savings.deposit_title": "Depositar en Ahorros",
    "savings.withdraw_title": "Retirar de Ahorros",
    "savings.deposit_desc": "Gana intereses depositando {token} en ahorros",
    "savings.withdraw_desc": "Retirar {token} de ahorros (período de espera de 3 días)",
    "savings.account": "Cuenta",
    "savings.amount": "Cantidad ({token})",
    "savings.deposit_hint": "Los fondos estarán disponibles para retiro después de 3 días",
    "savings.withdraw_hint": "El retiro se procesará después de 3 días",
    "savings.deposit_info": "Los ahorros generan intereses y tienen un período de retiro de 3 días por seguridad",
    "savings.withdraw_info": "Los retiros tardan 3 días en procesarse. Puedes cancelar durante este tiempo.",
    "savings.invalid_amount": "Por favor ingresa una cantidad válida",
    "savings.active_key_required": "Se requiere la clave activa para esta operación",
    "savings.operation_failed": "Operación fallida",
    "savings.success": "¡Operación exitosa!",
    "savings.not_available": "No Disponible",
    "savings.blurt_not_supported": "Blurt no soporta la función de ahorros",
    // Operaciones de RC
    "rc.hive_only": "La delegación de Créditos de Recursos (RC) solo está disponible en Hive.",
    "rc.delegate_title": "Delegar RC",
    "rc.undelegate_title": "Quitar Delegación RC",
    "rc.delegate_desc": "Ayuda a cuentas nuevas delegándoles Créditos de Recursos.",
    "rc.undelegate_desc": "Deja de delegar RC a una cuenta.",
    "rc.from_account": "Desde la Cuenta",
    "rc.delegatee": "Delegar a",
    "rc.delegatee_placeholder": "usuario",
    "rc.max_rc": "Cantidad de RC",
    "rc.max_rc_hint": "Ingrese la cantidad de RC que desea delegar.",
    "rc.invalid_delegatee": "Por favor ingrese un usuario válido",
    "rc.invalid_amount": "Por favor ingrese una cantidad de RC válida",
    "rc.active_key_required": "Se requiere la clave activa para delegar RC",
    "rc.operation_failed": "La operación de RC falló",
    "rc.success": "¡Delegación de RC actualizada con éxito!",
    "rc.not_available": "RC No Disponible",
    "rc.delegate_info": "Delegar RC permite que las cuentas realicen más operaciones en Hive.",
    "rc.undelegate_info": "Esto eliminará la delegación de RC de esta cuenta."
  },
  fr: {
    "landing.welcome": "Bon retour",
    "landing.subtitle": "Sélectionnez un réseau pour gérer vos actifs",
    "landing.manage_keys": "Gérer les clés",
    "landing.dapp_browser": "Navigateur dApp",
    "wallet.active_key_tooltip": "Clé Active présente",
    "wallet.posting_key_tooltip": "Clé Posting présente",
    "wallet.refresh_tooltip": "Actualiser les soldes",
    "wallet.send": "Envoyer",
    "wallet.receive": "Recevoir",
    "wallet.history": "Historique",
    "wallet.keys": "CLÉS",
    "wallet.network_label": "Réseau Actif",
    "wallet.no_accounts_chain": "Aucun compte ajouté pour {chain}",
    "wallet.add_one": "Ajouter un compte",
    "bulk.analyze": "Analyser la sécurité",
    "bulk.analyzing": "Analyse en cours...",
    "bulk.success": "Analyse : Aucun risque détecté.",
    "bulk.switch_network": "Changer de réseau",
    // Sidebar
    "sidebar.home": "Accueil",
    "sidebar.wallet": "Portefeuille",
    "sidebar.bulk": "Envoi Massif",
    "sidebar.multisig": "MultiSig",
    "sidebar.manage": "Paramètres",
    "sidebar.lock": "Verrouiller",
    "sidebar.pin": "Détacher Fenêtre",
    "sidebar.dock": "Ancrer Fenêtre",
    "sidebar.language": "Langue",
    // Actions
    "action.select_network": "Sélectionner Réseau",
    "action.manage_keys": "Gérer les clés",
    // Header
    "header.add": "Ajouter un compte",
    "common.cancel": "Annuler",
    "common.confirm": "Confirmer",
    "common.close": "Fermer",
    "common.processing": "Traitement...",
    "common.recent_recipients": "Destinataires Récents",
    "common.account_not_found": "Compte non trouvé",
    // Import
    "import.title": "Importer Portefeuille",
    "import.manual": "Saisie Manuelle",
    "import.file": "Téléverser Fichier",
    "import.select_chain": "Sélectionner Chaîne",
    "import.username": "Nom d'utilisateur",
    "import.checking": "Vérification chaîne...",
    "import.found": "✓ Trouvé",
    "import.not_found": "Compte non trouvé",
    "import.private_keys": "Clés Privées (Coller au moins une)",
    "import.key_posting": "CLÉ POSTING",
    "import.key_active": "CLÉ ACTIVE",
    "import.key_memo": "CLÉ MEMO",
    "import.invalid_format": "Format Invalide",
    "import.save": "Enregistrer",
    "import.verifying": "Vérification...",
    "import.placeholder_username": "nom d'utilisateur",
    "import.placeholder_key": "Commence par 5...",
    "import.error_username": "Veuillez entrer un nom d'utilisateur valide.",
    "import.error_format": "Une ou plusieurs clés ont un format invalide.",
    "import.error_missing_key": "Vous devez fournir au moins une clé privée.",
    "import.match_error_posting": "La clé Posting ne correspond pas au compte.",
    "import.match_error_active": "La clé Active ne correspond pas au compte.",
    "import.match_error_memo": "La clé Memo ne correspond pas au compte.",
    "import.success_file_parsed": "Fichier analysé. Comptes : ",
    "import.error_file_read": "Erreur de lecture du fichier.",
    "import.drag_drop": "Glisser-déposer fichier JSON/CSV/TXT",
    "import.click_upload": "ou cliquer pour téléverser",
    "import.processing": "Traitement...",
    "import.bulk_summary": "{count} comptes importés.",
    "import.no_valid_accounts": "Aucun compte valide trouvé.",
    // Settings
    "settings.title": "Configurer votre portefeuille",
    "settings.accounts_title": "Comptes Gérés",
    "settings.remove": "Supprimer",
    "settings.add_new": "Ajouter Nouveau Compte",
    "settings.no_accounts": "Aucun compte trouvé.",
    "settings.security_title": "Sécurité",
    "settings.change_password": "Changer Mot de Passe",
    "settings.biometrics": "Utiliser Biométrie",
    "settings.reset": "Réinitialiser Portefeuille",
    // MultiSig
    "multisig.title": "Portefeuille MultiSig",
    "multisig.initiator": "Initiateur",
    "multisig.threshold": "Seuil",
    "multisig.signers": "Signataires",
    "multisig.proposal": "Proposition",
    "multisig.expiration": "Expiration",
    "multisig.create": "Créer Proposition",
    "multisig.approve": "Approuver",
    "multisig.construction_title": "En Construction...",
    "multisig.construction_desc": "Nous développons cette fonctionnalité pour assurer une sécurité maximale.",
    // Bulk
    "bulk.title": "Transfert Massif",
    "bulk.recipients": "Destinataires",
    "bulk.count": "Nombre",
    "bulk.check": "Vérifier Validité",
    "bulk.checking": "Vérification...",
    "bulk.amount": "Montant",
    "bulk.memo": "Mémo",
    "bulk.same_amount": "Même Montant",
    "bulk.diff_amount": "Montants Différents",
    "bulk.add_row": "+ Ajouter Ligne",
    "bulk.verify": "Vérifier",
    "bulk.import": "Importer CSV/TXT",
    "bulk.total": "Total",
    "bulk.sign_broadcast": "Signer & Diffuser",
    "bulk.no_accounts": "Aucun compte {chain} trouvé.",
    "bulk.sending_from": "Envoi depuis",
    "bulk.asset": "Actif :",
    "bulk.available": "Disponible :",
    "bulk.title_single": "Distribution Montant Unique",
    "bulk.title_multi": "Distribution Montants Multiples",
    "bulk.validation_error": "Erreur de Validation",
    "bulk.error_remove_invalid": "Veuillez supprimer les comptes invalides avant d'envoyer.",
    "bulk.success_title": "Succès !",
    "bulk.success_msg": "{n} transferts envoyés avec succès. TXID : {txid}...",
    "bulk.error_title": "Erreur",
    "bulk.error_failed": "Échec de l'envoi",
    "bulk.warn_not_found": "⚠ Attention : {n} utilisateur(s) non trouvé(s) sur la chaîne {chain}.",
    "bulk.error_no_active": "Clé active non trouvée pour ce compte.",
    // Lock Screen
    "lock.title": "Bon retour",
    "lock.unlock": "Déverrouiller",
    "lock.password_placeholder": "Entrer Mot de Passe",
    "lock.pin_placeholder": "PIN à 6 chiffres",
    "lock.use_pin": "Utiliser PIN",
    "lock.use_password": "Utiliser Mot de Passe",
    "lock.biometrics": "Déverrouiller avec Biométrie",
    "lock.reset": "Réinitialiser",
    "lock.confirm_reset": "Êtes-vous sûr ? Cela effacera toutes les données !",
    "lock.create_title": "Créer Mot de Passe Maître",
    "lock.unlock_title": "Déverrouiller votre Portefeuille",
    "lock.create_btn": "Créer Portefeuille",
    "lock.unlock_btn": "Déverrouiller",
    "lock.processing": "Traitement...",
    "lock.placeholder_create": "Définir Mot de Passe",
    "lock.placeholder_enter": "Entrer Mot de Passe",
    "lock.error_length": "Le mot de passe doit comporter au moins 8 caractères",
    "lock.or_sign_up": "Ou s'inscrire avec",
    "lock.or_unlock": "Ou déverrouiller avec",
    "lock.clear_reset": "Effacer Données Locales & Réinitialiser",
    "lock.session_expired": "Session expirée. Veuillez déverrouiller pour enregistrer.",
    "lock.confirm_password": "Confirmer le mot de passe",
    "lock.passwords_not_match": "Les mots de passe ne correspondent pas",
    "lock.weak": "Faible",
    "lock.medium": "Moyen",
    "lock.strong": "Fort",
    "lock.very_strong": "Très Fort",
    "lock.security_strength": "Sécurité",
    // Auth
    "auth.authenticator": "Application d'authentification (2FA)",
    "auth.configure_title": "Configurer l'authentification",
    "auth.scan_qr": "Scannez ce QR code avec Aegis ou Google Auth.",
    "auth.enter_code": "Entrez le code à 6 chiffres pour vérifier.",
    "auth.verify": "Vérifier",
    "auth.success": "Authentification configurée avec succès !",
    "auth.backup_code": "Clé de secours (Saisie manuelle)",
    "auth.configure_desc": "Configurer Aegis, Google Auth ou Authy",
    // Manage Account
    "manage.title": "Gérer Compte",
    "manage.subtitle": "@{name} • {chain}",
    "manage.invalid_posting": "Format Clé Posting Invalide",
    "manage.invalid_active": "Format Clé Active Invalide",
    "manage.invalid_memo": "Format Clé Memo Invalide",
    "manage.validating": "Validation Clés...",
    "manage.save_verify": "Enregistrer & Vérifier",
    "manage.remove_link": "Supprimer Compte",
    "manage.verify_fail": "Échec Validation Clé : ",
    "manage.success": "Compte vérifié et enregistré !",
    "manage.confirm_remove_title": "Supprimer @{name} ?",
    "manage.confirm_remove_desc": "Ceci suprimera les clés localement. Irréversible.",
    "manage.cancel": "Annuler",
    "manage.confirm_remove": "Supprimer",
    "manage.label_posting": "Clé Posting",
    "manage.label_active": "Clé Active",
    "manage.label_memo": "Clé Memo",
    "manage.add_posting": "Ajouter Clé Privée Posting",
    "manage.add_active": "Ajouter Clé Privée Active",
    "manage.add_memo": "Ajouter Clé Privée Memo",
    // Security
    "security.analysis_prompt": "Veuillez analyser cette transaction crypto pour les risques en Français : ",
    // History
    "history.title": "Historique : {user}",
    "history.loading": "Chargement historique...",
    "history.empty": "Aucun transfert récent trouvé.",
    "history.received": "Reçu",
    "history.sent": "Envoyé",
    "history.from": "De",
    "history.to": "À",
    // Sign Request
    "sign.title": "Demande de Signature",
    "sign.transfer_title": "Demande de Transfert",
    "sign.vote_title": "Demande de Vote",
    "sign.custom_json_title": "JSON Personnalisé",
    "sign.operation": "Opération",
    "sign.params": "Paramètres",
    "sign.author": "Auteur",
    "sign.weight": "Poids",
    "sign.id": "ID",
    "sign.json_payload": "Contenu",
    "sign.from": "De",
    "sign.to": "À",
    "sign.reject": "Rejeter",
    "sign.confirm": "Confirmer",
    "sign.signing": "Signature...",
    "sign.local_file": "Fichier Local",
    "sign.unknown_source": "Source Inconnue",
    "sign.loading": "Chargement demande...",
    "sign.error": "Erreur",
    "sign.account_not_found": "Compte non trouvé dans ce portefeuille.",
    "sign.keys_missing": "Clés manquantes pour ce compte.",
    "sign.active_key_missing": "Clé Active manquante",
    "sign.key_missing_type": "Clé {type} manquante pour ce compte",
    "sign.key_missing_generic": "Clé {type} manquante",
    "sign.user_rejected": "L'utilisateur a rejeté la demande",
    "sign.success": "Signé avec succès",
    "sign.trust_domain": "Faire confiance à ce site",
    "sign.expired": "Demande expirée ou non trouvée",
    "sign.buffer_title": "Signer Message",
    "sign.message_label": "Message",
    "sign.key_type": "Clé",
    // Errors
    "validation.invalid_amount": "Veuillez entrer un montant valide supérieur à 0.",
    "validation.required": "Tous les champs sont requis.",
    "validation.account_not_found": "Compte non trouvé sur {chain}",
    // Transfer
    "transfer.available": "Disponible :",
    "transfer.memo_placeholder": "Note publique",
    "transfer.review_title": "Confirmer Transfert",
    "transfer.review_btn": "Vérifier Transfert",
    "transfer.back": "Retour",
    "transfer.total_amount": "Montant Total",
    "transfer.per_user": "Par Utilisateur :",
    "transfer.please_review": "Veuillez vérifier attentivement.",
    "transfer.operations": "Opérations",
    "transfer.no_memo": "Pas de Mémo",
    "transfer.optional": "(Optionnel)",
    // Receive
    "receive.title": "Recevoir des Fonds",
    "receive.scan_qr": "Scannez le QR pour envoyer {chain} à ce compte",
    "receive.account_name": "Nom du Compte",
    "receive.copied": "Copié !",
    "receive.copy": "Copier",
    "receive.close": "Fermer",
    // Aide
    "help.title": "Guide Utilisateur",
    "help.keys_title": "Gestion des Clés",
    "help.keys_desc": "La sécurité de votre compte dépend de vos clés. Ne partagez jamais votre mot de passe maître ou vos clés privées.",
    "help.posting_key_label": "Clé Posting",
    "help.posting_key_desc": "Utilisée pour les actions sociales comme voter, publier et suivre.",
    "help.active_key_label": "Clé Active",
    "help.active_key_desc": "Requise pour les transactions financières comme les transferts.",
    "help.memo_key_label": "Clé Memo",
    "help.memo_key_desc": "Utilisée pour chiffrer et déchiffrer les messages privés.",
    "help.transactions_title": "Transactions",
    "help.transactions_desc": "Gérez facilement vos actifs sur plusieurs réseaux.",
    "help.transfers_point": "Envoyez des fonds en toute sécurité.",
    "help.history_point": "Consultez les transferts entrants et sortants.",
    "help.bulk_point": "Utilisez le Transfert Massif pour les distributions.",
    "help.security_title": "Sécurité d'abord",
    "help.security_desc": "Les transactions sont signées localement. Vos clés restent chiffrées sur votre appareil.",
    "help.chat_title": "Gravity Chat en Direct",
    "help.chat_desc": "Messagerie en temps réel avec salons et MP.",
    "help.chat_warning": "Ce chat utilise un ID unique séparé de vos portefeuilles.",
    "help.chat_cost": "Gratuit & Instantané (Hors-chaîne)",
    // Help Buttons
    "help.btn_home": "Retourner à l'écran principal pour choisir un réseau.",
    "help.btn_wallet": "Accéder à vos comptes, soldes et actions.",
    "help.btn_bulk": "Envoyer des fonds à plusieurs comptes en une seule transaction.",
    "help.btn_multisig": "Gérer les comptes multi-signatures (Bientôt).",
    "help.btn_settings": "Configurer les comptes, la sécurité et les préférences.",
    "help.btn_lock": "Verrouiller votre portefeuille immédiatement.",
    "help.btn_detach": "Ouvrir le portefeuille dans une fenêtre flottante séparée.",
    "help.btn_send": "Transférer des fonds à un autre utilisateur.",
    "help.btn_receive": "Afficher le QR code pour recevoir des fonds.",
    "help.btn_history": "Voir votre historique de transactions récent.",
    "help.btn_keys": "Voir et gérer vos clés privées."
  },
  de: {
    "landing.welcome": "Willkommen zurück",
    "landing.subtitle": "Wählen Sie ein Netzwerk zur Verwaltung Ihrer Assets",
    "landing.manage_keys": "Schlüssel verwalten",
    "landing.dapp_browser": "dApp Browser",
    "wallet.active_key_tooltip": "Aktiver Schlüssel vorhanden",
    "wallet.posting_key_tooltip": "Posting-Schlüssel vorhanden",
    "wallet.refresh_tooltip": "Guthaben aktualisieren",
    "wallet.send": "Senden",
    "wallet.receive": "Empfangen",
    "wallet.history": "Verlauf",
    "wallet.keys": "SCHLÜSSEL",
    "wallet.network_label": "Aktives Netzwerk",
    "wallet.no_accounts_chain": "Keine Konten für {chain} hinzugefügt",
    "wallet.add_one": "Konto hinzufügen",
    "bulk.analyze": "Sicherheit analysieren",
    "bulk.analyzing": "Analysiere...",
    "bulk.success": "Analyse: Keine Risiken gefunden.",
    "bulk.switch_network": "Netzwerk wechseln",
    // Sidebar
    "sidebar.home": "Start",
    "sidebar.wallet": "Wallet",
    "sidebar.bulk": "Massenüberweisung",
    "sidebar.multisig": "MultiSig",
    "sidebar.manage": "Einstellungen",
    "sidebar.lock": "Sperren",
    "sidebar.pin": "Fenster lösen",
    "sidebar.dock": "Fenster andocken",
    "sidebar.language": "Sprache",
    // Actions
    "action.select_network": "Netzwerk wählen",
    "action.manage_keys": "Schlüssel verwalten",
    // Header
    "header.add": "Konto hinzufügen",
    "common.cancel": "Abbrechen",
    "common.confirm": "Bestätigen",
    "common.close": "Schließen",
    "common.processing": "Verarbeitung...",
    "common.recent_recipients": "Letzte Empfänger",
    "common.account_not_found": "Konto nicht gefunden",
    // Import
    "import.title": "Wallet importieren",
    "import.manual": "Manuelle Eingabe",
    "import.file": "Datei hochladen",
    "import.select_chain": "Kette wählen",
    "import.username": "Benutzername",
    "import.checking": "Prüfe Kette...",
    "import.found": "✓ Gefunden",
    "import.not_found": "Konto nicht gefunden",
    "import.private_keys": "Private Schlüssel (Mindestens einen einfügen)",
    "import.key_posting": "POSTING KEY",
    "import.key_active": "ACTIVE KEY",
    "import.key_memo": "MEMO KEY",
    "import.invalid_format": "Ungültiges Format",
    "import.save": "Konto speichern",
    "import.verifying": "Verifiziere...",
    "import.placeholder_username": "benutzername",
    "import.placeholder_key": "Beginnt mit 5...",
    "import.error_username": "Bitte geben Sie einen gültigen Benutzernamen ein.",
    "import.error_format": "Ein oder mehrere Schlüssel haben ein ungültiges Format.",
    "import.error_missing_key": "Sie müssen mindestens einen privaten Schlüssel angeben.",
    "import.match_error_posting": "Posting-Schlüssel passt nicht zum Konto.",
    "import.match_error_active": "Aktiver Schlüssel passt nicht zum Konto.",
    "import.match_error_memo": "Memo-Schlüssel passt nicht zum Konto.",
    "import.success_file_parsed": "Datei verarbeitet. Konten: ",
    "import.error_file_read": "Fehler beim Lesen der Datei.",
    "import.drag_drop": "JSON/CSV/TXT Datei hierher ziehen",
    "import.click_upload": "oder klicken zum Hochladen",
    "import.processing": "Verarbeite...",
    "import.bulk_summary": "{count} Konten importiert.",
    "import.no_valid_accounts": "Keine gültigen Konten gefunden.",
    // Settings
    "settings.title": "Wallet konfigurieren",
    "settings.accounts_title": "Verwaltete Konten",
    "settings.remove": "Entfernen",
    "settings.add_new": "Neues Konto hinzufügen",
    "settings.no_accounts": "Keine Konten gefunden.",
    "settings.security_title": "Sicherheit",
    "settings.change_password": "Passwort ändern",
    "settings.biometrics": "Biometrie verwenden",
    "settings.reset": "Wallet zurücksetzen",
    // MultiSig
    "multisig.title": "MultiSig Wallet",
    "multisig.initiator": "Initiator",
    "multisig.threshold": "Schwelle",
    "multisig.signers": "Unterzeichner",
    "multisig.proposal": "Vorschlag",
    "multisig.expiration": "Ablauf",
    "multisig.create": "Vorschlag erstellen",
    "multisig.approve": "Genehmigen",
    "multisig.construction_title": "In Bau...",
    "multisig.construction_desc": "Wir entwickeln diese Funktion für maximale Sicherheit.",
    // Bulk
    "bulk.title": "Massenüberweisung",
    "bulk.recipients": "Empfänger",
    "bulk.count": "Anzahl",
    "bulk.check": "Gültigkeit prüfen",
    "bulk.checking": "Prüfe...",
    "bulk.amount": "Betrag",
    "bulk.memo": "Memo",
    "bulk.same_amount": "Gleicher Betrag",
    "bulk.diff_amount": "Unterschiedliche Beträge",
    "bulk.add_row": "+ Zeile hinzufügen",
    "bulk.verify": "Verifizieren",
    "bulk.import": "CSV/TXT importieren",
    "bulk.total": "Gesamt",
    "bulk.sign_broadcast": "Signieren & Senden",
    "bulk.no_accounts": "Keine {chain} Konten gefunden.",
    "bulk.sending_from": "Senden von",
    "bulk.asset": "Asset:",
    "bulk.available": "Verfügbar:",
    "bulk.title_single": "Verteilung gleicher Betrag",
    "bulk.title_multi": "Verteilung unterschiedliche Beträge",
    "bulk.validation_error": "Validierungsfehler",
    "bulk.error_remove_invalid": "Bitte entfernen Sie ungültige Konten vor dem Senden.",
    "bulk.success_title": "Erfolg!",
    "bulk.success_msg": "{n} Überweisungen erfolgreich gesendet. TXID: {txid}...",
    "bulk.error_title": "Fehler",
    "bulk.error_failed": "Senden fehlgeschlagen",
    "bulk.warn_not_found": "⚠ Warnung: {n} Benutzer nicht auf der {chain} Chain gefunden.",
    "bulk.error_no_active": "Aktiver Schlüssel für dieses Konto nicht gefunden.",
    // Lock Screen
    "lock.title": "Willkommen zurück",
    "lock.unlock": "Entsperren",
    "lock.password_placeholder": "Passwort eingeben",
    "lock.pin_placeholder": "6-stellige PIN",
    "lock.use_pin": "PIN verwenden",
    "lock.use_password": "Passwort verwenden",
    "lock.biometrics": "Mit Biometrie entsperren",
    "lock.reset": "Zurücksetzen",
    "lock.confirm_reset": "Sicher? Alle Daten werden gelöscht!",
    "lock.create_title": "Master-Passwort erstellen",
    "lock.unlock_title": "Wallet entsperren",
    "lock.create_btn": "Wallet erstellen",
    "lock.unlock_btn": "Entsperren",
    "lock.processing": "Verarbeite...",
    "lock.placeholder_create": "Passwort festlegen",
    "lock.placeholder_enter": "Passwort eingeben",
    "lock.error_length": "Passwort muss mindestens 8 Zeichen lang sein",
    "lock.or_sign_up": "Oder registrieren mit",
    "lock.or_unlock": "Oder entsperren mit",
    "lock.clear_reset": "Lokale Daten löschen & Reset",
    "lock.session_expired": "Sitzung abgelaufen. Bitte entsperren.",
    "lock.confirm_password": "Passwort bestätigen",
    "lock.passwords_not_match": "Passwörter stimmen nicht überein",
    "lock.weak": "Schwach",
    "lock.medium": "Mittel",
    "lock.strong": "Stark",
    "lock.very_strong": "Sehr Stark",
    "lock.security_strength": "Sicherheit",
    // Auth
    "auth.authenticator": "Authenticator App (2FA)",
    "auth.configure_title": "Authenticator einrichten",
    "auth.scan_qr": "Scannen Sie diesen QR-Code mit Aegis oder Google Auth.",
    "auth.enter_code": "Geben Sie den 6-stelligen Code zur Überprüfung ein.",
    "auth.verify": "Überprüfen",
    "auth.success": "Authenticator erfolgreich konfiguriert!",
    "auth.backup_code": "Backup-Schlüssel (Manuelle Eingabe)",
    "auth.configure_desc": "Konfigurieren Sie Aegis, Google Auth oder Authy",
    // Manage Account
    "manage.title": "Konto verwalten",
    "manage.subtitle": "@{name} • {chain}",
    "manage.invalid_posting": "Ungültiges Posting-Key-Format",
    "manage.invalid_active": "Ungültiges Active-Key-Format",
    "manage.invalid_memo": "Ungültiges Memo-Key-Format",
    "manage.validating": "Validiere Schlüssel...",
    "manage.save_verify": "Speichern & Prüfen",
    "manage.remove_link": "Konto entfernen",
    "manage.verify_fail": "Schlüsselvalidierung fehlgeschlagen: ",
    "manage.success": "Konto verifiziert und gespeichert!",
    "manage.confirm_remove_title": "@{name} entfernen?",
    "manage.confirm_remove_desc": "Entfernt die Schlüssel. Kann nicht rückgängig gemacht werden.",
    "manage.cancel": "Abbrechen",
    "manage.confirm_remove": "Entfernen",
    "manage.label_posting": "Posting-Schlüssel",
    "manage.label_active": "Aktiver Schlüssel",
    "manage.label_memo": "Memo-Schlüssel",
    "manage.add_posting": "Posting-Schlüssel hinzufügen",
    "manage.add_active": "Aktiven Schlüssel hinzufügen",
    "manage.add_memo": "Memo-Schlüssel hinzufügen",
    // Security
    "security.analysis_prompt": "Bitte analysieren Sie diese Krypto-Transaktion auf Risiken in Deutsch: ",
    // History
    "history.title": "Verlauf: {user}",
    "history.loading": "Lade Verlauf...",
    "history.empty": "Keine kürzlichen Überweisungen gefunden.",
    "history.received": "Empfangen",
    "history.sent": "Gesendet",
    "history.from": "Von",
    "history.to": "An",
    // Sign Request
    "sign.title": "Signaturanfrage",
    "sign.transfer_title": "Überweisungsanfrage",
    "sign.vote_title": "Abstimmungsanfrage",
    "sign.custom_json_title": "Benutzerdefiniertes JSON",
    "sign.operation": "Operation",
    "sign.params": "Parameter",
    "sign.author": "Autor",
    "sign.weight": "Gewicht",
    "sign.id": "ID",
    "sign.json_payload": "Inhalt",
    "sign.from": "Von",
    "sign.to": "An",
    "sign.reject": "Ablehnen",
    "sign.confirm": "Bestätigen",
    "sign.signing": "Signiere...",
    "sign.local_file": "Lokale Datei",
    "sign.unknown_source": "Unbekannte Quelle",
    "sign.loading": "Lade Anfrage...",
    "sign.error": "Fehler",
    "sign.account_not_found": "Konto nicht in dieser Wallet gefunden.",
    "sign.keys_missing": "Schlüssel fehlen für dieses Konto.",
    "sign.active_key_missing": "Aktiver Schlüssel fehlt",
    "sign.key_missing_type": "{type}-Schlüssel fehlt für dieses Konto",
    "sign.key_missing_generic": "{type}-Schlüssel fehlt",
    "sign.user_rejected": "Benutzer hat Anfrage abgelehnt",
    "sign.success": "Erfolgreich signiert",
    "sign.trust_domain": "Dieser Seite vertrauen",
    "sign.expired": "Anfrage abgelaufen oder nicht gefunden",
    "sign.buffer_title": "Nachricht signieren",
    "sign.message_label": "Nachricht",
    "sign.key_type": "Schlüssel",
    // Errors
    "validation.invalid_amount": "Bitte geben Sie einen gültigen Betrag > 0 ein.",
    "validation.required": "Alle Felder sind erforderlich.",
    "validation.account_not_found": "Konto nicht auf {chain} gefunden",
    // Transfer
    "transfer.available": "Verfügbar:",
    "transfer.memo_placeholder": "Öffentliche Notiz",
    "transfer.review_title": "Überweisung bestätigen",
    "transfer.review_btn": "Überweisung prüfen",
    "transfer.back": "Zurück",
    "transfer.total_amount": "Gesamtbetrag",
    "transfer.per_user": "Pro Benutzer:",
    "transfer.please_review": "Bitte sorgfältig prüfen.",
    "transfer.operations": "Operationen",
    "transfer.no_memo": "Kein Memo",
    "transfer.optional": "(Optional)",
    // Receive
    "receive.title": "Guthaben empfangen",
    "receive.scan_qr": "QR scannen um {chain} an dieses Konto zu senden",
    "receive.account_name": "Kontoname",
    "receive.copied": "Kopiert!",
    "receive.copy": "Kopieren",
    "receive.close": "Schließen",
    // Hilfe
    "help.title": "Benutzerhandbuch",
    "help.keys_title": "Schlüsselverwaltung",
    "help.keys_desc": "Ihre Kontosicherheit hängt von Ihren Schlüsseln ab. Teilen Sie niemals Ihr Master-Passwort oder Ihre privaten Schlüssel.",
    "help.posting_key_label": "Posting-Schlüssel",
    "help.posting_key_desc": "Verwenden Sie dies für soziale Aktionen wie Abstimmen und Posten.",
    "help.active_key_label": "Aktiver Schlüssel",
    "help.active_key_desc": "Erforderlich für Finanztransaktionen wie Überweisungen.",
    "help.memo_key_label": "Memo-Schlüssel",
    "help.memo_key_desc": "Wird zum Verschlüsseln und Entschlüsseln privater Nachrichten verwendet.",
    "help.transactions_title": "Transaktionen",
    "help.transactions_desc": "Verwalten Sie Ihre Assets einfach über mehrere Ketten hinweg.",
    "help.transfers_point": "Senden Sie Gelder sicher an jeden Benutzer.",
    "help.history_point": "Sehen Sie eingehende und ausgehende Überweisungen.",
    "help.bulk_point": "Verwenden Sie Massenüberweisung für Verteilungen.",
    "help.security_title": "Sicherheit zuerst",
    "help.security_desc": "Transaktionen werden lokal signiert. Ihre Schlüssel verlassen Ihr Gerät nie unverschlüsselt.",
    "help.chat_title": "Gravity Live Chat",
    "help.chat_desc": "Echtzeit-Nachrichten mit Räumen und DMs.",
    "help.chat_warning": "Dieser Chat verwendet eine eindeutige ID, getrennt von Ihren Wallets.",
    "help.chat_cost": "Kostenlos & Sofort (Off-chain)",
    // Help Buttons
    "help.btn_home": "Zurück zum Hauptbildschirm, um ein Netzwerk auszuwählen.",
    "help.btn_wallet": "Zugriff auf Ihre Konten, Guthaben und Aktionen.",
    "help.btn_bulk": "Senden Sie Gelder an mehrere Konten in einer einzigen Transaktion.",
    "help.btn_multisig": "Multi-Signatur-Konten verwalten (Bald verfügbar).",
    "help.btn_settings": "Konten, Sicherheit und Einstellungen konfigurieren.",
    "help.btn_lock": "Ihr Wallet sofort sperren.",
    "help.btn_detach": "Öffnen Sie das Wallet in einem separaten schwebenden Fenster.",
    "help.btn_send": "Gelder an einen anderen Benutzer überweisen.",
    "help.btn_receive": "QR-Code anzeigen, um Gelder zu empfangen.",
    "help.btn_history": "Ihren letzten Transaktionsverlauf anzeigen.",
    "help.btn_keys": "Ihre privaten Schlüssel anzeigen und verwalten."
  },
  it: {
    "landing.welcome": "Bentornato",
    "landing.subtitle": "Seleziona una rete per gestire le tue risorse",
    "landing.manage_keys": "Gestisci Chiavi",
    "landing.dapp_browser": "Browser dApp",
    "wallet.active_key_tooltip": "Chiave Attiva Presente",
    "wallet.posting_key_tooltip": "Chiave Posting Presente",
    "wallet.refresh_tooltip": "Aggiorna Saldi",
    "wallet.send": "Invia",
    "wallet.receive": "Ricevi",
    "wallet.history": "Storico",
    "wallet.keys": "CHIAVI",
    "wallet.network_label": "Rete Attiva",
    "wallet.no_accounts_chain": "Nessun account aggiunto per {chain}",
    "wallet.add_one": "Aggiungi Account",
    "bulk.analyze": "Analisi Sicurezza",
    "bulk.analyzing": "Analisi in corso...",
    "bulk.success": "Analisi: Nessun rischio rilevato.",
    "bulk.switch_network": "Cambia Rete",
    // Sidebar
    "sidebar.home": "Home",
    "sidebar.wallet": "Portafoglio",
    "sidebar.bulk": "Trasferimento Multiplo",
    "sidebar.multisig": "MultiSig",
    "sidebar.manage": "Impostazioni",
    "sidebar.lock": "Blocca",
    "sidebar.pin": "Stacca Finestra",
    "sidebar.dock": "Ancora Finestra",
    "sidebar.language": "Lingua",
    // Actions
    "action.select_network": "Seleziona Rete",
    "action.manage_keys": "Gestisci Chiavi",
    // Header
    "header.add": "Aggiungi Account",
    "common.cancel": "Annulla",
    "common.confirm": "Conferma",
    "common.close": "Chiudi",
    "common.processing": "Elaborazione...",
    "common.recent_recipients": "Destinatari Recenti",
    "common.account_not_found": "Account non trovato",
    // Import
    "import.title": "Importa Portafoglio",
    "import.manual": "Inserimento Manuale",
    "import.file": "Carica File",
    "import.select_chain": "Seleziona Catena",
    "import.username": "Nome Utente",
    "import.checking": "Controllo catena...",
    "import.found": "✓ Trovato",
    "import.not_found": "Account non trovato",
    "import.private_keys": "Chiavi Private (Incolla almeno una)",
    "import.key_posting": "CHIAVE POSTING",
    "import.key_active": "CHIAVE ACTIVE",
    "import.key_memo": "CHIAVE MEMO",
    "import.invalid_format": "Formato Non Valido",
    "import.save": "Salva Account",
    "import.verifying": "Verifica...",
    "import.placeholder_username": "nome utente",
    "import.placeholder_key": "Inizia con 5...",
    "import.error_username": "Inserisci un nome utente valido.",
    "import.error_format": "Una o più chiavi hanno un formato non valido.",
    "import.error_missing_key": "Devi fornire almeno una chiave privata.",
    "import.match_error_posting": "La Chiave Posting non corrisponde all'account.",
    "import.match_error_active": "La Chiave Active non corrisponde all'account.",
    "import.match_error_memo": "La Chiave Memo non corrisponde all'account.",
    "import.success_file_parsed": "File analizzato. Account: ",
    "import.error_file_read": "Errore lettura file.",
    "import.drag_drop": "Trascina file JSON/CSV/TXT",
    "import.click_upload": "o clicca per caricare",
    "import.processing": "Elaborazione...",
    "import.bulk_summary": "Importati {count} account.",
    "import.no_valid_accounts": "Nessun account valido trovato.",
    // Settings
    "settings.title": "Configura il tuo wallet",
    "settings.accounts_title": "Account Gestiti",
    "settings.remove": "Rimuovi",
    "settings.add_new": "Aggiungi Nuovo Account",
    "settings.no_accounts": "Nessun account trovato.",
    "settings.security_title": "Sicurezza",
    "settings.change_password": "Cambia Password",
    "settings.biometrics": "Usa Biometria",
    "settings.reset": "Reimposta Wallet",
    // MultiSig
    "multisig.title": "Portafoglio MultiSig",
    "multisig.initiator": "Iniziatore",
    "multisig.threshold": "Soglia",
    "multisig.signers": "Firmatari",
    "multisig.proposal": "Proposta",
    "multisig.expiration": "Scadenza",
    "multisig.create": "Crea Proposta",
    "multisig.approve": "Approva",
    "multisig.construction_title": "In Costruzione...",
    "multisig.construction_desc": "Stiamo costruendo questa funzionalità per garantire la massima sicurezza.",
    // Bulk
    "bulk.title": "Trasferimento Multiplo",
    "bulk.recipients": "Destinatari",
    "bulk.count": "Conteggio",
    "bulk.check": "Controlla Validità",
    "bulk.checking": "Controllo...",
    "bulk.amount": "Importo",
    "bulk.memo": "Memo",
    "bulk.same_amount": "Stesso Importo",
    "bulk.diff_amount": "Importi Diversi",
    "bulk.add_row": "+ Aggiungi Riga",
    "bulk.verify": "Verifica",
    "bulk.import": "Importa CSV/TXT",
    "bulk.total": "Totale",
    "bulk.sign_broadcast": "Firma & Trasmetti",
    "bulk.no_accounts": "Nessun account {chain} trovato.",
    "bulk.sending_from": "Invio da",
    "bulk.asset": "Asset:",
    "bulk.available": "Disponibile:",
    "bulk.title_single": "Distribuzione Stesso Importo",
    "bulk.title_multi": "Distribuzione Importi Multipli",
    "bulk.validation_error": "Errore di Validazione",
    "bulk.error_remove_invalid": "Rimuovi gli account non validi prima di inviare.",
    "bulk.success_title": "Successo!",
    "bulk.success_msg": "Inviati {n} trasferimenti con successo. TXID: {txid}...",
    "bulk.error_title": "Errore",
    "bulk.error_failed": "Invio fallito",
    "bulk.warn_not_found": "⚠ Attenzione: {n} utente/i non trovato/i sulla catena {chain}.",
    "bulk.error_no_active": "Chiave attiva non trovata per questo account.",
    // Lock Screen
    "lock.title": "Bentornato",
    "lock.unlock": "Sblocca Wallet",
    "lock.password_placeholder": "Inserisci Password",
    "lock.pin_placeholder": "PIN 6 cifre",
    "lock.use_pin": "Usa PIN",
    "lock.use_password": "Usa Password",
    "lock.biometrics": "Sblocca con Biometria",
    "lock.reset": "Reimposta",
    "lock.confirm_reset": "Sei sicuro? Cancellerà tutti i dati!",
    "lock.create_title": "Crea Password Principale",
    "lock.unlock_title": "Sblocca il tuo Wallet",
    "lock.create_btn": "Crea Wallet",
    "lock.unlock_btn": "Sblocca",
    "lock.processing": "Elaborazione...",
    "lock.placeholder_create": "Imposta Password",
    "lock.placeholder_enter": "Inserisci Password",
    "lock.error_length": "La password deve essere di almeno 8 caratteri",
    "lock.or_sign_up": "O registrati con",
    "lock.or_unlock": "O sblocca con",
    "lock.clear_reset": "Cancella Dati Locali & Reset",
    "lock.session_expired": "Sessione scaduta. Sblocca per salvare.",
    "lock.confirm_password": "Conferma Password",
    "lock.passwords_not_match": "Le password non corrispondono",
    "lock.weak": "Debole",
    "lock.medium": "Media",
    "lock.strong": "Forte",
    "lock.very_strong": "Molto Forte",
    "lock.security_strength": "Sicurezza",
    // Auth
    "auth.authenticator": "App Autenticatore (2FA)",
    "auth.configure_title": "Configura Autenticatore",
    "auth.scan_qr": "Scansiona questo codice QR con Aegis o Google Auth.",
    "auth.enter_code": "Inserisci il codice a 6 cifre per verificare.",
    "auth.verify": "Verifica",
    "auth.success": "Autenticatore configurato con successo!",
    "auth.backup_code": "Chiave di Backup (Inserimento Manuale)",
    "auth.configure_desc": "Configura Aegis, Google Auth o Authy",
    // Manage Account
    "manage.title": "Gestisci Account",
    "manage.subtitle": "@{name} • {chain}",
    "manage.invalid_posting": "Formato Chiave Posting Invalido",
    "manage.invalid_active": "Formato Chiave Active Invalido",
    "manage.invalid_memo": "Formato Chiave Memo Invalido",
    "manage.validating": "Validazione Chiavi...",
    "manage.save_verify": "Salva & Verifica",
    "manage.remove_link": "Rimuovi Account",
    "manage.verify_fail": "Validazione Chiave Fallita: ",
    "manage.success": "Account verificato e salvato!",
    "manage.confirm_remove_title": "Rimuovere @{name}?",
    "manage.confirm_remove_desc": "Questo rimuoverà le chiavi dell'account. Non si può annullare.",
    "manage.cancel": "Annulla",
    "manage.confirm_remove": "Rimuovi",
    "manage.label_posting": "Chiave Posting",
    "manage.label_active": "Chiave Active",
    "manage.label_memo": "Chiave Memo",
    "manage.add_posting": "Aggiungi Chiave Privata Posting",
    "manage.add_active": "Aggiungi Chiave Privata Active",
    "manage.add_memo": "Aggiungi Chiave Privata Memo",
    // Security
    "security.analysis_prompt": "Per favore analizza questa transazione crypto per rischi in Italiano: ",
    // History
    "history.title": "Cronologia: {user}",
    "history.loading": "Caricamento cronologia...",
    "history.empty": "Nessun trasferimento recente trovato.",
    "history.received": "Ricevuto",
    "history.sent": "Inviato",
    "history.from": "Da",
    "history.to": "A",
    // Sign Request
    "sign.title": "Richiesta Firma",
    "sign.transfer_title": "Richiesta Trasferimento",
    "sign.vote_title": "Richiesta Voto",
    "sign.custom_json_title": "JSON Personalizzato",
    "sign.operation": "Operazione",
    "sign.params": "Parametri",
    "sign.author": "Autore",
    "sign.weight": "Peso",
    "sign.id": "ID",
    "sign.json_payload": "Contenuto",
    "sign.from": "Da",
    "sign.to": "A",
    "sign.reject": "Rifiuta",
    "sign.confirm": "Conferma",
    "sign.signing": "Firma in corso...",
    "sign.local_file": "File Locale",
    "sign.unknown_source": "Fonte Sconosciuta",
    "sign.loading": "Caricamento richiesta...",
    "sign.error": "Errore",
    "sign.account_not_found": "Account non trovato in questo wallet.",
    "sign.keys_missing": "Chiavi mancanti per questo account.",
    "sign.active_key_missing": "Chiave Attiva mancante",
    "sign.key_missing_type": "Chiave {type} mancante per questo account",
    "sign.key_missing_generic": "Chiave {type} mancante",
    "sign.user_rejected": "L'utente ha rifiutato la richiesta",
    "sign.success": "Firmato con successo",
    "sign.trust_domain": "Fidati di questo sito",
    "sign.expired": "Richiesta scaduta o non trovata",
    "sign.buffer_title": "Firma Messaggio",
    "sign.message_label": "Messaggio",
    "sign.key_type": "Chiave",
    // Errors
    "validation.invalid_amount": "Inserisci un importo valido maggiore di 0.",
    "validation.required": "Tutti i campi sono obbligatori.",
    "validation.account_not_found": "Account non trovato su {chain}",
    // Transfer
    "transfer.available": "Disponibile:",
    "transfer.memo_placeholder": "Nota pubblica",
    "transfer.review_title": "Conferma Trasferimento",
    "transfer.review_btn": "Revisiona Trasferimento",
    "transfer.back": "Indietro",
    "transfer.total_amount": "Importo Totale",
    "transfer.per_user": "Per Utente:",
    "transfer.please_review": "Per favore controlla attentamente.",
    "transfer.operations": "Operazioni",
    "transfer.no_memo": "Nessun Memo",
    "transfer.optional": "(Opzionale)",
    // Receive
    "receive.title": "Ricevi Fondi",
    "receive.scan_qr": "Scansiona il QR per inviare {chain} a questo account",
    "receive.account_name": "Nome Account",
    "receive.copied": "Copiato!",
    "receive.copy": "Copia",
    "receive.close": "Chiudi",
    // Aiuto
    "help.title": "Guida Utente",
    "help.keys_title": "Gestione Chiavi",
    "help.keys_desc": "La sicurezza del tuo account dipende dalle tue chiavi. Non condividere mai la Password Principale o le Chiavi Private.",
    "help.posting_key_label": "Chiave Posting",
    "help.posting_key_desc": "Usalo per azioni sociali come votare, pubblicare e seguire.",
    "help.active_key_label": "Chiave Attiva",
    "help.active_key_desc": "Richiesta per transazioni finanziarie come i trasferimenti.",
    "help.memo_key_label": "Chiave Memo",
    "help.memo_key_desc": "Usata per crittografare e decrittografare messaggi privati.",
    "help.transactions_title": "Transazioni",
    "help.transactions_desc": "Gestisci facilmente le tue risorse su più reti.",
    "help.transfers_point": "Invia fondi a qualsiasi utente in modo sicuro.",
    "help.history_point": "Visualizza trasferimenti in entrata e in uscita.",
    "help.bulk_point": "Usa Trasferimento Multiplo per distribuzioni di massa.",
    "help.security_title": "Sicurezza prima di tutto",
    "help.security_desc": "Le transazioni vengono firmate localmente. Le tue chiavi non lasciano mai il dispositivo non crittografate.",
    "help.chat_title": "Gravity Chat Live",
    "help.chat_desc": "Messaggistica in tempo reale con stanze e DM.",
    "help.chat_warning": "Questa chat usa un ID univoco separato dai tuoi wallet.",
    "help.chat_cost": "Gratis e Istantaneo (Off-chain)",
    // Help Buttons
    "help.btn_home": "Torna alla schermata principale per selezionare una rete.",
    "help.btn_wallet": "Accedi ai tuoi account, saldi e azioni.",
    "help.btn_bulk": "Invia fondi a più account in una singola transazione.",
    "help.btn_multisig": "Gestisci account multi-firma (Prossimamente).",
    "help.btn_settings": "Configura account, sicurezza e preferenze.",
    "help.btn_lock": "Blocca immediatamente il tuo wallet.",
    "help.btn_detach": "Apri il wallet in una finestra mobile separata.",
    "help.btn_send": "Trasferisci fondi a un altro utente.",
    "help.btn_receive": "Mostra codice QR per ricevere fondi.",
    "help.btn_history": "Visualizza la cronologia delle transazioni recenti.",
    "help.btn_keys": "Visualizza e gestisci le tue chiavi private."
  }
};
const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = reactExports.useState("en");
  reactExports.useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["language"], (res) => {
        const supported = ["en", "es", "fr", "de", "it"];
        if (res.language && supported.includes(res.language)) {
          setLanguage(res.language);
        }
      });
    }
  }, []);
  const changeLanguage = (lang) => {
    setLanguage(lang);
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.set({ language: lang });
    }
  };
  const t = (key) => {
    return translations[language][key] || key;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageContext.Provider, { value: { language, setLanguage: changeLanguage, t }, children });
};
const useTranslation = () => {
  const context = reactExports.useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};

const LanguageToggle = ({ className = "", direction = "bottom-right" }) => {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const dropdownRef = reactExports.useRef(null);
  const languages = [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
    { code: "fr", label: "Français" },
    { code: "de", label: "Deutsch" },
    { code: "it", label: "Italiano" }
  ];
  let positionClasses = "absolute right-0 top-full mt-2";
  if (direction === "right-up") {
    positionClasses = "absolute left-full bottom-0 ml-2";
  }
  reactExports.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative ${className}`, ref: dropdownRef, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        className: "text-xs font-bold text-slate-500 hover:text-white border border-dark-700 hover:border-dark-500 rounded px-2 py-1 uppercase bg-dark-800/50 transition-colors flex items-center gap-1",
        title: "Change Language",
        children: [
          language,
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: `w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${positionClasses} w-32 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in-down`, children: languages.map((lang) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => {
          setLanguage(lang.code);
          setIsOpen(false);
        },
        className: `w-full text-left px-4 py-2 text-xs font-medium hover:bg-dark-700 transition-colors flex justify-between items-center ${language === lang.code ? "text-blue-400 bg-dark-900/50" : "text-slate-400 hover:text-white"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: lang.label }),
          language === lang.code && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-500", children: "✓" })
        ]
      },
      lang.code
    )) })
  ] });
};

const LockScreen = ({ onUnlock, walletState, setWalletState, lockReason }) => {
  const { t } = useTranslation();
  const [password, setPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const isFirstRun = !walletState.encryptedMaster;
  const [error, setError] = reactExports.useState(lockReason || "");
  const [statusMessage, setStatusMessage] = reactExports.useState("");
  const [biometricsAvailable, setBiometricsAvailable] = reactExports.useState(false);
  const [enableBiometrics, setEnableBiometrics] = reactExports.useState(false);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [showPinModal, setShowPinModal] = reactExports.useState(false);
  const [pinValue, setPinValue] = reactExports.useState("");
  const [pinMode, setPinMode] = reactExports.useState("unlock");
  const [showResetConfirmation, setShowResetConfirmation] = reactExports.useState(false);
  reactExports.useEffect(() => {
    isBiometricsAvailable().then(setBiometricsAvailable);
  }, []);
  reactExports.useEffect(() => {
    if (lockReason) setError(lockReason);
  }, [lockReason]);
  reactExports.useEffect(() => {
    if ((pinMode === "unlock" || pinMode === "totp") && pinValue.length === 6 && !isLoading) {
      submitPin();
    }
  }, [pinValue, pinMode]);
  const handlePasswordSubmit = async () => {
    if (isFirstRun) {
      if (password.length < 8) {
        setError(t("lock.error_length"));
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      setIsLoading(true);
      setStatusMessage(t("lock.processing"));
      let bioSuccess = false;
      if (enableBiometrics) {
        setStatusMessage("Please verify biometrics...");
        bioSuccess = await registerBiometrics();
        if (!bioSuccess) {
          console.warn("Biometric setup failed, continuing...");
          setError("Biometrics setup failed. Wallet created with password only.");
          await new Promise((r) => setTimeout(r, 1e3));
        }
      }
      await initVault(password);
      setWalletState((prev) => ({
        ...prev,
        encryptedMaster: true,
        useBiometrics: bioSuccess
      }));
      setIsLoading(false);
      onUnlock([]);
    } else {
      setIsLoading(true);
      const vault = await unlockVault(password);
      setIsLoading(false);
      if (vault) {
        onUnlock(vault.accounts);
      } else {
        setError("Incorrect password");
      }
    }
  };
  const handleTOTPAuth = async () => {
    setError("");
    const hasConfig = await hasTOTPConfigured();
    if (hasConfig) {
      setPinMode("totp");
      setPinValue("");
      setShowPinModal(true);
    } else {
      setError("Authenticator not configured. Please unlock with password and configure it in Settings.");
    }
  };
  const performLegacyUnlock = async () => {
    const internalKey = await getInternalKey();
    if (internalKey) {
      const vault = await unlockVault(internalKey);
      setIsLoading(false);
      if (vault) {
        onUnlock(vault.accounts);
      } else {
        setError("Could not decrypt data (Invalid Key).");
      }
    } else {
      setIsLoading(false);
      setError("No Google Auth data found. Try Password.");
    }
  };
  const handleBiometricAuth = async () => {
    setError("");
    setIsLoading(true);
    setStatusMessage("Waiting for verification...");
    const success = await authenticateWithBiometrics();
    if (success) {
      const hasPin = await hasPinProtectedKey();
      if (hasPin) {
        setIsLoading(false);
        setPinMode("unlock");
        setPinValue("");
        setShowPinModal(true);
      } else {
        await performLegacyUnlock();
      }
    } else {
      setIsLoading(false);
      setError("Biometric verification failed");
    }
  };
  const submitPin = async () => {
    if (pinMode === "totp") {
      if (pinValue.length < 6) return;
      setIsLoading(true);
      const secret = await getTOTPSecret();
      if (!secret) {
        setError("Configuration Error (Secret missing)");
        setIsLoading(false);
        return;
      }
      const isValid = verifyTOTP(pinValue, secret);
      if (isValid) {
        setShowPinModal(false);
        const hasPin = await hasPinProtectedKey();
        if (hasPin) {
          setPinMode("unlock");
          setPinValue("");
          setShowPinModal(true);
          setIsLoading(false);
          setStatusMessage("TOTP Verified. Enter PIN.");
        } else {
          await performLegacyUnlock();
        }
      } else {
        setIsLoading(false);
        setError("Invalid Code");
        setPinValue("");
      }
      return;
    }
    if (pinMode === "create") {
      if (pinValue.length < 6) {
        alert("PIN must be at least 6 digits");
        return;
      }
      setIsLoading(true);
      setShowPinModal(false);
      try {
        const { vault } = await initVaultWithGeneratedKey(pinValue);
        setWalletState((prev) => ({ ...prev, encryptedMaster: true, useGoogleAuth: true }));
        onUnlock(vault.accounts);
      } catch (e) {
        setError("Failed to initialize PIN wallet.");
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 100));
      const internalKey = await loadInternalKeyWithPin(pinValue);
      if (internalKey) {
        const vault = await unlockVault(internalKey);
        if (vault) {
          onUnlock(vault.accounts);
        } else {
          setError("Decryption failed (Corrupt Vault?)");
          setIsLoading(false);
          setShowPinModal(true);
        }
      } else {
        setIsLoading(false);
        setError("Incorrect PIN");
        setTimeout(() => {
          setError("");
          setPinValue("");
        }, 1e3);
      }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 relative overflow-hidden", children: [
    showPinModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-50 bg-dark-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 p-6 rounded-2xl border border-dark-600 shadow-2xl w-full max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white mb-2 text-center", children: pinMode === "create" ? "Create Security PIN" : pinMode === "totp" ? "Authenticator Code" : "Enter Security PIN" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mb-6 text-center", children: pinMode === "create" ? "Set a 6-digit PIN to encrypt your wallet key. You will need this to login with Google/Biometrics." : pinMode === "totp" ? "Enter the 6-digit code from your Aegis/Auth app." : "Enter your 6-digit PIN to decrypt your wallet." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "password",
          inputMode: "numeric",
          maxLength: 6,
          autoFocus: true,
          value: pinValue,
          onChange: (e) => setPinValue(e.target.value.replace(/[^0-9]/g, "")),
          className: `w-full bg-dark-900 border ${error && pinMode === "unlock" ? "border-red-500" : "border-blue-500/50"} rounded-lg px-4 py-4 text-center text-2xl tracking-[1em] text-white font-mono mb-6 outline-none focus:ring-2 ring-blue-500`,
          placeholder: "••••••",
          onKeyDown: (e) => e.key === "Enter" && pinValue.length >= 6 && submitPin()
        }
      ),
      error && pinMode === "unlock" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-400 text-xs text-center mb-4", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              setShowPinModal(false);
              setIsLoading(false);
              setStatusMessage("");
              setPinValue("");
              setError("");
            },
            className: "flex-1 py-3 rounded-lg border border-dark-600 text-slate-400 hover:text-white transition-colors",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: submitPin,
            disabled: pinValue.length < 6,
            className: "flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            children: pinMode === "create" ? "Set PIN" : "Unlock"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 right-4 z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageToggle, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[-50px] left-[-50px] w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-[-50px] right-[-50px] w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(37,99,235,0.2)] border border-white/10 backdrop-blur-md animate-float", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logowallet.png", alt: "Gravity Wallet", className: "w-16 h-16 object-contain drop-shadow-lg" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400", children: "Gravity Wallet" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-sm mb-8", children: isFirstRun ? t("lock.create_title") : t("lock.unlock_title") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        error && !showPinModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 mb-2 bg-red-900/40 border border-red-500/50 rounded text-center text-xs text-red-200", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "password",
            placeholder: isFirstRun ? t("lock.placeholder_create") : t("lock.placeholder_enter"),
            value: password,
            onChange: (e) => setPassword(e.target.value),
            className: "w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition-colors",
            onKeyDown: (e) => e.key === "Enter" && handlePasswordSubmit()
          }
        ),
        isFirstRun && password.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-1 space-y-1 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-1 rounded-full overflow-hidden bg-dark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `h-full transition-all duration-300 ${getStrengthLabel(calculatePasswordStrength(password)).color}`,
              style: { width: `${(calculatePasswordStrength(password) + 1) * 20}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-[10px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: "Security" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${getStrengthLabel(calculatePasswordStrength(password)).color.replace("bg-", "text-")} font-bold uppercase`, children: getStrengthLabel(calculatePasswordStrength(password)).label })
          ] })
        ] }),
        isFirstRun && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "password",
            placeholder: "Confirm Password",
            value: confirmPassword,
            onChange: (e) => setConfirmPassword(e.target.value),
            className: `w-full bg-dark-900 border ${confirmPassword && password !== confirmPassword ? "border-red-500" : "border-dark-600"} rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition-colors mb-2`,
            onKeyDown: (e) => e.key === "Enter" && handlePasswordSubmit()
          }
        ),
        isFirstRun && biometricsAvailable && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-1 py-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              id: "bioSetup",
              checked: enableBiometrics,
              onChange: (e) => setEnableBiometrics(e.target.checked),
              className: "accent-blue-500 w-4 h-4 rounded cursor-pointer"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "bioSetup", className: "text-xs text-slate-400 cursor-pointer select-none", children: "Enable Biometric Unlock (TouchID / FaceID)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handlePasswordSubmit,
            disabled: isLoading,
            className: "w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
            children: isLoading ? t("lock.processing") : isFirstRun ? t("lock.create_btn") : t("lock.unlock_btn")
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full border-t border-dark-700" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex justify-center text-xs uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-dark-800 px-2 text-slate-500", children: isFirstRun ? t("lock.or_sign_up") : t("lock.or_unlock") }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleTOTPAuth,
            disabled: isLoading,
            className: "bg-white hover:bg-slate-50 text-gray-700 border border-gray-300 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-70",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3 h-3 text-slate-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Authenticator" })
            ]
          }
        ),
        biometricsAvailable && (walletState.useBiometrics || isFirstRun) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleBiometricAuth,
            disabled: isFirstRun || isLoading,
            className: `bg-dark-700 text-white font-medium py-2.5 rounded-lg hover:bg-dark-600 transition-colors flex items-center justify-center gap-2 text-sm ${isFirstRun ? "opacity-50 cursor-not-allowed" : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4 text-rose-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.85.577-4.147l.156-.471m-1.284 8.761a20.003 20.003 0 007.544 6.799" }) }),
              "Biometrics"
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: true, className: "bg-dark-700 text-slate-600 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm cursor-not-allowed opacity-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }),
          "N/A"
        ] })
      ] }),
      statusMessage && !error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-xs text-blue-400 mt-2 animate-pulse", children: statusMessage }),
      error && !showPinModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-xs text-red-400 mt-2 flex flex-col items-center gap-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: error }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setShowResetConfirmation(true),
          className: "text-[10px] underline text-slate-500 hover:text-red-400 transition-colors",
          children: t("lock.clear_reset")
        }
      ) })
    ] }),
    showResetConfirmation && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-[60] bg-dark-900/95 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 border border-red-500/30 p-6 rounded-2xl w-full max-w-sm text-center shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6 text-red-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-white mb-2", children: "Delete all data?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mb-6 leading-relaxed", children: "This action cannot be undone. All encrypted storage (Master Key, PIN, Accounts) will be permanently wiped from this device." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setShowResetConfirmation(false),
            className: "flex-1 py-3 rounded-lg border border-dark-600 text-slate-300 hover:bg-dark-700 transition-colors font-medium text-sm",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              if (typeof chrome !== "undefined" && chrome.storage) {
                chrome.storage.local.clear(() => window.location.reload());
              } else {
                localStorage.clear();
                window.location.reload();
              }
            },
            className: "flex-1 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors text-sm shadow-lg shadow-red-900/20",
            children: "Delete"
          }
        )
      ] })
    ] }) })
  ] });
};

const Sidebar = ({
  currentView,
  onChangeView,
  onLock,
  isDetached = false,
  onToggleDetach
}) => {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-16 h-full bg-dark-800 border-r border-dark-700 flex flex-col items-center py-4 shrink-0 z-20 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: "/logowallet.png",
        alt: "Gravity",
        onClick: () => onChangeView(ViewState.LANDING),
        className: "w-10 h-10 object-contain mb-6 drop-shadow-md hover:scale-110 transition-transform cursor-pointer shrink-0"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 w-full flex flex-col items-center gap-4 overflow-y-auto overflow-x-hidden custom-scrollbar no-scrollbar scroll-smooth py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        NavIcon,
        {
          active: currentView === ViewState.LANDING,
          onClick: () => onChangeView(ViewState.LANDING),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }),
          label: t("sidebar.home") || "Home"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px w-8 bg-dark-600 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        NavIcon,
        {
          active: currentView === ViewState.WALLET,
          onClick: () => onChangeView(ViewState.WALLET),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" }),
          label: t("sidebar.wallet") || "Wallet"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        NavIcon,
        {
          active: currentView === ViewState.BULK,
          onClick: () => onChangeView(ViewState.BULK),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }),
          label: t("sidebar.bulk") || "Bulk"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        NavIcon,
        {
          active: currentView === ViewState.MULTISIG,
          onClick: () => onChangeView(ViewState.MULTISIG),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" }),
          label: t("sidebar.multisig") || "Multi"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        NavIcon,
        {
          active: currentView === ViewState.CHAT,
          onClick: () => onChangeView(ViewState.CHAT),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" }),
          label: "Chat"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px w-8 bg-dark-600 my-1 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        NavIcon,
        {
          active: currentView === ViewState.MANAGE,
          onClick: () => onChangeView(ViewState.MANAGE),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }),
          label: t("sidebar.manage") || "Settings"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto flex flex-col items-center gap-2 pt-4 bg-dark-800 w-full shrink-0 border-t border-dark-700/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        NavIcon,
        {
          active: currentView === ViewState.HELP,
          onClick: () => onChangeView(ViewState.HELP),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }),
          label: t("help.title") || "Help"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageToggle, { direction: "right-up" }),
      onToggleDetach && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onToggleDetach,
          className: `p-2 transition-colors ${isDetached ? "text-blue-400" : "text-slate-500 hover:text-slate-300"}`,
          title: isDetached ? t("sidebar.dock") : t("sidebar.pin"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z" }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onLock,
          className: "text-slate-500 hover:text-red-400 transition-colors p-2 mb-2",
          title: t("sidebar.lock") || "Lock Wallet",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) })
        }
      )
    ] })
  ] });
};
const NavIcon = ({ active, onClick, icon, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  "button",
  {
    onClick,
    className: `group relative flex items-center justify-center w-10 h-10 rounded-lg transition-all ${active ? "bg-dark-700 text-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.2)] scale-105 border border-dark-600" : "text-slate-500 hover:bg-dark-700 hover:text-slate-300"}`,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-12 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-dark-600 z-50", children: label })
    ]
  }
);

const Landing = ({ onSelectChain, onManage }) => {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full space-y-4 relative p-4 overflow-y-auto custom-scrollbar", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-white/5 backdrop-blur-sm animate-float", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logowallet.png", alt: "App Logo", className: "w-10 h-10 object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-500" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight", children: t("landing.welcome") || "Welcome Back" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 text-xs max-w-[200px] mx-auto leading-relaxed", children: t("landing.subtitle") || "Select a network to manage your assets" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3 w-full max-w-[240px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => onSelectChain(Chain.BLURT),
          title: `${t("action.select_network")} BLURT`,
          className: "bg-dark-800 hover:bg-blurt/20 border border-dark-700 hover:border-blurt/50 p-4 rounded-xl flex items-center gap-4 transition-all group relative overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-blurt/5 opacity-0 group-hover:opacity-100 transition-opacity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center p-1 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logoblurt.png", alt: "Blurt", className: "w-full h-full object-contain" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg group-hover:text-blurt transition-colors", children: "BLURT" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 ml-auto text-dark-600 group-hover:text-blurt transform group-hover:translate-x-1 transition-all", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => onSelectChain(Chain.HIVE),
          title: `${t("action.select_network")} HIVE`,
          className: "bg-dark-800 hover:bg-hive/20 border border-dark-700 hover:border-hive/50 p-4 rounded-xl flex items-center gap-4 transition-all group relative overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-hive/5 opacity-0 group-hover:opacity-100 transition-opacity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center p-1 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/Logo_hive.png", alt: "Hive", className: "w-full h-full object-contain" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg group-hover:text-hive transition-colors", children: "HIVE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 ml-auto text-dark-600 group-hover:text-hive transform group-hover:translate-x-1 transition-all", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => onSelectChain(Chain.STEEM),
          title: `${t("action.select_network")} STEEM`,
          className: "bg-dark-800 hover:bg-steem/20 border border-dark-700 hover:border-steem/50 p-4 rounded-xl flex items-center gap-4 transition-all group relative overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-steem/5 opacity-0 group-hover:opacity-100 transition-opacity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center p-1 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logosteem.png", alt: "Steem", className: "w-full h-full object-contain" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-lg group-hover:text-steem transition-colors", children: "STEEM" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 ml-auto text-dark-600 group-hover:text-steem transform group-hover:translate-x-1 transition-all", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3 w-full max-w-[240px] pt-4 border-t border-dark-700/50 pb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: onManage,
        title: t("action.manage_keys"),
        className: "flex flex-col items-center justify-center p-3 rounded-xl bg-dark-800/50 hover:bg-dark-800 text-slate-400 hover:text-white transition-colors border border-transparent hover:border-dark-600 gap-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider", children: t("landing.manage_keys") || "Keys" })
        ]
      }
    ) })
  ] });
};

const TOTPSetupModal = ({ accounts, onClose, onComplete }) => {
  const [step, setStep] = reactExports.useState("loading");
  const [secret, setSecret] = reactExports.useState("");
  const [qrCode, setQrCode] = reactExports.useState("");
  const [token, setToken] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  reactExports.useEffect(() => {
    const init = async () => {
      try {
        const { secret: secret2, qrCode: qrCode2 } = await generateSetup();
        setSecret(secret2);
        setQrCode(qrCode2);
        setStep("scan");
      } catch (e) {
        setError("Failed to generate QR Code");
      }
    };
    init();
  }, []);
  const handleVerify = async () => {
    if (verifyTOTP(token, secret)) {
      await saveTOTPSecret(secret);
      await enablePasswordless(accounts);
      setStep("success");
      setTimeout(() => {
        onComplete();
      }, 1500);
    } else {
      setError("Invalid code. Please try again.");
      setToken("");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-50 bg-dark-900/90 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 border border-dark-600 rounded-2xl p-6 w-full max-w-sm shadow-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-white", children: "Setup Authenticator" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-slate-500 hover:text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })
    ] }),
    step === "loading" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" }) }),
    step === "scan" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-400", children: [
        "Scan this QR code with ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Aegis" }),
        ", ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Google Authenticator" }),
        ", or any TOTP app."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white p-2 rounded-lg mx-auto w-fit", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: qrCode, alt: "QR Code", className: "w-48 h-48" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900 p-2 rounded text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-slate-500 mb-1", children: "Backup Key (Manual Entry)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-blue-400 font-mono text-sm break-all", children: secret })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setStep("verify"),
          className: "w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg mt-4 transition-colors",
          children: "Next"
        }
      )
    ] }),
    step === "verify" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "Enter the 6-digit code from your app to verify." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          inputMode: "numeric",
          maxLength: 6,
          autoFocus: true,
          value: token,
          onChange: (e) => {
            const val = e.target.value.replace(/[^0-9]/g, "");
            setToken(val);
            setError("");
          },
          className: "w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-4 text-center text-2xl tracking-[0.5em] text-white font-mono outline-none focus:border-blue-500",
          placeholder: "000000",
          onKeyDown: (e) => e.key === "Enter" && token.length === 6 && handleVerify()
        }
      ),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-400 text-xs text-center", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setStep("scan"),
            className: "flex-1 py-3 text-slate-400 hover:text-white",
            children: "Back"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleVerify,
            disabled: token.length !== 6,
            className: "flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg disabled:opacity-50",
            children: "Verify"
          }
        )
      ] })
    ] }),
    step === "success" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-8 h-8 text-green-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "Success!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 text-sm", children: "Authenticator configured successfully." })
    ] })
  ] }) });
};

const BiometricSetupModal = ({ accounts, setWalletState, onClose, onComplete }) => {
  useTranslation();
  const [step, setStep] = reactExports.useState("intro");
  const [error, setError] = reactExports.useState("");
  const handleSetup = async () => {
    setStep("loading");
    setError("");
    try {
      const isAvailable = await isBiometricsAvailable();
      if (!isAvailable) {
        setStep("error");
        setError("Biometrics not supported on this device or browser context.");
        return;
      }
      const success = await registerBiometrics();
      if (success) {
        await enablePasswordless(accounts);
        setWalletState((prev) => ({
          ...prev,
          useBiometrics: true
        }));
        setStep("success");
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else {
        setStep("error");
        setError("Registration failed. Please try again.");
      }
    } catch (e) {
      setStep("error");
      setError(e.message || "An unexpected error occurred.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-50 bg-dark-900/90 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in text-white text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 border border-dark-600 rounded-2xl p-8 w-full max-w-sm shadow-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mb-2 absolute top-4 right-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-slate-500 hover:text-white transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }) }),
    step === "intro" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.1)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-10 h-10 text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.85.577-4.147l.156-.471m-1.284 8.761a20.003 20.003 0 007.544 6.799" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-black mb-2", children: "Enable Biometrics" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "Use your fingerprint or face scan to unlock your wallet faster and more securely." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleSetup,
          className: "w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95",
          children: "Setup Now"
        }
      )
    ] }),
    step === "loading" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-12 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-400 font-bold animate-pulse", children: "Waiting for system..." })
    ] }),
    step === "success" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-8 space-y-4 animate-bounce-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-10 h-10 text-green-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-black text-white", children: "Verified!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400", children: "Biometrics enabled successfully." })
    ] }),
    step === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-8 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-10 h-10 text-red-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "Error" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-400 text-sm", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setStep("intro"),
          className: "w-full bg-dark-700 hover:bg-dark-600 text-white font-bold py-3 rounded-xl mt-4",
          children: "Try Again"
        }
      )
    ] })
  ] }) });
};

const ManageWallets = ({ accounts, walletState, setWalletState, onEdit, onImport }) => {
  const { t } = useTranslation();
  const [showTOTP, setShowTOTP] = reactExports.useState(false);
  const [showBio, setShowBio] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center p-4 border-b border-dark-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold", children: t("settings.accounts_title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onImport,
          className: "text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded text-white font-bold transition-colors",
          children: t("settings.add_new")
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3", children: accounts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-slate-500 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("settings.no_accounts") }) }) : accounts.map((acc, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 border border-dark-700 rounded-lg p-3 flex justify-between items-center group hover:border-dark-600", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-2 h-8 rounded-full ${acc.chain === Chain.HIVE ? "bg-hive" : acc.chain === Chain.STEEM ? "bg-steem" : "bg-blurt"}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-sm text-slate-200", children: [
            "@",
            acc.name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 text-[10px] text-slate-500 uppercase tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: acc.chain }),
            acc.activeKey && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-500", children: "• Active" }),
            acc.postingKey && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-500", children: "• Posting" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => onEdit(acc),
          className: "p-2 hover:bg-dark-700 rounded-lg text-slate-500 hover:text-white transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" }) })
        }
      )
    ] }, `${acc.chain}-${acc.name}-${idx}`)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 pt-2 border-t border-dark-700 mt-auto space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-slate-400 uppercase tracking-wider mb-1", children: "Security" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setShowTOTP(true),
          className: "w-full bg-dark-800 hover:bg-dark-700 border border-dark-600 text-slate-200 p-3 rounded-xl flex items-center gap-3 transition-all text-left group",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm", children: "Authenticator App (2FA)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500", children: "Enable Aegis, Google Auth, or Authy" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `px-2 py-0.5 rounded text-[8px] font-black uppercase ${walletState.useTOTP ? "bg-green-500/20 text-green-500" : "bg-slate-700 text-slate-400"}`, children: walletState.useTOTP ? "Enabled" : "Off" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setShowBio(true),
          className: "w-full bg-dark-800 hover:bg-dark-700 border border-dark-600 text-slate-200 p-3 rounded-xl flex items-center gap-3 transition-all text-left group",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:bg-rose-500/20 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.85.577-4.147l.156-.471m-1.284 8.761a20.003 20.003 0 007.544 6.799" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm", children: "Fingerprint / FaceID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500", children: "Fast biometric unlock" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `px-2 py-0.5 rounded text-[8px] font-black uppercase ${walletState.useBiometrics ? "bg-green-500/20 text-green-500" : "bg-slate-700 text-slate-400"}`, children: walletState.useBiometrics ? "Enabled" : "Off" })
          ]
        }
      )
    ] }),
    showTOTP && /* @__PURE__ */ jsxRuntimeExports.jsx(
      TOTPSetupModal,
      {
        accounts,
        onClose: () => setShowTOTP(false),
        onComplete: () => setShowTOTP(false)
      }
    ),
    showBio && /* @__PURE__ */ jsxRuntimeExports.jsx(
      BiometricSetupModal,
      {
        accounts,
        walletState,
        setWalletState,
        onClose: () => setShowBio(false),
        onComplete: () => setShowBio(false)
      }
    )
  ] });
};

const PowerModal = ({ account, type, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = reactExports.useState("");
  const [recipient, setRecipient] = reactExports.useState(account.name);
  const [delegatee, setDelegatee] = reactExports.useState("");
  const [processing, setProcessing] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [success, setSuccess] = reactExports.useState(false);
  const [isStoppingPowerDown, setIsStoppingPowerDown] = reactExports.useState(false);
  const [recentRecipients, setRecentRecipients] = reactExports.useState([]);
  const [showRecent, setShowRecent] = reactExports.useState(null);
  reactExports.useEffect(() => {
    document.body.style.overflow = "hidden";
    chrome.storage?.local.get(["recentRecipients"], (result) => {
      if (result.recentRecipients) setRecentRecipients(result.recentRecipients);
    });
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  const getTokenSymbol = () => {
    if (account.chain === Chain.HIVE) return "HIVE";
    if (account.chain === Chain.STEEM) return "STEEM";
    return "BLURT";
  };
  const getPowerSymbol = () => {
    if (account.chain === Chain.HIVE) return "HP";
    if (account.chain === Chain.STEEM) return "SP";
    return "BP";
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStoppingPowerDown && (!amount || parseFloat(amount) <= 0)) {
      setError(t("power.invalid_amount"));
      return;
    }
    if (type === "delegate" && !delegatee.trim()) {
      setError(t("power.invalid_recipient"));
      return;
    }
    if (!account.activeKey) {
      setError(t("power.active_key_required"));
      return;
    }
    setProcessing(true);
    setError("");
    try {
      let response;
      const tokenSymbol = getTokenSymbol();
      if (type === "powerup") {
        const formattedAmount = `${parseFloat(amount).toFixed(3)} ${tokenSymbol}`;
        response = await broadcastPowerUp(account.chain, account.name, account.activeKey, recipient, formattedAmount);
      } else if (type === "powerdown") {
        if (isStoppingPowerDown) {
          response = await broadcastPowerDown(account.chain, account.name, account.activeKey, 0);
        } else {
          response = await broadcastPowerDown(account.chain, account.name, account.activeKey, parseFloat(amount));
        }
      } else {
        response = await broadcastDelegation(account.chain, account.name, account.activeKey, delegatee, parseFloat(amount));
      }
      if (response.success) {
        if (type === "powerup" && recipient !== account.name) saveRecipient(recipient);
        if (type === "delegate") saveRecipient(delegatee);
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setError(response.error || t("power.operation_failed"));
      }
    } catch (err) {
      setError(err.message || t("power.operation_failed"));
    } finally {
      setProcessing(false);
    }
  };
  const saveRecipient = (name) => {
    chrome.storage?.local.get(["recentRecipients"], (result) => {
      const list = result.recentRecipients || [];
      if (!list.includes(name)) {
        const newList = [name, ...list].slice(0, 10);
        chrome.storage.local.set({ recentRecipients: newList });
      }
    });
  };
  const handleStopPowerDown = () => {
    setIsStoppingPowerDown(true);
    setError("");
  };
  const getTitle = () => {
    if (type === "powerup") return t("power.powerup_title");
    if (type === "powerdown") return t("power.powerdown_title");
    return t("power.delegate_title");
  };
  const getDescription = () => {
    if (type === "powerup") return t("power.powerup_desc").replace("{token}", getTokenSymbol()).replace("{power}", getPowerSymbol());
    if (type === "powerdown") return t("power.powerdown_desc").replace("{power}", getPowerSymbol());
    const baseDesc = t("power.delegate_desc").replace("{power}", getPowerSymbol());
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2", children: baseDesc }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-blue-900/20 border border-blue-500/30 p-2 rounded text-[10px] text-blue-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Note:" }),
        " Delegation is ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "NOT additive" }),
        ". This value will be the ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "new total" }),
        ". Set to 0 to remove delegation."
      ] }) })
    ] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto my-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border-b border-dark-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-white", children: getTitle() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onClose,
            className: "text-slate-400 hover:text-white transition-colors",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400 mt-2", children: getDescription() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900/50 rounded-lg p-4 border border-dark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400 mb-1", children: t("power.from_account") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white font-bold", children: [
          "@",
          account.name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400 mt-1", children: account.chain }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-dark-700 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400", children: t("power.available_token").replace("{token}", getTokenSymbol()) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-green-400", children: [
              (account.balance || 0).toFixed(3),
              " ",
              getTokenSymbol()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400", children: t("power.available_power").replace("{power}", getPowerSymbol()) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-blue-400", children: [
              (account.stakedBalance || 0).toFixed(3),
              " ",
              getPowerSymbol()
            ] })
          ] }),
          account.powerDownActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 mt-2 border-t border-dark-700/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-yellow-500 font-medium", children: t("power.active_powerdown") || "Active Power Down" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-yellow-400", children: [
                "~",
                (account.powerDownAmount || 0).toFixed(3),
                " ",
                getPowerSymbol(),
                "/week"
              ] })
            ] }),
            account.nextPowerDown && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-500 text-right mt-1", children: [
              t("power.next_withdrawal") || "Next:",
              " ",
              new Date(account.nextPowerDown).toLocaleDateString()
            ] })
          ] }),
          !account.powerDownActive && type === "powerdown" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500 italic mt-2", children: t("power.no_active_powerdown") || "No active power downs" })
        ] })
      ] }),
      type === "powerup" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-300 mb-2", children: t("power.recipient") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: recipient,
            onChange: (e) => setRecipient(e.target.value.replace("@", "")),
            onFocus: () => setShowRecent("recipient"),
            onBlur: () => setTimeout(() => setShowRecent(null), 200),
            className: "w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none",
            placeholder: t("power.recipient_placeholder")
          }
        ),
        showRecent === "recipient" && recentRecipients.length > 0 && !recipient && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute z-10 w-full mt-1 bg-dark-800 border border-dark-700 rounded-lg shadow-xl overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500 font-bold px-3 py-2 border-b border-dark-700 uppercase", children: t("common.recent_recipients") || "Recent Recipients" }),
          recentRecipients.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setRecipient(name),
              className: "w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-dark-700 hover:text-white transition-colors",
              children: [
                "@",
                name
              ]
            },
            name
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-1", children: t("power.recipient_hint") })
      ] }),
      type === "delegate" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-300 mb-2", children: t("power.delegatee") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: delegatee,
            onChange: (e) => setDelegatee(e.target.value.replace("@", "")),
            onFocus: () => setShowRecent("delegatee"),
            onBlur: () => setTimeout(() => setShowRecent(null), 200),
            className: "w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none",
            placeholder: t("power.delegatee_placeholder"),
            required: true
          }
        ),
        showRecent === "delegatee" && recentRecipients.length > 0 && !delegatee && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute z-10 w-full mt-1 bg-dark-800 border border-dark-700 rounded-lg shadow-xl overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500 font-bold px-3 py-2 border-b border-dark-700 uppercase", children: t("common.recent_recipients") || "Recent Recipients" }),
          recentRecipients.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setDelegatee(name),
              className: "w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-dark-700 hover:text-white transition-colors",
              children: [
                "@",
                name
              ]
            },
            name
          ))
        ] })
      ] }),
      !isStoppingPowerDown && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-300 mb-2", children: type === "powerup" ? t("power.amount_token").replace("{token}", getTokenSymbol()) : t("power.amount_vests").replace("{power}", getPowerSymbol()) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            step: "0.001",
            value: amount,
            onChange: (e) => setAmount(e.target.value),
            className: "w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none",
            placeholder: "0.000",
            required: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-1", children: type === "powerup" ? t("power.powerup_hint").replace("{token}", getTokenSymbol()).replace("{power}", getPowerSymbol()) : type === "powerdown" ? t("power.powerdown_hint").replace("{power}", getPowerSymbol()) : t("power.delegate_hint").replace("{power}", getPowerSymbol()) })
      ] }),
      isStoppingPowerDown && type === "powerdown" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-yellow-300", children: t("power.stop_powerdown_warning") })
      ] }) }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm break-all max-h-32 overflow-y-auto custom-scrollbar", children: error }),
      success && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-green-500/10 border border-green-500/50 rounded-lg p-3 text-green-400 text-sm", children: t("power.success") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "flex-1 bg-dark-700 hover:bg-dark-600 text-white font-bold py-3 rounded-lg transition-colors",
            disabled: processing,
            children: t("common.cancel")
          }
        ),
        type === "powerdown" && !isStoppingPowerDown && account.powerDownActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleStopPowerDown,
            className: "flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            disabled: processing || success,
            children: t("power.stop_powerdown")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            className: "flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            disabled: processing || success,
            children: processing ? t("common.processing") : t("common.confirm")
          }
        )
      ] })
    ] })
  ] }) });
};

const SavingsModal = ({ account, type, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = reactExports.useState("");
  const [processing, setProcessing] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [success, setSuccess] = reactExports.useState(false);
  reactExports.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  const getStablecoinSymbol = () => {
    if (account.chain === Chain.HIVE) return "HBD";
    if (account.chain === Chain.STEEM) return "SBD";
    return "";
  };
  const getAvailableBalance = () => {
    return account.secondaryBalance || 0;
  };
  const handleMaxClick = () => {
    setAmount(getAvailableBalance().toFixed(3));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (account.chain === Chain.BLURT) {
      setError(t("savings.blurt_not_supported"));
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError(t("savings.invalid_amount"));
      return;
    }
    if (!account.activeKey) {
      setError(t("savings.active_key_required"));
      return;
    }
    setProcessing(true);
    setError("");
    try {
      const stablecoin = getStablecoinSymbol();
      const formattedAmount = `${parseFloat(amount).toFixed(3)} ${stablecoin}`;
      let response;
      if (type === "deposit") {
        response = await broadcastSavingsDeposit(account.chain, account.name, account.activeKey, formattedAmount);
      } else {
        const requestId = Date.now();
        response = await broadcastSavingsWithdraw(account.chain, account.name, account.activeKey, formattedAmount, requestId);
      }
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setError(response.error || t("savings.operation_failed"));
      }
    } catch (err) {
      setError(err.message || t("savings.operation_failed"));
    } finally {
      setProcessing(false);
    }
  };
  if (account.chain === Chain.BLURT) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md shadow-2xl p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-8 h-8 text-yellow-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white mb-2", children: t("savings.not_available") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 mb-6", children: t("savings.blurt_not_supported") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors",
          children: t("common.close")
        }
      )
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border-b border-dark-700 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-white", children: type === "deposit" ? t("savings.deposit_title") : t("savings.withdraw_title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onClose,
            className: "text-slate-400 hover:text-white transition-colors",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400 mt-2", children: type === "deposit" ? t("savings.deposit_desc").replace("{token}", getStablecoinSymbol()) : t("savings.withdraw_desc").replace("{token}", getStablecoinSymbol()) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto custom-scrollbar", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900/50 rounded-lg p-4 border border-dark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400 mb-1", children: t("savings.account") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white font-bold", children: [
          "@",
          account.name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400 mt-1", children: account.chain }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 pt-3 border-t border-dark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex justify-between items-center cursor-pointer hover:bg-white/5 p-1 rounded transition-colors",
            onClick: handleMaxClick,
            title: "Click to use max balance",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 uppercase", children: t("wallet.balance") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-blue-400", children: [
                getAvailableBalance().toFixed(3),
                " ",
                getStablecoinSymbol()
              ] })
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-300 mb-2", children: t("savings.amount").replace("{token}", getStablecoinSymbol()) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              step: "0.001",
              value: amount,
              onChange: (e) => setAmount(e.target.value),
              className: "w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none pr-16",
              placeholder: "0.000",
              required: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold", children: getStablecoinSymbol() })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-blue-500/10 border border-blue-500/30 rounded-lg p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-blue-300 leading-tight", children: type === "deposit" ? t("savings.deposit_info") : t("savings.withdraw_info") })
      ] }) }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm animate-shake", children: error }),
      success && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-green-500/10 border border-green-500/50 rounded-lg p-3 text-green-400 text-sm", children: t("savings.success") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "flex-1 bg-dark-700 hover:bg-dark-600 text-white font-bold py-3 rounded-lg transition-colors",
            disabled: processing,
            children: t("common.cancel")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            className: "flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            disabled: processing || success,
            children: processing ? t("common.processing") : t("common.confirm")
          }
        )
      ] })
    ] }) })
  ] }) });
};

const RCModal = ({ account, type, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [delegatee, setDelegatee] = reactExports.useState("");
  const [amountHP, setAmountHP] = reactExports.useState("");
  const [processing, setProcessing] = reactExports.useState(false);
  const [isValidating, setIsValidating] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [success, setSuccess] = reactExports.useState(false);
  const [recentRecipients, setRecentRecipients] = reactExports.useState([]);
  const [showRecent, setShowRecent] = reactExports.useState(false);
  reactExports.useEffect(() => {
    document.body.style.overflow = "hidden";
    chrome.storage?.local.get(["recentRecipients"], (result) => {
      if (result.recentRecipients) setRecentRecipients(result.recentRecipients);
    });
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (account.chain !== Chain.HIVE) {
      setError(t("rc.hive_only"));
      return;
    }
    const cleanDelegatee = delegatee.trim().replace("@", "").toLowerCase();
    if (!cleanDelegatee) {
      setError(t("rc.invalid_delegatee"));
      return;
    }
    if (type === "delegate" && (!amountHP || parseFloat(amountHP) <= 0)) {
      setError(t("rc.invalid_amount"));
      return;
    }
    if (!account.activeKey) {
      setError(t("rc.active_key_required"));
      return;
    }
    setProcessing(true);
    setIsValidating(true);
    setError("");
    try {
      const accData = await fetchAccountData(account.chain, cleanDelegatee);
      if (!accData) {
        setError(t("common.account_not_found") || "Account not found");
        setProcessing(false);
        setIsValidating(false);
        return;
      }
      setIsValidating(false);
      let response;
      if (type === "delegate") {
        response = await broadcastRCDelegate(account.chain, account.name, account.activeKey, cleanDelegatee, parseFloat(amountHP));
      } else {
        response = await broadcastRCUndelegate(account.chain, account.name, account.activeKey, cleanDelegatee);
      }
      if (response.success) {
        saveRecipient(cleanDelegatee);
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setError(response.error || t("rc.operation_failed"));
      }
    } catch (err) {
      setError(err.message || t("rc.operation_failed"));
    } finally {
      setProcessing(false);
      setIsValidating(false);
    }
  };
  const saveRecipient = (name) => {
    chrome.storage?.local.get(["recentRecipients"], (result) => {
      const list = result.recentRecipients || [];
      if (!list.includes(name)) {
        const newList = [name, ...list].slice(0, 10);
        chrome.storage.local.set({ recentRecipients: newList });
      }
    });
  };
  if (account.chain !== Chain.HIVE) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md shadow-2xl p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-8 h-8 text-yellow-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white mb-2", children: t("rc.not_available") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 mb-6", children: t("rc.hive_only") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors",
          children: t("common.close")
        }
      )
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border-b border-dark-700 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-white", children: type === "delegate" ? t("rc.delegate_title") : t("rc.undelegate_title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onClose,
            className: "text-slate-400 hover:text-white transition-colors",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400 mt-2", children: type === "delegate" ? t("rc.delegate_desc") : t("rc.undelegate_desc") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto custom-scrollbar", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900/50 rounded-lg p-4 border border-dark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400 mb-1", children: t("rc.from_account") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white font-bold", children: [
          "@",
          account.name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400 mt-1", children: "Hive" }),
        account.stakedBalance !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 pt-2 border-t border-dark-700 flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 uppercase", children: "Hive Power" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-blue-400 font-bold", children: [
            account.stakedBalance.toFixed(3),
            " HP"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-300 mb-2", children: t("rc.delegatee") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: delegatee,
            onChange: (e) => setDelegatee(e.target.value),
            onFocus: () => setShowRecent(true),
            onBlur: () => setTimeout(() => setShowRecent(false), 200),
            className: "w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none",
            placeholder: t("rc.delegatee_placeholder"),
            required: true
          }
        ),
        showRecent && recentRecipients.length > 0 && !delegatee && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute z-10 w-full mt-1 bg-dark-800 border border-dark-700 rounded-lg shadow-xl overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500 font-bold px-3 py-2 border-b border-dark-700 uppercase", children: t("common.recent_recipients") || "Recent Recipients" }),
          recentRecipients.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setDelegatee(name),
              className: "w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-dark-700 hover:text-white transition-colors",
              children: [
                "@",
                name
              ]
            },
            name
          ))
        ] })
      ] }),
      type === "delegate" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-300 mb-2", children: t("rc.max_rc") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: amountHP,
            onChange: (e) => setAmountHP(e.target.value),
            className: "w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none",
            placeholder: "10.000",
            required: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-2", children: t("rc.max_rc_hint") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-blue-500/10 border border-blue-500/30 rounded-lg p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-blue-300 leading-tight", children: type === "delegate" ? t("rc.delegate_info") : t("rc.undelegate_info") })
      ] }) }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm animate-shake", children: error }),
      success && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-green-500/10 border border-green-500/50 rounded-lg p-3 text-green-400 text-sm", children: t("rc.success") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "flex-1 bg-dark-700 hover:bg-dark-600 text-white font-bold py-3 rounded-lg transition-colors",
            disabled: processing,
            children: t("common.cancel")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            className: "flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            disabled: processing || success,
            children: processing ? isValidating ? "Validating..." : t("common.processing") : t("common.confirm")
          }
        )
      ] })
    ] }) })
  ] }) });
};

const WalletView = ({
  chain,
  onChainChange,
  accounts,
  onManage,
  onSend,
  onReceive,
  onHistory,
  onRefresh,
  onAddAccount
}) => {
  const { t } = useTranslation();
  const [modalState, setModalState] = reactExports.useState({ type: null, account: null });
  const openModal = (type, account) => {
    setModalState({ type, account });
  };
  const closeModal = () => {
    setModalState({ type: null, account: null });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 relative h-full overflow-y-auto p-4 custom-scrollbar", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400", children: t("wallet.network_label") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onRefresh,
          className: "p-2 bg-dark-800 rounded-full hover:bg-dark-700 hover:text-blue-400 transition-colors border border-dark-700",
          title: t("wallet.refresh_tooltip"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex p-1 bg-dark-800 rounded-xl mb-6 border border-dark-700", children: [Chain.BLURT, Chain.HIVE, Chain.STEEM].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => onChainChange(c),
        className: `flex-1 py-2 text-xs font-bold rounded-lg transition-all ${chain === c ? c === Chain.HIVE ? "bg-hive text-white shadow-lg" : c === Chain.STEEM ? "bg-steem text-white shadow-lg" : "bg-blurt text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`,
        children: c
      },
      c
    )) }),
    accounts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-10 opacity-50 bg-dark-800/50 rounded-xl border border-dashed border-dark-700 flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: t("wallet.no_accounts_chain").replace("{chain}", chain) }),
      onAddAccount && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onAddAccount,
          className: "bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg text-xs transition-colors shadow-lg whitespace-normal leading-tight h-auto max-w-[200px]",
          children: t("wallet.add_one")
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: accounts.map((account) => {
      const hasActive = !!account.activeKey;
      const hasPosting = !!account.postingKey;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-dark-800 p-5 rounded-2xl border border-dark-700 shadow-xl overflow-hidden group hover:border-dark-600 transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[-20px] right-[-20px] w-32 h-32 opacity-5 pointer-events-none transform rotate-12 group-hover:opacity-10 transition-opacity duration-500 blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: chain === Chain.HIVE ? "/Logo_hive.png" : chain === Chain.STEEM ? "/logosteem.png" : "/logoblurt.png",
            alt: chain,
            className: "w-full h-full object-contain"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col mb-4 relative z-10 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-lg text-white flex items-center gap-2", children: [
            "@",
            account.name,
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
              hasActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]", title: t("wallet.active_key_tooltip") }),
              hasPosting && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]", title: t("wallet.posting_key_tooltip") })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-500 text-xs tracking-wide", children: chain }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-1 h-1 rounded-full ${chain === Chain.HIVE ? "bg-red-500" : chain === Chain.STEEM ? "bg-blue-500" : "bg-orange-500"}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-white text-lg tracking-tight", title: String(account.balance), children: account.balance !== void 0 ? account.balance.toFixed(3) : "0.000" })
            ] }),
            (chain === Chain.HIVE || chain === Chain.STEEM) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1.5 ml-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600 font-bold text-[10px]", children: "•" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-400 text-sm", title: String(account.secondaryBalance), children: account.secondaryBalance !== void 0 ? account.secondaryBalance.toFixed(3) : "0.000" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-slate-500", children: chain === Chain.HIVE ? "HBD" : "SBD" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1.5 ml-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600 font-bold text-[10px]", children: "/" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-blue-400 text-sm", title: String(account.stakedBalance), children: account.stakedBalance !== void 0 ? account.stakedBalance.toFixed(3) : "0.000" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-blue-500/80", children: chain === Chain.HIVE ? "HP" : chain === Chain.STEEM ? "SP" : "BP" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-2 mt-4 relative z-10 w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => onSend && onSend(account),
              className: "relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-blue-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn",
              "aria-label": t("wallet.send"),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-slate-400 group-hover/btn:text-blue-400 transition-colors", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 10l7-7m0 0l7 7m-7-7v18" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50", children: t("wallet.send") })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => onReceive && onReceive(account),
              className: "relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-green-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn",
              "aria-label": t("wallet.receive"),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-slate-400 group-hover/btn:text-green-400 transition-colors", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 14l-7 7m0 0l-7-7m7 7V3" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50", children: t("wallet.receive") })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => onHistory && onHistory(account),
              className: "relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-purple-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn",
              "aria-label": t("wallet.history"),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-slate-400 group-hover/btn:text-purple-400 transition-colors", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50", children: t("wallet.history") })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => onManage && onManage(account),
              className: "relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-orange-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn",
              "aria-label": t("wallet.keys"),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-slate-400 group-hover/btn:text-orange-400 transition-colors", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50", children: t("wallet.keys") })
              ]
            }
          )
        ] }),
        hasActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 mt-2 relative z-10 w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => openModal("powerup", account),
              className: "relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-cyan-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn",
              "aria-label": "Power Up",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-slate-400 group-hover/btn:text-cyan-400 transition-colors", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50", children: "Power Up" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => openModal("powerdown", account),
              className: "relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-yellow-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn",
              "aria-label": "Power Down",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-5 h-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-slate-400 group-hover/btn:text-yellow-400 transition-colors absolute inset-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3 h-3 text-red-500 group-hover/btn:text-red-400 transition-colors absolute top-0 right-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", strokeWidth: 3, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50", children: "Power Down" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => openModal("delegate", account),
              className: "relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-pink-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn",
              "aria-label": "Delegate",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-slate-400 group-hover/btn:text-pink-400 transition-colors", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50", children: "Delegate" })
              ]
            }
          )
        ] }),
        hasActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 mt-2 relative z-10 w-full", children: [
          (chain === Chain.HIVE || chain === Chain.STEEM) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => openModal("savings-deposit", account),
              className: "relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-emerald-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn",
              "aria-label": "Savings",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-slate-400 group-hover/btn:text-emerald-400 transition-colors", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50", children: "Savings" })
              ]
            }
          ),
          chain === Chain.HIVE && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => openModal("rc-delegate", account),
              className: "relative bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-indigo-500/50 h-10 rounded-lg transition-all flex items-center justify-center group/btn",
              "aria-label": "Delegate RC",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-slate-400 group-hover/btn:text-indigo-400 transition-colors", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm shadow-xl z-50", children: "Delegate RC" })
              ]
            }
          )
        ] })
      ] }, account.name);
    }) }),
    modalState.account && modalState.type && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      (modalState.type === "powerup" || modalState.type === "powerdown" || modalState.type === "delegate") && /* @__PURE__ */ jsxRuntimeExports.jsx(
        PowerModal,
        {
          account: modalState.account,
          type: modalState.type,
          onClose: closeModal,
          onSuccess: () => {
            closeModal();
            onRefresh?.();
          }
        }
      ),
      (modalState.type === "savings-deposit" || modalState.type === "savings-withdraw") && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SavingsModal,
        {
          account: modalState.account,
          type: modalState.type === "savings-deposit" ? "deposit" : "withdraw",
          onClose: closeModal,
          onSuccess: () => {
            closeModal();
            onRefresh?.();
          }
        }
      ),
      (modalState.type === "rc-delegate" || modalState.type === "rc-undelegate") && /* @__PURE__ */ jsxRuntimeExports.jsx(
        RCModal,
        {
          account: modalState.account,
          type: modalState.type === "rc-delegate" ? "delegate" : "undelegate",
          onClose: closeModal,
          onSuccess: () => {
            closeModal();
            onRefresh?.();
          }
        }
      )
    ] })
  ] });
};

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  type = "info",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false
}) => {
  if (!isOpen) return null;
  const colors = {
    info: "text-blue-400 border-blue-500/30",
    warning: "text-orange-400 border-orange-500/30",
    error: "text-red-400 border-red-500/30",
    success: "text-green-400 border-green-500/30"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-dark-900 border border-dark-700 rounded-xl shadow-2xl max-w-sm w-full transform transition-all scale-100 animate-slideIn", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: `text-lg font-bold mb-2 ${colors[type].split(" ")[0]}`, children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-slate-300 mb-6 leading-relaxed", children: message }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onCancel,
          disabled: isLoading,
          className: "flex-1 py-2 px-4 bg-dark-800 border border-dark-700 rounded-lg text-slate-400 hover:bg-dark-700 text-sm font-medium transition-colors",
          children: cancelLabel
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: onConfirm,
          disabled: isLoading,
          className: `flex-1 py-2 px-4 rounded-lg text-white text-sm font-bold shadow-lg transition-all transform active:scale-95 flex justify-center items-center gap-2
                                ${type === "error" ? "bg-red-600 hover:bg-red-500" : "bg-blue-600 hover:bg-blue-500"}
                                ${isLoading ? "opacity-70 cursor-wait" : ""}
                            `,
          children: [
            isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-spin h-3 w-3 border-2 border-white/30 border-t-white rounded-full" }),
            confirmLabel
          ]
        }
      )
    ] })
  ] }) }) });
};

const BulkTransferForm = ({ chain, account, mode, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [singleAmount, setSingleAmount] = reactExports.useState(0);
  const [singleMemo, setSingleMemo] = reactExports.useState("");
  const [recipientsText, setRecipientsText] = reactExports.useState("");
  const [selectedToken, setSelectedToken] = reactExports.useState(
    chain === Chain.HIVE ? "HIVE" : chain === Chain.STEEM ? "STEEM" : "BLURT"
  );
  reactExports.useEffect(() => {
    if (chain === Chain.HIVE) setSelectedToken("HIVE");
    else if (chain === Chain.STEEM) setSelectedToken("STEEM");
    else setSelectedToken("BLURT");
  }, [chain]);
  const [items, setItems] = reactExports.useState([{ to: "", amount: 0, memo: "" }]);
  const [validationStatus, setValidationStatus] = reactExports.useState({ valid: [], invalid: [], checking: false });
  const [confirmModal, setConfirmModal] = reactExports.useState(null);
  const [isBroadcasting, setIsBroadcasting] = reactExports.useState(false);
  const totalAmount = mode === "single" ? Number(singleAmount) * recipientsText.split(/[\s,]+/).filter((s) => s).length : items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const recipientCount = mode === "single" ? recipientsText.split(/[\s,]+/).filter((s) => s.trim()).length : items.filter((i) => i.to).length;
  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (mode === "single") {
          const names = text.split(/[\s,]+/).map((s) => s.trim()).filter((s) => s);
          setRecipientsText(names.join(", "));
        } else {
          const lines = text.split(/\r?\n/);
          const newItems = [];
          lines.forEach((line) => {
            const parts = line.trim().split(/[\s,]+/);
            if (parts.length >= 2) {
              newItems.push({
                to: parts[0],
                amount: parseFloat(parts[1]) || 0,
                memo: parts.slice(2).join(" ")
              });
            }
          });
          if (newItems.length > 0) {
            setItems(newItems);
            setToast({ msg: t("import.bulk_summary").replace("{count}", String(newItems.length)), type: "success" });
          } else {
            setToast({ msg: t("import.no_valid_accounts"), type: "error" });
          }
        }
      };
      reader.readAsText(file);
    }
  };
  const [toast, setToast] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const timer = setTimeout(() => {
      const hasData = mode === "single" ? recipientsText.trim().length > 0 : items.some((i) => i.to.trim().length > 0);
      if (hasData) {
        verifyAccounts(true);
      } else {
        setValidationStatus({ valid: [], invalid: [], checking: false });
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [recipientsText, items, mode, chain]);
  reactExports.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4e3);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  const verifyAccounts = async (isAuto = false) => {
    setValidationStatus((prev) => ({ ...prev, checking: true }));
    let usernamesToCheck = [];
    if (mode === "single") {
      usernamesToCheck = recipientsText.split(/[\s,]+/).map((s) => s.trim()).filter((s) => s).map((u) => u.replace(/^@/, ""));
    } else {
      usernamesToCheck = items.map((i) => i.to.trim()).filter((s) => s).map((u) => u.replace(/^@/, ""));
    }
    usernamesToCheck = [...new Set(usernamesToCheck)];
    if (usernamesToCheck.length === 0) {
      setValidationStatus({ valid: [], invalid: [], checking: false });
      return;
    }
    const valid = [];
    const invalid = [];
    const CHUNK_SIZE = 5;
    for (let i = 0; i < usernamesToCheck.length; i += CHUNK_SIZE) {
      const chunk = usernamesToCheck.slice(i, i + CHUNK_SIZE);
      await Promise.all(chunk.map(async (user) => {
        try {
          const data = await fetchAccountData(chain, user);
          if (data) valid.push(user);
          else invalid.push(user);
        } catch (e) {
          invalid.push(user);
        }
      }));
    }
    setValidationStatus({ valid, invalid, checking: false });
    if (isAuto && invalid.length > 0) {
      setToast({
        msg: t("bulk.warn_not_found").replace("{n}", String(invalid.length)).replace("{chain}", chain),
        type: "warning"
      });
    }
  };
  const addNewRow = () => setItems([...items, { to: "", amount: 0, memo: "" }]);
  const removeRow = (idx) => setItems(items.filter((_, i) => i !== idx));
  const handleInitiateSend = () => {
    if (mode === "single" && recipientCount === 0) return;
    if (mode === "multi" && items.length === 0) return;
    if (validationStatus.invalid.length > 0) {
      setConfirmModal({
        isOpen: true,
        title: t("bulk.validation_error"),
        message: t("bulk.error_remove_invalid"),
        type: "error"
      });
      return;
    }
    const recipientsList = mode === "single" ? recipientsText.split(/[\s,]+/).map((s) => s.trim()).filter((s) => s) : [];
    const details = mode === "single" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-950 p-3 rounded border border-dark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-dark-700 pb-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: t("sign.from") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-bold", children: [
            "@",
            account.name
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-dark-700 pb-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: t("transfer.total_amount") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-blue-400 font-bold", children: [
            totalAmount.toFixed(3),
            " ",
            selectedToken
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-500 mb-1 font-bold", children: [
          t("bulk.recipients"),
          " ",
          recipientsList.length
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 max-h-32 overflow-y-auto mb-3 custom-scrollbar", children: recipientsList.map((u, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-dark-800 text-slate-300 px-2 py-0.5 rounded text-[10px]", children: [
          "@",
          u.replace(/^@/, "")
        ] }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-[10px] text-slate-400 bg-dark-900 p-2 rounded", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            t("transfer.per_user"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white", children: [
              singleAmount,
              " ",
              selectedToken
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic max-w-[150px] truncate", title: singleMemo, children: singleMemo || "No Memo" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-center italic", children: t("transfer.please_review") })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-950 p-3 rounded border border-dark-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-dark-700 pb-2 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: t("sign.from") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-bold", children: [
          "@",
          account.name
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-dark-700 pb-2 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: t("transfer.total_amount") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-blue-400 font-bold", children: [
          totalAmount.toFixed(3),
          " ",
          selectedToken
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-500 mb-1 font-bold", children: [
        t("transfer.operations"),
        " (",
        items.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-48 overflow-y-auto custom-scrollbar space-y-1 pr-1", children: items.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col bg-dark-900 p-2 rounded border border-dark-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-bold mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white", children: [
            "@",
            item.to.replace(/^@/, "")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-green-400", children: [
            item.amount,
            " ",
            selectedToken
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 italic truncate", title: item.memo, children: item.memo || "No Memo" })
      ] }, idx)) })
    ] }) });
    setConfirmModal({
      isOpen: true,
      title: t("bulk.title"),
      message: details,
      type: "warning"
    });
  };
  const executeSend = async () => {
    setIsBroadcasting(true);
    let finalItems = [];
    if (mode === "single") {
      const names = recipientsText.split(/[\s,]+/).map((s) => s.trim()).filter((s) => s).map((u) => u.replace(/^@/, ""));
      finalItems = names.map((name) => ({
        to: name,
        amount: Number(singleAmount),
        memo: singleMemo
      }));
    } else {
      finalItems = items.filter((i) => i.to && Number(i.amount) > 0).map((i) => ({
        to: i.to.replace(/^@/, ""),
        amount: Number(i.amount),
        memo: i.memo
      }));
    }
    try {
      if (!account.activeKey) throw new Error(t("bulk.error_no_active"));
      const result = await broadcastBulkTransfer(chain, account.name, account.activeKey, finalItems, selectedToken);
      if (result.success) {
        setConfirmModal({
          isOpen: true,
          title: t("bulk.success_title"),
          message: t("bulk.success_msg").replace("{n}", String(finalItems.length)).replace("{txid}", result.txId?.slice(0, 8) || "???"),
          type: "success"
        });
        onSuccess();
      } else {
        throw new Error(result.error);
      }
    } catch (e) {
      setConfirmModal({
        isOpen: true,
        title: t("bulk.error_title"),
        message: e.message || t("bulk.error_failed"),
        type: "error"
      });
    } finally {
      setIsBroadcasting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900 w-full max-w-2xl h-[90vh] rounded-2xl shadow-2xl flex flex-col border border-dark-700 animate-slide-up relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "absolute top-4 right-4 text-slate-400 hover:text-white z-10 p-2 bg-dark-800 rounded-full hover:bg-dark-700 transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
        }
      ),
      toast && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-16 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-xl text-xs font-bold transition-opacity duration-500 animate-slide-down backdrop-blur-md ${toast.type === "error" || toast.type === "warning" ? "bg-red-500/80 text-white" : "bg-green-500/80 text-white"}`, children: toast.msg }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-dark-700 bg-dark-800 rounded-t-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-white flex items-center gap-2", children: mode === "single" ? t("bulk.title_single") : t("bulk.title_multi") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-400 text-xs mt-0.5 mb-2", children: [
          t("bulk.sending_from"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-blue-400 font-bold", children: [
            "@",
            account.name
          ] })
        ] }),
        (chain === Chain.HIVE || chain === Chain.STEEM) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between bg-dark-900/50 p-2 rounded-lg border border-dark-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-400 w-full text-right", children: [
          t("bulk.available"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400 font-bold font-mono", children: (selectedToken === "HBD" || selectedToken === "SBD" ? account.secondaryBalance : account.balance)?.toFixed(3) }),
          " ",
          selectedToken
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-dark-900", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden cursor-pointer group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] text-blue-400 font-bold uppercase border border-blue-500/30 px-3 py-1.5 rounded-lg hover:bg-blue-500/10 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" }) }),
            t("bulk.import"),
            " CSV/TXT"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", onChange: handleFileImport, className: "absolute inset-0 opacity-0 cursor-pointer", accept: ".csv,.txt" })
        ] }) }),
        mode === "single" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800/50 p-4 rounded-xl border border-dark-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider", children: [
              t("bulk.amount"),
              " per user"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  inputMode: "decimal",
                  placeholder: "0.000",
                  value: singleAmount,
                  onChange: (e) => {
                    const val = e.target.value.replace(",", ".");
                    if (val === "" || !isNaN(Number(val)) || val.endsWith(".")) {
                      setSingleAmount(val);
                    }
                  },
                  className: "w-full bg-dark-950 border border-dark-600 rounded-lg p-3 text-lg font-mono text-white focus:border-blue-500 outline-none transition-colors"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-1 top-1 bottom-1 flex items-center", children: chain === Chain.HIVE || chain === Chain.STEEM ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  value: selectedToken,
                  onChange: (e) => setSelectedToken(e.target.value),
                  className: "h-full bg-dark-800 text-xs font-bold text-white border-l border-dark-600 rounded-r-lg px-2 outline-none cursor-pointer hover:bg-dark-700",
                  children: chain === Chain.HIVE ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "HIVE", children: "HIVE" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "HBD", children: "HBD" })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "STEEM", children: "STEEM" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "SBD", children: "SBD" })
                  ] })
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 text-xs font-bold text-slate-500", children: selectedToken }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800/50 p-4 rounded-xl border border-dark-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider", children: t("bulk.recipients") }),
              validationStatus.checking && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-blue-400 animate-pulse font-mono", children: "Verifying..." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                value: recipientsText,
                onChange: (e) => setRecipientsText(e.target.value.replace(/[\u200B-\u200D\uFEFF]/g, "")),
                className: "w-full h-32 bg-dark-950 border border-dark-600 rounded-lg p-3 text-xs font-mono text-slate-300 focus:border-blue-500 outline-none resize-none custom-scrollbar",
                placeholder: `user1, user2
user3`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-3 max-h-24 overflow-y-auto custom-scrollbar", children: recipientsText.split(/[\s,]+/).filter((s) => s.trim()).map((user, i) => {
              const clean = user.replace(/^@/, "");
              const isValid = validationStatus.valid.includes(clean);
              const isInvalid = validationStatus.invalid.includes(clean);
              let color = "bg-slate-700 text-slate-400";
              let icon = "";
              if (isValid) {
                color = "bg-green-900/40 text-green-400 border border-green-500/30";
                icon = "✓";
              }
              if (isInvalid) {
                color = "bg-red-900/40 text-red-400 border border-red-500/30";
                icon = "✕";
              }
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-[10px] px-2 py-0.5 rounded-full ${color} flex items-center gap-1`, children: [
                icon,
                " ",
                clean
              ] }, i);
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800/50 p-4 rounded-xl border border-dark-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider", children: t("bulk.memo") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                value: singleMemo,
                onChange: (e) => setSingleMemo(e.target.value),
                className: "w-full h-20 bg-dark-950 border border-dark-600 rounded-lg p-3 text-sm text-white focus:border-blue-500 outline-none resize-none",
                placeholder: "Public Memo..."
              }
            )
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          items.map((item, idx) => {
            const clean = item.to.replace(/^@/, "");
            const isValid = validationStatus.valid.includes(clean);
            const isInvalid = validationStatus.invalid.includes(clean);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800/50 p-3 rounded-xl border border-dark-700 relative hover:border-dark-600 transition-colors group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      placeholder: t("import.username"),
                      value: item.to,
                      onChange: (e) => {
                        const newItems = [...items];
                        newItems[idx].to = e.target.value.toLowerCase().replace(/[\s\u200B-\u200D\uFEFF]/g, "");
                        setItems(newItems);
                      },
                      className: `w-full bg-dark-950 border rounded-lg px-3 py-2 text-xs outline-none text-white placeholder-slate-600 ${isValid ? "border-green-500/50" : isInvalid ? "border-red-500/50" : "border-dark-600"}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-2 top-2 text-[10px]", children: [
                    isValid && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400", children: "✓" }),
                    isInvalid && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400 font-bold", children: "✕" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-1/3 relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      inputMode: "decimal",
                      placeholder: "0.000",
                      value: item.amount,
                      onChange: (e) => {
                        const val = e.target.value.replace(",", ".");
                        if (val === "" || !isNaN(Number(val)) || val.endsWith(".")) {
                          const newItems = [...items];
                          newItems[idx].amount = val;
                          setItems(newItems);
                        }
                      },
                      className: "w-full bg-dark-950 border border-dark-600 rounded-lg px-3 py-2 text-xs outline-none text-white placeholder-slate-600 font-mono"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-1 top-1 bottom-1 flex items-center", children: chain === Chain.HIVE || chain === Chain.STEEM ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "select",
                    {
                      value: selectedToken,
                      onChange: (e) => setSelectedToken(e.target.value),
                      className: "h-full bg-dark-800 text-xs font-bold text-white border-l border-dark-600 rounded-r-lg px-2 outline-none cursor-pointer hover:bg-dark-700",
                      children: chain === Chain.HIVE ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "HIVE", children: "HIVE" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "HBD", children: "HBD" })
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "STEEM", children: "STEEM" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "SBD", children: "SBD" })
                      ] })
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 text-xs font-bold text-slate-500", children: selectedToken }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => removeRow(idx),
                    className: "text-red-400 hover:text-red-200 hover:bg-red-500/10 rounded w-8 flex items-center justify-center transition-colors",
                    title: "Remove row",
                    children: "✕"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  rows: 3,
                  placeholder: t("bulk.memo"),
                  value: item.memo,
                  onChange: (e) => {
                    const newItems = [...items];
                    newItems[idx].memo = e.target.value;
                    setItems(newItems);
                  },
                  className: "w-full bg-dark-950 border border-dark-600 rounded-lg px-3 py-2 text-xs outline-none text-white placeholder-slate-600 resize-none custom-scrollbar"
                }
              ) })
            ] }, idx);
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: addNewRow, className: "w-full py-3 bg-dark-800 border-2 border-dashed border-dark-600 rounded-xl text-slate-400 text-xs font-bold hover:border-blue-500/50 hover:text-blue-400 transition-all", children: [
            "+ ",
            t("bulk.add_row")
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-6 pb-4 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleInitiateSend,
            disabled: validationStatus.invalid.length > 0 || validationStatus.checking || isBroadcasting,
            className: "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-dark-600 disabled:to-dark-600 disabled:text-slate-500 text-white font-bold py-2 px-6 h-auto min-h-[40px] rounded-full shadow-lg transition-all transform active:scale-[0.98] text-xs tracking-wide whitespace-normal leading-tight max-w-[200px]",
            children: isBroadcasting ? "Broadcasting..." : t("bulk.sign_broadcast")
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmationModal,
      {
        isOpen: !!confirmModal,
        title: confirmModal?.title || "",
        message: confirmModal?.message || "",
        type: confirmModal?.type,
        onConfirm: () => {
          if (confirmModal?.type === "success") {
            setConfirmModal(null);
            onClose();
          } else if (confirmModal?.type === "error") {
            setConfirmModal(null);
          } else {
            executeSend();
          }
        },
        onCancel: () => setConfirmModal(null),
        isLoading: isBroadcasting,
        confirmLabel: confirmModal?.type === "warning" ? "Confirm Send" : "OK",
        cancelLabel: confirmModal?.type === "warning" ? "Cancel" : "Close"
      }
    )
  ] });
};

const BulkTransfer = ({ chain, accounts, refreshBalance, onChangeChain, onAddAccount }) => {
  const { t } = useTranslation();
  const [activeModal, setActiveModal] = reactExports.useState(null);
  const currentChainAccounts = accounts.filter((a) => a.chain === chain);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col bg-dark-900 overflow-hidden relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 pb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400 mb-4", children: t("bulk.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex p-1 bg-dark-800 rounded-xl mb-4 border border-dark-700", children: [Chain.BLURT, Chain.HIVE, Chain.STEEM].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => onChangeChain && onChangeChain(c),
          className: `flex-1 py-2 text-xs font-bold rounded-lg transition-all ${chain === c ? c === Chain.HIVE ? "bg-hive text-white shadow-lg" : c === Chain.STEEM ? "bg-steem text-white shadow-lg" : "bg-blurt text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`,
          children: c
        },
        c
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 space-y-4", children: currentChainAccounts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 opacity-50 bg-dark-800/50 rounded-xl border border-dashed border-dark-700 flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-400", children: t("bulk.no_accounts").replace("{chain}", chain) }),
      onAddAccount && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onAddAccount,
          className: "bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg text-xs transition-colors shadow-lg",
          children: t("wallet.add_one")
        }
      )
    ] }) : currentChainAccounts.map((account) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-dark-800 p-5 rounded-2xl border border-dark-700 shadow-xl overflow-hidden group hover:border-dark-600 transition-all", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[-20px] right-[-20px] w-32 h-32 opacity-5 pointer-events-none transform rotate-12 group-hover:opacity-10 transition-opacity duration-500 blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: chain === Chain.HIVE ? "/Logo_hive.png" : chain === Chain.STEEM ? "/logosteem.png" : "/logoblurt.png",
          alt: chain,
          className: "w-full h-full object-contain"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-lg text-white flex items-center gap-2", children: [
              "@",
              account.name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-400 font-bold tracking-wider mt-1", children: [
              chain,
              " COIN"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1 justify-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-black text-white block truncate", children: account.balance !== void 0 ? account.balance.toFixed(3) : "0.000" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-slate-500", children: chain })
            ] }),
            (chain === Chain.HIVE || chain === Chain.STEEM) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1 justify-end mt-[-2px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-slate-400 block truncate", children: account.secondaryBalance !== void 0 ? account.secondaryBalance.toFixed(3) : "0.000" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-slate-600", children: chain === Chain.HIVE ? "HBD" : "SBD" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setActiveModal({ account, mode: "single" }),
              className: "bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-blue-500/50 py-3 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-2 group/btn relative overflow-hidden",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-blue-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-dark-800 rounded-full group-hover/btn:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-blue-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300 group-hover/btn:text-white relative z-10", children: t("bulk.same_amount") })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setActiveModal({ account, mode: "multi" }),
              className: "bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-purple-500/50 py-3 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-2 group/btn relative overflow-hidden",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-purple-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-dark-800 rounded-full group-hover/btn:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-purple-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300 group-hover/btn:text-white relative z-10", children: t("bulk.diff_amount") })
              ]
            }
          )
        ] })
      ] })
    ] }, account.name)) }),
    activeModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      BulkTransferForm,
      {
        chain,
        account: activeModal.account,
        mode: activeModal.mode,
        onClose: () => setActiveModal(null),
        onSuccess: () => {
          setActiveModal(null);
          if (refreshBalance) refreshBalance();
        }
      }
    )
  ] });
};

const MultiSig = () => {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col items-center justify-center p-8 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-64 h-64 mb-8 group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-blue-500 blur-[80px] opacity-20 rounded-full group-hover:opacity-30 transition-opacity duration-700" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: "/construction_worker.png",
          alt: "Under Construction",
          className: "relative w-full h-full object-contain drop-shadow-2xl animate-float"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4 tracking-tight", children: t("multisig.construction_title") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 max-w-sm text-lg leading-relaxed", children: t("multisig.construction_desc") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex gap-3 opacity-75", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded-full bg-blue-500 animate-bounce", style: { animationDelay: "0ms" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded-full bg-indigo-500 animate-bounce", style: { animationDelay: "150ms" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded-full bg-purple-500 animate-bounce", style: { animationDelay: "300ms" } })
    ] })
  ] });
};

const ImportModal = ({ onClose, onImport, initialChain }) => {
  const { t } = useTranslation();
  const [method, setMethod] = reactExports.useState("manual");
  const [selectedChain, setSelectedChain] = reactExports.useState(initialChain || Chain.HIVE);
  const [username, setUsername] = reactExports.useState("");
  const [postingKey, setPostingKey] = reactExports.useState("");
  const [activeKey, setActiveKey] = reactExports.useState("");
  const [memoKey, setMemoKey] = reactExports.useState("");
  const [isVerifying, setIsVerifying] = reactExports.useState(false);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [chainData, setChainData] = reactExports.useState(null);
  const [usernameError, setUsernameError] = reactExports.useState(null);
  const [generalError, setGeneralError] = reactExports.useState(null);
  const [isDragging, setIsDragging] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const timer = setTimeout(() => {
      if (username.length > 2) {
        verifyUsername();
      } else {
        setChainData(null);
        setUsernameError(null);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [username, selectedChain]);
  const verifyUsername = async () => {
    const formatError = validateUsername(username);
    if (formatError) {
      setUsernameError(formatError);
      setChainData(null);
      return;
    }
    setIsVerifying(true);
    setUsernameError(null);
    const data = await fetchAccountData(selectedChain, username.trim().toLowerCase());
    setIsVerifying(false);
    if (data) {
      setChainData(data);
    } else {
      setChainData(null);
      setUsernameError(t("import.not_found").replace("{chain}", selectedChain));
    }
  };
  const processManualImport = async () => {
    setGeneralError(null);
    if (usernameError || !chainData) {
      setGeneralError(t("import.error_username"));
      return;
    }
    const postingErr = validatePrivateKey(postingKey);
    const activeErr = validatePrivateKey(activeKey);
    const memoErr = validatePrivateKey(memoKey);
    if (postingErr || activeErr || memoErr) {
      setGeneralError(t("import.error_format"));
      return;
    }
    if (!postingKey && !activeKey && !memoKey) {
      setGeneralError(t("import.error_missing_key"));
      return;
    }
    setIsSaving(true);
    if (postingKey) {
      const isValid = await verifyKeyAgainstChain(selectedChain, username, postingKey, "posting");
      if (!isValid) {
        setGeneralError(t("import.match_error_posting"));
        setIsSaving(false);
        return;
      }
    }
    if (activeKey) {
      const isValid = await verifyKeyAgainstChain(selectedChain, username, activeKey, "active");
      if (!isValid) {
        setGeneralError(t("import.match_error_active"));
        setIsSaving(false);
        return;
      }
    }
    if (memoKey) {
      const isValid = await verifyKeyAgainstChain(selectedChain, username, memoKey, "memo");
      if (!isValid) {
        setGeneralError(t("import.match_error_memo"));
        setIsSaving(false);
        return;
      }
    }
    const newAccount = {
      name: chainData.name,
      chain: selectedChain,
      publicKey: "IMPORTED",
      // Placeholder
      postingKey: postingKey.trim() || void 0,
      activeKey: activeKey.trim() || void 0,
      memoKey: memoKey.trim() || void 0
    };
    onImport([newAccount]);
    setIsSaving(false);
  };
  const processFileContent = (text) => {
    try {
      let newAccounts = [];
      if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
        const json = JSON.parse(text);
        const list = Array.isArray(json) ? json : json.list || json.accounts || [json];
        newAccounts = list.map((item) => ({
          name: item.name || item.username || item.account,
          chain: selectedChain,
          publicKey: "IMPORTED",
          postingKey: item.postingKey || item.posting || item.privatePostingKey,
          activeKey: item.activeKey || item.active || item.privateActiveKey,
          memoKey: item.memoKey || item.memo || item.privateMemoKey
        })).filter((a) => a.name && (a.postingKey || a.activeKey));
      } else {
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        newAccounts = lines.map((line) => {
          const parts = line.replace(/"/g, "").split(/[,;\t]/).map((s) => s.trim());
          if (parts.length < 2) return null;
          return {
            name: parts[0],
            chain: selectedChain,
            publicKey: "IMPORTED",
            postingKey: parts[1],
            activeKey: parts[2],
            memoKey: parts[3]
          };
        }).filter(Boolean);
      }
      if (newAccounts.length > 0) {
        onImport(newAccounts);
        onClose();
      } else {
        setGeneralError(t("import.no_valid_accounts"));
      }
    } catch (err) {
      setGeneralError(t("import.error_file_read"));
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => processFileContent(ev.target?.result);
      reader.readAsText(file);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 w-full max-w-sm rounded-xl border border-dark-600 p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto my-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold", children: t("import.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-slate-500 hover:text-white", children: "✕" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 mb-5 text-sm border-b border-dark-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `pb-2 border-b-2 px-2 transition-colors ${method === "manual" ? "border-blue-500 text-white font-medium" : "border-transparent text-slate-500"}`, onClick: () => setMethod("manual"), children: t("import.manual") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `pb-2 border-b-2 px-2 transition-colors ${method === "file" ? "border-blue-500 text-white font-medium" : "border-transparent text-slate-500"}`, onClick: () => setMethod("file"), children: t("import.file") })
    ] }),
    method === "manual" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 overflow-y-auto custom-scrollbar pr-1 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-400 uppercase font-bold mb-2 block", children: t("import.select_chain") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: [Chain.HIVE, Chain.STEEM, Chain.BLURT].map((chain) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                setSelectedChain(chain);
                setChainData(null);
              },
              className: `py-2 rounded-lg text-xs font-bold transition-all border ${selectedChain === chain ? chain === Chain.HIVE ? "bg-hive border-hive text-white" : chain === Chain.STEEM ? "bg-steem border-steem text-white" : "bg-blurt border-blurt text-white" : "bg-dark-900 border-dark-700 text-slate-400 hover:bg-dark-700"}`,
              children: chain
            },
            chain
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-400 uppercase font-bold mb-1 block", children: t("import.username") }),
            isVerifying && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-blue-400 animate-pulse", children: t("import.checking") }),
            chainData && !isVerifying && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-green-400 font-bold", children: t("import.found") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-2.5 text-slate-500", children: "@" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: username,
                onChange: (e) => setUsername(e.target.value.toLowerCase().replace(/[@\s\u200B-\u200D\uFEFF]/g, "")),
                className: `w-full bg-dark-900 border ${usernameError ? "border-red-500" : chainData ? "border-green-500" : "border-dark-600"} rounded-lg py-2 pl-7 pr-3 text-sm text-white focus:outline-none`,
                placeholder: t("import.placeholder_username"),
                disabled: isSaving
              }
            )
          ] }),
          usernameError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-red-400 mt-1", children: usernameError })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-slate-500 uppercase font-bold tracking-wider border-b border-dark-700 pb-1", children: t("import.private_keys") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] text-blue-400 mb-1 block flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("import.key_posting") }),
              validatePrivateKey(postingKey) && postingKey.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400", children: t("import.invalid_format") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "password",
                value: postingKey,
                onChange: (e) => {
                  setPostingKey(e.target.value);
                  setGeneralError(null);
                },
                className: "w-full bg-dark-900 border border-dark-600 rounded p-2 text-xs font-mono text-slate-300 focus:border-blue-500 outline-none",
                placeholder: t("import.placeholder_key"),
                disabled: isSaving
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] text-green-400 mb-1 block flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("import.key_active") }),
              validatePrivateKey(activeKey) && activeKey.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400", children: t("import.invalid_format") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "password",
                value: activeKey,
                onChange: (e) => {
                  setActiveKey(e.target.value);
                  setGeneralError(null);
                },
                className: "w-full bg-dark-900 border border-dark-600 rounded p-2 text-xs font-mono text-slate-300 focus:border-blue-500 outline-none",
                placeholder: t("import.placeholder_key"),
                disabled: isSaving
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] text-slate-400 mb-1 block flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("import.key_memo") }),
              validatePrivateKey(memoKey) && memoKey.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400", children: t("import.invalid_format") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "password",
                value: memoKey,
                onChange: (e) => {
                  setMemoKey(e.target.value);
                  setGeneralError(null);
                },
                className: "w-full bg-dark-900 border border-dark-600 rounded p-2 text-xs font-mono text-slate-300 focus:border-blue-500 outline-none",
                placeholder: t("import.placeholder_key"),
                disabled: isSaving
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto pt-4 border-t border-dark-700", children: [
        generalError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-900/20 border border-red-500/50 p-2 rounded text-xs text-red-200 text-center mb-2", children: generalError }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: processManualImport,
            disabled: !chainData || !!usernameError || isSaving,
            className: `w-full py-3 rounded-lg font-bold transition-all shadow-lg ${!chainData || !!usernameError || isSaving ? "bg-dark-700 text-slate-500 cursor-not-allowed" : selectedChain === Chain.HIVE ? "bg-hive hover:bg-red-700 text-white" : selectedChain === Chain.STEEM ? "bg-steem hover:bg-blue-800 text-white" : "bg-blurt hover:bg-orange-700 text-white"}`,
            children: isSaving ? t("import.verifying") : t("import.save")
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center mb-4 transition-colors relative group ${isDragging ? "bg-blue-900/20 border-blue-500" : "bg-dark-900/50 border-dark-600 hover:bg-dark-800"}`,
        onDragOver: (e) => {
          e.preventDefault();
          setIsDragging(true);
        },
        onDragLeave: () => setIsDragging(false),
        onDrop: handleDrop,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: `w-12 h-12 mb-3 transition-opacity ${isDragging ? "text-blue-400 scale-110" : "text-blue-500 opacity-50 group-hover:opacity-100"}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-300 font-bold pointer-events-none", children: t("import.drag_drop") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-1 pointer-events-none", children: t("import.click_upload") }),
          generalError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400 mt-2 absolute bottom-4 w-full text-center px-4", children: generalError }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "file",
              accept: ".json,.csv,.txt",
              className: "absolute inset-0 opacity-0 cursor-pointer",
              onChange: (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => processFileContent(ev.target?.result);
                  reader.readAsText(file);
                }
              }
            }
          )
        ]
      }
    )
  ] }) });
};

const ManageAccountModal = ({ account, onClose, onSave, onDelete }) => {
  const { t } = useTranslation();
  const [postingKey, setPostingKey] = reactExports.useState(account.postingKey || "");
  const [activeKey, setActiveKey] = reactExports.useState(account.activeKey || "");
  const [memoKey, setMemoKey] = reactExports.useState(account.memoKey || "");
  const [showConfirmDelete, setShowConfirmDelete] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [isValidating, setIsValidating] = reactExports.useState(false);
  const handleSave = async () => {
    setError(null);
    const pErr = validatePrivateKey(postingKey);
    const aErr = validatePrivateKey(activeKey);
    const mErr = validatePrivateKey(memoKey);
    if (pErr && postingKey) return setError(t("manage.invalid_posting"));
    if (aErr && activeKey) return setError(t("manage.invalid_active"));
    if (mErr && memoKey) return setError(t("manage.invalid_memo"));
    setIsValidating(true);
    const chainResult = await validateAccountKeys(account.chain, account.name, {
      active: activeKey || void 0,
      posting: postingKey || void 0,
      memo: memoKey || void 0
    });
    setIsValidating(false);
    if (!chainResult.valid) {
      setError(t("manage.verify_fail") + chainResult.error);
      return;
    }
    onSave({
      ...account,
      postingKey: postingKey.trim() || void 0,
      activeKey: activeKey.trim() || void 0,
      memoKey: memoKey.trim() || void 0
    });
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 w-full max-w-sm rounded-xl border border-dark-600 p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto my-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold", children: t("manage.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500", children: [
          "@",
          account.name,
          " • ",
          account.chain
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-slate-500 hover:text-white", children: "✕" })
    ] }),
    !showConfirmDelete ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-blue-400 mb-1 block uppercase font-bold", children: t("manage.label_posting") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              value: postingKey,
              onChange: (e) => setPostingKey(e.target.value),
              className: `w-full bg-dark-900 border ${validatePrivateKey(postingKey) && postingKey ? "border-red-500" : "border-dark-600"} rounded p-2 text-xs font-mono text-slate-300 focus:outline-none`,
              placeholder: t("manage.add_posting")
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-green-400 mb-1 block uppercase font-bold", children: t("manage.label_active") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              value: activeKey,
              onChange: (e) => setActiveKey(e.target.value),
              className: `w-full bg-dark-900 border ${validatePrivateKey(activeKey) && activeKey ? "border-red-500" : "border-dark-600"} rounded p-2 text-xs font-mono text-slate-300 focus:outline-none`,
              placeholder: t("manage.add_active")
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-slate-400 mb-1 block uppercase font-bold", children: t("manage.label_memo") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              value: memoKey,
              onChange: (e) => setMemoKey(e.target.value),
              className: `w-full bg-dark-900 border ${validatePrivateKey(memoKey) && memoKey ? "border-red-500" : "border-dark-600"} rounded p-2 text-xs font-mono text-slate-300 focus:outline-none`,
              placeholder: t("manage.add_memo")
            }
          )
        ] })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400 text-center mb-2", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleSave,
            disabled: isValidating,
            className: "w-full py-3 h-auto min-h-[48px] rounded-lg font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg disabled:opacity-50 whitespace-normal leading-tight",
            children: isValidating ? t("manage.validating") : t("manage.save_verify")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setShowConfirmDelete(true),
            className: "text-xs text-red-400 hover:text-red-300 underline",
            children: t("manage.remove_link")
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6 text-red-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-white mb-2", children: t("manage.confirm_remove_title").replace("{name}", account.name) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mb-6", children: t("manage.confirm_remove_desc") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setShowConfirmDelete(false),
            className: "flex-1 py-2 rounded bg-dark-700 hover:bg-dark-600 text-slate-300 text-sm",
            children: t("manage.cancel")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => onDelete(account),
            className: "flex-1 py-2 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-sm",
            children: t("manage.confirm_remove")
          }
        )
      ] })
    ] })
  ] }) });
};

const TransferModal = ({ account: initialAccount, accounts, onClose, onTransfer, disableAccountSelection }) => {
  const { t } = useTranslation();
  const [selectedAccount, setSelectedAccount] = reactExports.useState(initialAccount);
  const [to, setTo] = reactExports.useState("");
  const [amount, setAmount] = reactExports.useState("");
  const [memo, setMemo] = reactExports.useState("");
  const [currency, setCurrency] = reactExports.useState(
    initialAccount.chain === "HIVE" ? "HIVE" : initialAccount.chain === "STEEM" ? "STEEM" : "BLURT"
  );
  const [isSending, setIsSending] = reactExports.useState(false);
  const [recentRecipients, setRecentRecipients] = reactExports.useState([]);
  const [showRecent, setShowRecent] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const c = selectedAccount.chain;
    if (c === "HIVE") setCurrency("HIVE");
    else if (c === "STEEM") setCurrency("STEEM");
    else setCurrency("BLURT");
  }, [selectedAccount.chain]);
  reactExports.useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(["recentRecipients"], (result) => {
        if (result.recentRecipients) {
          setRecentRecipients(result.recentRecipients);
        }
      });
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  const [error, setError] = reactExports.useState(null);
  const [isValidRecipient, setIsValidRecipient] = reactExports.useState(null);
  const [isValidating, setIsValidating] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setError(null);
    const check = async () => {
      if (!to || to.length < 3) {
        setIsValidRecipient(null);
        setIsValidating(false);
        return;
      }
      setIsValidating(true);
      try {
        const data = await fetchAccountData(selectedAccount.chain, to.replace(/^@/, ""));
        setIsValidRecipient(!!data);
      } catch {
        setIsValidRecipient(false);
      } finally {
        setIsValidating(false);
      }
    };
    const timer = setTimeout(check, 500);
    return () => clearTimeout(timer);
  }, [to, selectedAccount.chain]);
  reactExports.useEffect(() => {
    if (error) setError(null);
  }, [amount]);
  const hasActiveKey = !!selectedAccount.activeKey;
  const [step, setStep] = reactExports.useState("input");
  const handleReview = () => {
    setError(null);
    if (!to) {
      setError(t("validation.required"));
      return;
    }
    if (isValidRecipient === false) {
      return;
    }
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 0) {
      setError(t("validation.invalid_amount"));
      return;
    }
    setStep("review");
  };
  const saveRecipient = (name) => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["recentRecipients"], (result) => {
        const list = result.recentRecipients || [];
        if (!list.includes(name)) {
          const newList = [name, ...list].slice(0, 10);
          chrome.storage.local.set({ recentRecipients: newList });
        }
      });
    }
  };
  const handleConfirm = async () => {
    setIsSending(true);
    try {
      await onTransfer(selectedAccount, to, amount, memo, currency);
      saveRecipient(to);
      onClose();
    } catch (e) {
      console.error(e);
      setError(t("bulk.error_failed"));
    } finally {
      setIsSending(false);
    }
  };
  const handleMaxClick = () => {
    const bal = currency === "HBD" || currency === "SBD" ? selectedAccount.secondaryBalance : selectedAccount.balance;
    if (bal !== void 0) {
      setAmount(bal.toString());
    }
  };
  if (step === "review") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900 w-full max-w-sm rounded-xl border border-dark-600 p-6 shadow-2xl flex flex-col animate-fadeIn", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-white mb-4", children: t("transfer.review_title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-950 p-4 rounded-lg border border-dark-700 space-y-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-dark-800 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 uppercase font-bold", children: t("sign.from") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-white", children: [
            "@",
            selectedAccount.name
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-dark-800 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 uppercase font-bold", children: t("sign.to") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-white", children: [
            "@",
            to
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-dark-800 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 uppercase font-bold", children: t("bulk.amount") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-bold text-blue-400", children: [
            amount,
            " ",
            currency
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 uppercase font-bold block mb-1", children: t("bulk.memo") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-300 italic bg-dark-900 p-2 rounded break-all max-h-20 overflow-y-auto", children: memo || t("transfer.no_memo") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setStep("input"),
            disabled: isSending,
            className: "flex-1 py-3 rounded-lg font-bold bg-dark-800 text-slate-400 hover:bg-dark-700 transition-colors",
            children: t("transfer.back")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleConfirm,
            disabled: isSending,
            className: "flex-1 py-3 rounded-lg font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg flex justify-center items-center gap-2",
            children: isSending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" }) : t("wallet.send")
          }
        )
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 w-full max-w-sm rounded-xl border border-dark-600 p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold flex items-center gap-2", children: [
        t("wallet.send"),
        " ",
        selectedAccount.chain
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-slate-500 hover:text-white", children: "✕" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-dark-900 rounded-lg border border-dark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-500 block mb-1", children: t("sign.from") }),
        disableAccountSelection ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full bg-dark-800 text-slate-400 border border-dark-600 rounded p-2 text-sm font-bold flex items-center gap-2 cursor-not-allowed", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-slate-500" }),
          "@",
          selectedAccount.name
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            value: `${selectedAccount.chain}-${selectedAccount.name}`,
            onChange: (e) => {
              const [c, n] = e.target.value.split("-");
              const acc = accounts.find((a) => a.chain === c && a.name === n);
              if (acc) setSelectedAccount(acc);
            },
            className: "w-full bg-dark-800 text-white border border-dark-600 rounded p-2 text-sm outline-none focus:border-blue-500",
            children: accounts.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: `${a.chain}-${a.name}`, children: [
              "@",
              a.name,
              " (",
              a.chain,
              ")"
            ] }, `${a.chain}-${a.name}`))
          }
        )
      ] }),
      !hasActiveKey && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-900/20 text-red-400 p-2 rounded text-xs text-center border border-red-500/30", children: t("sign.keys_missing") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-400 uppercase font-bold mb-1 block", children: t("sign.to") }),
          isValidating && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-blue-400 animate-pulse", children: t("bulk.checking") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-2.5 text-slate-500", children: "@" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: to,
              onFocus: () => !to && setShowRecent(true),
              onBlur: () => setTimeout(() => setShowRecent(false), 200),
              onChange: (e) => {
                const val = e.target.value.toLowerCase().replace(/[@\s\u200B-\u200D\uFEFF]/g, "");
                setTo(val);
                setShowRecent(false);
              },
              className: `w-full bg-dark-900 border rounded-lg py-2 pl-7 pr-8 text-sm outline-none transition-colors ${isValidRecipient === false ? "border-red-500/50 focus:border-red-500" : isValidRecipient === true ? "border-green-500/50 focus:border-green-500" : "border-dark-600 focus:border-blue-500"}`,
              placeholder: t("import.placeholder_username"),
              autoComplete: "off"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-3 top-2.5 text-xs", children: [
            isValidRecipient === true && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400", children: "✓" }),
            isValidRecipient === false && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400 font-bold", children: "✕" })
          ] }),
          showRecent && recentRecipients.length > 0 && !to && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-full left-0 right-0 z-50 mt-1 bg-dark-800 border border-dark-700 rounded-lg shadow-xl max-h-40 overflow-y-auto custom-scrollbar animate-slide-down", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider border-b border-dark-700 bg-dark-900/50", children: t("common.recent_recipients") }),
            recentRecipients.map((recipient) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                onClick: () => {
                  setTo(recipient);
                  setShowRecent(false);
                },
                className: "px-3 py-2 text-sm text-slate-300 hover:bg-blue-600/20 hover:text-white cursor-pointer transition-colors flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 h-6 rounded-full bg-dark-700 flex items-center justify-center text-[10px] text-slate-400 font-bold", children: recipient.charAt(0).toUpperCase() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: recipient })
                ]
              },
              recipient
            ))
          ] })
        ] }),
        isValidRecipient === false && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-red-400 mt-1", children: t("validation.account_not_found").replace("{chain}", selectedAccount.chain) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-400 uppercase font-bold mb-1 block", children: t("bulk.amount") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              value: amount,
              onChange: (e) => setAmount(e.target.value),
              className: "w-full bg-dark-900 border border-dark-600 rounded-lg py-2 pl-3 pr-20 text-sm focus:border-blue-500 outline-none",
              placeholder: "0.000"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-1 top-1 bottom-1 flex items-center", children: selectedAccount.chain === "HIVE" || selectedAccount.chain === "STEEM" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              value: currency,
              onChange: (e) => setCurrency(e.target.value),
              className: "h-full bg-dark-800 text-xs font-bold text-white border-l border-dark-600 rounded-r-lg px-2 outline-none cursor-pointer hover:bg-dark-700",
              children: selectedAccount.chain === "HIVE" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "HIVE", children: "HIVE" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "HBD", children: "HBD" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "STEEM", children: "STEEM" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "SBD", children: "SBD" })
              ] })
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 text-xs font-bold text-slate-500", children: selectedAccount.chain }) })
        ] }),
        (() => {
          const bal = currency === "HBD" || currency === "SBD" ? selectedAccount.secondaryBalance : selectedAccount.balance;
          if (bal !== void 0) {
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-slate-500 mt-1 text-right", children: [
              t("transfer.available"),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { onClick: handleMaxClick, className: "font-bold text-white cursor-pointer hover:text-blue-400 ml-1", children: [
                bal.toFixed(3),
                " ",
                currency
              ] })
            ] });
          }
          return null;
        })()
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs text-slate-400 uppercase font-bold mb-1 block", children: [
          t("bulk.memo"),
          " ",
          t("transfer.optional")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: memo,
            onChange: (e) => setMemo(e.target.value),
            rows: 3,
            className: "w-full bg-dark-900 border border-dark-600 rounded-lg py-2 px-3 text-sm focus:border-blue-500 outline-none resize-none custom-scrollbar",
            placeholder: t("transfer.memo_placeholder")
          }
        )
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-red-400 text-xs text-center font-bold mb-3 animate-pulse bg-red-900/20 p-2 rounded border border-red-500/30", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: handleReview,
        disabled: isSending || !to || !amount || !hasActiveKey,
        className: "w-full py-3 h-auto min-h-[48px] rounded-lg font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 whitespace-normal leading-tight",
        children: isSending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "animate-spin h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
          ] }),
          t("bulk.sign_broadcast"),
          "..."
        ] }) : t("transfer.review_btn")
      }
    )
  ] }) });
};

const ReceiveModal = ({ account: initialAccount, onClose }) => {
  const { t } = useTranslation();
  const [selectedAccount] = reactExports.useState(initialAccount);
  const [copied, setCopied] = reactExports.useState(false);
  reactExports.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  const handleCopy = () => {
    navigator.clipboard.writeText(selectedAccount.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 w-full max-w-sm rounded-xl border border-dark-600 shadow-2xl flex flex-col overflow-hidden relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-dark-700 flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-white", children: t("receive.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClose,
          className: "text-slate-400 hover:text-white transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 flex flex-col items-center text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900 border border-dark-600 rounded px-2 py-1 text-xs text-white mx-auto inline-block font-bold", children: [
        "@",
        selectedAccount.name,
        " (",
        selectedAccount.chain,
        ")"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mb-6", children: t("receive.scan_qr").replace("{chain}", selectedAccount.chain) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white p-2 rounded-lg mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedAccount.name}`,
          alt: "QR Code",
          className: "w-32 h-32"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-slate-500 uppercase font-bold mb-2", children: t("receive.account_name") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onClick: handleCopy,
          className: "w-full bg-dark-900 border border-dark-600 rounded-lg py-3 px-4 flex justify-between items-center cursor-pointer hover:border-blue-500 transition-colors group",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-lg text-white", children: [
              "@",
              selectedAccount.name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs ${copied ? "text-green-400" : "text-slate-500 group-hover:text-white"}`, children: copied ? t("receive.copied") : t("receive.copy") })
          ]
        }
      )
    ] })
  ] }) });
};

const HistoryModal = ({ account, onClose }) => {
  const { t } = useTranslation();
  const [history, setHistory] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    setLoading(true);
    fetchAccountHistory(account.chain, account.name).then((data) => setHistory(data)).catch((err) => console.error(err)).finally(() => setLoading(false));
  }, [account]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 rounded-xl w-full max-w-md max-h-[80vh] flex flex-col border border-dark-700 shadow-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-dark-700 flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg text-white", children: t("history.title").replace("{user}", account.name) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-slate-400 hover:text-white text-xl leading-none", children: "×" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto custom-scrollbar p-0 bg-dark-900/50", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center text-slate-500 flex flex-col items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 border-2 border-slate-600 border-t-white rounded-full animate-spin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("history.loading") })
    ] }) : history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-slate-500", children: t("history.empty") }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-dark-700", children: history.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 hover:bg-dark-700/50 transition-colors", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${item.type === "receive" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`, children: item.type === "receive" ? t("history.received") : t("history.sent") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500", children: new Date(item.date).toLocaleString() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-300", children: item.type === "receive" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          t("history.from"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-bold hover:text-blue-400 cursor-pointer", children: [
            "@",
            item.from
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          t("history.to"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-bold hover:text-blue-400 cursor-pointer", children: [
            "@",
            item.to
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `font-mono font-bold text-sm ${item.type === "receive" ? "text-green-400" : "text-red-400"}`, children: [
          item.type === "receive" ? "+" : "-",
          item.amount
        ] })
      ] }),
      item.memo && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-400 italic bg-dark-900/50 p-1.5 rounded border border-dark-700/50 break-all", children: item.memo })
    ] }, idx)) }) })
  ] }) });
};

const SignRequest = ({ requestId, accounts, onComplete }) => {
  const { t } = useTranslation();
  const [request, setRequest] = reactExports.useState(null);
  const [origin, setOrigin] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState("");
  const [processing, setProcessing] = reactExports.useState(false);
  const [voteWeight, setVoteWeight] = reactExports.useState(1e4);
  const [chainHint, setChainHint] = reactExports.useState(null);
  reactExports.useEffect(() => {
    chrome.runtime.sendMessage({ type: "gravity_get_request", requestId }, (resp) => {
      if (resp && resp.request) {
        setRequest(resp.request);
        setOrigin(resp.origin || t("sign.unknown_source"));
        if (resp.chain) setChainHint(resp.chain);
        const method2 = resp.request.method;
        if (method2 === "requestVote" || method2 === "vote") {
          setVoteWeight(Number(resp.request.params[3]));
        }
      } else {
        setError(t("sign.expired"));
      }
      setLoading(false);
    });
  }, [requestId, t]);
  const [trustDomain, setTrustDomain] = reactExports.useState(false);
  const handleDecision = async (accept) => {
    if (!accept) {
      notifyBackground(null, t("sign.user_rejected"));
      return;
    }
    if (trustDomain && domain) {
      chrome.storage.local.get(["gravity_whitelist"], (res) => {
        const whitelist = res.gravity_whitelist || [];
        const username = request.params[0];
        const method2 = request.method;
        const exists = whitelist.some(
          (e) => e.domain === domain && e.username === username && e.method === method2
        );
        if (!exists) {
          chrome.storage.local.set({
            gravity_whitelist: [...whitelist, { domain, username, method: method2 }]
          });
        }
      });
    }
    setProcessing(true);
    try {
      const username = request.params[0];
      let targetChain = chainHint;
      let account = accounts.find((a) => a.name === username && (targetChain ? a.chain === targetChain : true));
      if (!account && !targetChain) {
        account = accounts.find((a) => a.name === username && a.chain === "HIVE");
      }
      if (!account) {
        account = accounts.find((a) => a.name === username);
      }
      if (!account) {
        throw new Error(t("sign.account_not_found"));
      }
      let result = { success: false };
      const method2 = request.method;
      const isTransfer2 = method2 === "requestTransfer";
      const isVote2 = method2 === "requestVote" || method2 === "vote";
      const isCustomJson2 = method2 === "requestCustomJson" || method2 === "customJSON";
      const isSignBuffer2 = method2 === "requestSignBuffer" || method2 === "signBuffer";
      const isBroadcast2 = method2 === "requestBroadcast" || method2 === "broadcast";
      const isPowerUp = method2 === "requestPowerUp" || method2 === "powerUp";
      const isPowerDown = method2 === "requestPowerDown" || method2 === "powerDown";
      const isDelegation = method2 === "requestDelegation" || method2 === "delegation";
      const isPost2 = method2 === "requestPost" || method2 === "post";
      const needsActive = isTransfer2 || isPowerUp || isPowerDown || isDelegation || isBroadcast2 && !account.postingKey || // Broadcast assumes Active?
      isCustomJson2 && request.params[2] === "Active";
      if (needsActive && !account.activeKey) {
        throw new Error(t("sign.active_missing"));
      }
      if (isTransfer2) {
        const to = request.params[1];
        const amount = request.params[2];
        const memo = request.params[3] || "";
        const response = await broadcastTransfer(account.chain, account.name, account.activeKey, to, amount, memo);
        if (!response.success) throw new Error(response.error);
        result = { result: response.opResult || response.txId, message: t("sign.success"), ...response };
      } else if (isVote2) {
        const author = request.params[2];
        const permlink = request.params[1];
        const weight = voteWeight;
        const key = account.postingKey || account.activeKey;
        if (!key) throw new Error(t("sign.keys_missing"));
        const response = await broadcastVote(account.chain, account.name, key, author, permlink, weight);
        if (!response.success) throw new Error(response.error);
        result = { result: response.opResult || response.txId, message: t("sign.success"), ...response };
      } else if (isCustomJson2) {
        const id = request.params[1];
        const type = request.params[2];
        const json = request.params[3];
        let key = account.postingKey;
        if (type === "Active") key = account.activeKey;
        if (!key) throw new Error(t("sign.key_missing_type").replace("{type}", type));
        const response = await broadcastCustomJson(account.chain, account.name, key, id, typeof json === "string" ? json : JSON.stringify(json), type);
        if (!response.success) throw new Error(response.error);
        result = { result: response.opResult || response.txId, message: t("sign.success"), ...response };
      } else if (isSignBuffer2) {
        const message = request.params[1];
        const type = request.params[2];
        let keyStr = "";
        if (type === "Posting") keyStr = account.postingKey || "";
        else if (type === "Active") keyStr = account.activeKey || "";
        else if (type === "Memo") keyStr = account.memoKey || "";
        if (!keyStr) throw new Error(t("sign.key_missing_generic").replace("{type}", type));
        const response = signMessage(account.chain, message, keyStr);
        if (!response.success) throw new Error(response.error);
        result = { result: response.result, message: t("sign.success"), ...response };
      } else if (isBroadcast2) {
        let operations = request.params[1];
        const keyType = request.params[2];
        if (operations && Array.isArray(operations)) {
          operations = operations.map((op) => {
            if (Array.isArray(op) && op[0] === "comment" && op[1]) {
              const payload = op[1];
              let parentPermlink = payload.parent_permlink;
              if (!parentPermlink && !payload.parent_author && payload.category) {
                parentPermlink = payload.category;
              }
              if (!parentPermlink && payload.json_metadata) {
                try {
                  const meta = typeof payload.json_metadata === "string" ? JSON.parse(payload.json_metadata) : payload.json_metadata;
                  if (meta.tags && meta.tags[0]) {
                    parentPermlink = meta.tags[0];
                  }
                } catch (e) {
                }
              }
              const cleanPayload = {
                parent_author: payload.parent_author || "",
                parent_permlink: parentPermlink || "general",
                author: payload.author || "",
                permlink: payload.permlink || "",
                title: payload.title || "",
                body: payload.body || "",
                json_metadata: payload.json_metadata || "{}"
              };
              return ["comment", cleanPayload];
            }
            return op;
          });
        }
        let key = account.postingKey;
        if (keyType === "Active") key = account.activeKey;
        if (!key && account.activeKey) key = account.activeKey;
        if (!key) throw new Error(t("sign.key_missing_type").replace("{type}", keyType || "Posting"));
        const response = await broadcastOperations(account.chain, key, operations);
        if (!response.success) throw new Error(response.error);
        result = { result: response.opResult || response.txId, message: t("sign.success"), ...response };
      } else if (isPowerUp) {
        const to = request.params[1] || account.name;
        let amount = request.params[2];
        if (amount && !amount.includes(" ")) {
          const symbol = account.chain === Chain.HIVE ? "HIVE" : account.chain === Chain.STEEM ? "STEEM" : "BLURT";
          amount = `${parseFloat(amount).toFixed(3)} ${symbol}`;
        }
        const response = await broadcastPowerUp(account.chain, account.name, account.activeKey, to, amount);
        if (!response.success) throw new Error(response.error);
        const finalResult = response.opResult || response.txId;
        result = { result: finalResult, message: t("sign.success"), ...response };
      } else if (isPowerDown) {
        let vestingShares = request.params[1];
        if (vestingShares && !vestingShares.includes(" ")) {
          vestingShares = `${parseFloat(vestingShares).toFixed(6)} VESTS`;
        }
        const response = await broadcastPowerDown(account.chain, account.name, account.activeKey, vestingShares);
        if (!response.success) throw new Error(response.error);
        const finalResult = response.opResult || response.txId;
        result = { result: finalResult, message: t("sign.success"), ...response };
      } else if (isDelegation) {
        const delegatee = request.params[1];
        const amount = request.params[2];
        const unit = request.params[3] || "VESTS";
        let vestingShares = amount;
        if (amount && !amount.includes(" ")) {
          vestingShares = `${amount} ${unit}`;
        }
        const response = await broadcastDelegation(account.chain, account.name, account.activeKey, delegatee, vestingShares);
        if (!response.success) throw new Error(response.error);
        const finalResult = response.opResult || response.txId;
        result = { result: finalResult, message: t("sign.success"), ...response };
      } else if (isPost2) {
        const title = request.params[1];
        const body = request.params[2];
        let parentPermlink = request.params[3];
        const parentAuthor = request.params[4];
        const jsonMetadata = request.params[5];
        const permlink = request.params[6];
        if (!parentPermlink) {
          try {
            const metadata = typeof jsonMetadata === "string" ? JSON.parse(jsonMetadata) : jsonMetadata;
            if (metadata && metadata.tags && Array.isArray(metadata.tags) && metadata.tags.length > 0) {
              parentPermlink = metadata.tags[0];
            }
          } catch (e) {
          }
          if (!parentPermlink) parentPermlink = "general";
        }
        const op = ["comment", {
          parent_author: parentAuthor || "",
          parent_permlink: parentPermlink || "general",
          author: username || "",
          permlink: permlink || "",
          title: title || "",
          body: body || "",
          json_metadata: typeof jsonMetadata === "string" ? jsonMetadata : JSON.stringify(jsonMetadata || {})
        }];
        console.log("SignRequest: About to broadcast operation:", JSON.stringify(op, null, 2));
        const opPayload = op[1];
        console.log("SignRequest: Operation fields:", {
          parent_author: opPayload.parent_author,
          parent_permlink: opPayload.parent_permlink,
          author: opPayload.author,
          permlink: opPayload.permlink,
          title: opPayload.title,
          body: opPayload.body?.substring(0, 50),
          json_metadata: opPayload.json_metadata?.substring(0, 100)
        });
        const response = await broadcastOperations(account.chain, account.postingKey || account.activeKey, [op]);
        if (!response.success) throw new Error(response.error);
        result = { success: true, result: response.opResult || response.txId };
      }
      notifyBackground(result, null);
    } catch (e) {
      setError(e.message);
      setProcessing(false);
    }
  };
  reactExports.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter" && !processing && !loading && !error) {
        handleDecision(true);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [processing, loading, error, request]);
  const notifyBackground = (result, err) => {
    chrome.runtime.sendMessage({
      type: "gravity_resolve_request",
      requestId,
      result,
      error: err
    }, () => {
      if (chrome.runtime.lastError) console.error("Gravity: Failed to resolve request", chrome.runtime.lastError);
      onComplete();
    });
  };
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full flex items-center justify-center text-slate-400", children: t("sign.loading") });
  if (error) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex items-center justify-center text-red-400 p-8 text-center", children: [
    t("sign.error"),
    ": ",
    error
  ] });
  const method = request?.method;
  const isTransfer = method === "requestTransfer";
  const isVote = method === "requestVote" || method === "vote";
  const isCustomJson = method === "requestCustomJson" || method === "customJSON";
  const isSignBuffer = method === "requestSignBuffer" || method === "signBuffer";
  const isPost = method === "requestPost" || method === "post";
  const isFile = origin === "file" || origin.startsWith("file://");
  const domain = isFile ? t("sign.local_file") : (origin.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/im) || [null, origin])[1];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full bg-dark-900 text-slate-200 flex flex-col relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 p-4 border-b border-dark-700 flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6 text-blue-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.85.577-4.147l.156-.471m-1.284 8.761a20.003 20.003 0 007.544 6.799" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-white text-lg", children: t("sign.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: domain })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4 flex flex-col items-center", children: isTransfer ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xs mx-auto bg-dark-800 rounded-xl p-6 border border-dark-600 shadow-lg text-center animate-fade-in-down", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs uppercase tracking-widest text-slate-500 mb-4", children: t("sign.transfer_title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-black text-white", children: request.params[2] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-blue-400", children: request.params[4] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm mt-6 border-t border-dark-700 pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: t("sign.from") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-white", children: [
            "@",
            request.params[0]
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-600", children: "➜" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: t("sign.to") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-white", children: [
            "@",
            request.params[1]
          ] })
        ] })
      ] }),
      request.params[3] && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 bg-dark-900/50 p-3 rounded-lg text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase text-slate-500 mb-1", children: "Memo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-300 italic", children: [
          '"',
          request.params[3],
          '"'
        ] })
      ] })
    ] }) : isVote ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xs mx-auto bg-dark-800 rounded-xl p-6 border border-dark-600 shadow-lg text-center animate-fade-in-down", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs uppercase tracking-widest text-slate-500 mb-4", children: t("sign.vote_title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-2 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-5xl font-black text-blue-500", children: [
          voteWeight / 100,
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "range",
              min: "0",
              max: "10000",
              step: "100",
              value: voteWeight,
              onChange: (e) => setVoteWeight(Number(e.target.value)),
              className: "w-full mt-4 h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between w-full mt-3 px-1", children: [0, 25, 50, 75, 100].map((pct) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setVoteWeight(pct * 100),
              className: "text-[10px] font-bold text-slate-500 hover:text-white bg-dark-900 border border-dark-700 hover:border-blue-500 hover:bg-dark-700 px-2 py-1 rounded transition-all transform hover:scale-105",
              children: [
                pct,
                "%"
              ]
            },
            pct
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 text-sm border-t border-dark-700 pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: t("sign.author") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-bold", children: [
            "@",
            request.params[2]
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-dark-900/50 p-3 rounded-lg text-left overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-300 truncate", children: request.params[1] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs text-slate-500 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("sign.from") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-bold", children: [
            "@",
            request.params[0]
          ] })
        ] })
      ] })
    ] }) : isCustomJson ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xs mx-auto bg-dark-800 rounded-xl p-6 border border-dark-600 shadow-lg animate-fade-in-down", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs uppercase tracking-widest text-slate-500 mb-4 text-center", children: t("sign.custom_json_title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b border-dark-700 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500", children: t("sign.id") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono text-blue-400 font-bold", children: request.params[1] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mb-1", children: t("sign.json_payload") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-dark-900 p-3 rounded-lg border border-dark-700 max-h-60 overflow-y-auto custom-scrollbar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-[10px] text-green-400 whitespace-pre-wrap break-all font-mono", children: (() => {
            try {
              const data = typeof request.params[3] === "string" ? JSON.parse(request.params[3]) : request.params[3];
              return JSON.stringify(data, null, 2);
            } catch (e) {
              return String(request.params[3]);
            }
          })() }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-dark-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("sign.from") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-bold", children: [
            "@",
            request.params[0]
          ] })
        ] })
      ] })
    ] }) : isSignBuffer ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xs mx-auto bg-dark-800 rounded-xl p-6 border border-dark-600 shadow-lg animate-fade-in-down", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs uppercase tracking-widest text-slate-500 mb-4 text-center", children: t("sign.buffer_title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900 p-4 rounded-lg border border-dark-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mb-2 uppercase", children: t("sign.message_label") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-60 overflow-y-auto custom-scrollbar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-300 font-mono break-all", children: request.params[1] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs text-slate-500 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("sign.key_type") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-400 font-bold", children: request.params[2] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-dark-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("sign.from") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-bold", children: [
            "@",
            request.params[0]
          ] })
        ] })
      ] })
    ] }) : isPost ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xs mx-auto bg-dark-800 rounded-xl p-6 border border-dark-600 shadow-lg animate-fade-in-down", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs uppercase tracking-widest text-slate-500 mb-4 text-center", children: t("sign.post_title") || "POST / COMMENT" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        request.params[1] && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase text-slate-500 mb-1", children: "Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-white", children: request.params[1] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase text-slate-500 mb-1", children: "Content" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-dark-900 p-3 rounded-lg border border-dark-700 max-h-60 overflow-y-auto custom-scrollbar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-300 whitespace-pre-wrap font-mono", children: request.params[2] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-dark-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("sign.author") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-bold", children: [
            "@",
            request.params[0]
          ] })
        ] })
      ] })
    ] }) : (
      // Generic Request ViewFallback
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full space-y-4 max-w-xs mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 p-4 rounded-xl border border-dark-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase text-slate-500 mb-1", children: t("sign.operation") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-blue-400 font-bold", children: request?.method })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-800 p-4 rounded-xl border border-dark-700 w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase text-slate-500 mb-2", children: t("sign.params") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2", children: request.params.map((param, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 text-xs border-b border-dark-700 last:border-0 pb-2 last:pb-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-500 w-6 font-mono opacity-50 shrink-0", children: [
              idx,
              ":"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300 font-mono break-all leading-relaxed", children: typeof param === "object" ? JSON.stringify(param, null, 2) : String(param) })
          ] }, idx)) })
        ] })
      ] })
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 pb-8 bg-dark-800 border-t border-dark-700", children: [
      !isFile && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center space-x-2 cursor-pointer select-none group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: trustDomain,
            onChange: (e) => setTrustDomain(e.target.checked),
            className: "form-checkbox h-4 w-4 text-blue-600 rounded border-dark-600 bg-dark-900 focus:ring-blue-500 focus:ring-offset-dark-800 transition duration-150 ease-in-out"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400 group-hover:text-slate-300 transition-colors", children: t("sign.trust_domain") })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 max-w-xs mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => handleDecision(false),
            className: "flex-1 py-3 px-2 h-auto min-h-[48px] rounded-lg font-bold text-slate-400 hover:text-white hover:bg-dark-700 transition-colors whitespace-normal leading-tight",
            children: t("sign.reject")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => handleDecision(true),
            disabled: processing,
            className: "flex-1 py-3 px-2 h-auto min-h-[48px] rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02] whitespace-normal leading-tight",
            children: processing ? t("sign.signing") : t("sign.confirm")
          }
        )
      ] })
    ] })
  ] });
};

const HelpView = () => {
  const { t } = useTranslation();
  const icons = {
    home: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }),
    wallet: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" }),
    bulk: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }),
    multisig: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" }),
    settings: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }),
    lock: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }),
    detach: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z", stroke: "currentColor", fill: "currentColor" }),
    send: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 10l7-7m0 0l7 7m-7-7v18" }),
    receive: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 14l-7 7m0 0l-7-7m7 7V3" }),
    history: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }),
    power: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }),
    savings: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }),
    rc: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" })
  };
  const navItems = [
    { icon: icons.home, label: t("sidebar.home"), desc: t("help.btn_home") },
    { icon: icons.wallet, label: t("sidebar.wallet"), desc: t("help.btn_wallet") },
    { icon: icons.bulk, label: t("sidebar.bulk"), desc: t("help.btn_bulk") },
    { icon: icons.multisig, label: t("sidebar.multisig"), desc: t("help.btn_multisig") },
    { icon: icons.settings, label: t("sidebar.manage"), desc: t("help.btn_settings") },
    { icon: icons.lock, label: t("sidebar.lock"), desc: t("help.btn_lock") },
    { icon: icons.detach, label: t("sidebar.pin"), desc: t("help.btn_detach") }
  ];
  const actionItems = [
    { icon: icons.send, label: t("wallet.send"), desc: t("help.btn_send") },
    { icon: icons.receive, label: t("wallet.receive"), desc: t("help.btn_receive") },
    { icon: icons.history, label: t("wallet.history"), desc: t("help.btn_history") },
    { icon: icons.power, label: "Power up/down", desc: t("help.btn_powerup") },
    { icon: icons.savings, label: "Savings", desc: t("help.btn_savings") },
    { icon: icons.rc, label: "Resource Credits", desc: t("help.btn_rc") }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full overflow-y-auto p-4 custom-scrollbar text-slate-300 space-y-8 animate-fadeIn", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-white mb-6 border-b border-dark-700 pb-2", children: t("help.title") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-dark-800 p-5 rounded-2xl border border-dark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-blue-400 font-bold mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" }) }),
          t("help.keys_title")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mb-4", children: t("help.keys_desc") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-white", children: "Posting:" }),
            " ",
            t("help.posting_key_desc")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-white", children: "Active:" }),
            " ",
            t("help.active_key_desc")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-white", children: "Memo:" }),
            " ",
            t("help.memo_key_desc")
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-dark-800 p-5 rounded-2xl border border-dark-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-pink-400 font-bold mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }),
          t("help.power_title")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mb-4", children: t("help.power_desc") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2 text-slate-300", children: [
            "• ",
            t("help.power_point")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2 text-slate-300", children: [
            "• ",
            t("help.power_down_point")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2 text-slate-300", children: [
            "• ",
            t("help.delegate_point")
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-slate-400 uppercase tracking-widest mb-4", children: "Account Actions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: actionItems.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 bg-dark-900/50 p-3 rounded-xl border border-dark-700/50 hover:border-dark-600 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center text-slate-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: item.icon }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-white text-[13px]", children: item.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400 mt-0.5 leading-tight", children: item.desc })
        ] })
      ] }, idx)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-slate-400 uppercase tracking-widest mb-4", children: "Main Navigation" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: navItems.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 bg-dark-900/50 p-3 rounded-xl border border-dark-700/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center text-slate-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: item.icon }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-white text-[13px]", children: item.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400 mt-0.5 leading-tight", children: item.desc })
        ] })
      ] }, idx)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-dark-800 p-5 rounded-2xl border border-dark-700 mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-green-400 font-bold mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" }) }),
        t("help.chat_title")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-300 mb-2", children: t("help.chat_desc") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-dark-900 p-3 rounded-lg border border-dark-600", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-xs text-slate-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2 text-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-yellow-500", children: "⚠" }),
          " ",
          t("help.chat_warning")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2 text-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-400", children: "ℹ" }),
          " ",
          t("help.chat_cost")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400", children: "✓" }),
          " Requires ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Memo Key" }),
          " (or Master Password) to read/write."
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-blue-900/10 rounded-2xl p-6 border border-blue-500/20 shadow-lg mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold text-blue-400 mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }),
        t("help.security_title")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-slate-400", children: t("help.security_desc") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-dark-800 rounded-2xl p-6 border border-dark-700 shadow-lg mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold text-white mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-green-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" }) }),
        "Two-Factor Authentication"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-sm text-blue-400 mb-2", children: "Can I use multiple apps? (Aegis + Google Auth)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 leading-relaxed mb-3", children: "Yes! You can have the same code generated on multiple devices or apps simultaneously. To do this:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "list-decimal list-inside text-xs text-slate-300 space-y-2 ml-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: "Go to Settings > Authenticator App to reveal the QR Code." }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-400", children: [
              "Scan this ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "same QR code" }),
              " with Aegis."
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-400", children: [
              "Scan it ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "again" }),
              " with Google Authenticator."
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: "Both apps will now generate identical codes that work for unlocking." }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-dark-700 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-sm text-purple-400 mb-2", children: "Visual Guides" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mb-4", children: "How to configure your wallet securely:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900 p-2 rounded-lg border border-dark-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video bg-dark-800 rounded flex items-center justify-center mb-2 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: "/images/help/setup_2fa.gif",
                  alt: "2FA Setup Animation",
                  className: "w-full h-full object-cover opacity-80",
                  onError: (e) => {
                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgY2xhc3M9InRleHQtc2xhdGUtNzAwIj48cGF0aCBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjEiIGQ9Ik0xNSAxMGEzIDMgMCAxMTYgMCAzIDMgMCAwMS02IDB6Ii8+PHBhdGggc3Ryb2tlPSJjdXJyZW50Q29xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjEiIGQ9Ik0yLjQ1OCAxMmMyLjUxOS02Ljg3NiA5LjY3Mi02Ljg3NiAxOS4wODQgMG0tMi40NTggNmMtMi41MTkgNi44NzYtOS42NzIgNi44NzYtMTkuMDg0IDAiLz48L3N2Zz4=";
                    e.target.classList.add("p-8");
                  }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 font-mono block text-center", children: "setup_2fa.gif" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-dark-900 p-2 rounded-lg border border-dark-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video bg-dark-800 rounded flex items-center justify-center mb-2 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: "/images/help/multi_chain.gif",
                  alt: "Multi Chain Animation",
                  className: "w-full h-full object-cover opacity-80",
                  onError: (e) => {
                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgY2xhc3M9InRleHQtc2xhdGUtNzAwIj48cGF0aCBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjEiIGQ9Ik0xMyAxMFYzbC05IDExaDd2N2w5LTExaC03eiIvPjwvc3ZnPg==";
                    e.target.classList.add("p-8");
                  }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 font-mono block text-center", children: "multi_chain.gif" })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
};

const ChatView = ({ onClose }) => {
  const [user, setUser] = reactExports.useState(null);
  const [isRegistering, setIsRegistering] = reactExports.useState(false);
  const [usernameInput, setUsernameInput] = reactExports.useState("");
  const [regError, setRegError] = reactExports.useState(null);
  const [rooms, setRooms] = reactExports.useState([]);
  const [activeRoomId, setActiveRoomId] = reactExports.useState(null);
  const [messages, setMessages] = reactExports.useState([]);
  const [inputText, setInputText] = reactExports.useState("");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [searchResults, setSearchResults] = reactExports.useState([]);
  const [isCreating, setIsCreating] = reactExports.useState(false);
  const [newRoomName, setNewRoomName] = reactExports.useState("");
  const [isPrivateRoom, setIsPrivateRoom] = reactExports.useState(false);
  const [showParticipants, setShowParticipants] = reactExports.useState(false);
  const [notification, setNotification] = reactExports.useState(null);
  const [chatModal, setChatModal] = reactExports.useState(null);
  const [modalInput, setModalInput] = reactExports.useState("");
  const messagesEndRef = reactExports.useRef(null);
  const handleCreateRoom = () => {
    if (newRoomName.trim().length < 3) return;
    chatService.createRoom(newRoomName.trim(), isPrivateRoom);
    setNewRoomName("");
    setIsPrivateRoom(false);
    setIsCreating(false);
  };
  reactExports.useEffect(() => {
    const existing = chatService.getCurrentUser();
    if (existing) {
      setUser(existing);
    }
    chatService.onAuthSuccess = (u) => {
      setUser(u);
      setIsRegistering(false);
    };
    chatService.onRoomUpdated = (updatedRooms) => {
      setRooms(updatedRooms);
    };
    chatService.onMessage = (roomId, msg) => {
      if (roomId === activeRoomId) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
    };
    chatService.onError = (err) => {
      setNotification({ msg: err, type: "error" });
      setIsRegistering(false);
    };
    const handleSearch = (e) => {
      setSearchResults(e.detail);
    };
    const handleKicked = (e) => {
      if (e.detail.roomId === activeRoomId) {
        setActiveRoomId(null);
        setNotification({ msg: "You have been removed from this room", type: "warning" });
      }
    };
    window.addEventListener("chat-search-results", handleSearch);
    window.addEventListener("chat-room-kicked", handleKicked);
    chatService.init();
    return () => {
      window.removeEventListener("chat-search-results", handleSearch);
      window.removeEventListener("chat-room-kicked", handleKicked);
    };
  }, [activeRoomId]);
  reactExports.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4e3);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  reactExports.useEffect(() => {
    if (activeRoomId) {
      const room = rooms.find((r) => r.id === activeRoomId);
      if (room) {
        setMessages(room.messages);
        scrollToBottom();
      }
    }
  }, [activeRoomId, rooms]);
  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };
  const handleRegister = () => {
    if (usernameInput.trim().length < 3) {
      setRegError("Username must be at least 3 chars");
      return;
    }
    setIsRegistering(true);
    setRegError(null);
    chatService.register(usernameInput.trim());
  };
  const handleSend = () => {
    if (!activeRoomId || !inputText.trim()) return;
    chatService.sendMessage(activeRoomId, inputText);
    setInputText("");
  };
  const handleModalAction = () => {
    if (!chatModal) return;
    const { type, data } = chatModal;
    switch (type) {
      case "invite":
        if (modalInput.trim() && activeRoomId) {
          chatService.inviteUser(activeRoomId, modalInput.trim());
          setNotification({ msg: `Invitation sent to ${modalInput}`, type: "success" });
        }
        break;
      case "confirm_delete":
        if (activeRoomId) {
          chatService.closeRoom(activeRoomId);
          setActiveRoomId(null);
          setNotification({ msg: "Room deleted", type: "info" });
        }
        break;
      case "confirm_kick":
        if (activeRoomId && data) {
          chatService.kickUser(activeRoomId, data.id);
          setNotification({ msg: `Kicked @${data.username}`, type: "warning" });
        }
        break;
      case "confirm_ban":
        if (activeRoomId && data) {
          chatService.banUser(activeRoomId, data.id);
          setNotification({ msg: `Banned @${data.username} permanently`, type: "error" });
        }
        break;
    }
    setChatModal(null);
    setModalInput("");
  };
  const handleSearchUsers = (q) => {
    setSearchQuery(q);
    if (q.length > 1) {
      chatService.searchUsers(q);
    } else {
      setSearchResults([]);
    }
  };
  const startDM = (targetId) => {
    chatService.createDM(targetId);
    setSearchQuery("");
    setSearchResults([]);
  };
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col h-full bg-dark-900 text-white items-center justify-center p-6 animate-fadeIn", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm bg-dark-800 p-8 rounded-2xl border border-dark-700 shadow-xl text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-8 h-8", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold mb-2", children: "Gravity Chat" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 text-sm mb-6", children: "Create a unique username to join the community. This ID is separate from your wallets." }),
      regError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-500/10 text-red-400 text-xs p-3 rounded-lg mb-4 border border-red-500/20", children: regError }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white mb-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder-slate-600",
          placeholder: "Choose a username...",
          value: usernameInput,
          onChange: (e) => setUsernameInput(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && handleRegister()
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleRegister,
          disabled: isRegistering,
          className: "w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 shadow-lg shadow-purple-900/20",
          children: isRegistering ? "Joining..." : "Join Chat"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "mt-4 text-slate-500 text-xs hover:text-white", children: "Cancel" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full bg-dark-900 text-white overflow-hidden animate-fadeIn", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `w-80 flex flex-col border-r border-dark-700 bg-dark-850 ${activeRoomId ? "hidden md:flex" : "flex w-full"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-b border-dark-700 bg-dark-800 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold shadow-sm", children: user.username.substring(0, 2).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-xs truncate max-w-[100px]", children: user.username }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-green-400 flex items-center gap-1", children: "● Online" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setIsCreating(true), className: "p-1.5 bg-dark-700 hover:bg-purple-600/20 text-slate-400 hover:text-purple-400 rounded-lg transition-all", title: "New Room", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-b border-dark-700 bg-dark-900/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "w-full bg-dark-900 border border-dark-700 rounded-lg pl-8 pr-4 py-1.5 text-xs outline-none focus:border-purple-500 transition-all placeholder-slate-600",
              placeholder: "Find ID or Room...",
              value: searchQuery,
              onChange: (e) => handleSearchUsers(e.target.value)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) })
        ] }),
        searchResults.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-2 right-2 mt-1 z-50 bg-dark-800 border border-dark-600 rounded-xl shadow-2xl overflow-hidden animate-slideDown", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 border-b border-dark-700 flex justify-between items-center bg-dark-900/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-slate-500 uppercase", children: "Search Results" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSearchResults([]), className: "text-slate-500 hover:text-white", children: "✕" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-60 overflow-y-auto", children: searchResults.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => startDM(u.id), className: "px-3 py-2 hover:bg-purple-900/20 cursor-pointer flex items-center gap-2 border-b border-dark-700/50 last:border-0 transition-colors group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 bg-dark-700 group-hover:bg-purple-600 rounded-full flex items-center justify-center text-[9px] font-bold text-slate-400 group-hover:text-white transition-colors", children: u.username.substring(0, 2).toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium", children: [
                "@",
                u.username
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-slate-500", children: "Click to start DM" })
            ] })
          ] }, u.id)) })
        ] })
      ] }),
      isCreating && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "m-3 p-3 bg-dark-800 rounded-xl border border-purple-500/30 animate-fadeIn shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            autoFocus: true,
            className: "w-full bg-dark-950 border border-dark-700 rounded-lg px-3 py-2 text-xs mb-3 focus:border-purple-500 outline-none",
            placeholder: "My awesome room...",
            value: newRoomName,
            onChange: (e) => setNewRoomName(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter") handleCreateRoom();
              if (e.key === "Escape") setIsCreating(false);
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center mb-3 group cursor-pointer", onClick: () => setIsPrivateRoom(!isPrivateRoom), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-3.5 h-3.5 rounded border flex items-center justify-center mr-2 transition-colors ${isPrivateRoom ? "bg-purple-600 border-purple-600" : "border-dark-600 bg-dark-900/50"}`, children: isPrivateRoom && /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-2.5 h-2.5 text-white", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] text-slate-400 cursor-pointer group-hover:text-slate-200", children: "Private (Invite Only)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            setIsCreating(false);
            setIsPrivateRoom(false);
          }, className: "text-[10px] py-1.5 px-3 rounded-lg hover:bg-dark-700 text-slate-400 transition-colors", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleCreateRoom, className: "text-[10px] py-1.5 px-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-bold transition-all shadow-md", children: "Create Room" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-2 mt-2", children: "Rooms" }),
        rooms.filter((r) => r.type === "public" || r.type === "private").map((room) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            onClick: () => setActiveRoomId(room.id),
            className: `p-3 rounded-lg cursor-pointer flex flex-col transition-colors ${activeRoomId === room.id ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20" : "hover:bg-dark-700 text-slate-300"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold text-sm flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-70 text-xs", children: room.type === "public" ? "#" : "🔒" }),
              " ",
              room.name
            ] })
          },
          room.id
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-2 mt-4", children: "Direct Messages" }),
        rooms.filter((r) => r.type === "dm").map((room) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            onClick: () => setActiveRoomId(room.id),
            className: `p-3 rounded-lg cursor-pointer flex flex-col transition-colors ${activeRoomId === room.id ? "bg-indigo-600 text-white shadow-lg" : "hover:bg-dark-700 text-slate-300"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold text-sm flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-green-500" }),
              room.name.replace(user.username, "").replace(" & ", "").trim() || "Chat"
            ] })
          },
          room.id
        )),
        rooms.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 p-4 text-center italic", children: "No active conversations." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex-1 flex flex-col bg-dark-900 ${!activeRoomId ? "hidden md:flex" : "flex"}`, children: !activeRoomId ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-slate-600 opacity-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-16 h-16 mb-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Select a room to start chatting" })
    ] }) : (() => {
      const room = rooms.find((r) => r.id === activeRoomId);
      if (!room) return null;
      const isOwner = room.owner === user?.id;
      const isDM = room.type === "dm";
      const cleanName = isDM ? room.name.replace(user?.username || "", "").replace(" & ", "").replace(user?.username || "", "").trim() : room.name;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-14 border-b border-dark-700 flex items-center px-4 bg-dark-800 justify-between shrink-0 shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveRoomId(null), className: "md:hidden p-1 text-slate-400 hover:text-white hover:bg-dark-700 rounded-lg transition-all active:scale-90", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold flex items-center gap-2 truncate", children: [
              room.type === "dm" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] shadow-lg font-black text-white shrink-0", children: cleanName.substring(0, 1).toUpperCase() }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-lg font-mono", children: "#" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col truncate", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-sm md:text-base text-slate-100 font-bold tracking-tight", children: cleanName }),
                (room.type === "private" || isOwner) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 -mt-0.5", children: [
                  room.type === "private" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] text-orange-400/80 flex items-center gap-0.5 uppercase tracking-tighter", children: "🔒 Private" }),
                  isOwner && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] text-purple-400 font-bold flex items-center gap-0.5 uppercase tracking-tighter", children: "☆ Owner" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 items-center shrink-0 ml-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setShowParticipants(!showParticipants),
                className: `p-2 rounded-lg transition-all active:scale-95 ${showParticipants ? "bg-purple-600/20 text-purple-400 border border-purple-500/30" : "text-slate-400 hover:bg-dark-700"}`,
                title: "View Members",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }) })
              }
            ),
            room.type === "private" && isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setChatModal({ type: "invite" }),
                className: "bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold px-2 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-colors active:scale-95",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }),
                  "Invite"
                ]
              }
            ),
            isOwner && room.id !== "global-lobby" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setChatModal({ type: "confirm_delete" }),
                className: "bg-red-900/40 hover:bg-red-600 border border-red-700/50 text-red-100 text-[10px] font-bold px-2 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all active:scale-95",
                title: "Delete Room",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }),
                  "Close"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-slate-400 hover:text-white hidden md:block p-1.5 transition-colors", children: "✕" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar", children: [
          messages.map((msg, i) => {
            const isMe = msg.senderId === user.id;
            const showAvatar = i === 0 || messages[i - 1].senderId !== msg.senderId;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex gap-2 ${isMe ? "flex-row-reverse" : ""}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold ${showAvatar ? isMe ? "bg-purple-600" : "bg-slate-600" : "opacity-0"}`, children: msg.senderName.substring(0, 2).toUpperCase() }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col max-w-[80%] ${isMe ? "items-end" : "items-start"}`, children: [
                showAvatar && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-slate-500 mb-0.5 px-1", children: msg.senderName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `px-3 py-1.5 rounded-xl text-sm leading-relaxed ${isMe ? "bg-purple-600 text-white rounded-tr-sm" : "bg-dark-700 text-slate-200 rounded-tl-sm"}`, children: msg.content }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-slate-600 mt-0.5 px-1 opacity-70", children: new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
              ] })
            ] }, msg.id || i);
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 md:p-3 bg-dark-800 border-t border-dark-700 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-dark-900 border border-dark-600 rounded-xl px-2 py-1.5 focus-within:ring-2 focus-within:ring-purple-500/50 transition-all", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "flex-1 bg-transparent px-1 text-white placeholder-slate-600 outline-none text-sm min-w-0",
              placeholder: room.type === "dm" ? `Message ${cleanName}...` : `Message #${room.name}...`,
              value: inputText,
              onChange: (e) => setInputText(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && handleSend()
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleSend,
              disabled: !inputText.trim(),
              className: "p-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:bg-dark-700 shrink-0",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" }) })
            }
          )
        ] }) })
      ] });
    })() }),
    activeRoomId && showParticipants && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-64 bg-dark-800 border-l border-dark-700 flex flex-col animate-slideInRight", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-dark-700 flex justify-between items-center bg-dark-900/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[10px] uppercase tracking-wider text-slate-500", children: "Participants" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowParticipants(false), className: "text-slate-500 hover:text-white", children: "✕" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar", children: rooms.find((r) => r.id === activeRoomId)?.memberDetails?.map((member) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 p-2 rounded hover:bg-dark-700/50 transition-colors border border-transparent hover:border-dark-600", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-sm ${member.id === user?.id ? "text-purple-400 font-bold" : "text-slate-300"}`, children: [
          "@",
          member.username,
          rooms.find((r) => r.id === activeRoomId)?.owner === member.id && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-[8px] bg-orange-900/30 border border-orange-500/30 px-1 rounded text-orange-400", children: "Owner" })
        ] }) }),
        rooms.find((r) => r.id === activeRoomId)?.owner === user?.id && member.id !== user?.id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                chatService.muteUser(activeRoomId, member.id);
                setNotification({ msg: `User @${member.username} muted`, type: "info" });
              },
              className: "flex-1 text-[9px] bg-dark-900 border border-dark-600 hover:bg-slate-700 px-1.5 py-1 rounded text-slate-400 hover:text-white transition-colors",
              children: "Mute"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setChatModal({ type: "confirm_kick", data: member }),
              className: "flex-1 text-[9px] bg-dark-900 border border-dark-600 hover:bg-red-900/20 px-1.5 py-1 rounded text-slate-400 hover:text-red-400 transition-colors",
              children: "Kick"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setChatModal({ type: "confirm_ban", data: member }),
              className: "flex-1 text-[9px] bg-red-900/40 border border-red-700 hover:bg-red-800 px-1.5 py-1 rounded text-white transition-colors font-bold",
              children: "Ban"
            }
          )
        ] })
      ] }, member.id)) })
    ] }),
    chatModal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-dark-950/80 backdrop-blur-sm", onClick: () => setChatModal(null) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-xs bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl p-6 animate-fadeIn", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-lg font-bold mb-2", children: [
          chatModal.type === "invite" && "Invite Member",
          chatModal.type === "confirm_delete" && "Delete Room?",
          chatModal.type === "confirm_kick" && `Kick @${chatModal.data?.username}?`,
          chatModal.type === "confirm_ban" && `Ban @${chatModal.data?.username}?`
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-400 mb-6", children: [
          chatModal.type === "invite" && "Type the username of the person you want to invite to this private room.",
          chatModal.type === "confirm_delete" && "This action is permanent. All messages and room history will be lost.",
          chatModal.type === "confirm_kick" && "This user will be removed from the room but can rejoin if it is a public room.",
          chatModal.type === "confirm_ban" && "This user will be permanently banned from this room."
        ] }),
        chatModal.type === "invite" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            autoFocus: true,
            className: "w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white mb-6 outline-none focus:border-purple-500",
            placeholder: "Username...",
            value: modalInput,
            onChange: (e) => setModalInput(e.target.value),
            onKeyDown: (e) => e.key === "Enter" && handleModalAction()
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                setChatModal(null);
                setModalInput("");
              },
              className: "flex-1 py-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-slate-300 font-bold transition-all",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleModalAction,
              className: `flex-1 py-2 rounded-lg font-bold transition-all ${chatModal.type === "invite" ? "bg-purple-600 hover:bg-purple-500" : "bg-red-600 hover:bg-red-500"} text-white`,
              children: chatModal.type === "invite" ? "Invite" : "Confirm"
            }
          )
        ] })
      ] })
    ] }),
    notification && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-20 left-1/2 -translate-x-1/2 z-[200] max-w-[90%] w-auto animate-slideUp", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `px-4 py-3 rounded-xl border shadow-2xl flex items-center gap-3 ${notification.type === "error" ? "bg-red-900/90 border-red-500 text-red-100" : notification.type === "success" ? "bg-green-900/90 border-green-500 text-green-100" : notification.type === "warning" ? "bg-orange-900/90 border-orange-500 text-orange-100" : "bg-blue-900/90 border-blue-500 text-blue-100"}`, children: [
      notification.type === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 shrink-0", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: notification.msg }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setNotification(null), className: "ml-2 hover:opacity-70 transition-opacity", children: "✕" })
    ] }) })
  ] });
};

const NotificationToast = ({ message, type = "success", onClose }) => {
  reactExports.useEffect(() => {
    const timer = setTimeout(onClose, 3e3);
    return () => clearTimeout(timer);
  }, [onClose]);
  const bgColors = {
    success: "bg-green-600/90 border-green-500/50",
    error: "bg-red-600/90 border-red-500/50",
    info: "bg-blue-600/90 border-blue-500/50"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-20 left-0 right-0 z-[100] flex justify-center px-6 pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `
                ${bgColors[type]} 
                text-white text-xs font-bold px-6 py-3 rounded-xl shadow-2xl border border-opacity-50
                animate-bounce-in pointer-events-auto flex items-center gap-2 backdrop-blur-md
                max-w-[85vw]
            `, children: [
    type === "success" && /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4 shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }),
    type === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4 shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "break-all line-clamp-4 overflow-y-auto max-h-32 custom-scrollbar pr-1", children: message })
  ] }) });
};

function App() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppContent, {}) });
}
function AppContent() {
  const { t } = useTranslation();
  const [walletState, setWalletState] = reactExports.useState({
    accounts: [],
    encryptedMaster: false,
    useGoogleAuth: false,
    useBiometrics: false
  });
  const [activeChain, setActiveChain] = reactExports.useState(Chain.HIVE);
  const [currentView, setCurrentView] = reactExports.useState(ViewState.LANDING);
  const [showImport, setShowImport] = reactExports.useState(false);
  const [managingAccount, setManagingAccount] = reactExports.useState(null);
  const [transferAccount, setTransferAccount] = reactExports.useState(null);
  const [receiveAccount, setReceiveAccount] = reactExports.useState(null);
  const [historyAccount, setHistoryAccount] = reactExports.useState(null);
  const [isLocked, setIsLocked] = reactExports.useState(true);
  const [isDataLoaded, setIsDataLoaded] = reactExports.useState(false);
  const [isRefreshing, setIsRefreshing] = reactExports.useState(false);
  const [needsSave, setNeedsSave] = reactExports.useState(false);
  const [web3Context, setWeb3Context] = reactExports.useState(null);
  const [notification, setNotification] = reactExports.useState(null);
  const [lockReason, setLockReason] = reactExports.useState(null);
  const [requestId, setRequestId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const req = params.get("requestId");
    if (req) setRequestId(req);
  }, []);
  reactExports.useEffect(() => {
    const loadState = async () => {
      const vaultData = await getVault();
      if (vaultData) {
        setWalletState((prev) => ({
          ...prev,
          accounts: [],
          // Keys are encrypted
          encryptedMaster: true,
          useGoogleAuth: false,
          useBiometrics: false
        }));
      }
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.session) {
        const restored = await tryRestoreSession();
        chrome.storage.session.get(["session_accounts"], (res) => {
          if (res.session_accounts && res.session_accounts.length > 0) {
            if (restored) {
              setWalletState((prev) => ({ ...prev, accounts: res.session_accounts }));
              setIsLocked(false);
              setTimeout(fetchBalances$1, 500);
            } else {
              console.warn("Session accounts found but crypto key missing. Forcing re-login.");
              chrome.storage.session.remove("session_accounts");
            }
            setIsDataLoaded(true);
            return;
          }
          setIsDataLoaded(true);
        });
      } else {
        setIsDataLoaded(true);
      }
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(["walletConfig"], (result) => {
          if (result.walletConfig) {
            setWalletState((prev) => ({
              ...prev,
              encryptedMaster: result.walletConfig.encryptedMaster,
              useGoogleAuth: result.walletConfig.useGoogleAuth,
              useBiometrics: result.walletConfig.useBiometrics,
              useTOTP: result.walletConfig.useTOTP
            }));
          }
        });
      }
      const context = detectWeb3Context();
      if (context) setWeb3Context(context);
      benchmarkNodes();
    };
    loadState();
  }, []);
  reactExports.useEffect(() => {
    if (isDataLoaded) {
      const config = {
        encryptedMaster: walletState.encryptedMaster,
        useGoogleAuth: walletState.useGoogleAuth,
        useBiometrics: walletState.useBiometrics,
        useTOTP: walletState.useTOTP
      };
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.set({ walletConfig: config });
      }
    }
  }, [walletState.encryptedMaster, walletState.useGoogleAuth, walletState.useBiometrics, walletState.useTOTP, isDataLoaded]);
  reactExports.useEffect(() => {
    if (!isLocked && needsSave && walletState.encryptedMaster) {
      const vault = { accounts: walletState.accounts, lastUpdated: Date.now() };
      saveVault("cached", vault).then(() => setNeedsSave(false)).catch((err) => {
        console.warn("Auto-save failed:", err);
        if (err.message && err.message.includes("cache is empty")) {
          setLockReason("Session expired. Please unlock to save changes.");
          setIsLocked(true);
        }
      });
    }
  }, [walletState.accounts, isLocked, needsSave]);
  reactExports.useEffect(() => {
    let interval;
    if (!isLocked && walletState.accounts.length > 0) {
      interval = setInterval(fetchBalances$1, 12e3);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLocked, walletState.accounts.length]);
  const fetchBalances$1 = async () => {
    if (isLocked || walletState.accounts.length === 0) return;
    setIsRefreshing(true);
    try {
      const updatedAccounts = await Promise.all(walletState.accounts.map(async (acc) => {
        const balances = await fetchBalances(acc.chain, acc.name);
        return {
          ...acc,
          balance: balances.primary,
          secondaryBalance: balances.secondary,
          stakedBalance: balances.staked,
          powerDownActive: balances.powerDownActive,
          nextPowerDown: balances.nextPowerDown,
          powerDownAmount: balances.powerDownAmount
        };
      }));
      setWalletState((prev) => ({ ...prev, accounts: updatedAccounts }));
    } catch (err) {
      console.warn("Poll balances failed:", err);
    } finally {
      setIsRefreshing(false);
    }
  };
  const handleUnlock = (decryptedAccounts) => {
    setWalletState((prev) => ({ ...prev, accounts: decryptedAccounts }));
    setIsLocked(false);
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.session) {
      chrome.storage.session.set({ session_accounts: decryptedAccounts });
    }
    setTimeout(() => fetchBalances$1(), 500);
  };
  const handleImport = async (newAccounts) => {
    const withBalance = await Promise.all(newAccounts.map(async (acc) => {
      const balances = await fetchBalances(acc.chain, acc.name);
      return {
        ...acc,
        balance: balances.primary,
        secondaryBalance: balances.secondary,
        stakedBalance: balances.staked,
        powerDownActive: balances.powerDownActive,
        nextPowerDown: balances.nextPowerDown,
        powerDownAmount: balances.powerDownAmount
      };
    }));
    setWalletState((prev) => ({
      ...prev,
      accounts: [...prev.accounts, ...withBalance]
    }));
    setNeedsSave(true);
    setNotification({ msg: "Account imported successfully", type: "success" });
    setShowImport(false);
  };
  const handleUpdateAccount = (updatedAccount) => {
    setWalletState((prev) => ({
      ...prev,
      accounts: prev.accounts.map(
        (acc) => acc.name === updatedAccount.name && acc.chain === updatedAccount.chain ? updatedAccount : acc
      )
    }));
    setNeedsSave(true);
    setManagingAccount(null);
  };
  const handleDeleteAccount = (accountToDelete) => {
    setWalletState((prev) => ({
      ...prev,
      accounts: prev.accounts.filter(
        (acc) => !(acc.name === accountToDelete.name && acc.chain === accountToDelete.chain)
      )
    }));
    setNeedsSave(true);
    setManagingAccount(null);
  };
  const handleTransfer = async (fromAcc, to, amount, memo, symbol) => {
    if (!fromAcc.activeKey) {
      setNotification({ msg: "No active key found for this account.", type: "error" });
      return;
    }
    try {
      const result = await broadcastTransfer(
        fromAcc.chain,
        fromAcc.name,
        fromAcc.activeKey,
        to,
        amount,
        memo,
        symbol
      );
      if (result.success) {
        setNotification({ msg: `TX: ${result.txId?.substring(0, 8)}...`, type: "success" });
        fetchBalances$1();
      } else {
        setNotification({ msg: `Failed: ${result.error}`, type: "error" });
      }
    } catch (e) {
      setNotification({ msg: "Unexpected error during broadcast.", type: "error" });
    }
  };
  const isContextRelevant = (context, chain) => {
    if (chain === Chain.STEEM && context.includes("steemit")) return true;
    if (chain === Chain.HIVE && context.includes("hive")) return true;
    if (chain === Chain.BLURT && context.includes("blurt")) return true;
    return false;
  };
  const [isDetached, setIsDetached] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const isDetachedMode = typeof window !== "undefined" && window.location.search.includes("detached=true");
    const TARGET_WIDTH = 400;
    const TARGET_HEIGHT = 600;
    const OUTER_WIDTH = 416;
    const OUTER_HEIGHT = 639;
    if (isDetachedMode) {
      setIsDetached(true);
      document.body.style.width = `${TARGET_WIDTH}px`;
      document.body.style.height = `${TARGET_HEIGHT}px`;
      document.body.style.overflow = "hidden";
      let animationFrameId;
      const lockSize = () => {
        if (window.innerWidth <= 420 && window.innerHeight <= 650 && window.innerWidth >= 390) {
          animationFrameId = requestAnimationFrame(lockSize);
          return;
        }
        const screenW = window.screen.availWidth || window.screen.width;
        const screenH = window.screen.availHeight || window.screen.height;
        const left = Math.round((screenW - OUTER_WIDTH) / 2);
        const top = Math.round((screenH - OUTER_HEIGHT) / 2);
        try {
          window.resizeTo(OUTER_WIDTH, OUTER_HEIGHT);
          window.moveTo(left, top);
        } catch (e) {
        }
        if (typeof chrome !== "undefined" && chrome.windows) {
          chrome.windows.getCurrent((win) => {
            if (win.state === "maximized" || win.width > 450 || win.height > 700) {
              chrome.windows.update(win.id, {
                state: "normal",
                width: OUTER_WIDTH,
                height: OUTER_HEIGHT,
                left,
                top
              });
            }
          });
        }
        animationFrameId = requestAnimationFrame(lockSize);
      };
      window.addEventListener("resize", lockSize);
      lockSize();
      return () => {
        window.removeEventListener("resize", lockSize);
        cancelAnimationFrame(animationFrameId);
      };
    } else {
      if (typeof chrome !== "undefined" && chrome.extension) {
        const views = chrome.extension.getViews();
        const detachedView = views.find((v) => v.location.href.includes("detached=true"));
        if (detachedView) {
          detachedView.focus();
          window.close();
        }
      }
    }
  }, []);
  const handleToggleDetach = () => {
    if (isDetached) {
      window.close();
    } else {
      const width = 416;
      const height = 639;
      const left = Math.round(window.screen.width / 2 - width / 2);
      const top = Math.round(window.screen.height / 2 - height / 2);
      if (typeof chrome !== "undefined" && chrome.windows) {
        chrome.windows.create({
          url: "index.html?detached=true",
          type: "popup",
          width,
          height,
          left,
          top,
          focused: true
        });
        window.close();
      } else {
        window.open(
          "index.html?detached=true",
          "GravityWalletDetached",
          `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=no,status=no`
        );
        window.close();
      }
    }
  };
  reactExports.useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      const listener = (changes, area) => {
        if (area === "session" && changes.session_accounts) {
          if (!changes.session_accounts.newValue) {
            setIsLocked(true);
            setWalletState((prev) => ({ ...prev, accounts: [] }));
          }
        }
      };
      chrome.storage.onChanged.addListener(listener);
      return () => chrome.storage.onChanged.removeListener(listener);
    }
  }, []);
  if (!isDataLoaded) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-dark-900 flex items-center justify-center text-slate-500", children: "Loading..." });
  }
  if (isLocked) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      LockScreen,
      {
        onUnlock: handleUnlock,
        walletState,
        setWalletState,
        lockReason
      }
    );
  }
  if (requestId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SignRequest, { requestId, accounts: walletState.accounts, onComplete: () => window.close() });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full w-full bg-dark-900 text-slate-200 font-sans overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Sidebar,
      {
        currentView,
        onChangeView: setCurrentView,
        onLock: () => {
          setWalletState((prev) => ({ ...prev, accounts: [] }));
          clearCryptoCache();
          setIsLocked(true);
          if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.session) {
            chrome.storage.session.remove("session_accounts");
          }
        },
        isDetached,
        onToggleDetach: handleToggleDetach
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 flex flex-col min-w-0 h-full overflow-hidden relative bg-dark-900", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "h-14 border-b border-dark-700 flex items-center justify-between px-4 bg-dark-800 shadow-md z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: currentView === ViewState.LANDING ? /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-bold tracking-wider text-sm", children: t("sidebar.home").toUpperCase() }) : currentView === ViewState.MANAGE ? /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-bold tracking-wider text-sm text-slate-200", children: t("settings.title").toUpperCase() }) : currentView === ViewState.HELP ? /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-bold tracking-wider text-sm text-slate-200", children: t("help.title").toUpperCase() }) : currentView === ViewState.CHAT ? /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-bold tracking-wider text-sm text-purple-400", children: "GRAVITY CHAT" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: activeChain === Chain.HIVE ? "/Logo_hive.png" : activeChain === Chain.STEEM ? "/logosteem.png" : "/logoblurt.png",
              alt: activeChain,
              className: `w-5 h-5 object-contain ${isRefreshing ? "animate-spin" : ""}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-bold tracking-wider text-sm", children: [
            activeChain,
            " NETWORK"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          currentView !== ViewState.CHAT && web3Context && currentView !== ViewState.LANDING && isContextRelevant(web3Context, activeChain) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded border border-green-800 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" }) }),
            web3Context
          ] }),
          currentView !== ViewState.CHAT && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setShowImport(true),
              className: "text-xs bg-dark-700 hover:bg-dark-600 px-2 py-1 rounded text-slate-300 transition-colors",
              title: t("header.add"),
              children: t("header.add")
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-hidden relative", children: [
        currentView === ViewState.LANDING && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Landing,
          {
            onSelectChain: (chain) => {
              setActiveChain(chain);
              setCurrentView(ViewState.WALLET);
            },
            onManage: () => setCurrentView(ViewState.MANAGE)
          }
        ),
        currentView === ViewState.WALLET && /* @__PURE__ */ jsxRuntimeExports.jsx(
          WalletView,
          {
            chain: activeChain,
            onChainChange: setActiveChain,
            accounts: walletState.accounts.filter((a) => a.chain === activeChain),
            onManage: (acc) => setManagingAccount(acc),
            onSend: (acc) => setTransferAccount(acc),
            onReceive: (acc) => setReceiveAccount(acc),
            onHistory: (acc) => setHistoryAccount(acc),
            onRefresh: fetchBalances$1,
            onAddAccount: () => setShowImport(true)
          }
        ),
        currentView === ViewState.MANAGE && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ManageWallets,
          {
            accounts: walletState.accounts,
            walletState,
            setWalletState,
            onEdit: (acc) => setManagingAccount(acc),
            onImport: () => setShowImport(true)
          }
        ),
        currentView === ViewState.BULK && /* @__PURE__ */ jsxRuntimeExports.jsx(
          BulkTransfer,
          {
            chain: activeChain,
            accounts: walletState.accounts.filter((a) => a.chain === activeChain),
            refreshBalance: fetchBalances$1,
            onChangeChain: setActiveChain,
            onAddAccount: () => setShowImport(true)
          }
        ),
        currentView === ViewState.MULTISIG && /* @__PURE__ */ jsxRuntimeExports.jsx(MultiSig, { chain: activeChain, accounts: walletState.accounts }),
        currentView === ViewState.HELP && /* @__PURE__ */ jsxRuntimeExports.jsx(HelpView, {}),
        currentView === ViewState.CHAT && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ChatView,
          {
            onClose: () => setCurrentView(ViewState.LANDING)
          }
        )
      ] })
    ] }),
    showImport && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ImportModal,
      {
        onClose: () => setShowImport(false),
        onImport: handleImport,
        initialChain: activeChain
      }
    ),
    managingAccount && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ManageAccountModal,
      {
        account: managingAccount,
        onClose: () => setManagingAccount(null),
        onSave: handleUpdateAccount,
        onDelete: handleDeleteAccount
      }
    ),
    transferAccount && /* @__PURE__ */ jsxRuntimeExports.jsx(
      TransferModal,
      {
        account: transferAccount,
        onClose: () => setTransferAccount(null),
        accounts: walletState.accounts,
        onTransfer: handleTransfer,
        disableAccountSelection: true
      }
    ),
    historyAccount && /* @__PURE__ */ jsxRuntimeExports.jsx(
      HistoryModal,
      {
        account: historyAccount,
        onClose: () => setHistoryAccount(null)
      }
    ),
    receiveAccount && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReceiveModal,
      {
        account: receiveAccount,
        onClose: () => setReceiveAccount(null),
        accounts: walletState.accounts
      }
    ),
    notification && /* @__PURE__ */ jsxRuntimeExports.jsx(
      NotificationToast,
      {
        message: notification.msg,
        type: notification.type,
        onClose: () => setNotification(null)
      }
    )
  ] });
}

export { App as default };
