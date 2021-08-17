/**
 * This script generates a model social network of follows.
 * It assumes:
 * 1. Some accounts are much more likely to receive follows than others. The extent of this discrepacy is set by rateExp.
 * 2. Accounts are more likely to follow accounts that have followed them. How much more likely is set by refollowRate.
 *
 * The graph is generated by iterating followCount times. Each iteration, a random account is selected (uniformly)
 * to create a follow. If the account has unfollowed followers, the account has refollowRate chance of following one
 * of those accounts. Otherwise it picks from unfollowed accounts according to their follow rates.
 */
const numAccounts = 20;
const rateExp = 3;
const refollowRate = 0.333;
const followCount = numAccounts * 5;
const follows = {};

const lerp = (a, b, x) => a + x * (b - a);
const rates = Array(20)
  .fill()
  .map((x, i) => Math.exp(lerp(0, rateExp, i / (numAccounts - 1))));
const rndAccount = (selection) => {
  const srates = selection.map((s) => rates[s]);
  const cumulative = srates
    .slice(0, 19)
    .reduce((m, x) => [...m, m[m.length - 1] + x], [0]);
  const cumRates = srates.reduce((m, x) => m + x, 0);
  const rnd = Math.random() * cumRates;
  for (let i = 0; i < cumulative.length; i++) if (rnd < cumulative[i]) return i;
};
const followed = (follower) => follows[follower] || {};
const follow = (account, other) =>
  (follows[account] = { ...followed(account), [other]: true });
const unfollowedAccounts = (account) => {
  const f = followed(account);
  return Array(numAccounts)
    .fill()
    .map((x, i) => i)
    .filter((a) => a !== account && !f[a]);
};
const unfollowedFollowers = (account) =>
  Object.keys(follows).filter(
    (follower) => followed(account)[followed] && !followed(account)[follower]
  );
const choose = (a) => a[Math.floor(Math.random() * a.length)];

const rndFollow = () => {
  const account = Math.floor(Math.random() * numAccounts);
  const refollows = unfollowedFollowers(account);
  if (Math.random() < refollowRate && refollows.length)
    return follow(account, choose(Object.keys(refollows)));

  const accountFollows = unfollowedAccounts(account);
  if (!accountFollows.length) return;
  follow(account, rndAccount(accountFollows));
};

// Generate follows.
Array(followCount)
  .fill()
  .forEach(() => rndFollow());

// Display follows per account.
const allAccounts = Array(numAccounts)
  .fill()
  .map((x, i) => i);
allAccounts.forEach((i) =>
  console.log(
    i,
    Object.keys(followed(i)).length,
    allAccounts.filter((j) => followed(j)[i]).length
  )
);

console.log();

// Output follows.
console.log(follows);
