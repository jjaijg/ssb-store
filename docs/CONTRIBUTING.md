# Contributing to SSB Store

## Getting Started

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/your-username/ssb-store.git
```
3. Install dependencies:
```bash
cd ssb-store
npm install
```

## Development Setup

1. Create a `.env.local` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ssb_store"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
RAZORPAY_KEY_ID="your-test-key"
RAZORPAY_KEY_SECRET="your-test-secret"
```

2. Setup database:
```bash
npx prisma generate
npx prisma db push
```

## Code Style Guidelines

- Use TypeScript for all new code
- Follow existing code formatting
- Add proper types and interfaces
- Write meaningful commit messages
- Add comments for complex logic

## Pull Request Process

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit:
```bash
git add .
git commit -m "feat: add your feature description"
```

3. Push to your fork:
```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request

## Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Formatting, missing semicolons
- `refactor:` - Code changes that neither fixes a bug nor adds a feature
- `test:` - Adding missing tests
- `chore:` - Changes to build process or auxiliary tools

## Testing

- Write unit tests for new features
- Ensure all existing tests pass
- Test your changes in development environment

## Questions?

Feel free to create an issue for:
- Bug reports
- Feature requests
- Documentation improvements