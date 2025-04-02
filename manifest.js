// manifest.json
{
  "name": "Custom Radar Chart (Online)",
  "description": "Displays data using a radar (spider) chart.",
  "version": "1.0.1", // Increment version if you make changes later
  "author": "Your Name",
  "organization": "Your Organization",
  "packageUrl": "https://<YOUR_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>/", // Replace placeholders!
  "logoUrl": "https://<YOUR_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>/icon.png", // Optional: Add an icon.png later
  "devMode": false, // Set to false for production/GitHub Pages
  "components": [
    {
      "id": "radarChartComponentOnline", // Unique ID
      "name": "Radar Chart (Online)",
      "description": "A customizable radar chart.",
      "iconUrl": "https://<YOUR_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>/icon.png", // Optional: Add an icon.png later
      "resource": {
        "js": "radar.js",
        "css": "style.css",
        "html": "index.html"
      },
      "data": [
        {
          "id": "categoryDimension",
          "name": "Categories (Axes)",
          "concept": "DIMENSION",
          "description": "The categories that will form the axes of the radar chart.",
          "type": "TEXT",
          "min": 1,
          "max": 1
        },
        {
          "id": "valueMetrics",
          "name": "Values (Series)",
          "concept": "METRIC",
          "description": "The numeric values to plot along the axes. Each metric is a separate series.",
          "type": "NUMBER",
          "min": 1,
          "max": 5 // Allow 1 to 5 metrics
        }
      ],
      "style": [
        {
          "id": "legendSection",
          "name": "Legend & Tooltips",
          "elements": [
            { "id": "showLegend", "name": "Show Legend", "type": "CHECKBOX", "defaultValue": true },
            {
              "id": "legendPosition", "name": "Legend Position", "type": "SELECT_SINGLE",
              "options": [
                {"value": "top", "label": "Top"}, {"value": "bottom", "label": "Bottom"},
                {"value": "left", "label": "Left"}, {"value": "right", "label": "Right"}
              ],
              "defaultValue": "top"
            }
          ]
        },
        {
          "id": "colorSection",
          "name": "Colors & Appearance",
          "elements": [
            { "id": "fillOpacity", "name": "Fill Opacity (0-1)", "type": "TEXTINPUT", "defaultValue": "0.2" },
            { "id": "pointRadius", "name": "Point Radius", "type": "TEXTINPUT", "defaultValue": "3" },
            { "id": "series1Color", "name": "Series 1 Color", "type": "FILL_COLOR", "defaultValue": "#3366CC"},
            { "id": "series2Color", "name": "Series 2 Color", "type": "FILL_COLOR", "defaultValue": "#DC3912"},
            { "id": "series3Color", "name": "Series 3 Color", "type": "FILL_COLOR", "defaultValue": "#FF9900"},
            { "id": "series4Color", "name": "Series 4 Color", "type": "FILL_COLOR", "defaultValue": "#109618"},
            { "id": "series5Color", "name": "Series 5 Color", "type": "FILL_COLOR", "defaultValue": "#990099" }
          ]
        },
        {
          "id": "scaleSection",
          "name": "Scale & Grid",
          "elements": [
             { "id": "scaleBeginAtZero", "name": "Start Scale at Zero", "type": "CHECKBOX", "defaultValue": true },
             { "id": "gridLineColor", "name": "Grid Line Color", "type": "GRID_COLOR", "defaultValue": "rgba(0, 0, 0, 0.1)" },
             { "id": "angleLineColor", "name": "Angle Line Color", "type": "AXIS_COLOR", "defaultValue": "rgba(0, 0, 0, 0.1)" },
             { "id": "pointLabelColor", "name": "Category Label Color", "type": "FONT_COLOR", "defaultValue": "#666666" },
             { "id": "pointLabelFontSize", "name": "Category Label Font Size", "type": "FONT_SIZE", "defaultValue": "12" }
          ]
        }
      ]
    }
  ]
}
