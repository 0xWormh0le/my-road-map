package io.myroadmap.android;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.android.volley.AuthFailureError;
import com.android.volley.Cache;
import com.android.volley.Network;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.BasicNetwork;
import com.android.volley.toolbox.DiskBasedCache;
import com.android.volley.toolbox.HurlStack;
import com.android.volley.toolbox.JsonObjectRequest;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class ButtonListener extends BroadcastReceiver {
    private String authToken = null;
    private String competency = null;
    private String student = null;
    private String status = null;

    @Override
    public void onReceive(Context context, Intent intent) {
        authToken = MainActivity.getAuthToken();
        competency = MyFirebaseMessagingService.getCompetency();
        student = MyFirebaseMessagingService.getStudent();

        String action = intent.getAction();

        if (action == "load_URL") {
            context.sendBroadcast(new Intent("DAILY_ASSESSMENT"));
            Intent launch_intent = new Intent(context, MainActivity.class);
            launch_intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
            launch_intent.addCategory(Intent.CATEGORY_LAUNCHER);
            context.startActivity(launch_intent);
        } else {
            switch (action) {
                case "red_button":
                    status = "1";
                    break;
                case "yellow_button":
                    status = "2";
                    break;
                case "green_button":
                    status = "3";
                    break;
            }

        String APIurl = "https://app.myroadmap.io/assessment/";

            if (authToken != null) {
                Log.d("INFO", "authtoken: " + authToken);

                RequestQueue requestQueue;

                // Instantiate the cache
                Cache cache = new DiskBasedCache(context.getCacheDir(), 1024 * 1024); // 1MB cap

                // Set up the network to use HttpURLConnection as the HTTP client.
                Network network = new BasicNetwork(new HurlStack());

                // Instantiate the RequestQueue with the cache and network.
                requestQueue = new RequestQueue(cache, network);

                // Start the queue
                requestQueue.start();

                try {
                    JSONObject params = new JSONObject();

                    params.put("status", status);
                    params.put("competency", competency);
                    params.put("student", student);
                    params.put("user", student);

                    JsonObjectRequest jsonRequest = new JsonObjectRequest(Request.Method.POST, APIurl, params, new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            Log.d("INFO", "response: " + response);
                        }
                    }, new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            Log.d("INFO", "response: " + error);
                        }
                    }) {
                        @Override
                        public Map<String, String> getHeaders() throws AuthFailureError {
                            final Map<String, String> headers = new HashMap<>();
                            headers.put("Authorization", "Token " + authToken);//put your token here
                            headers.put("Content-Type", "application/json");
                            return headers;
                        }
                    };


                    // Add the request to the RequestQueue.
                    requestQueue.add(jsonRequest);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }

        MyFirebaseMessagingService.cancelNotification();
        context.sendBroadcast(new Intent("android.intent.action.CLOSE_SYSTEM_DIALOGS"));
    }
}