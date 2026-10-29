document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const scrim = document.getElementById("mobileScrim");
  const mobileMorePanel = document.getElementById("mobileMorePanel");
  const mobileMoreScrim = document.getElementById("mobileMoreScrim");
  const mobileMoreToggle = document.getElementById("mobileMoreToggle");
  const pageContent = document.getElementById("pageContent");
  const dashboardMarkup = pageContent.innerHTML;
  const toast = bootstrap.Toast.getOrCreateInstance(document.getElementById("demoToast"), { delay: 2600 });

  function notify(message) {
    document.getElementById("toastMessage").textContent = message;
    toast.show();
  }

  function selectPage(page) {
    document.getElementById("pageTitle").textContent = page;
    document.querySelectorAll(".nav-link").forEach(link => {
      link.classList.toggle("active", link.dataset.page === page);
    });
    document.querySelectorAll(".mobile-bottom-nav [data-page]").forEach(link => {
      const active = link.dataset.page === page;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    const mobileMoreActive = !["Dashboard", "Accounts", "Fund", "Rewards"].includes(page);
    mobileMoreToggle.classList.toggle("active", mobileMoreActive);
    mobileMoreToggle.setAttribute("aria-current", mobileMoreActive ? "page" : "false");
    pageContent.innerHTML = page === "Dashboard" ? dashboardMarkup : window.hxPortalPages.render(page);
    if (page === "Dashboard") window.renderBalanceChart();
    sidebar.classList.remove("open");
    scrim.classList.remove("show");
    closeMobileMore();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeMobileMore() {
    mobileMorePanel.hidden = true;
    mobileMoreScrim.hidden = true;
    mobileMoreToggle.setAttribute("aria-expanded", "false");
    const currentPage = document.getElementById("pageTitle").textContent;
    const moreActive = !["Dashboard", "Accounts", "Fund", "Rewards"].includes(currentPage);
    mobileMoreToggle.classList.toggle("active", moreActive);
    mobileMoreToggle.setAttribute("aria-current", moreActive ? "page" : "false");
  }

  mobileMoreToggle.addEventListener("click", () => {
    mobileMorePanel.hidden = false;
    mobileMoreScrim.hidden = false;
    mobileMoreToggle.classList.add("active");
    mobileMoreToggle.setAttribute("aria-current", "page");
    mobileMoreToggle.setAttribute("aria-expanded", "true");
    document.getElementById("mobileMoreClose").focus();
  });
  document.getElementById("mobileMoreClose").addEventListener("click", () => {
    closeMobileMore();
    mobileMoreToggle.focus();
  });
  mobileMoreScrim.addEventListener("click", () => {
    closeMobileMore();
    mobileMoreToggle.focus();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !mobileMorePanel.hidden) {
      closeMobileMore();
      mobileMoreToggle.focus();
    }
  });

  document.getElementById("menuToggle").addEventListener("click", () => {
    sidebar.classList.add("open");
    scrim.classList.add("show");
  });
  scrim.addEventListener("click", () => {
    sidebar.classList.remove("open");
    scrim.classList.remove("show");
  });

  document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    notify(document.body.classList.contains("light-theme") ? "Light theme enabled." : "Dark theme enabled.");
  });
  document.getElementById("signOut").addEventListener("click", () => {
    notify("Sign-out is disabled in this local demo.");
  });

  document.addEventListener("click", event => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const pageLink = target.closest("[data-page]");
    if (pageLink) {
      event.preventDefault();
      selectPage(pageLink.dataset.page);
      return;
    }

    const actionButton = target.closest("[data-action]");
    if (actionButton) {
      notify(`${actionButton.dataset.action} opened. This prototype uses demo data only; no real transaction will be made.`);
      return;
    }

    const copyButton = target.closest("[data-copy]");
    if (copyButton) {
      if (!navigator.clipboard) {
        notify("Clipboard access is unavailable here. Please copy the text manually.");
      } else {
        navigator.clipboard.writeText(copyButton.dataset.copy).then(
          () => notify("Copied to clipboard."),
          () => notify("Could not access the clipboard. Please copy the text manually.")
        );
      }
      return;
    }

    const accountTab = target.closest(".account-tab");
    if (accountTab) {
      const accountData = {
        "Live USD": { balance: "$12,450.00", equity: "$12,682.00", unrealised: "+$232.00", currency: "USD" },
        "Raw Spread USD": { balance: "$1,000.00", equity: "$1,018.50", unrealised: "+$18.50", currency: "USD" },
        "Live EUR": { balance: "€820.00", equity: "€836.20", unrealised: "+€16.20", currency: "EUR" },
        "Demo USD": { balance: "$100,000.00", equity: "$101,250.00", unrealised: "+$1,250.00", currency: "USD" }
      };
      document.querySelectorAll(".account-tab").forEach(item => item.classList.toggle("selected", item === accountTab));
      const data = accountData[accountTab.dataset.account];
      document.getElementById("balanceAmount").textContent = data.balance;
      document.getElementById("equityAmount").textContent = data.equity;
      document.getElementById("unrealisedAmount").textContent = data.unrealised;
      document.getElementById("currencyTag").textContent = data.currency;
      return;
    }

    if (target.closest("#chartView")) {
      document.getElementById("chartView").classList.add("selected");
      document.getElementById("activityView").classList.remove("selected");
      document.getElementById("chartWrap").classList.remove("hidden");
      document.getElementById("activityList").classList.add("hidden");
      return;
    }
    if (target.closest("#activityView")) {
      document.getElementById("activityView").classList.add("selected");
      document.getElementById("chartView").classList.remove("selected");
      document.getElementById("chartWrap").classList.add("hidden");
      document.getElementById("activityList").classList.remove("hidden");
      return;
    }

    const toggle = target.closest(".fund-tabs button, .method-cards button, .leaderboard-tabs button, .filter-tabs button");
    if (toggle) {
      toggle.parentElement.querySelectorAll("button").forEach(button => button.classList.toggle("selected", button === toggle));
      if (toggle.matches(".fund-tabs button")) {
        document.querySelectorAll(".fund-tabs button").forEach(button => button.setAttribute("aria-pressed", String(button === toggle)));
      }
      return;
    }

    const ticketButton = target.closest(".ticket-choice");
    if (ticketButton) {
      document.querySelectorAll(".ticket-choice").forEach(button => button.classList.toggle("selected", button === ticketButton));
      document.getElementById("ticketTitle").textContent = ticketButton.querySelector("strong").textContent;
      return;
    }
  });

  document.addEventListener("input", event => {
    if (event.target.id === "fundAmount") {
      const amount = Math.max(0, Number(event.target.value) || 0);
      const fee = amount * 0.015;
      document.getElementById("sendAmount").textContent = `$${amount.toFixed(2)}`;
      document.getElementById("feeAmount").textContent = `$${fee.toFixed(2)}`;
      document.getElementById("creditAmount").textContent = `$${(amount - fee).toFixed(2)}`;
    }
    if (event.target.id === "ticketSearch") {
      const query = event.target.value.toLowerCase();
      document.querySelectorAll(".ticket-choice").forEach(ticket => {
        ticket.hidden = !ticket.textContent.toLowerCase().includes(query);
      });
    }
  });

  document.addEventListener("click", event => {
    const shortcut = event.target instanceof Element ? event.target.closest(".amount-shortcuts button") : null;
    if (!shortcut) return;
    const amountInput = document.getElementById("fundAmount");
    amountInput.value = shortcut.textContent.replace(/[$,]/g, "");
    amountInput.dispatchEvent(new Event("input", { bubbles: true }));
  });

  selectPage("Dashboard");
});
