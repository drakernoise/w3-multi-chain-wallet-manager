export enum Chain {
  BLURT = 'BLURT',
  HIVE = 'HIVE',
  STEEM = 'STEEM'
}

export enum ViewState {
  LANDING = 'LANDING',
  WALLET = 'WALLET',
  BULK = 'BULK',
  MULTISIG = 'MULTISIG',
  MANAGE = 'MANAGE',
  HELP = 'HELP',
  CHAT = 'CHAT'
}

export interface Account {
  name: string;
  chain: Chain;
  publicKey?: string;
  postingKey?: string;
  activeKey?: string;
  memoKey?: string;
  balance?: number;
  secondaryBalance?: number;
  stakedBalance?: number; // HP/SP/BP (Power)
  powerDownActive?: boolean;
  nextPowerDown?: string;
  powerDownAmount?: number;
}

export interface WalletState {
  accounts: Account[];
  // encryptedMaster is now the marker that the wallet is initialized.
  // The actual keys are stored in the encrypted 'Vault'.
  encryptedMaster: boolean;
  useGoogleAuth: boolean;
  useBiometrics: boolean;
  useTOTP?: boolean;
}

export interface Vault {
  accounts: Account[];
  lastUpdated: number;
}

export interface BulkItem {
  to: string;
  amount: number | string;
  memo: string;
}

export interface MultiSigRequest {
  initiator: string;
  signers: string[];
  threshold: number;
  operation: string;
}