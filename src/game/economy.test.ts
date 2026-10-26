import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialEconomy,
  depositToMoMo,
  withdrawFromMoMo,
  buyBusinessProperty,
  updatePassiveDividends,
  collectDividends,
  applyArrestConfiscation,
  simulateMarketFluctuation,
  COTONOU_PROPERTIES,
  COTONOU_JOBS,
} from './economy.ts';

test('Economy - Initialization', () => {
  const eco = createInitialEconomy(80000);
  assert.equal(eco.cashFCFA, 80000);
  assert.equal(eco.bankMoMoFCFA, 150000);
  assert.equal(eco.ownedPropertyIds.length, 0);
  assert.equal(eco.accumulatedDividendsFCFA, 0);
});

test('Economy - Deposit and Withdraw MoMo', () => {
  let eco = createInitialEconomy(100000);
  // Deposit 40 000
  const depRes = depositToMoMo(eco, 40000);
  assert.equal(depRes.success, true);
  assert.equal(depRes.state.cashFCFA, 60000);
  assert.equal(depRes.state.bankMoMoFCFA, 190000);

  // Withdraw 25 000
  const witRes = withdrawFromMoMo(depRes.state, 25000);
  assert.equal(witRes.success, true);
  assert.equal(witRes.state.cashFCFA, 85000);
  assert.equal(witRes.state.bankMoMoFCFA, 165000);

  // Overdraft attempt fails gracefully
  const failRes = withdrawFromMoMo(witRes.state, 999999);
  assert.equal(failRes.success, false);
});

test('Economy - Business Buyout & Dividends', () => {
  let eco = createInitialEconomy(200000); // 200k cash + 150k momo = 350k total
  const kiosk = COTONOU_PROPERTIES.find((p) => p.id === 'kiosk_sike')!; // 150 000 FCFA

  const buyRes = buyBusinessProperty(eco, kiosk.id);
  assert.equal(buyRes.success, true);
  assert.ok(buyRes.state.ownedPropertyIds.includes('kiosk_sike'));
  assert.equal(buyRes.state.cashFCFA, 50000); // 200k - 150k

  // Simulate 2 minutes of passive time
  const t0 = 1000000;
  const t2min = t0 + 120000; // 2 minutes later
  buyRes.state.lastDividendTimestamp = t0;

  const withDividends = updatePassiveDividends(buyRes.state, t2min);
  assert.equal(withDividends.accumulatedDividendsFCFA, kiosk.incomePerMinFCFA * 2);

  // Collect dividends into MoMo
  const collectRes = collectDividends(withDividends);
  assert.equal(collectRes.collectedAmount, kiosk.incomePerMinFCFA * 2);
  assert.equal(collectRes.state.accumulatedDividendsFCFA, 0);
  assert.equal(collectRes.state.bankMoMoFCFA, 150000 + kiosk.incomePerMinFCFA * 2);
});

test('Economy - Arrest Confiscation protects MoMo', () => {
  const eco = createInitialEconomy(100000);
  eco.bankMoMoFCFA = 500000;

  const { state, lostCash } = applyArrestConfiscation(eco);
  assert.equal(lostCash, 40000); // 40% of 100k cash
  assert.equal(state.cashFCFA, 60000);
  assert.equal(state.bankMoMoFCFA, 500000); // Untouched!
});

test('Economy - Market fluctuation stays bounded', () => {
  let eco = createInitialEconomy();
  for (let i = 0; i < 20; i++) {
    eco = simulateMarketFluctuation(eco);
    assert.ok(eco.commodities.fuelPriceFCFA >= 550 && eco.commodities.fuelPriceFCFA <= 900);
    assert.ok(eco.commodities.waxIndexFCFA >= 12000 && eco.commodities.waxIndexFCFA <= 30000);
    assert.ok(eco.commodities.koboCashStockFCFA >= 100 && eco.commodities.koboCashStockFCFA <= 500);
  }
});

test('Economy - Jobs list integrity', () => {
  assert.ok(COTONOU_JOBS.length >= 5);
  const heist = COTONOU_JOBS.find((j) => j.id === 'heist_ministry_van');
  assert.ok(heist);
  assert.equal(heist.isIllegal, true);
  assert.equal(heist.wantedStarsOnStart, 4);
});
