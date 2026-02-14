# Cash Register

A full-stack change calculator for **Creative Cash Draw Solutions**. It tells cashiers how much change to return and in which denominations (dollars, quarters, dimes, nickels, pennies). When both the amount owed and amount paid are whole dollars divisible by a configurable divisor (default 3), the app returns a valid but randomly chosen mix of denominations instead of the minimum coins—so the math is always correct.

## Technologies

| Layer      | Stack |
|-----------|--------|
| **Frontend** | Next.js 15 (App Router), React 19, Mantine UI, TanStack Query |
| **Backend**  | Node.js, Express |
| **Database** | PostgreSQL (optional; for transaction history) |

## How to set up and run (from a fresh clone)

Assume you’ve just cloned the repo from GitHub and want to run both the frontend and backend locally.

### Prerequisites

- **Node.js** (v18 or v20 recommended) and **npm**
- **PostgreSQL** (optional) — only if you want transaction history saved; the app runs without it

### 1. Install dependencies

Install for both the root app (Next.js) and the server (Express):

```bash
# From the repo root
npm install

# Server dependencies (in a separate folder)
cd server && npm install && cd ..
```

### 2. Environment variables

Create a `.env` file at the **project root** (or use `app/.env`). Copy from the example:

```bash
cp .env.example .env
```

Edit `.env` and set:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | No | API base URL. Default: `http://localhost:3001`. Change only if the API runs elsewhere. |
| `DATABASE_URL` | No | PostgreSQL connection string. Omit if you don’t use Postgres; the app still runs and the Calculator works, but the Transactions page won’t persist history. |

**Example `.env` without Postgres:**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Example `.env` with Postgres (transaction history):**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
DATABASE_URL=postgresql://youruser:yourpassword@localhost:5432/cash_register
```

Create the database if needed (e.g. `createdb cash_register`). The server creates the `transactions` table on startup when `DATABASE_URL` is set.

### 3. Run the backend (API server)

From the **repo root**:

```bash
npm run server
```

You should see something like:

- `Server running at http://localhost:3001`
- If `DATABASE_URL` is set: `Database initialized — transactions will be saved`
- If not: a warning that transactions won’t be persisted

Leave this terminal running.

### 4. Run the frontend (Next.js app)

In a **second terminal**, from the **repo root**:

```bash
npm run dev
```

Then open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Verify it’s working

- **Dashboard:** Stats cards and the calculator (Text / Keypad) should load.
- **Calculator:** Enter amounts (e.g. owed `3`, paid `10`) and click **Compute change**; the right panel shows the change breakdown.
- **Transactions:** If you set `DATABASE_URL`, run a calculation and check the Transactions page; entries should appear and persist.

### Troubleshooting

- **Frontend can’t reach the API** — Ensure the server is running on port 3001 and `NEXT_PUBLIC_API_URL` in `.env` matches (e.g. `http://localhost:3001`). Restart the Next.js dev server after changing env vars.
- **“Failed to save transaction” / DB errors** — Check that Postgres is running, `DATABASE_URL` is correct, and the database exists. The server will still return change results; only persistence is affected.
- **Port in use** — The app uses 3000 (frontend) and 3001 (backend). Change ports in the scripts or env if needed.

### Quick reference (once set up)

```bash
# Terminal 1 — API
npm run server

# Terminal 2 — Frontend
npm run dev
# → http://localhost:3000
```

---

## Design Notes

- **Random divisor:** The “divisible by 3” rule is driven by config in `server/src/config/denominations.js` (`CHANGE_RULES.randomDivisor`). Changing it (e.g. to 5) requires no logic changes.
- **Extra rules:** The change path is split into “minimum change” vs “random change” via `shouldUseRandomChange()`. Additional rules (e.g. “if divisible by 5 use half dollars”) can be added there or via a small rule engine.
- **Locales:** Denominations are defined in a single config (`US_DENOMINATIONS`). A future locale (e.g. France) would add another config and pass it into the calculator; the UI could switch by locale.

---

## The Problem
Creative Cash Draw Solutions is a client who wants to provide something different for the cashiers who use their system. The function of the application is to tell the cashier how much change is owed, and what denominations should be used. In most cases the app should return the minimum amount of physical change, but the client would like to add a twist. If the "owed" amount is divisible by 3, the app should randomly generate the change denominations (but the math still needs to be right :))

Please write a program which accomplishes the clients goals. The program should:

1. Accept a flat file as input
	1. Each line will contain the amount owed and the amount paid separated by a comma (for example: 2.13,3.00)
	2. Expect that there will be multiple lines
2. Output the change the cashier should return to the customer
	1. The return string should look like: 1 dollar,2 quarters,1 nickel, etc ...
	2. Each new line in the input file should be a new line in the output file

## Sample Input
2.12,3.00

1.97,2.00

3.33,5.00

## Sample Output
3 quarters,1 dime,3 pennies

3 pennies

1 dollar,1 quarter,6 nickels,12 pennies

*Remember the last one is random

## The Fine Print
Please use whatever technology and techniques you feel are applicable to solve the problem. We suggest that you approach this exercise as if this code was part of a larger system. The end result should be representative of your abilities and style.

Please fork this repository. When you have completed your solution, please issue a pull request to notify us that you are ready.

Have fun.

## Things To Consider
Here are a couple of thoughts about the domain that could influence your response:

* What might happen if the client needs to change the random divisor?
* What might happen if the client needs to add another special case (like the random twist)?
* What might happen if sales closes a new client in France?