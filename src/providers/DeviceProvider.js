import DeviceInfo from "react-native-device-info";
import { Platform } from "react-native";
import { version } from "../../package.json";

const deviceInfo = async () => {
  return {
    platform: Platform.OS,
    appName: DeviceInfo.getApplicationName(),
    buildId: await DeviceInfo.getBuildId(),
    buildNumber: DeviceInfo.getBuildNumber(),
    bundleId: DeviceInfo.getBundleId(),
    carrier: await DeviceInfo.getCarrier(),
    deviceId: DeviceInfo.getDeviceId(),
    deviceType: DeviceInfo.getDeviceType(),
    deviceName: await DeviceInfo.getDeviceName(),
    freeDiskStorage: await DeviceInfo.getFreeDiskStorage(),
    ip: await DeviceInfo.getIpAddress(),
    installerPackageName: await DeviceInfo.getInstallerPackageName(),
    macAddress: await DeviceInfo.getMacAddress(),
    manufacturer: await DeviceInfo.getManufacturer(),
    model: DeviceInfo.getModel(),
    systemName: DeviceInfo.getSystemName(),
    systemVersion: DeviceInfo.getSystemVersion(),
    totalDiskCapacity: await DeviceInfo.getTotalDiskCapacity(),
    uniqueId: DeviceInfo.getUniqueId(),
    userAgent: await DeviceInfo.getUserAgent(),
    version: DeviceInfo.getVersion(),
    hasNotch: DeviceInfo.hasNotch(),
    isLocationEnabled: await DeviceInfo.isLocationEnabled(),
    isTablet: DeviceInfo.isTablet(),
    appVersion: version,

  };
};

const getDeviceInfo = async () => await deviceInfo();

export default {
  getDeviceInfo,
};
