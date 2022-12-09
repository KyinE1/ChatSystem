Static files are held in this directory. 

Using express, the files can sent to the server
using 'app.use(express.static('directory_name'))'.

JavaScript:
	index.js
	start.js

HTML:
	index.html

@note: Although the HTML file should not be held in this directory, I've encountered a bug in resolving the path of the file outside of this directory without ExpressJS considering the relative path malicious. For the time being, I have placed the file within the same directory as the static files.