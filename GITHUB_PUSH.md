# Push opd-engine-backend to GitHub

## 1. Create a repo on GitHub

1. Go to [github.com](https://github.com) and sign in.
2. Click **New** (or **+** → **New repository**).
3. Name it `opd-engine-backend` (or whatever you prefer).
4. Leave **Add a README**, **Add .gitignore**, and **Choose a license** **unchecked**.
5. Click **Create repository**.

## 2. Open PowerShell in the project folder

```powershell
cd C:\Medoc_assignment\opd-engine-backend
```

## 3. Clean up a previous failed Git init (if any)

If you ever ran `git init` here before and it failed, remove the `.git` folder:

```powershell
Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue
```

## 4. Initialize Git, add files, and commit

```powershell
git init
git add .
git status
git commit -m "Initial commit: OPD token allocation engine"
git branch -M main
```

## 5. Add your GitHub repo as remote and push

Replace `YOUR_USERNAME` with your GitHub username and `opd-engine-backend` with your repo name if different:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/opd-engine-backend.git
git push -u origin main
```

## 6. Authentication

- **HTTPS:** GitHub will prompt for username and **password**. Use a **Personal Access Token (PAT)** instead of your account password.
  - GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token**. Give it `repo` scope, then use the token as the password when pushing.
- **SSH:** If you use SSH keys, add the remote with:
  ```powershell
  git remote add origin git@github.com:YOUR_USERNAME/opd-engine-backend.git
  ```
  Then `git push -u origin main` as above.

## Summary

| Step | Command |
|------|--------|
| Go to project | `cd C:\Medoc_assignment\opd-engine-backend` |
| (Optional) Remove old .git | `Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue` |
| Init | `git init` |
| Stage all | `git add .` |
| Commit | `git commit -m "Initial commit: OPD token allocation engine"` |
| Default branch | `git branch -M main` |
| Add remote | `git remote add origin https://github.com/YOUR_USERNAME/opd-engine-backend.git` |
| Push | `git push -u origin main` |
