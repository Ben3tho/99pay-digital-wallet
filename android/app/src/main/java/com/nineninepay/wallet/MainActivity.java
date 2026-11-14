package com.nineninepay.wallet;

import android.os.Bundle;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

public class MainActivity extends BridgeActivity {
    @CapacitorPlugin(name = "NineNinePaySecurity")
    public static class NineNinePaySecurityPlugin extends Plugin {
        @PluginMethod
        public void setFlagSecure(PluginCall call) {
            boolean enabled = Boolean.TRUE.equals(call.getBoolean("enabled", true));
            if (getActivity() == null) {
                call.reject("Activity unavailable");
                return;
            }
            getActivity().runOnUiThread(() -> {
                if (enabled) {
                    getActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);
                } else {
                    getActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
                }
                JSObject ret = new JSObject();
                ret.put("enabled", enabled);
                call.resolve(ret);
            });
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(NineNinePaySecurityPlugin.class);
        super.onCreate(savedInstanceState);
        // Protect sensitive card details & PIN screens from OS screenshots and screen recordings by default
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_SECURE,
            WindowManager.LayoutParams.FLAG_SECURE
        );
    }
}
