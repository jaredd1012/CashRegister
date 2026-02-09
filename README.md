# Cash Register

A full-stack change calculator for **Creative Cash Draw Solutions**: it tells cashiers how much change to return and in which denominations. When the amount owed is divisible by 3, denominations are chosen at random (math remains correct).

## Quick Start

1. **Install dependencies**
   - Root (Next.js): `npm install`
   - Server (Express): `cd server && npm install`

2. **Run the API server** (from repo root)
   ```bash
   npm run server
   ```
   Server runs at `http://localhost:3001`.

3. **Run the Next.js app** (from repo root)
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000). Paste or upload a file with lines like `2.12,3.00`, then click **Compute change**. Copy or download the output.

Optional: set `NEXT_PUBLIC_API_URL` (e.g. in `.env`) if the API is on another host/port.

4. **PostgreSQL (for transaction history)**  
   To persist calculation history in the Transactions page:
   - Create a Postgres database (e.g. `createdb cash_register`)
   - Add `DATABASE_URL=postgresql://user:password@localhost:5432/cash_register` to `.env`
   - Restart the server — the `transactions` table is created automatically

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, Mantine UI, TanStack Query
- **Backend:** Node.js, Express
- **Design:** Configurable “random change” divisor and denomination set for future locales (e.g. France)

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