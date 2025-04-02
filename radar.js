// radar.js
const ctx = document.getElementById('radarChartCanvas').getContext('2d');
let myRadarChart; // Variable to hold the chart instance

// Subscribe to data and style changes
dscc.subscribeToData(drawChart, { transform: dscc.tableTransform });

function drawChart(data) {
  // console.log("Received data:", data); // Uncomment for debugging

  // --- 1. Prepare Data ---
  if (!data || !data.tables || !data.tables.DEFAULT || !data.tables.DEFAULT.rows || data.tables.DEFAULT.rows.length === 0) {
    console.log("No data or empty data received.");
    // Clear the chart if no data
    if (myRadarChart) {
        myRadarChart.destroy();
        myRadarChart = null; // Ensure it's nullified
    }
     // Optionally display a "No Data" message on the canvas
    const canvas = document.getElementById('radarChartCanvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
    context.textAlign = 'center';
    context.fillStyle = '#888'; // Use a subtle color
    context.font = '16px Arial';
    context.fillText('No data selected', canvas.width / 2, canvas.height / 2);
    return;
  }

  const tableData = data.tables.DEFAULT;
  const headers = tableData.headers;
  const rows = tableData.rows;

  // Find the dimension and metric headers based on manifest config IDs
  const dimensionHeader = headers.find(h => h.configId === 'categoryDimension');
  const metricHeaders = headers.filter(h => h.configId === 'valueMetrics');

  if (!dimensionHeader || metricHeaders.length === 0) {
      console.error("Required dimension or metrics not found in data headers.");
       if (myRadarChart) { myRadarChart.destroy(); myRadarChart = null; }
       // Add error message to canvas if needed
      return;
  }

  // Extract labels (from the dimension column)
  const labels = rows.map(row => row[dimensionHeader.id]);

  // Extract datasets (one for each metric)
  const datasets = metricHeaders.map((metricHeader, index) => {
    const seriesStyleId = `series${index + 1}Color`; // e.g., series1Color
    const defaultColors = ['#3366CC', '#DC3912', '#FF9900', '#109618', '#990099'];

    // Get color from style settings, use default if not found or invalid index
    const colorSetting = data.style[seriesStyleId];
    const color = (colorSetting && colorSetting.value && colorSetting.value.color)
                  ? colorSetting.value.color
                  : (colorSetting && colorSetting.defaultValue)
                     ? colorSetting.defaultValue
                     : defaultColors[index % defaultColors.length];

    const fillOpacitySetting = data.style.fillOpacity;
    const fillOpacity = parseFloat(fillOpacitySetting ? fillOpacitySetting.value : 0.2);

    const pointRadiusSetting = data.style.pointRadius;
    const pointRadius = parseInt(pointRadiusSetting ? pointRadiusSetting.value : 3, 10);


    return {
      label: metricHeader.name, // Use metric name as dataset label
      data: rows.map(row => row[metricHeader.id]), // Get data for this metric
      borderColor: color,
      backgroundColor: hexToRgba(color, fillOpacity),
      pointBackgroundColor: color,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: color,
      pointRadius: pointRadius,
      pointHoverRadius: pointRadius + 2
    };
  });

  // --- 2. Prepare Style Options ---
  const showLegend = data.style.showLegend ? data.style.showLegend.value : true;
  const legendPosition = data.style.legendPosition ? data.style.legendPosition.value : 'top';
  const scaleBeginAtZero = data.style.scaleBeginAtZero ? data.style.scaleBeginAtZero.value : true;

  const gridLineColorSetting = data.style.gridLineColor;
  const gridLineColor = (gridLineColorSetting && gridLineColorSetting.value && gridLineColorSetting.value.color)
                      ? gridLineColorSetting.value.color
                      : (gridLineColorSetting && gridLineColorSetting.defaultValue)
                        ? gridLineColorSetting.defaultValue : 'rgba(0, 0, 0, 0.1)';

  const angleLineColorSetting = data.style.angleLineColor;
   const angleLineColor = (angleLineColorSetting && angleLineColorSetting.value && angleLineColorSetting.value.color)
                       ? angleLineColorSetting.value.color
                       : (angleLineColorSetting && angleLineColorSetting.defaultValue)
                         ? angleLineColorSetting.defaultValue : 'rgba(0, 0, 0, 0.1)';

  const pointLabelColorSetting = data.style.pointLabelColor;
  const pointLabelColor = (pointLabelColorSetting && pointLabelColorSetting.value && pointLabelColorSetting.value.color)
                        ? pointLabelColorSetting.value.color
                        : (pointLabelColorSetting && pointLabelColorSetting.defaultValue)
                          ? pointLabelColorSetting.defaultValue : '#666';

  const pointLabelFontSizeSetting = data.style.pointLabelFontSize;
  const pointLabelFontSize = parseInt(pointLabelFontSizeSetting ? pointLabelFontSizeSetting.value : 12, 10);

  // --- 3. Destroy Previous Chart (if exists) ---
  if (myRadarChart) {
    myRadarChart.destroy();
    myRadarChart = null; // Explicitly nullify
  }

  // --- 4. Create New Chart ---
  try {
      myRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: showLegend, position: legendPosition },
            tooltip: { enabled: true }
          },
          scales: {
            r: { // Radial scale (values)
              beginAtZero: scaleBeginAtZero,
              grid: { color: gridLineColor },
              angleLines: { color: angleLineColor }, // Lines from center
              pointLabels: { // Category Labels
                color: pointLabelColor,
                font: { size: pointLabelFontSize }
              },
              ticks: { // Numeric labels on scale
                 backdropColor: 'rgba(255, 255, 255, 0.75)',
                 backdropPadding: 3
              }
            }
          },
          elements: {
              line: { borderWidth: 2 }
          }
        }
      });
  } catch (error) {
      console.error("Error creating chart:", error);
       // Display error on canvas?
  }
}

// --- Helper Function ---
function hexToRgba(hex, alpha) {
    if (!hex) return `rgba(0, 0, 0, ${alpha})`; // Default to black if hex is invalid/missing
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    // Ensure alpha is a number between 0 and 1
    const validAlpha = Math.min(1, Math.max(0, Number(alpha) || 0));
    return `rgba(${r}, ${g}, ${b}, ${validAlpha})`;
}
