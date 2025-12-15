# Troubleshooting Guide

Common issues and their solutions for Gravity Wallet.

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Login & Password Problems](#login--password-problems)
3. [Transaction Failures](#transaction-failures)
4. [dApp Connection Issues](#dapp-connection-issues)
5. [Balance & Display Problems](#balance--display-problems)
6. [Performance Issues](#performance-issues)
7. [Error Messages](#error-messages)

---

## Installation Issues

### Extension Won't Load

**Symptoms**: Extension doesn't appear after loading unpacked folder

**Solutions**:
1. **Check build output**:
   ```bash
   npm run build
   ```
   Ensure no errors in build process

2. **Verify dist folder exists**:
   - Look for `dist/` folder in project directory
   - Should contain `manifest.json` and assets

3. **Clear browser cache**:
   - Go to `chrome://extensions/`
   - Click "Remove" on old version
   - Reload page
   - Load unpacked again

4. **Check browser compatibility**:
   - Chrome 88+
   - Edge 88+
   - Brave (latest)

### Build Errors

**Error**: `npm install` fails

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

**Error**: TypeScript compilation errors

**Solution**:
```bash
# Update TypeScript
npm install typescript@latest --save-dev

# Rebuild
npm run build
```

---

## Login & Password Problems

### Forgot Master Password

**Problem**: Cannot remember wallet password

**Solution**:
⚠️ **There is NO password recovery**. The password encrypts your data locally.

**Options**:
1. **If you have backup**:
   - Uninstall extension
   - Reinstall
   - Import from backup file
   - Set new password

2. **If no backup**:
   - You must re-import all accounts manually
   - Use your blockchain private keys
   - Set new master password

**Prevention**:
- ✅ Store password in password manager
- ✅ Create encrypted backups regularly
- ✅ Write down password in secure location

### Password Not Accepted

**Symptoms**: Correct password shows "Invalid password" error

**Solutions**:
1. **Check keyboard layout**: Ensure correct language/layout
2. **Check Caps Lock**: Password is case-sensitive
3. **Copy-paste carefully**: Avoid extra spaces
4. **Try different browser**: Data might be corrupted

### Wallet Won't Unlock

**Problem**: Password accepted but wallet doesn't unlock

**Solution**:
1. **Refresh extension**:
   - Go to `chrome://extensions/`
   - Click refresh icon on Gravity Wallet
   - Try unlocking again

2. **Check browser console**:
   - Right-click extension icon → Inspect
   - Look for errors in Console tab
   - Report errors on GitHub

---

## Transaction Failures

### "Insufficient RC" Error

**Problem**: Transaction fails with Resource Credit error

**Explanation**: Hive/Blurt use RC (Resource Credits) instead of fees. RC regenerates over time.

**Solutions**:
1. **Wait for RC to regenerate**:
   - RC refills at ~20% per day
   - Check RC at [hiveblocks.com](https://hiveblocks.com)

2. **Power up more tokens**:
   - More HP = More RC
   - Even small power-up helps

3. **Reduce transaction size**:
   - Split bulk transfers into smaller batches
   - Shorten memos
   - Wait between transactions

### "Account Not Found" Error

**Problem**: Recipient username shows as not found

**Solutions**:
1. **Verify username spelling**: No typos, case-sensitive
2. **Check correct blockchain**: Hive username ≠ Steem username
3. **Verify account exists**: Search on block explorer
4. **Remove @ symbol**: Use `username` not `@username`

### Transaction Pending Forever

**Problem**: Transaction shows "Pending" but never confirms

**Solutions**:
1. **Check blockchain status**:
   - Visit [hiveblocks.com](https://hiveblocks.com) or [steemblockexplorer.com](https://steemblockexplorer.com)
   - Look for network issues

2. **Verify transaction ID**:
   - Copy transaction ID from wallet
   - Search on block explorer
   - If found: Transaction succeeded (wallet display issue)
   - If not found: Transaction failed to broadcast

3. **Refresh wallet**:
   - Click refresh button
   - Or close and reopen extension

4. **Check RPC node**:
   - Go to Settings → Network
   - Switch to different RPC node
   - Retry transaction

### "Broadcast Failed" Error

**Problem**: Transaction fails to broadcast to blockchain

**Solutions**:
1. **Check internet connection**: Ensure stable connection
2. **Try different RPC node**: Settings → Network → Select different node
3. **Verify keys**: Ensure correct key type (Active for transfers)
4. **Check account permissions**: Some accounts have custom permissions

---

## dApp Connection Issues

### PeakD Won't Recognize Wallet

**Problem**: PeakD shows "No Keychain detected"

**Solutions**:
1. **Refresh PeakD page**: Hard refresh (Ctrl+Shift+R)
2. **Check extension is enabled**:
   - Go to `chrome://extensions/`
   - Ensure Gravity Wallet is enabled
3. **Clear browser cache**: For peakd.com specifically
4. **Disable other wallet extensions**: Conflicts with Hive Keychain
5. **Check console for errors**:
   - F12 → Console tab
   - Look for `hive_keychain` errors

### Comment/Post Not Appearing

**Problem**: Comment submitted but doesn't show on page

**Solutions**:
1. **Wait 3-5 seconds**: Blockchain confirmation time
2. **Refresh page**: Comment should appear
3. **Check transaction history**: Verify it was sent
4. **Look for errors**: Check browser console (F12)

**Recent Fix**: This was a known issue with `requestPost` signature. Update to latest version.

### Votes Not Registering

**Problem**: Vote button clicked but vote doesn't apply

**Solutions**:
1. **Check vote weight**: Ensure slider is not at 0%
2. **Verify posting key**: Voting requires posting key
3. **Check RC**: Low RC can prevent voting
4. **Wait and retry**: Network congestion can delay

### Auto-Sign Not Working

**Problem**: Trusted domain still shows approval popup

**Solutions**:
1. **Verify domain is trusted**:
   - Settings → Security → Trusted Domains
   - Check if domain is listed

2. **Re-trust domain**:
   - Remove from trusted list
   - Visit dApp again
   - Check "Trust this domain" when prompted

3. **Clear and re-add**:
   - Settings → Connected dApps
   - Remove connection
   - Reconnect from dApp

---

## Balance & Display Problems

### Balance Shows Zero

**Problem**: Account balance displays as 0.000 but you have funds

**Solutions**:
1. **Click refresh button**: Force balance update
2. **Check on block explorer**: Verify actual balance
3. **Switch RPC node**: Current node might be out of sync
4. **Wait for sync**: New accounts take a few minutes

### Wrong Balance Displayed

**Problem**: Balance is incorrect compared to blockchain

**Solutions**:
1. **Refresh balances**: Click refresh icon
2. **Check pending transactions**: Might not be confirmed yet
3. **Verify on multiple explorers**:
   - [hiveblocks.com](https://hiveblocks.com)
   - [peakd.com](https://peakd.com)
4. **Clear cache and refresh**

### History Not Loading

**Problem**: Transaction history is empty or incomplete

**Solutions**:
1. **Wait for initial sync**: First load takes time
2. **Check RPC node**: Switch to different node
3. **Reduce date range**: Try last 7 days instead of all time
4. **Clear extension data**:
   - Settings → Advanced → Clear Cache
   - Refresh wallet

---

## Performance Issues

### Extension is Slow

**Problem**: Wallet takes long time to load or respond

**Solutions**:
1. **Close unused tabs**: Reduces memory usage
2. **Restart browser**: Clears memory leaks
3. **Disable other extensions**: Check for conflicts
4. **Clear history cache**: Settings → Advanced → Clear Cache
5. **Use faster RPC node**: Settings → Network → Auto-select

### High Memory Usage

**Problem**: Browser uses too much RAM

**Solutions**:
1. **Limit open accounts**: Close accounts not in use
2. **Clear transaction history**: Periodically clear old history
3. **Disable auto-refresh**: Settings → Disable auto-balance refresh
4. **Update browser**: Ensure latest version

### Popup Won't Open

**Problem**: Clicking extension icon does nothing

**Solutions**:
1. **Check extension is enabled**: `chrome://extensions/`
2. **Reload extension**:
   - Go to `chrome://extensions/`
   - Click refresh icon
3. **Check for errors**:
   - Right-click extension icon
   - Select "Inspect popup"
   - Check Console for errors
4. **Reinstall extension**: Last resort

---

## Error Messages

### "Extension context invalidated"

**Cause**: Extension was reloaded while page was open

**Solution**:
1. **Refresh the web page** (F5)
2. Extension will reconnect automatically

### "Failed to fetch"

**Cause**: Network connection or RPC node issue

**Solutions**:
1. Check internet connection
2. Switch RPC node (Settings → Network)
3. Try again in a few moments

### "Invalid key format"

**Cause**: Private key is incorrectly formatted

**Solutions**:
1. **Verify key format**: Should start with `5` and be 51 characters
2. **No extra spaces**: Copy-paste carefully
3. **Check key type**: Ensure using correct key (posting/active/memo)
4. **Get from blockchain**: Export from official wallet

### "Transaction expired"

**Cause**: Transaction took too long to confirm

**Solutions**:
1. **Retry transaction**: Create new transaction
2. **Check blockchain status**: Network might be congested
3. **Use different RPC node**: Faster node = faster broadcast

### "Missing required authority"

**Cause**: Operation requires a key you haven't imported

**Solutions**:
1. **Check required key**:
   - Transfers: Active key
   - Posts/votes: Posting key
   - Messages: Memo key
2. **Import missing key**: Settings → Manage Keys
3. **Verify key is correct**: Test on block explorer

---

## Still Having Issues?

### Before Reporting

1. **Check GitHub Issues**: Your problem might already be reported
2. **Try latest version**: Update to newest release
3. **Test in incognito mode**: Rules out extension conflicts
4. **Gather information**:
   - Browser version
   - Extension version
   - Steps to reproduce
   - Error messages (screenshots)
   - Console logs (F12 → Console)

### Report a Bug

1. **Go to**: [GitHub Issues](https://github.com/drakernoise/w3-multi-chain-wallet-manager/issues)
2. **Click**: "New Issue"
3. **Select**: "Bug Report" template
4. **Provide**:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/logs
   - Environment details

### Get Help

- **GitHub Discussions**: [Ask questions](https://github.com/drakernoise/w3-multi-chain-wallet-manager/discussions)
- **Community**: [@gravitywallet on Hive](https://peakd.com/@gravitywallet)

---

## Preventive Measures

### Regular Maintenance

- ✅ **Backup weekly**: Export wallet data
- ✅ **Update regularly**: Install latest version
- ✅ **Clear cache monthly**: Keeps wallet fast
- ✅ **Review trusted domains**: Remove unused

### Security Checklist

- ✅ Strong master password
- ✅ Encrypted backups stored safely
- ✅ Only trust known domains
- ✅ Lock wallet when not in use
- ✅ Keep browser updated
- ✅ Use antivirus software

### Best Practices

- ✅ Test with small amounts first
- ✅ Double-check recipient usernames
- ✅ Keep private keys offline backup
- ✅ Monitor transaction history regularly
- ✅ Report suspicious activity immediately

---

[← Back to User Guide](User-Guide) | [Advanced Features →](Advanced-Features)
