package com.necen.coinpara.react;

// import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
// import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;


import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import org.reactnative.maskedview.RNCMaskedViewPackage;
import com.marcshilling.idletimer.IdleTimerPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;


import com.facebook.react.bridge.JSIModulePackage; // <- add

import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.reanimated.ReanimatedJSIModulePackage; // <- add
import cl.json.RNSharePackage;
import cl.json.ShareApplication;
import com.intercom.reactnative.IntercomModule; //  <-- Add this line
import com.marcshilling.idletimer.IdleTimerPackage; // <--- This!
import com.reactNativeQuickActions.AppShortcutsPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
//           packages.add(new RNGestureHandlerPackage());
//             new VectorIconsPackage();
//             new ReactVideoPackage();
            new RNSharePackage();
              new IdleTimerPackage();
              new AppShortcutsPackage();
//             new OrientationPackage();
//             new LinearGradientPackage();

          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

 // Add this method here!
        @Override
        protected JSIModulePackage getJSIModulePackage() {

//          new CryptoJSIPackage();
//         new ReanimatedJSIModulePackage();
         return new CryptoJSIPackage();
        }

//         @Override
//         protected JSIModulePackage getJSIModulePackage() {
//           return new ReanimatedJSIModulePackage(); // <- add
//         }

      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    IntercomModule.initialize(this, "android_sdk-c40b0dc72d9597128c17afd7a85a5bf812aa04c9", "tb64dsnj"); // <-- Add this line
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.cryptomobileapp.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
