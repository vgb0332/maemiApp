Gunhee's work
Day-01 : Build structure! (redux, thunk, page, container, drawer, navigator)

How to integrate code-push in react Native
1. first install code-push, appcenter, appcenter-crash, appcenter-analytics as instructed from the official documents
2. link using react-native link
3. Need a secret key from the code-push console
4. Make sure inside app/build.gradle, you include
    compile project(':appcenter')
    compile project(':appcenter-analytics')
    compile project(':appcenter-crashes')

5. some code push commands to remember
- code-push app list
- code-push deployment list Maemi-android
- code-push release-react Maemi-android android
- code-push promote Maemi-android Staging Production 
