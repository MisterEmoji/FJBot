# FJBot development docs

## Applications
Bot app use two separated discord applications: public and private (for development purpose) to split public commands (etc.) into separate bot:
  - **Public bot instance init:**
    - `node . public`
    - `node . pub`
    - `npm run login`. 
  - **Private bot instance init:**
    - `node .`
   
  > you can similarly use `npm run deploy` with same argument logic as above.
  > to deploy and run bot with one command use" `npm run [priv|pub]dp-login`.

## Folder Structure
- `core` folder basically contains all files other than commands and events (at least for now).
- `docs` folder is intended to contain project-describing information.
- `local` folder will contain all local bot-related data (for now there is only config and profile).
