# Install Dependencies
```bash
npx react-native init PojectName # Created new react native CLI app
npm install @react-native-firebase/app # Installing react-native-firebase
npm install @react-native-firebase/auth # Installing auth lib
```
# Important
> Add `google-services.json` file in android/app/

> add the google-services plugin as a dependency inside of your `/android/build.gradle` file:
```java
buildscript {
  dependencies {
    // ... other dependencies
    // NOTE: if you are on react-native 0.71 or below, you must not update
    //       the google-services plugin past version 4.3.15 as it requires gradle >= 7.3.0
    classpath 'com.google.gms:google-services:4.4.2'
    // Add me --- /\
  }
}
```

>  execute the plugin by adding the following to your ```/android/app/build.gradle``` file:
```java
apply plugin: 'com.android.application'
apply plugin: 'com.google.gms.google-services' // <- Add this line
```

---

```bash
npx react-native run-android # Must run to link android packages with react-native
```
# Realease Sign key generate
## macOS
On macOS, if you're not sure where your JDK bin folder is, then perform the following command to find it:
`/usr/libexec/java_home`

It will output the directory of the JDK, which will look something like this:

`/Library/Java/JavaVirtualMachines/jdkX.X.X_XXX.jdk/Contents/Home`

Navigate to that directory by using the command cd /your/jdk/path and use the keytool command with sudo permission as shown below.

```bash
sudo keytool -genkey -v -keystore release.keystore -alias changeKeyAlias -keyalg RSA -keysize 2048 -validity 10000
```
> After this you need to enter a password and some details

> Copy the `release.keystore` file to `/ProjectName/android/app/release.keystore`

> Edit File `/ProjectName/android/gradle.properties`:
```java
MYAPP_UPLOAD_STORE_FILE=release.keystore
MYAPP_UPLOAD_KEY_ALIAS=changeKeyAlias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****
```
> Adding signing config to your app's Gradle config to file `/ProjectName/android/app/build.gradle`:

```java
...
android {
    ...
    defaultConfig { ... }
    signingConfigs {
      // add from here
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
      // Till here
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release // update debug to release
        }
    }
}
...
```
> Done your signing
# Build Release your app 
```bash
npx react-native build-android --mode=release
```