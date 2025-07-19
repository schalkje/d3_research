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
- Can you create a new test for the Rectangular node
Run tests from the root of the project

http://localhost:8000/5_nodes/01_rectNode/01_rectangularNode.html

Some things I notice, can you command on it is that is right?
- there is a rect for the zone container shape and one for the border; isn't one rect enough with the right css?
- a rectangulrNode, doesn't need a zone-header
- I expect only a label in the innercontainer; the shape is the shape of the zonde container for a rectangularNode

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