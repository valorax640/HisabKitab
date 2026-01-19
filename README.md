While Registering an App to Firebase give package name same as build.gradle applicationId

Paste this xmlns:tools="http://schemas.android.com/tools" and this package="yourpackagename" in the manifest tag in AndroidManifest.xml

Download the google-services.json file while registering the app in firebase then paste it inside android/app folder

Paste the below code down to the activity tag in AndroidManifest.xml

    <service
      android:name="io.invertase.firebase.messaging.ReactNativeFirebaseMessagingService"
      android:exported="true"
      tools:replace="android:exported">
      <intent-filter>
        <action android:name="com.google.firebase.MESSAGING_EVENT" />
      </intent-filter>
    </service>

    <service
      android:name="io.invertase.firebase.messaging.ReactNativeFirebaseMessagingHeadlessService"
      android:exported="true"
      tools:replace="android:exported" />

    <receiver
      android:name="com.google.firebase.iid.FirebaseInstanceIdReceiver"
      android:exported="true"
      android:permission="com.google.android.c2dm.permission.SEND">
      <intent-filter>
        <action android:name="com.google.android.c2dm.intent.RECEIVE" />
        <category android:name="${applicationId}" />
      </intent-filter>
    </receiver>

Install this packages npm install @react-native-firebase/app @react-native-firebase/messaging

Paste the below inside build.gradle /android under dependencies object

classpath("com.google.gms:google-services:4.3.15")

Paste the below inside build.gradle /android/app under dependencies object

implementation platform('com.google.firebase:firebase-bom:34.0.0')
     implementation('com.google.firebase:firebase-messaging')

apply plugin: 'com.google.gms.google-services' (Paste at the bottom most)

After Next while registering choose Groovy and then Continue


