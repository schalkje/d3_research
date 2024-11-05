
export async function fetchDashboardFile(selectedFile) {
    const graphData = await d3.json(`data/${selectedFile}`);
    return graphData;
}