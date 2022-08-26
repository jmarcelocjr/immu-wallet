export interface User {
  id: number;
}

export interface Wallet {
  id?: number;
  user_id: number;
  token: string;
  balance?: number;
}

export interface Transfer {
  from: Wallet;
  to: Wallet;
  value: number;
  description: string;
}

export interface Transaction {
  from: Wallet;
  to: Wallet;
  value: number;
  description: string;
}

export interface WalletList {
  wallets: Wallet[];
}

export interface Response {
  success: boolean;
  message: string;
}

export interface ImmuWalletService {
  registerWallet(wallet: Wallet): Response;
  getWallets(user: User): WalletList;
  getWallet(wallet: Wallet): Wallet;
  transfer(transfer: Transfer): Response;
  getTransactions(wallet: Wallet): Transaction[];
}
