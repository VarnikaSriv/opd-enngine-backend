# OPD Engine Backend

Node.js + Express + Mongoose backend implementing an OPD token allocation engine with doctors, slots, and tokens.

## Project Structure

- `src/models` – Mongoose models (`Doctor`, `Slot`, `Token`)
- `src/services/allocator.js` – OPD token allocation engine
- `src/routes` – Express routes for doctors, slots, and tokens
- `src/app.js` – Express app bootstrap
- `src/simulation.js` – Script to simulate OPD workflow

## Setup

```bash
cd opd-engine-backend
npm install
```

Make sure MongoDB is running locally on `mongodb://localhost:27017/opd_engine` or set `MONGO_URI` in your environment.

## Running the API

```bash
npm start
```

The API will listen on port `3000` by default.

## Running the Simulation

```bash
npm run simulation
```

This creates sample doctors/slots, book/cancel/no-show tokens, adds an emergency token, and prints slot allocations before and after.

## Push to GitHub

1. **Create a new repo on GitHub** (e.g. `opd-engine-backend`). Do **not** add a README, .gitignore, or license.

2. **In PowerShell, from `opd-engine-backend`:**

   ```powershell
   cd C:\Medoc_assignment\opd-engine-backend
   ```

   If you had a failed `git init` before, remove the `.git` folder first:

   ```powershell
   Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue
   ```

   Then:

   ```powershell
   git init
   git add .
   git commit -m "Initial commit: OPD token allocation engine"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/opd-engine-backend.git
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` with your GitHub username (and `opd-engine-backend` if you used a different repo name).

3. **If GitHub asks for auth:** Use a Personal Access Token (PAT) instead of a password, or set up SSH and use an `git@github.com:...` remote.
