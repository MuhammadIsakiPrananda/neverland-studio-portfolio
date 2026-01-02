<div align="center">

# 🤝 Contributing to Neverland Studio Portfolio

**Thank you for considering contributing to our project!**

[![Contributors](https://img.shields.io/github/contributors/MuhammadIsakiPrananda/neverland-studio-portfolio)](https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/graphs/contributors)
[![Pull Requests](https://img.shields.io/github/issues-pr/MuhammadIsakiPrananda/neverland-studio-portfolio)](https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/pulls)
[![Issues](https://img.shields.io/github/issues/MuhammadIsakiPrananda/neverland-studio-portfolio)](https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/issues)

We love your input! We want to make contributing to this project as easy and transparent as possible.

[🚀 Getting Started](#-getting-started) • [💻 Development](#-development-process) • [📝 Guidelines](#-code-style-guidelines) • [🐛 Reporting Bugs](#-reporting-bugs)

</div>

---

## 📋 Table of Contents

- [Getting Started](#-getting-started)
- [Ways to Contribute](#-ways-to-contribute)
- [Development Process](#-development-process)
- [Code Style Guidelines](#-code-style-guidelines)
- [Commit Message Guidelines](#-commit-message-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Reporting Bugs](#-reporting-bugs)
- [Feature Requests](#-feature-requests)
- [Code of Conduct](#-code-of-conduct)

---

## 🚀 Getting Started

### Prerequisites

Before you begin contributing, make sure you have:

- **Node.js** (v20.x or higher)
- **PHP** (v8.2 or higher)
- **Composer** (v2.x)
- **Docker** & Docker Compose (optional but recommended)
- **Git** installed and configured

### Setting Up Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/neverland-studio-portfolio.git
   cd neverland-studio-portfolio
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio.git
   ```

4. **Install dependencies**:
   ```bash
   # Frontend dependencies
   npm install
   
   # Backend dependencies
   cd backend
   composer install
   cd ..
   ```

5. **Setup environment**:
   ```bash
   # Copy environment files
   cp .env.example .env
   cp backend/.env.example backend/.env
   
   # Configure your database credentials in both .env files
   ```

6. **Start development server**:
   ```bash
   # Option 1: Using Docker (recommended)
   docker compose up -d
   
   # Option 2: Manual setup
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - Backend
   cd backend
   php artisan serve
   ```

7. **Run migrations**:
   ```bash
   # If using Docker
   docker compose exec backend php artisan migrate --seed
   
   # If running manually
   cd backend
   php artisan migrate --seed
   ```

---

## 🎯 Ways to Contribute

We welcome many types of contributions:

### 💻 Code Contributions
- Fix bugs or issues
- Implement new features
- Improve existing features
- Optimize performance
- Refactor code

### 📚 Documentation
- Improve existing documentation
- Add missing documentation
- Fix typos or errors
- Translate documentation
- Add code examples

### 🐛 Bug Reports
- Report bugs with detailed information
- Provide reproduction steps
- Include screenshots/logs

### ✨ Feature Requests
- Suggest new features
- Propose enhancements
- Share use cases

### 🧪 Testing
- Write unit tests
- Write integration tests
- Test pull requests
- Report test failures

### 🎨 Design
- Improve UI/UX
- Create mockups
- Suggest design improvements

---

## 💻 Development Process

### 1. Create a Feature Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a new feature branch
git checkout -b feature/amazing-feature

# Or for bug fixes
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the [Code Style Guidelines](#-code-style-guidelines)
- Add comments for complex logic
- Update documentation as needed
- Write tests for new features

### 3. Test Your Changes

```bash
# Run frontend tests
npm run test

# Run backend tests
cd backend
php artisan test

# Run linting
npm run lint
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add amazing feature"
```

Follow the [Commit Message Guidelines](#-commit-message-guidelines)

### 5. Push to Your Fork

```bash
git push origin feature/amazing-feature
```

### 6. Create Pull Request

- Go to your fork on GitHub
- Click "New Pull Request"
- Fill out the PR template
- Link related issues
- Wait for review

---

## 📝 Code Style Guidelines

### Frontend (React/TypeScript)

#### General Rules
- Use **TypeScript** for all new files
- Use **functional components** with hooks
- Use **arrow functions** for components
- Keep components **small and focused** (< 300 lines)
- Use **descriptive variable names**

#### Naming Conventions
```typescript
// Components: PascalCase
export const UserProfile = () => { ... }

// Functions: camelCase
const fetchUserData = async () => { ... }

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'

// Interfaces/Types: PascalCase with 'I' prefix (optional)
interface UserData { ... }
type ButtonProps = { ... }
```

#### File Structure
```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { User } from '@/types';

// 2. Types/Interfaces
interface Props {
  userId: string;
}

// 3. Component
export const UserProfile: React.FC<Props> = ({ userId }) => {
  // 4. State
  const [user, setUser] = useState<User | null>(null);
  
  // 5. Effects
  useEffect(() => {
    fetchUser();
  }, [userId]);
  
  // 6. Functions
  const fetchUser = async () => {
    // Implementation
  };
  
  // 7. Render
  return <div>...</div>;
};
```

#### React Best Practices
```typescript
// ✅ Good
const UserList = ({ users }: { users: User[] }) => (
  <ul>
    {users.map(user => (
      <li key={user.id}>{user.name}</li>
    ))}
  </ul>
);

// ❌ Bad
const UserList = (props: any) => (
  <ul>
    {props.users.map((user: any, index: number) => (
      <li key={index}>{user.name}</li>
    ))}
  </ul>
);
```

### Backend (Laravel/PHP)

#### General Rules
- Follow **PSR-12** coding standards
- Use **type hints** for parameters and return types
- Use **Eloquent ORM** for database operations
- Write **descriptive method names**
- Keep controllers **thin**, move logic to services

#### Naming Conventions
```php
// Classes: PascalCase
class UserController extends Controller { ... }

// Methods: camelCase
public function getUserProfile(int $id): User { ... }

// Variables: camelCase
$userData = $request->validated();

// Constants: UPPER_SNAKE_CASE
const MAX_LOGIN_ATTEMPTS = 5;
```

#### Laravel Best Practices
```php
// ✅ Good - Controller
public function store(StoreUserRequest $request): JsonResponse
{
    $user = $this->userService->create($request->validated());
    return response()->json($user, 201);
}

// ❌ Bad - Controller with too much logic
public function store(Request $request): JsonResponse
{
    $validator = Validator::make($request->all(), [...]);
    if ($validator->fails()) { ... }
    $user = new User();
    $user->name = $request->name;
    // ... many more lines
}
```

### CSS/Styling

#### Tailwind CSS
- Use **Tailwind utility classes** first
- Create custom classes only when necessary
- Use **semantic class names**
- Group related utilities together

```tsx
// ✅ Good
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors">
  Click Me
</button>

// ❌ Bad - Inline styles
<button style={{ padding: '8px 16px', backgroundColor: '#2563eb' }}>
  Click Me
</button>
```

### Database

#### Migrations
```php
// ✅ Good - Descriptive migration name
2024_01_01_000000_create_users_table.php
2024_01_02_000000_add_email_verified_at_to_users_table.php

// ❌ Bad
migration1.php
update_users.php
```

#### Eloquent Models
```php
// ✅ Good
class User extends Model
{
    protected $fillable = ['name', 'email', 'password'];
    
    protected $hidden = ['password', 'remember_token'];
    
    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];
    
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }
}
```

---

## 📝 Commit Message Guidelines

We follow **Conventional Commits** specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **ci**: CI/CD changes

### Examples

```bash
# Feature
git commit -m "feat(auth): add Google OAuth integration"

# Bug fix
git commit -m "fix(dashboard): resolve chart rendering issue"

# Documentation
git commit -m "docs(api): update authentication endpoint examples"

# With body and footer
git commit -m "feat(user): add profile photo upload

- Add image upload component
- Integrate with backend API
- Add image validation

Closes #123"
```

### Rules

- Use **present tense** ("add" not "added")
- Use **imperative mood** ("move" not "moves")
- Keep subject line **under 72 characters**
- Capitalize first letter of subject
- No period at the end of subject
- Separate subject from body with blank line
- Wrap body at **72 characters**
- Reference issues in footer

---

## 🔄 Pull Request Process

### Before Submitting

1. ✅ Update documentation if needed
2. ✅ Add/update tests
3. ✅ Run linting and fix issues
4. ✅ Test locally
5. ✅ Rebase on latest main
6. ✅ Write clear commit messages

### PR Template

When creating a PR, include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] Tests pass locally
```

### Review Process

1. **Maintainer Review**: A maintainer will review your PR
2. **Changes Requested**: Address feedback if any
3. **Approval**: Once approved, PR will be merged
4. **Merge**: Maintainer will merge your PR

### After Merge

- Delete your feature branch
- Update your local repository
- Celebrate! 🎉

---

## 🐛 Reporting Bugs

### Before Reporting

- Check existing issues
- Update to latest version
- Test in clean environment
- Verify it's not a feature request

### Bug Report Template

```markdown
**Describe the Bug**
Clear description of the bug

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 120]
- Node Version: [e.g. 20.10.0]
- PHP Version: [e.g. 8.2.0]

**Additional Context**
Any other information
```

### Creating a Bug Report

1. Go to [Issues](https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/issues)
2. Click "New Issue"
3. Choose "Bug Report" template
4. Fill out all sections
5. Add relevant labels
6. Submit

---

## ✨ Feature Requests

### Before Requesting

- Check existing requests
- Search closed issues
- Consider if it fits project scope
- Think about implementation

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
What you want to happen

**Describe alternatives you've considered**
Other solutions or features

**Additional context**
Mockups, examples, or references

**Would you like to implement this?**
Yes/No - If yes, we can guide you
```

---

## 🛡 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of:

- Age
- Body size
- Disability
- Ethnicity
- Gender identity
- Experience level
- Nationality
- Personal appearance
- Race
- Religion
- Sexual identity and orientation

### Our Standards

**Positive behavior includes:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards others

**Unacceptable behavior includes:**

- Trolling, insulting, or derogatory comments
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the project team at **muhammadisakiprananda88@gmail.com**. All complaints will be reviewed and investigated promptly and fairly.

---

## 📞 Questions?

If you have questions about contributing:

1. Check the [Documentation](docs/README.md)
2. Ask in [GitHub Discussions](https://github.com/MuhammadIsakiPrananda/neverland-studio-portfolio/discussions)
3. Email: muhammadisakiprananda88@gmail.com

---

## 🙏 Thank You!

Your contributions, whether big or small, make a difference. Thank you for being part of our community!

---

<div align="center">

**[⬆ Back to Top](#-contributing-to-neverland-studio-portfolio)**

Made with ❤️ by [Neverland Studio](https://github.com/MuhammadIsakiPrananda)

</div>
