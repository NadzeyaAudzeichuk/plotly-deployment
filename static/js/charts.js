function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// // Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples and metadata arrays. 
    var samplesArray = data.samples;
    var metadataArray = data.metadata;

    // Create a variable that filters the samples and metadata arrays for the object with the desired sample number.
    var resultArray = samplesArray.filter(sampleObj => sampleObj.id == sample);
    var metaArray = metadataArray.filter(sampleObj => sampleObj.id == sample);
    
    // Create a variable that holds the first sample in both arrays.
    var result = resultArray[0];
    var metaSample = metaArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    var wfreq = parseFloat(metaSample.wfreq).toFixed(2);

    // BAR CHART
    // Create the yticks for the bar chart.
    // Get the the top 10 otu_ids and map them in descending order  
    // so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
  
    // Create the trace for the bar chart. 
    var barData = [{
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h",
      marker: {
        color: "rgb(9, 16, 12)"
      },
      text: otu_labels.slice(0,10).reverse()
    }];

   
    // Create the layout for the bar chart. 
     var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>"
    };

    // Plot the bar chart. 
    Plotly.newPlot("bar", barData, barLayout);

    // BUBBLE CHART
    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      type: "scatter",
      mode: "markers",
      marker:{
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample</b>",
      xaxis: {title: "OTU ID"},
      hovermode: "closest"
    };

    // Plot the bubble chart.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
   
    // GAUGE CHART
    // Create the trace for the gauge chart.
    var gaugeData = [{
      title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
      value: wfreq,
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        bar: {color: "black"},
        axis:{ range: [0, 10]},
        steps:[
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "lightgreen"},
          {range: [8, 10], color: "green"},
        ]
      }
    }];
    
    // Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 400
    };

    // Plot the gauge chart.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
