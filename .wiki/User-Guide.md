# User Guide - Gravity Wallet

Complete guide for using Gravity Wallet in your daily blockchain activities.

## Table of Contents

1. [Account Management](#account-management)
2. [Sending & Receiving](#sending--receiving)
3. [Bulk Transfers](#bulk-transfers)
4. [Transaction History](#transaction-history)
5. [Security Features](#security-features)
6. [dApp Integration](#dapp-integration)
7. [Settings & Preferences](#settings--preferences)

---

## Account Management

### Adding Multiple Accounts

Gravity Wallet supports multiple accounts across different blockchains:

1. **Click "+ Add"** in the top-right corner
2. **Select Blockchain**: Choose Hive, Steem, or Blurt
3. **Enter Credentials**:
   - Username
   - Posting Key (optional but recommended)
   - Active Key (required for transfers)
   - Memo Key (optional)
4. **Validate**: Keys are verified against the blockchain
5. **Success**: Account appears in your wallet list

### Switching Between Accounts

- **Click on any account card** to view its details
- **Use the sidebar** to navigate between different accounts
- **Network indicator** shows which blockchain is active

### Managing Account Keys

**To update keys**:
1. Click the **gear icon** on an account card
2. Select "Manage Keys"
3. Add or remove keys as needed
4. Click "Save Changes"

**Key indicators**:
- 🔑 **Green lock**: Active key present
- ✏️ **Pen icon**: Posting key present
- 📝 **Memo icon**: Memo key present

### Removing an Account

1. Click **gear icon** on account card
2. Select "Remove Account"
3. **Confirm deletion** (this only removes from wallet, not blockchain)
4. Account is removed from local storage

---

## Sending & Receiving

### Sending Tokens

#### Basic Transfer

1. **Select Account**: Click on the account to send from
2. **Click "Send"** button
3. **Fill Transfer Form**:
   ```
   To: recipient-username
   Amount: 10.000
   Token: HIVE (or HBD/STEEM/SBD/BLURT)
   Memo: Optional message
   ```
4. **Review Details**: Double-check recipient and amount
5. **Click "Send"**: Popup appears for confirmation
6. **Approve**: Transaction is broadcast to blockchain
7. **Success**: Confirmation message appears

#### Encrypted Memos

To send an encrypted memo:
1. Start memo with `#` symbol
2. Example: `#This message is encrypted`
3. Only sender and recipient can read it
4. **Requires memo key** for both parties

#### Transfer Tips

- ✅ Always double-check the recipient username
- ✅ Start with small test amounts for new recipients
- ✅ Use memos for reference (invoice numbers, notes)
- ❌ Never include sensitive information in unencrypted memos

### Receiving Tokens

#### Share Your Username

1. **Click "Receive"** button
2. **QR Code** is displayed with your username
3. **Share** the QR code or username
4. **Wait**: Funds appear automatically (usually within 3 seconds)

#### Checking Incoming Transactions

1. Click **"History"** button
2. **Green entries** are incoming transfers
3. **Red entries** are outgoing transfers
4. Click any transaction for details

---

## Bulk Transfers

Perfect for airdrops, payments, or distributing rewards to multiple users.

### Single Amount Mode

Send the **same amount** to multiple recipients:

1. **Navigate to "Bulk Transfers"** in sidebar
2. **Select "Same Amount to Multiple Recipients"**
3. **Enter Amount**: e.g., `5.000`
4. **Select Token**: HIVE, HBD, STEEM, SBD, or BLURT
5. **Add Recipients**:
   ```
   username1, memo for user 1
   username2, memo for user 2
   username3, memo for user 3
   ```
6. **Preview**: Review all transfers
7. **Execute**: Confirm and send all at once

### Different Amounts Mode

Send **different amounts** to different recipients:

1. **Select "Different Amounts"** mode
2. **Add Recipients with Amounts**:
   ```
   username1, 10.000, memo for user 1
   username2, 5.500, memo for user 2
   username3, 2.250, memo for user 3
   ```
3. **Total is calculated** automatically
4. **Preview and Execute**

### CSV Import

For large batches, import from CSV:

1. **Prepare CSV file**:
   ```csv
   username,amount,memo
   user1,10.000,Payment for services
   user2,5.500,Airdrop reward
   user3,2.250,Contest prize
   ```
2. **Click "Import CSV"**
3. **Select file** from your computer
4. **Validate**: System checks format
5. **Review and Execute**

### Bulk Transfer Tips

- ✅ Test with 2-3 recipients first
- ✅ Keep CSV backups of large distributions
- ✅ Use descriptive memos for record-keeping
- ⚠️ Bulk transfers use more RC (Resource Credits)
- ❌ Don't exceed your account's RC limit

---

## Transaction History

### Viewing History

1. **Click "History"** on any account
2. **Filter by Type**:
   - All transactions
   - Sent only
   - Received only
3. **Search**: Find specific transactions by username or memo
4. **Export**: Download history as CSV

### Transaction Details

Click any transaction to see:
- **Transaction ID**: Blockchain reference
- **Block Number**: Where it was confirmed
- **Timestamp**: Exact date and time
- **Amount**: Tokens transferred
- **Memo**: Message (decrypted if encrypted)
- **Status**: Confirmed/Pending

### Exporting History

1. **Click "Export"** in history view
2. **Select Date Range**
3. **Choose Format**: CSV or JSON
4. **Download**: File saved to your computer

---

## Security Features

### Wallet Lock

**Auto-lock**:
- Wallet locks after 15 minutes of inactivity
- Requires password to unlock
- All keys are encrypted while locked

**Manual lock**:
1. Click **lock icon** in sidebar
2. Wallet locks immediately
3. Enter password to unlock

### Password Management

**Changing Password**:
1. Go to **Settings** → **Security**
2. Click "Change Password"
3. Enter current password
4. Enter new password (twice)
5. **All data is re-encrypted** with new password

**Password Requirements**:
- Minimum 8 characters
- Mix of letters and numbers recommended
- Special characters add extra security

### Trusted Domains

**Whitelist dApps** to skip approval prompts:

1. When a dApp requests action, check **"Trust this domain"**
2. Future requests from that domain auto-approve
3. **Manage trusted domains** in Settings → Security
4. **Remove trust** anytime

**Security Warning**: Only trust domains you use frequently and trust completely.

### Backup & Recovery

**Backup Your Wallet**:
1. Go to **Settings** → **Backup**
2. Click "Export Wallet Data"
3. **Save encrypted file** securely
4. Store in multiple locations (USB drive, cloud storage)

**Restore from Backup**:
1. **Fresh install** of Gravity Wallet
2. Click "Import Wallet"
3. **Select backup file**
4. **Enter password**
5. All accounts restored

---

## dApp Integration

### Supported dApps

Gravity Wallet works with any dApp supporting Hive Keychain API:

#### Social Platforms
- **PeakD**: Blogging and community
- **Ecency**: Mobile-friendly social platform
- **Hive.blog**: Official Hive frontend

#### Gaming
- **Splinterlands**: Trading card game
- **dCity**: City building simulation
- **Rising Star**: Music career game

#### Finance
- **Tribaldex**: Token exchange
- **Hive-Engine**: Token creation and trading
- **LeoDex**: DeFi platform

#### Tools
- **HiveAuth**: Authentication service
- **Keychain Store**: Browser extension store
- **PeakLock**: Encrypted notes

### Using with dApps

**First-time connection**:
1. **Visit dApp** (e.g., peakd.com)
2. **Click "Login"** or "Connect Wallet"
3. **Select "Hive Keychain"** option
4. **Gravity Wallet popup** appears
5. **Review permissions** requested
6. **Approve** to connect

**Subsequent uses**:
- If domain is trusted: Auto-approves
- If not trusted: Popup for each action

### Managing Permissions

**View active connections**:
1. Go to **Settings** → **Connected dApps**
2. See list of all connected sites
3. **Revoke access** for any site
4. **Clear all** connections if needed

---

## Settings & Preferences

### Language

**Change interface language**:
1. Click **language toggle** (🌐) in top-right
2. Select from:
   - English
   - Español
   - Français
   - Deutsch
   - Italiano
3. Interface updates immediately

### Display Options

**Customize appearance**:
- **Theme**: Light/Dark mode (coming soon)
- **Currency Display**: Show/hide secondary balances
- **Compact Mode**: Smaller account cards

### Network Settings

**RPC Node Selection**:
1. Go to **Settings** → **Network**
2. **Auto-select** (recommended): Fastest node chosen automatically
3. **Manual select**: Choose specific RPC node
4. **Custom node**: Add your own RPC endpoint

**Node benchmarking**:
- Runs automatically on startup
- Tests latency to all available nodes
- Selects fastest for optimal performance

### Notifications

**Configure alerts**:
- **Transaction confirmations**: On/Off
- **Incoming transfers**: On/Off
- **Low RC warnings**: On/Off
- **dApp requests**: On/Off

### Advanced Settings

**Developer Options**:
- **Debug mode**: Show console logs
- **Test networks**: Enable testnet support
- **Custom RPC**: Add custom endpoints

---

## Tips & Tricks

### Keyboard Shortcuts

- **Ctrl/Cmd + L**: Lock wallet
- **Ctrl/Cmd + N**: New transfer
- **Ctrl/Cmd + H**: View history
- **Esc**: Close modal/popup

### Quick Actions

- **Double-click account**: Opens transfer modal
- **Right-click account**: Context menu
- **Drag QR code**: Save to desktop

### Performance Tips

- **Close unused tabs**: Reduces memory usage
- **Clear history periodically**: Keeps wallet fast
- **Use bulk transfers**: More efficient than individual sends

---

## Next Steps

- [Advanced Features](Advanced-Features) - MultiSig, custom operations, and more
- [Troubleshooting](Troubleshooting) - Common issues and solutions
- [Developer Guide](Developer-Guide) - Integrate Gravity Wallet into your dApp

## Need Help?

- **GitHub Issues**: [Report bugs](https://github.com/drakernoise/w3-multi-chain-wallet-manager/issues)
- **Discussions**: [Ask questions](https://github.com/drakernoise/w3-multi-chain-wallet-manager/discussions)
- **Community**: Join us on Hive [@gravitywallet](https://peakd.com/@gravitywallet)
