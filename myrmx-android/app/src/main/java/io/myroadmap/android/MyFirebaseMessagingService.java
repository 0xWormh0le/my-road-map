package io.myroadmap.android;

/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.util.Log;
import android.widget.RemoteViews;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import androidx.core.app.NotificationCompat;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;

/**
 * NOTE: There can only be one service in each app that receives FCM messages. If multiple
 * are declared in the Manifest then the first one will be chosen.
 *
 * In order to make this Java sample functional, you must remove the following from the Kotlin messaging
 * service in the AndroidManifest.xml:
 *
 * <intent-filter>
 *   <action android:name="com.google.firebase.MESSAGING_EVENT" />
 * </intent-filter>
 */
public class MyFirebaseMessagingService extends FirebaseMessagingService {

    private static final String TAG = "MyFirebaseMsgService";
    private RemoteViews mRemoteViews;
    public static String competency = null;
    public static String student = null;
    public static String user = null;
    public static String status = null;
    public static String url = null;
    private static NotificationManager manager = null;

    /**
     * Called when message is received.
     *
     * @param remoteMessage Object representing the message received from Firebase Cloud Messaging.
     */
    // [START receive_message]
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        // [START_EXCLUDE]
        // There are two types of messages data messages and notification messages. Data messages
        // are handled
        // here in onMessageReceived whether the app is in the foreground or background. Data
        // messages are the type
        // traditionally used with GCM. Notification messages are only received here in
        // onMessageReceived when the app
        // is in the foreground. When the app is in the background an automatically generated
        // notification is displayed.
        // When the user taps on the notification they are returned to the app. Messages
        // containing both notification
        // and data payloads are treated as notification messages. The Firebase console always
        // sends notification
        // messages. For more see: https://firebase.google.com/docs/cloud-messaging/concept-options
        // [END_EXCLUDE]


        super.onMessageReceived(remoteMessage);
        Log.d("msg", "onMessageReceived: " + remoteMessage.getData().get("msg"));
        // Not getting messages here? See why this may be: https://goo.gl/39bRNJ
        Log.d(TAG, "From: " + remoteMessage.getFrom());

        // Check if message contains a data payload.
        if (remoteMessage.getData().size() > 0) {
            Log.d(TAG, "Message data payload: " + remoteMessage.getData());

            competency = remoteMessage.getData().get("competency");
            student = remoteMessage.getData().get("student");
            user = remoteMessage.getData().get("student");
            url = "https://react-app.myroadmap.io/competency/"+competency;

            //this is the intent that is supposed to be called when the
            //button is clicked
            Intent pendingURLIntent = new Intent(this, ButtonListener.class);
            pendingURLIntent.setAction("load_URL");
            pendingURLIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            PendingIntent pendingURLButtonIntent = PendingIntent.getBroadcast(this, 0,
                    pendingURLIntent, PendingIntent.FLAG_UPDATE_CURRENT);
            Intent redButtonIntent = new Intent(this, ButtonListener.class);
            redButtonIntent.setAction("red_button");
            PendingIntent pendingRedButtonIntent = PendingIntent.getBroadcast(this, 0,
                    redButtonIntent, PendingIntent.FLAG_UPDATE_CURRENT);
            Intent yellowButtonIntent = new Intent(this, ButtonListener.class);
            yellowButtonIntent.setAction("yellow_button");
            PendingIntent pendingYellowButtonIntent = PendingIntent.getBroadcast(this, 0,
                    yellowButtonIntent, PendingIntent.FLAG_UPDATE_CURRENT);
            Intent greenButtonIntent = new Intent(this, ButtonListener.class);
            greenButtonIntent.setAction("green_button");
            PendingIntent pendingGreenButtonIntent = PendingIntent.getBroadcast(this, 0,
                    greenButtonIntent, PendingIntent.FLAG_UPDATE_CURRENT);
//
//        PendingIntent redIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_ONE_SHOT);
//        PendingIntent yellowIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_ONE_SHOT);
//        PendingIntent greenIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_ONE_SHOT);

            // notification's layout
            mRemoteViews = new RemoteViews(getPackageName(), R.layout.daily_assessment_large);
            // notification's title
            mRemoteViews.setTextViewText(R.id.notif_title, remoteMessage.getData().get("notif_title"));
            // notification's content
            mRemoteViews.setTextViewText(R.id.notif_description, remoteMessage.getData().get("notif_description"));
            mRemoteViews.setTextViewText(R.id.red_button, remoteMessage.getData().get("red_description"));
            mRemoteViews.setTextViewText(R.id.yellow_button, remoteMessage.getData().get("yellow_description"));
            mRemoteViews.setTextViewText(R.id.green_button, remoteMessage.getData().get("green_description"));

            mRemoteViews.setOnClickPendingIntent(R.id.red_button, pendingRedButtonIntent);
            mRemoteViews.setOnClickPendingIntent(R.id.yellow_button, pendingYellowButtonIntent);
            mRemoteViews.setOnClickPendingIntent(R.id.green_button, pendingGreenButtonIntent);
            mRemoteViews.setOnClickPendingIntent(R.id.notif_title, pendingURLButtonIntent);
            mRemoteViews.setOnClickPendingIntent(R.id.notif_description, pendingURLButtonIntent);

            String channelId = getResources().getString(R.string.default_notification_channel_id);
            NotificationCompat.Builder builder = new  NotificationCompat.Builder(this, channelId)
                    .setSmallIcon(R.mipmap.ic_launcher_notification)
                    .setContentTitle("MyRoadmap Notification")
                    .setContentText(remoteMessage.getData().get("msg"))
                    .setAutoCancel(true)
                    .setContentIntent(pendingURLButtonIntent)
                    .setStyle(new NotificationCompat.DecoratedCustomViewStyle())
                    .setCustomContentView(mRemoteViews);
//                    .setCustomBigContentView(notificationLayoutExpanded)
//                    .setStyle(new NotificationCompat.BigTextStyle().bigText(remoteMessage.getData().get("msg")))
//                    .addAction(R.mipmap.ic_launcher, remoteMessage.getData().get("red_description"),
//                        redIntent)
//                    .addAction(R.mipmap.ic_launcher, remoteMessage.getData().get("yellow_description"),
//                        yellowIntent)
//                    .addAction(R.mipmap.ic_launcher, remoteMessage.getData().get("green_description"),
//                        greenIntent);
            manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                NotificationChannel channel = new NotificationChannel(channelId, "Default channel", NotificationManager.IMPORTANCE_DEFAULT);
                manager.createNotificationChannel(channel);
            }
            manager.notify(0, builder.build());

            if (/* Check if data needs to be processed by long running job */ true) {
                // For long-running tasks (10 seconds or more) use WorkManager.
                scheduleJob();
            } else {
                // Handle message within 10 seconds
                handleNow();
            }

        } else {
            Intent intent = new Intent(this, MainActivity.class);
            PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_ONE_SHOT);

            String channelId = getResources().getString(R.string.default_notification_channel_id);
            NotificationCompat.Builder builder = new  NotificationCompat.Builder(this, channelId)
                    .setSmallIcon(R.mipmap.ic_launcher_notification)
                    .setContentTitle("MyRoadmap Notification")
                    .setContentText(remoteMessage.getNotification().getBody())
                    .setAutoCancel(true)
                    .setContentIntent(pendingIntent)
                    .setStyle(new NotificationCompat.BigTextStyle()
                            .bigText(remoteMessage.getNotification().getBody()));
            manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                NotificationChannel channel = new NotificationChannel(channelId, "Default channel", NotificationManager.IMPORTANCE_DEFAULT);
                manager.createNotificationChannel(channel);
            }
            manager.notify(0, builder.build());
        }

        // Check if message contains a notification payload.
        if (remoteMessage.getNotification() != null) {
            Log.d(TAG, "Message Notification Body: " + remoteMessage.getNotification().getBody());
        }

        // Also if you intend on generating your own notifications as a result of a received FCM
        // message, here is where that should be initiated. See sendNotification method below.
    }
    // [END receive_message]

    // [START on_new_token]

    public static String getCompetency() {
        return competency;
    }
    public static String getStudent() {
        return student;
    }
    public static String getUrl() {
        return url;
    }

    public static void cancelNotification() {
        manager.cancel(0);
    }

    /**
     * Called if InstanceID token is updated. This may occur if the security of
     * the previous token had been compromised. Note that this is called when the InstanceID token
     * is initially generated so this is where you would retrieve the token.
     */
    @Override
    public void onNewToken(String token) {
        Log.d(TAG, "Refreshed token: " + token);

        // If you want to send messages to this application instance or
        // manage this apps subscriptions on the server side, send the
        // Instance ID token to your app server.
        sendRegistrationToServer(token);
    }
    // [END on_new_token]

    /**
     * Schedule async work using WorkManager.
     */
    private void scheduleJob() {
        // [START dispatch_job]
        OneTimeWorkRequest work = new OneTimeWorkRequest.Builder(MyWorker.class)
                .build();
        WorkManager.getInstance().beginWith(work).enqueue();
        // [END dispatch_job]
    }

    /**
     * Handle time allotted to BroadcastReceivers.
     */
    private void handleNow() {
        Log.d(TAG, "Short lived task is done.");
    }

    /**
     * Persist token to third-party servers.
     *
     * Modify this method to associate the user's FCM InstanceID token with any server-side account
     * maintained by your application.
     *
     * @param token The new token.
     */
    private void sendRegistrationToServer(String token) {
        // TODO: Implement this method to send token to your app server.
    }

    /**
     * Create and show a simple notification containing the received FCM message.
     *
     * @param messageBody FCM message body received.
     */
    private void sendNotification(String messageBody) {
        Intent intent = new Intent(this, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0 /* Request code */, intent,
                PendingIntent.FLAG_ONE_SHOT);

        String channelId = getResources().getString(R.string.default_notification_channel_id);
        Uri defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        NotificationCompat.Builder notificationBuilder =
                new NotificationCompat.Builder(this, channelId)
                        .setSmallIcon(R.mipmap.ic_launcher)
                        .setContentTitle(getString(R.string.fcm_message))
                        .setContentText(messageBody)
                        .setAutoCancel(true)
                        .setSound(defaultSoundUri)
                        .setContentIntent(pendingIntent);

        NotificationManager notificationManager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        // Since android Oreo notification channel is needed.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(channelId,
                    "Default channel",
                    NotificationManager.IMPORTANCE_DEFAULT);
            notificationManager.createNotificationChannel(channel);
        }

        notificationManager.notify(0 /* ID of notification */, notificationBuilder.build());
    }
}