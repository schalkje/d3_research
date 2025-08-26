//////////////////////////////////////////////////////////////
//
// Demo: states-adapters-collapsed
// Node Type: adapter within a lane
// Features: Multiple adapter children, identical state, children collapsed
// Test Status: Not Tested
//

export const demoData = {
	// Demo metadata
	metadata: {
		name: "states-adapters-collapsed",
		nodeType: "adapter",
		features: ["Adapters", "Lane layout", "Collapsed children"],
		description: "Lane with multiple adapter nodes, all in the same state and collapsed",
		testStatus: "Not Tested",
		version: "1.0.0"
	},

	// Dashboard settings
	settings: {
		showCenterMark: false,
		showGrid: true,
		showGroupLabels: true,
		showGroupTitles: true,
		showGhostlines: false,
		curved: false,
		showConnectionPoints: false,
		zoomToRoot: true,
		isDebug: false
	},



	// Node definitions
	nodes: [
		{
			id: "lane-adapters",
			label: "Adapters (Collapsed)",
			type: "lane",
			layout: {
				arrangement: "default",
				display: "content"
			},
			children: [
				{ id: "ad-1", label: "Unknown Adapter", type: "adapter", code: "AD1", state: "Unknown", collapsed: true, layout: { mode: "full", arrangement: 1, displayMode: "full" }, children: [
					{ id: "ad-1-staging", label: "STAGING", type: "node", layout: null, children: [], state: "Unknown", role: "staging" },
					{ id: "ad-1-archive", label: "ARCHIVE", type: "node", layout: null, children: [], state: "Unknown", role: "archive" },
					{ id: "ad-1-transform", label: "TRANSFORM", type: "node", layout: null, children: [], state: "Unknown", role: "transform" }
				] },
				{ id: "ad-2", label: "Disabled Adapter", type: "adapter", code: "AD2", state: "Disabled", collapsed: true, layout: { mode: "full", arrangement: 1, displayMode: "full" }, children: [
					{ id: "ad-2-staging", label: "STAGING", type: "node", layout: null, children: [], state: "Disabled", role: "staging" },
					{ id: "ad-2-archive", label: "ARCHIVE", type: "node", layout: null, children: [], state: "Disabled", role: "archive" },
					{ id: "ad-2-transform", label: "TRANSFORM", type: "node", layout: null, children: [], state: "Disabled", role: "transform" }
				] },
				{ id: "ad-3", label: "Ready Adapter", type: "adapter", code: "AD3", state: "Ready", collapsed: true, layout: { mode: "full", arrangement: 1, displayMode: "full" }, children: [
					{ id: "ad-3-staging", label: "STAGING", type: "node", layout: null, children: [], state: "Ready", role: "staging" },
					{ id: "ad-3-archive", label: "ARCHIVE", type: "node", layout: null, children: [], state: "Ready", role: "archive" },
					{ id: "ad-3-transform", label: "TRANSFORM", type: "node", layout: null, children: [], state: "Ready", role: "transform" }
				] },
				{ id: "ad-4", label: "Updating Adapter", type: "adapter", code: "AD4", state: "Updating", collapsed: true, layout: { mode: "full", arrangement: 1, displayMode: "full" }, children: [
					{ id: "ad-4-staging", label: "STAGING", type: "node", layout: null, children: [], state: "Updating", role: "staging" },
					{ id: "ad-4-archive", label: "ARCHIVE", type: "node", layout: null, children: [], state: "Updating", role: "archive" },
					{ id: "ad-4-transform", label: "TRANSFORM", type: "node", layout: null, children: [], state: "Updating", role: "transform" }
				] },
				{ id: "ad-5", label: "Skipped Adapter", type: "adapter", code: "AD5", state: "Skipped", collapsed: true, layout: { mode: "full", arrangement: 1, displayMode: "full" }, children: [
					{ id: "ad-5-staging", label: "STAGING", type: "node", layout: null, children: [], state: "Skipped", role: "staging" },
					{ id: "ad-5-archive", label: "ARCHIVE", type: "node", layout: null, children: [], state: "Skipped", role: "archive" },
					{ id: "ad-5-transform", label: "TRANSFORM", type: "node", layout: null, children: [], state: "Skipped", role: "transform" }
				] },
				{ id: "ad-6", label: "Delayed Adapter", type: "adapter", code: "AD6", state: "Delayed", collapsed: true, layout: { mode: "full", arrangement: 1, displayMode: "full" }, children: [
					{ id: "ad-6-staging", label: "STAGING", type: "node", layout: null, children: [], state: "Delayed", role: "staging" },
					{ id: "ad-6-archive", label: "ARCHIVE", type: "node", layout: null, children: [], state: "Delayed", role: "archive" },
					{ id: "ad-6-transform", label: "TRANSFORM", type: "node", layout: null, children: [], state: "Delayed", role: "transform" }
				] },
				{ id: "ad-7", label: "Warning Adapter", type: "adapter", code: "AD7", state: "Warning", collapsed: true, layout: { mode: "full", arrangement: 1, displayMode: "full" }, children: [
					{ id: "ad-7-staging", label: "STAGING", type: "node", layout: null, children: [], state: "Warning", role: "staging" },
					{ id: "ad-7-archive", label: "ARCHIVE", type: "node", layout: null, children: [], state: "Warning", role: "archive" },
					{ id: "ad-7-transform", label: "TRANSFORM", type: "node", layout: null, children: [], state: "Warning", role: "transform" }
				] },
				{ id: "ad-8", label: "Error Adapter", type: "adapter", code: "AD8", state: "Error", collapsed: true, layout: { mode: "full", arrangement: 1, displayMode: "full" }, children: [
					{ id: "ad-8-staging", label: "STAGING", type: "node", layout: null, children: [], state: "Error", role: "staging" },
					{ id: "ad-8-archive", label: "ARCHIVE", type: "node", layout: null, children: [], state: "Error", role: "archive" },
					{ id: "ad-8-transform", label: "TRANSFORM", type: "node", layout: null, children: [], state: "Error", role: "transform" }
				] }
			]
		}
	],

	// Edge definitions
	edges: []
};



