# Contributing to Gravity Wallet

**Languages:** [🇬🇧 English](CONTRIBUTING.md) | [🇪🇸 Español](CONTRIBUTING.es.md) | [🇫🇷 Français](CONTRIBUTING.fr.md) | [🇩🇪 Deutsch](CONTRIBUTING.de.md) | [🇮🇹 Italiano](CONTRIBUTING.it.md)

---

First off, thank you for considering contributing to Gravity Wallet!

It's people like you that make Gravity Wallet such a great tool for the Graphene blockchain community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inspiring community for all.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When reporting a bug, include:**
- Clear and descriptive title
- Steps to reproduce the behavior
- Expected behavior vs actual behavior
- Screenshots (if applicable)
- Environment details (browser, OS, extension version)
- Console logs or error messages

**Use this template:**
```markdown
**Bug Description:**
[Clear description of the bug]

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:**
[What you expected to happen]

**Actual Behavior:**
[What actually happened]

**Environment:**
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- Extension Version: [e.g., 1.0.4]

**Screenshots/Logs:**
[If applicable]
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues.

**When suggesting an enhancement, include:**
- Clear and descriptive title
- Detailed description of the proposed feature
- Use cases and benefits
- Mockups or examples (if applicable)
- Links to similar features in other projects

### Security Vulnerabilities

**IMPORTANT:** Do NOT create public issues for security vulnerabilities.

Please report security issues privately to: `drakernoise@protonmail.com`

See our [Security Policy](SECURITY.md) for more details.

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes** (following our commit guidelines)
6. **Push to your fork** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

## Development Setup

### Prerequisites

- **Node.js**: v16 or higher
- **npm**: v8 or higher
- **Git**: Latest version
- **Browser**: Chrome, Brave, or Edge (for testing)

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/w3-multi-chain-wallet-manager.git
cd w3-multi-chain-wallet-manager

# Install dependencies
npm install

# Build the extension
npm run build

# For development with auto-rebuild
npm run dev
```

### Loading the Extension

1. Open Chrome/Brave/Edge
2. Navigate to `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `dist` folder

### Project Structure

```
web3-multi-chain-wallet/
├── src/                    # Source code
│   ├── background/         # Background scripts
│   ├── content/            # Content scripts & provider
│   └── popup/              # Extension popup UI
├── components/             # React components
├── services/               # Blockchain services
├── config/                 # Configuration files
├── public/                 # Static assets
├── scripts/                # Build & utility scripts
└── dist/                   # Built extension (generated)
```

## Pull Request Process

### Before Submitting

- **Test your changes** thoroughly
- **Update documentation** if needed
- **Follow coding standards**
- **Write meaningful commit messages**
- **Ensure no console errors**
- **Check for TypeScript errors** (`npm run build`)

### PR Guidelines

1. **Title**: Use a clear, descriptive title
   - Good: `feat: Add support for Hive Resource Credits delegation`
   - Bad: `Update code`

2. **Description**: Include:
   - What changes were made
   - Why the changes were necessary
   - How to test the changes
   - Screenshots (for UI changes)
   - Related issues (if any)

3. **Size**: Keep PRs focused and reasonably sized
   - Prefer multiple small PRs over one large PR
   - Each PR should address one feature/fix

4. **Review**: Be responsive to feedback
   - Address review comments promptly
   - Be open to suggestions
   - Ask questions if unclear

### PR Template

```markdown
## Description
[Brief description of changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
[How to test these changes]

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated (if applicable)
```

## Coding Standards

### TypeScript/JavaScript

```typescript
// Good
export const transferFunds = async (
    chain: Chain,
    from: string,
    to: string,
    amount: string
): Promise<TransferResult> => {
    // Clear, descriptive function
    // Proper typing
    // Async/await pattern
};

// Bad
function transfer(a, b, c) {
    // No types
    // Unclear parameters
    // No return type
}
```

### React Components

```typescript
// Good
interface TransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    account: Account;
}

export const TransferModal: React.FC<TransferModalProps> = ({
    isOpen,
    onClose,
    account
}) => {
    // Proper typing
    // Functional component
    // Clear props interface
};
```

### Naming Conventions

- **Files**: `camelCase.ts` or `PascalCase.tsx` (for components)
- **Components**: `PascalCase`
- **Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Interfaces/Types**: `PascalCase`

### Code Style

- **Indentation**: 4 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Required
- **Line Length**: Max 120 characters
- **Comments**: Use JSDoc for functions

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding/updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples

```bash
# Feature
feat(wallet): Add support for Hive Resource Credits

# Bug fix
fix(transfer): Resolve memo encoding issue on Blurt

# Documentation
docs(readme): Update installation instructions

# Multiple changes
feat(delegation): Add BP delegation UI and API integration

- Add delegation modal component
- Implement delegation service methods
- Add validation for minimum delegation amount
```

### Scope

Use the component/module being changed:
- `wallet`, `transfer`, `delegation`, `ui`, `services`, etc.

## Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Extension loads without errors
- [ ] All existing features still work
- [ ] New feature works as expected
- [ ] No console errors or warnings
- [ ] Works on different chains (Hive, Steem, Blurt)
- [ ] Responsive UI (if applicable)
- [ ] Error handling works correctly

### Testing on Different Frontends

Test your changes on:
- **Hive**: PeakD, Ecency, Hive.blog
- **Steem**: Steemit
- **Blurt**: BeBlurt, Blurt.blog, BlurtWallet

### Browser Compatibility

Test on:
- Chrome (latest)
- Brave (latest)
- Edge (latest)

## Documentation

### Code Documentation

```typescript
/**
 * Transfers funds between accounts on a specified blockchain
 * 
 * @param chain - The blockchain to use (HIVE, STEEM, or BLURT)
 * @param from - Sender's account name
 * @param to - Recipient's account name
 * @param amount - Amount to transfer (e.g., "10.000 HIVE")
 * @param memo - Optional memo message
 * @returns Promise resolving to transfer result
 * @throws {Error} If transfer fails or insufficient balance
 */
export const transferFunds = async (
    chain: Chain,
    from: string,
    to: string,
    amount: string,
    memo?: string
): Promise<TransferResult> => {
    // Implementation
};
```

### README Updates

If your changes affect:
- Installation process
- Usage instructions
- Features list
- Configuration

→ Update the README.md accordingly

### Wiki Updates

For major features, consider adding:
- User guide in the Wiki
- Screenshots/GIFs
- Troubleshooting tips

## UI/UX Guidelines

### Design Principles

- **Consistency**: Follow existing design patterns
- **Clarity**: Clear labels and error messages
- **Accessibility**: Proper contrast, keyboard navigation
- **Responsiveness**: Works on different screen sizes
- **Feedback**: Loading states, success/error messages

### Color Scheme

Use the existing color variables:
```css
--primary-color: #...
--secondary-color: #...
--error-color: #...
--success-color: #...
```

## Recognition

Contributors will be:
- Listed in release notes
- Mentioned in the README (for significant contributions)
- Added to the contributors list

## Getting Help

- **Questions**: Use [GitHub Discussions](https://github.com/drakernoise/w3-multi-chain-wallet-manager/discussions)
- **Bugs**: Create an [Issue](https://github.com/drakernoise/w3-multi-chain-wallet-manager/issues)
- **Chat**: Join our community channels (if available)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Gravity Wallet!**

Every contribution, no matter how small, makes a difference. We appreciate your time and effort in making this project better for everyone.

Happy coding!
