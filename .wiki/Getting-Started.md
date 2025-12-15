# Getting Started with Gravity Wallet

## Installation

### Chrome/Brave/Edge

1. **Download the Extension**
   - Clone the repository or download the latest release
   ```bash
   git clone https://github.com/drakernoise/w3-multi-chain-wallet-manager.git
   cd w3-multi-chain-wallet-manager
   ```

2. **Build the Extension**
   ```bash
   npm install
   npm run build
   ```

3. **Load in Browser**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `dist` folder from the project directory

4. **Pin the Extension**
   - Click the puzzle icon in your browser toolbar
   - Find "Gravity Wallet" and click the pin icon

## First-Time Setup

### Creating Your First Wallet

1. **Launch Gravity Wallet**
   - Click the Gravity Wallet icon in your browser toolbar
   - You'll see the welcome screen

2. **Set a Master Password**
   - Choose a strong password (minimum 8 characters)
   - This password encrypts your wallet data
   - **Important**: Store this password safely - it cannot be recovered!

3. **Import Your First Account**
   - Click "+ Add" button
   - Select the blockchain (Hive, Steem, or Blurt)
   - Enter your account details:
     - **Username**: Your blockchain username
     - **Posting Key**: For social actions (posts, votes, comments)
     - **Active Key**: For financial transactions (transfers, power up/down)
     - **Memo Key**: For encrypted messages (optional)

4. **Verify Import**
   - The wallet will validate your keys against the blockchain
   - If successful, you'll see your account balance

## Understanding Key Types

### Posting Key
- **Used for**: Creating posts, voting, commenting, following
- **Security Level**: Medium
- **Recommendation**: Safe to store in wallet for daily use

### Active Key
- **Used for**: Transfers, power up/down, delegations
- **Security Level**: High
- **Recommendation**: Only import if you need to make transfers

### Memo Key
- **Used for**: Encrypting/decrypting private messages
- **Security Level**: Low
- **Recommendation**: Optional, import only if needed

## Quick Start Guide

### Viewing Your Balance

1. Click on your account name in the wallet
2. You'll see:
   - **Primary Balance**: HIVE/STEEM/BLURT
   - **Secondary Balance**: HBD/SBD (for Hive/Steem)
   - **Powered Up**: Vested tokens (HP/SP/BP)

### Sending Your First Transfer

1. **Select Account**: Click on the account you want to send from
2. **Click "Send"**: Opens the transfer modal
3. **Enter Details**:
   - **To**: Recipient's username (without @)
   - **Amount**: Number of tokens to send
   - **Token**: Select HIVE/HBD or STEEM/SBD
   - **Memo**: Optional message (encrypted if starts with #)
4. **Confirm**: Review and click "Send"
5. **Approve**: Confirm in the popup window

### Receiving Funds

1. Click "Receive" button
2. Your username is displayed with a QR code
3. Share your username with the sender
4. Funds will appear automatically in your balance

## Using with dApps

### Connecting to PeakD

1. **Navigate to PeakD**: Go to [peakd.com](https://peakd.com)
2. **Click Login**: Select "Hive Keychain" option
3. **Gravity Wallet Activates**: A popup will appear
4. **Approve Connection**: Click "Approve" to connect
5. **Start Using**: You can now post, vote, and comment

### Connecting to Other dApps

Gravity Wallet is compatible with any dApp that supports Hive Keychain API:
- **Ecency**: Social blogging platform
- **Tribaldex**: Token trading
- **Splinterlands**: Gaming
- **And many more!**

## Security Best Practices

### Password Security
- ✅ Use a unique, strong password
- ✅ Never share your password
- ✅ Store password in a password manager
- ❌ Don't use the same password as other services

### Key Management
- ✅ Only import keys you need
- ✅ Keep a backup of your keys offline
- ✅ Use posting key for daily activities
- ❌ Don't share your private keys with anyone

### Browser Security
- ✅ Keep your browser updated
- ✅ Only install extensions from trusted sources
- ✅ Lock your wallet when not in use
- ❌ Don't use on public/shared computers

## Next Steps

- [User Guide](User-Guide) - Learn all features in detail
- [Advanced Features](Advanced-Features) - Bulk transfers, MultiSig, and more
- [Troubleshooting](Troubleshooting) - Common issues and solutions

## Need Help?

- **GitHub Issues**: [Report problems](https://github.com/drakernoise/w3-multi-chain-wallet-manager/issues)
- **Discussions**: [Ask questions](https://github.com/drakernoise/w3-multi-chain-wallet-manager/discussions)
