package com.necen.coinpara.react;

import android.os.Bundle;
import android.os.Build;
import android.view.View;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.zoontek.rnbootsplash.RNBootSplash; // <- add this necessary import
import android.view.WindowManager;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import android.content.Intent; // <--- import
import android.content.res.Configuration; // <--- import

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "CryptoMobileApp";
  }

    @Override
          protected ReactActivityDelegate createReactActivityDelegate() {
            return new ReactActivityDelegate(this, getMainComponentName()) {
              @Override
              protected ReactRootView createRootView() {
               return new RNGestureHandlerEnabledRootView(MainActivity.this);
              }

              @Override
                    protected void loadApp(String appKey) {
                      RNBootSplash.init(MainActivity.this); // <- initialize the splash screen
                      super.loadApp(appKey);
                    }
            };
          }


  @Override
  protected void onCreate(Bundle savedInstanceState) {
//           if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
//      WindowManager.LayoutParams layoutParams = new WindowManager.LayoutParams();
//               layoutParams.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
//               getWindow().setAttributes(layoutParams);
//               getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
// //               getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
//         }

              super.onCreate(savedInstanceState);
//               RNBootSplash.init(MainActivity.this);
//               hideNavigationBar();

  }

  @Override
        public void onConfigurationChanged(Configuration newConfig) {
          super.onConfigurationChanged(newConfig);
          Intent intent = new Intent("onConfigurationChanged");
          intent.putExtra("newConfig", newConfig);
          this.sendBroadcast(intent);
      }

  @Override
      public void onWindowFocusChanged(boolean hasFocus) {
          super.onWindowFocusChanged(hasFocus);
//           if (hasFocus) {
//               hideNavigationBar();
//           }
      }

      private void hideNavigationBar() {
//           getWindow().getDecorView().setSystemUiVisibility(
//               View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
//               | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);

      }
}
