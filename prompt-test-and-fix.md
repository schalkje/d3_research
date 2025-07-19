Can you help me fix my flow dashboard library.

I'm working on a windows system. The rootfolder of the project is: cd /repo/jeroen/d3_research
    How can I instruct you to fix this problem in you execution:
    cd /c/repo/jeroen/d3_research && npm test -- tests/rectangular-nodes.spec.js 

    on my pc should be:
    cd /repo/jeroen/d3_research && npm test -- tests/rectangular-nodes.spec.js 

    There does the /c come from; if you want a drive, windows need c:

Python server is already running on port 8000, so you don't need to start it
Th folder: 4_edges, 5_nodes, 6_groups; are used for demonstrating the capabilities of the dashboard library in 7_dashboard. Those demo pages are also the basis of all the tests.

For testing use and improve the tests in /tests folder:
- Can you create a new test for the simple lane test with 3 Rectangular nodes; don't duplicate the dynamic tests from rectangular-nodes.spec.js
Run tests from the root of the project
Please make sure you don't start the html report by default; I don't want to wait on:   Serving HTML report at http://localhost:56794. Press Ctrl+C to quit.

http://localhost:8000/5_nodes/01_rectNode/03_node_lane.html

Some things I notice, can you command on it is that is right?
- the rectangle nodes are not centered in the middle of the container
- the long texts go from the screen on the left
- the too long text is not abreviated with elipses following

Take care, it might be wrong in the specs: implementation-nodes.md


----


Let continue fixing the adapter node display and layout of the inner nodes.

For testing use and improve the tests in /tests folder:
- /tests/adapter-nodes.spec.js
Run tests from the root of the project


I i look to the result in: http://localhost:8000/5_nodes/10_adapter/01_single.html

I notice the following problems:
- the inner container; 
Can you verify if they are covered in the tests?