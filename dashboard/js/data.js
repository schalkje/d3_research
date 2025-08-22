
export  function fetchDashboardFile(selectedFile) {
    const graphData =  d3.json(`data/${selectedFile}`);
    return graphData;
}