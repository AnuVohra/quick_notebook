#Build instruction:
#For more info read this : https://www.mkyong.com/java/how-to-make-an-executable-jar-file/
# copy manifest.txt file in classes folder and run below commands from classes folder

javac -d classes ./*.java
jar -cvfm mini-server.jar ./classes/manifest.txt ./classes/*.class


jar -cvfm mini-server.jar manifest.txt ./*.class
