window.renderBalanceChart = () => {
  const canvas = document.getElementById("balanceChart");
  if (!canvas || !window.Chart) return;

  if (window.hxBalanceChart) window.hxBalanceChart.destroy();

  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, 190);
  gradient.addColorStop(0, "rgba(126, 226, 207, .28)");
  gradient.addColorStop(1, "rgba(126, 226, 207, 0)");
  window.hxBalanceChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Sep 5", "Sep 11", "Sep 17", "Sep 23", "Sep 30"],
      datasets: [{
        data: [10130, 12680, 10920, 12020, 12680],
        borderColor: "#8ce2d0",
        backgroundColor: gradient,
        fill: true,
        tension: 0,
        borderWidth: 2.5,
        pointRadius: [3, 4, 4, 4, 5],
        pointHoverRadius: 6,
        pointBackgroundColor: "#14242e",
        pointBorderColor: "#8ce2d0",
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1c303c",
          titleColor: "#eaf4f7",
          bodyColor: "#8ce2d0",
          displayColors: false,
          callbacks: {
            label: context => "$" + context.parsed.y.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          }
        }
      },
      scales: {
        x: { display: false, grid: { display: false } },
        y: {
          min: 10000,
          max: 13000,
          ticks: {
            stepSize: 1400,
            color: "#afc5d4",
            font: { family: "Inter", size: 10 },
            callback: value => "$" + Number(value).toLocaleString("en-US", { maximumFractionDigits: 0 })
          },
          border: { display: false },
          grid: { color: "rgba(118, 154, 173, .18)", borderDash: [3, 4], drawTicks: false }
        }
      },
      interaction: { intersect: false, mode: "index" }
    }
  });
};
