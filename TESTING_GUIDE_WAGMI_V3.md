# Wagmi v2 → v3 Migration Testing Guide

## Summary of Changes

You've successfully migrated from **wagmi v2.15.4** to **wagmi v3.3.1**. This migration includes:

### Key API Changes:

1. ✅ `useAccount` → `useConnection` (React hooks)
2. ✅ `getAccount` → `getConnection` (@wagmi/core)
3. ✅ `wallet.getAccount()` → `wallet.getConnection()` (custom method)
4. ✅ `useConnect().connectors` → `useConnections().map(c => c.connector)`
5. ✅ `useDisconnect()` → `useDisconnect().mutate`
6. ✅ `useSwitchChain()` → `useSwitchChain().mutate`
7. ✅ `useSignMessage().signMessageAsync` → `useSignMessage().mutateAsync`

### Package Updates:

- Wagmi: `2.15.4` → `3.3.1`
- TypeScript: `5.7.2` → `5.9.3`
- Added connector dependencies (@base-org/account, @coinbase/wallet-sdk, @metamask/sdk, etc.)

---

## Critical Testing Areas

### 1. **Wallet Connection Flow** ⚠️ HIGH PRIORITY

**What to test:**

- [ ] **Connect wallet** from WalletWall component
  - Test MetaMask/Injected wallet
  - Test WalletConnect
  - Test Coinbase Wallet
  - Test Sequence Wallet
  - Test Ronin Wallet
  - Test Farcaster Wallet
- [ ] **Disconnect wallet**
  - Verify disconnect button works
  - Verify wallet state clears properly
  - Verify UI updates correctly after disconnect

- [ ] **Multiple connections**
  - Verify handling of multiple simultaneous connections
  - Verify `useConnections()` returns correct connections

**Files changed:**

- `src/features/wallet/components/WalletWall.tsx`
- `src/features/wallet/components/buttons/*.tsx` (Farcaster, InjectedProvider, Ronin)

---

### 2. **Wallet Authentication & Signing** ⚠️ HIGH PRIORITY

**What to test:**

- [ ] **Sign message for login**
  - Complete login flow with wallet signature
  - Verify message signing works correctly
  - Verify signature is accepted by backend

- [ ] **Connection status**
  - Verify `isConnected` state updates correctly
  - Verify connection persists across page refreshes
  - Verify connection state is reactive to wallet changes

**Files changed:**

- `src/features/wallet/components/SignMessage.tsx`
- `src/features/auth/actions/login.ts`
- `src/features/auth/components/Verifying.tsx`

---

### 3. **Chain Switching** ⚠️ HIGH PRIORITY

**What to test:**

- [ ] **Switch between networks**
  - Polygon Mainnet/Testnet
  - Base Mainnet/Testnet
  - Ronin Mainnet/Testnet
- [ ] **Network switching during operations**
  - Switch network when depositing items
  - Switch network when depositing FLOWER
  - Switch network when withdrawing
  - Verify pending state (`isPending`) displays correctly

**Files changed:**

- `src/features/wallet/Wallet.tsx`
- `src/features/island/hud/components/deposit/DepositFlower.tsx`

---

### 4. **Account/Connection Access** ⚠️ HIGH PRIORITY

**What to test:**

- [ ] **Get wallet address**
  - Verify `wallet.getConnection()` returns correct address
  - Verify address is displayed correctly throughout the app
  - Test when wallet is disconnected (should return undefined)

- [ ] **Account in game machine**
  - Verify game loads correctly with connected wallet
  - Verify session loading uses correct connector
  - Test game state with no wallet connected

**Files changed:**

- `src/lib/blockchain/wallet.ts` (method renamed from `getAccount()` to `getConnection()`)
- `src/features/game/lib/gameMachine.ts`
- All files that call `wallet.getAccount()` → now `wallet.getConnection()`

---

### 5. **Deposit Operations** ⚠️ MEDIUM PRIORITY

**What to test:**

- [ ] **Deposit FLOWER**
  - Deposit from linked wallet
  - Manual deposit (other wallet)
  - Network switching during deposit flow
  - Verify chain ID detection works

- [ ] **Deposit Items**
  - Deposit items from linked wallet
  - Verify account address is correctly passed

**Files changed:**

- `src/features/island/hud/components/deposit/DepositFlower.tsx`
- `src/features/game/lib/gameMachine.ts` (depositingFlowerFromLinkedWallet, depositingSFLFromLinkedWallet, depositing)

---

### 6. **Withdraw Operations** ⚠️ MEDIUM PRIORITY

**What to test:**

- [ ] **Withdraw FLOWER**
  - Verify wallet address is retrieved correctly
  - Verify withdrawal completes successfully

- [ ] **Withdraw Items/Buds/Pets/Wearables/Resources**
  - Verify all withdrawal flows work
  - Verify wallet address display in withdrawal modals

**Files changed:**

- `src/features/game/components/bank/components/Withdraw*.tsx` (multiple files)
- `src/features/game/components/Withdrawn.tsx`

---

### 7. **Transaction Monitoring** ⚠️ MEDIUM PRIORITY

**What to test:**

- [ ] **Transaction status**
  - Verify transaction widget shows correct connection status
  - Verify `isConnected` state updates correctly
  - Verify transaction receipts are monitored correctly

**Files changed:**

- `src/features/island/hud/Transaction.tsx`

---

### 8. **Edge Cases & Error Handling** ⚠️ HIGH PRIORITY

**What to test:**

- [ ] **No wallet connected**
  - Verify app handles undefined/null addresses gracefully
  - Verify error messages are clear
  - Verify no crashes when accessing wallet methods

- [ ] **Wallet disconnected during operation**
  - Disconnect wallet mid-transaction
  - Verify error handling is appropriate

- [ ] **Network mismatch**
  - Verify switching prompts work correctly
  - Verify operations wait for correct network

- [ ] **TypeScript compilation**
  - Verify no type errors
  - Verify all types are correctly updated

---

## Testing Checklist

### Pre-Release Testing

- [ ] **Build successful** - No compilation errors
- [ ] **All wallet providers tested** - MetaMask, WalletConnect, Coinbase, Sequence, Ronin, Farcaster
- [ ] **All networks tested** - Polygon, Base, Ronin (both mainnet and testnet)
- [ ] **Core flows tested**:
  - [ ] Login/authentication
  - [ ] Deposit operations
  - [ ] Withdraw operations
  - [ ] Transaction monitoring
  - [ ] Network switching
  - [ ] Wallet disconnection

### Regression Testing

- [ ] **Existing functionality** - Ensure nothing broke
- [ ] **Performance** - Check for any performance regressions
- [ ] **Browser compatibility** - Test in Chrome, Firefox, Safari, Edge
- [ ] **Mobile testing** - Test on mobile browsers if applicable

---

## Known Issues to Watch For

1. **Connector dependencies** - v3 requires manual installation of connector packages. Verify all connectors are working.

2. **Mutate functions** - All mutation functions now return `{ mutate, mutateAsync }` object. Verify all calls are updated.

3. **Connection vs Account** - The terminology changed from "account" to "connection". Ensure UI/UX still makes sense.

4. **TypeScript types** - Verify no type errors with new TypeScript version (5.9.3).

---

## Files Modified Summary

**37 files changed** across:

- Wallet components and providers
- Game state machine
- Blockchain operations (deposits, withdrawals, rewards)
- Authentication flows
- Transaction monitoring

**Key files to focus testing on:**

1. `src/features/wallet/Wallet.tsx`
2. `src/features/wallet/components/WalletWall.tsx`
3. `src/lib/blockchain/wallet.ts`
4. `src/features/game/lib/gameMachine.ts`
5. `src/features/island/hud/components/deposit/DepositFlower.tsx`

---

## Quick Test Script

```bash
# 1. Build the project
yarn build

# 2. Run preview based on built project
yarn preview --port=3000

# Then manually test:
# - Connect wallet
# - Sign message
# - Switch networks
# - Deposit/withdraw
```

---

## Notes

- The migration appears comprehensive - all `useAccount` → `useConnection` and `getAccount` → `getConnection` changes have been made.
- The `wallet.getAccount()` method was renamed to `wallet.getConnection()` with proper typing.
- All mutation functions have been updated to use the new API pattern.
- Connector access has been updated to use `useConnections()` hook.

Good luck with testing! 🚀
