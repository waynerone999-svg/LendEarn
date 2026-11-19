
/*
  LendEarnWorld Shared Account Balance
  Demonstration version.

  Only verified deposits increase the balance.
  Only approved or reserved withdrawals reduce it.
  Pending deposit requests do not count.

  IMPORTANT:
  In a live platform, this information must come from
  a secure backend, not browser localStorage.
*/

(function () {
    "use strict";

    const LEDGER_KEY = "lewAccountLedger";

    function readLedger() {
        try {
            const ledger = JSON.parse(
                localStorage.getItem(LEDGER_KEY) || "[]"
            );

            return Array.isArray(ledger) ? ledger : [];
        } catch (error) {
            console.error("Could not read account ledger:", error);
            return [];
        }
    }

    function calculateBalances() {
        const ledger = readLedger();

        let confirmedDeposits = 0;
        let approvedWithdrawals = 0;
        let reservedWithdrawals = 0;
        let managedCapital = 0;

        ledger.forEach(function (entry) {
            const amount = Number(entry.amount);

            if (!Number.isFinite(amount) || amount <= 0) {
                return;
            }

            if (
                entry.type === "deposit" &&
                entry.status === "verified"
            ) {
                confirmedDeposits += amount;
            }

            if (
                entry.type === "withdrawal" &&
                entry.status === "approved"
            ) {
                approvedWithdrawals += amount;
            }

            if (
                entry.type === "withdrawal" &&
                entry.status === "reserved"
            ) {
                reservedWithdrawals += amount;
            }

            if (
                entry.type === "managed-capital" &&
                entry.status === "confirmed"
            ) {
                managedCapital += amount;
            }
        });

        const availableBalance = Math.max(
            0,
            confirmedDeposits -
            approvedWithdrawals -
            reservedWithdrawals
        );

        return {
            currency: "USD",
            confirmedDeposits: confirmedDeposits,
            approvedWithdrawals: approvedWithdrawals,
            reservedWithdrawals: reservedWithdrawals,
            availableBalance: availableBalance,
            managedCapital: managedCapital,
            totalAccountValue: availableBalance + managedCapital
        };
    }

    function formatUSD(amount) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    function updateBalanceDisplays() {
        const balances = calculateBalances();

        document.querySelectorAll("[data-account-balance]").forEach(
            function (element) {
                element.textContent = formatUSD(
                    balances.availableBalance
                );
            }
        );

        document.querySelectorAll("[data-confirmed-deposits]").forEach(
            function (element) {
                element.textContent = formatUSD(
                    balances.confirmedDeposits
                );
            }
        );

        document.querySelectorAll("[data-managed-capital]").forEach(
            function (element) {
                element.textContent = formatUSD(
                    balances.managedCapital
                );
            }
        );

        document.querySelectorAll("[data-total-account-value]").forEach(
            function (element) {
                element.textContent = formatUSD(
                    balances.totalAccountValue
                );
            }
        );

        return balances;
    }

    // Other page scripts can use these functions.
    window.LEWAccount = {
        getBalances: calculateBalances,
        updateDisplays: updateBalanceDisplays,
        formatUSD: formatUSD
    };

    document.addEventListener("DOMContentLoaded", function () {
        updateBalanceDisplays();
    });

})();
