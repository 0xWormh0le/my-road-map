package io.myroadmap.android;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Color;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Message;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

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
import com.android.volley.toolbox.StringRequest;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.constraintlayout.widget.ConstraintLayout;

public class MainActivity extends Activity {

    private static final String TAG = "MainActivity";
    private static final int RC_GET_TOKEN = 9002;
    public static final int REQUEST_SELECT_FILE = 100;
    private final static int FILECHOOSER_RESULTCODE=1;

    public ValueCallback<Uri> mUploadMessage;
    public ValueCallback<Uri[]> uploadMessage;
    private WebView webView;
    private GoogleSignInClient mGoogleSignInClient;
    private WebView mWebviewPop;
    private ConstraintLayout mConstraintLayout;
    private String mHost = "https://react-app.myroadmap.io/";
    public String FCMToken = null;
    public static String authToken = null;
    private Boolean deviceRegisted = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        FirebaseInstanceId.getInstance().getInstanceId()
            .addOnCompleteListener(new OnCompleteListener<InstanceIdResult>() {
                @Override
                public void onComplete(@NonNull Task<InstanceIdResult> task) {
                if (!task.isSuccessful()) {
                    Log.w(TAG, "getInstanceId failed", task.getException());
                    return;
                }

                // Get new Instance ID token
                FCMToken = task.getResult().getToken();

                // Log and toast
                String msg = getString(R.string.msg_token_fmt, FCMToken);
                Log.d(TAG, msg);
                //Toast.makeText(MainActivity.this, msg, Toast.LENGTH_SHORT).show();
                }
            });

        WebView.setWebContentsDebuggingEnabled(true);
        setContentView(R.layout.activity_main);

        registerReceiver(WebContentReceiver, new IntentFilter("DAILY_ASSESSMENT"));

        mConstraintLayout = findViewById(R.id.constraint_layout);
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);

        webView = findViewById(R.id.webview);
        webView.addJavascriptInterface(new WebAppInterface(this), "Android");
        webView.setWebViewClient(new MyBrowser());
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
        webSettings.setSupportMultipleWindows(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webView.setWebChromeClient(new UriChromeClient());
        webView.setBackgroundColor(Color.TRANSPARENT);
        webView.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);
        Intent intent_o = getIntent();
        String link = intent_o.getStringExtra("link");
        //try another place if that didn't get the link
        if (link == null) {
            Uri appLinkData = intent_o.getData();
            if(appLinkData != null){
                link = appLinkData.getPath();
            }
        }
        String url = mHost;

        String release = android.os.Build.VERSION.RELEASE;
        int sdkVersion = android.os.Build.VERSION.SDK_INT;
        Log.d(TAG, "Android SDK " + sdkVersion + " (" + release + ")");

        if (link != null) {
            url += link;
        }

        if (getIntent().getExtras() != null) {
            for (String key : getIntent().getExtras().keySet()) {
                Object value = getIntent().getExtras().get(key);
                Log.d(TAG, "Key: " + key + " Value: " + value);
            }
        }

        url += "?android_app=1&private_id=" + getString(R.string.private_id);
        Log.d(TAG, "URL: " + url);
        webView.loadUrl(url);
    }

    BroadcastReceiver WebContentReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String url = MyFirebaseMessagingService.getUrl();
            webView.loadUrl(url);
            //context.startActivity(new Intent(context, MainActivity.class));
        }
    };

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == RC_GET_TOKEN) {
            // This task is always completed immediately, there is no need to attach an
            // asynchronous listener.
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
            handleSignInResult(task);
        }
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP)
        {
            if (requestCode == REQUEST_SELECT_FILE)
            {
                if (uploadMessage == null)
                    return;
                uploadMessage.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, data));
                uploadMessage = null;
            }
        }
        else if(requestCode==FILECHOOSER_RESULTCODE)
        {
            if (null == mUploadMessage) return;
            Uri result = data == null || resultCode != RESULT_OK ? null : data.getData();
            mUploadMessage.onReceiveValue(result);
            mUploadMessage = null;
        }
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    private void getIdToken() {
        // Show an account picker to let the user choose a Google account from the device.
        // If the GoogleSignInOptions only asks for IDToken and/or profile and/or email then no
        // consent screen will be shown here.
        Intent signInIntent = mGoogleSignInClient.getSignInIntent();
        startActivityForResult(signInIntent, RC_GET_TOKEN);
    }

    private void handleSignInResult(@NonNull Task<GoogleSignInAccount> completedTask) {
        try {
            GoogleSignInAccount account = completedTask.getResult(ApiException.class);
            String idToken = account.getIdToken();
            webView.loadUrl("javascript:handleAppGoogleSignin('" + idToken + "')");
            // Sign out in case they want to use a different account next time
            mGoogleSignInClient.signOut();
        } catch (ApiException e) {
            Log.d(TAG, e.getMessage());
            e.printStackTrace();
        }
    }

    private class MyBrowser extends WebViewClient {

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            String host = Uri.parse(url).getHost();
            if (mHost.contains(host)) {
                if (mWebviewPop != null) {
                    mWebviewPop.setVisibility(View.GONE);
                    mConstraintLayout.removeView(mWebviewPop);
                    mWebviewPop = null;
                }
                return false;
            }
            if (host.equals("m.facebook.com")) {
                return false;
            }
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            startActivity(intent);
            return true;
        }
//
//        @Override
//        public void onPageStarted(WebView view, String url) {
//            super.onPageStarted(view, url);
//            progressDialog.show();
//        }

        @Override
        public void onPageFinished(WebView view, String url) {
            // First, get the URL that Facebook's login button is actually redirecting you to.
            // It should be something simulator to https://www.facebook.com/dialog/return/arbiter?relation=opener&close=true
//            Log.e("MyRoadmap", "1 onPageFinished. url: " + url);
//            Log.e("MyRoadmap", "2 onPageFinished. url: " + webView.getUrl());
//            String webUrl = webView.getUrl();
//            // Pass it to the LogCat so that you can then use it in the if statement below.
//            Log.d.println(TAG, webUrl);
//
            if (url.startsWith("https://m.facebook.com/v2.12/dialog/oauth")) {
//                // Check whether the current URL is the URL that Facebook's redirecting you to.
//                // If it is - that's it - do what you want to after the logging process has finished.
                return;
            }

            authToken = getCookie(url, "authtoken");

            String APIurl = "https://app.myroadmap.io/device/gcm/";
//            String APIurl = "https://28720f30.ngrok.io/device/gcm/";

            if (authToken != null && FCMToken != null && !deviceRegisted) {
                Log.d(TAG, "authtoken: " + authToken);
                Log.d(TAG, "fcmtoken: " + FCMToken);

                RequestQueue requestQueue;

                // Instantiate the cache
                Cache cache = new DiskBasedCache(getCacheDir(), 1024 * 1024); // 1MB cap

                // Set up the network to use HttpURLConnection as the HTTP client.
                Network network = new BasicNetwork(new HurlStack());

                // Instantiate the RequestQueue with the cache and network.
                requestQueue = new RequestQueue(cache, network);

                // Start the queue
                requestQueue.start();

                try {
                    JSONObject params = new JSONObject();

                    params.put("name", "android");
                    params.put("registration_id", FCMToken);
                    params.put("cloud_message_type", "FCM");
                    params.put("active", "true");

                    JsonObjectRequest jsonRequest = new JsonObjectRequest(Request.Method.POST, APIurl, params, new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            Log.d(TAG, "response: " + response);
                            deviceRegisted = true;
                        }
                        }, new Response.ErrorListener() {
                            @Override
                            public void onErrorResponse(VolleyError error) {
                                Log.d(TAG, "response: " + error);
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

            super.onPageFinished(view, url);
        }

        public String getCookie(String siteName,String cookieName){
            String CookieValue = null;

            CookieManager cookieManager = CookieManager.getInstance();
            String cookies = cookieManager.getCookie(siteName);
            if (cookies != null) {
                String[] temp = cookies.split(";");
                for (String ar1 : temp ){
                    if(ar1.contains(cookieName)){
                        String[] temp1=ar1.split("=");
                        CookieValue = temp1[1];
                        break;
                    }
                }
                return CookieValue;
            } else {
                return null;
            }
        }
    }

    public static String getAuthToken() {
        return authToken;
    }

    class UriChromeClient extends WebChromeClient {

        private MainActivity activity;

        @Override
        public boolean onCreateWindow(WebView view, boolean isDialog,
                                      boolean isUserGesture, Message resultMsg) {
            mWebviewPop = new WebView(MainActivity.this);
            mWebviewPop.setVerticalScrollBarEnabled(false);
            mWebviewPop.setHorizontalScrollBarEnabled(false);
            mWebviewPop.setWebViewClient(new MyBrowser());
            mWebviewPop.getSettings().setJavaScriptEnabled(true);
            mWebviewPop.getSettings().setAllowFileAccess(true);
            mWebviewPop.getSettings().setAllowContentAccess(true);
            mWebviewPop.getSettings().setSavePassword(false);
            mWebviewPop.setLayoutParams(new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT));
            mConstraintLayout.addView(mWebviewPop);
            WebView.WebViewTransport transport = (WebView.WebViewTransport) resultMsg.obj;
            transport.setWebView(mWebviewPop);
            resultMsg.sendToTarget();
            return true;
        }

        @Override
        public void onCloseWindow(WebView window) {
            Log.d("onCloseWindow", "called");
        }

        public void openFileChooser(ValueCallback<Uri> uploadMsg) {

            mUploadMessage = uploadMsg;
            Intent i = new Intent(Intent.ACTION_GET_CONTENT);
            i.addCategory(Intent.CATEGORY_OPENABLE);
            i.setType("image/*");
            MainActivity.this.startActivityForResult(Intent.createChooser(i,"File Chooser"), FILECHOOSER_RESULTCODE);

        }

        @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
        public boolean onShowFileChooser(WebView mWebView, ValueCallback<Uri[]> filePathCallback, WebChromeClient.FileChooserParams fileChooserParams)
        {
            if (uploadMessage != null) {
                uploadMessage.onReceiveValue(null);
                uploadMessage = null;
            }

            uploadMessage = filePathCallback;

            Intent intent = fileChooserParams.createIntent();
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            intent.setType("image/*");
            try
            {
                startActivityForResult(intent, REQUEST_SELECT_FILE);
            } catch (ActivityNotFoundException e)
            {
                uploadMessage = null;
                return false;
            }
            return true;
        }

        // For Android 3.0+
        public void openFileChooser( ValueCallback uploadMsg, String acceptType ) {
            mUploadMessage = uploadMsg;
            Intent i = new Intent(Intent.ACTION_GET_CONTENT);
            i.addCategory(Intent.CATEGORY_OPENABLE);
            i.setType("*/*");
            MainActivity.this.startActivityForResult(
                    Intent.createChooser(i, "File Browser"),
                    FILECHOOSER_RESULTCODE);
        }

        //For Android 4.1
        public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType, String capture){
            mUploadMessage = uploadMsg;
            Intent i = new Intent(Intent.ACTION_GET_CONTENT);
            i.addCategory(Intent.CATEGORY_OPENABLE);
            i.setType("image/*");
            MainActivity.this.startActivityForResult( Intent.createChooser( i, "File Chooser" ), MainActivity.FILECHOOSER_RESULTCODE );

        }
    }

    class WebAppInterface {
        Context mContext;

        WebAppInterface(Context c) {
            mContext = c;
        }

        @JavascriptInterface
        public void googleSignIn(String toast) {
            GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                    .requestIdToken(getString(R.string.server_client_id))
                    .requestEmail()
                    .build();
            mGoogleSignInClient = GoogleSignIn.getClient(MainActivity.this, gso);
            getIdToken();
        }

        @JavascriptInterface
        public void shareText(String text){
            Intent shareIntent = new Intent(Intent.ACTION_SEND);
            shareIntent.setType("text/plain");
            shareIntent.putExtra(android.content.Intent.EXTRA_TEXT,text);
            startActivity(Intent.createChooser(shareIntent,"Share..."));
        }

    }
}
