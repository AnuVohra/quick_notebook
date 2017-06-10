# quick_notebook
A small quick notebook, HTML,CSS, JS based,  which can be used to take notes.

Its runs locally. It uses HTML,CSS,JS for the front end and Java based NanoHTTPD for back end support.
NanoHTTPD is small HTTP server written (24kB) in java. JAVA was specifically chosen, as JRE is available by defualt on most system 
and hence base code for the final executible can be made realy small.

HOW TO USE THE NOTEBOOK

Windows user: Simply doubly click the notebook.bat file and it should run the server
and launch the default page of Notebook in your default browser. 

Linux user: You will need to run the notebook script you will find in root directoy of the extract.


CODE strcuture explained for the developer.
1. NanoHTTPD is JAVA based a very small HTTP server code. I have modified it a bit to meet the Notebook requirement.
2. Dexie JS for indexed BD handling.
3. Jquery for the JS and DOM modification.
4. HTML and CSS for styling.
