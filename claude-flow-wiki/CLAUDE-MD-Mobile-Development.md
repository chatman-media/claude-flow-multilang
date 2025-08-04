# 📱 CLAUDE.md Template - Mobile Development

## 🚨 CRITICAL: MOBILE DEVELOPMENT PARALLEL EXECUTION

**MANDATORY RULE**: For mobile development projects, ALL operations MUST be concurrent/parallel:

### 🔴 MOBILE-SPECIFIC CONCURRENT PATTERNS:

1. **Cross-Platform Parallel**: Develop iOS and Android simultaneously
2. **Component Development**: Create multiple screens/components in parallel
3. **Native Module Integration**: Build platform-specific modules concurrently
4. **Testing Automation**: Generate unit, integration, and e2e tests in parallel
5. **Asset Management**: Handle images, fonts, and resources concurrently

### ⚡ MOBILE DEVELOPMENT GOLDEN RULE: "CROSS-PLATFORM PARALLEL EXECUTION"

**✅ CORRECT Mobile Development Pattern:**

```javascript
// Single Message - Cross-Platform Parallel Development
[BatchTool]:
  // iOS Components (Parallel)
  - Write("ios/Components/HomeScreen.swift", iosHomeScreen)
  - Write("ios/Components/ProfileScreen.swift", iosProfileScreen)
  - Write("ios/Components/SettingsScreen.swift", iosSettingsScreen)
  - Write("ios/Components/NavigationController.swift", iosNavigation)
  
  // Android Components (Parallel)
  - Write("android/app/src/main/java/com/app/HomeActivity.kt", androidHome)
  - Write("android/app/src/main/java/com/app/ProfileActivity.kt", androidProfile)
  - Write("android/app/src/main/java/com/app/SettingsActivity.kt", androidSettings)
  - Write("android/app/src/main/java/com/app/MainActivity.kt", androidMain)
  
  // React Native Screens (Parallel)
  - Write("src/screens/HomeScreen.tsx", rnHomeScreen)
  - Write("src/screens/ProfileScreen.tsx", rnProfileScreen)
  - Write("src/screens/SettingsScreen.tsx", rnSettingsScreen)
  - Write("src/navigation/AppNavigator.tsx", rnNavigation)
  
  // Shared Services (Parallel)
  - Write("src/services/AuthService.ts", authService)
  - Write("src/services/ApiService.ts", apiService)
  - Write("src/services/StorageService.ts", storageService)
  
  // Tests (Parallel)
  - Write("__tests__/screens/HomeScreen.test.tsx", homeScreenTests)
  - Write("__tests__/services/AuthService.test.ts", authServiceTests)
  - Write("e2e/app.e2e.js", e2eTests)
```

## 🎯 MOBILE PROJECT CONTEXT

### Project Types
- **📱 Native iOS**: Swift + UIKit/SwiftUI
- **🤖 Native Android**: Kotlin/Java + Jetpack Compose/XML
- **⚛️ React Native**: TypeScript + React Native
- **🔄 Hybrid**: Ionic, Flutter, Xamarin
- **📊 Cross-Platform**: .NET MAUI, Unity

### Architecture Patterns
- **MVVM**: Model-View-ViewModel for data binding
- **Clean Architecture**: Use cases, repositories, data sources
- **Redux/MobX**: State management for complex apps
- **Repository Pattern**: Data layer abstraction
- **Dependency Injection**: Modular, testable architecture

## 🔧 MOBILE DEVELOPMENT PATTERNS

### Native iOS Development Standards

```swift
// iOS Project Structure (Create in parallel)
iOS/
├── App/                    // App configuration
├── Scenes/                 // Screen view controllers (parallel)
│   ├── Home/              // Home scene components
│   ├── Profile/           // Profile scene components
│   └── Settings/          // Settings scene components  
├── Services/              // Business logic services (parallel)
│   ├── AuthService.swift
│   ├── NetworkService.swift
│   └── StorageService.swift
├── Models/                // Data models (parallel)
├── Views/                 // Reusable UI components (parallel)
├── Extensions/            // Swift extensions
├── Resources/             // Images, fonts, strings
└── Tests/                 // Unit and UI tests (parallel)
```

### Native Android Development Standards

```kotlin
// Android Project Structure (Create in parallel)
android/
├── app/src/main/java/com/app/
│   ├── ui/                     // Activities and Fragments (parallel)
│   │   ├── home/              // Home screen components  
│   │   ├── profile/           // Profile screen components
│   │   └── settings/          // Settings screen components
│   ├── data/                  // Data layer (parallel)
│   │   ├── repository/        // Repository implementations
│   │   ├── local/            // Local data sources
│   │   └── remote/           // Remote data sources
│   ├── domain/               // Business logic (parallel)
│   │   ├── usecase/          // Use cases
│   │   └── model/            // Domain models
│   ├── di/                   // Dependency injection
│   └── util/                 // Utility classes
├── app/src/test/             // Unit tests (parallel)
└── app/src/androidTest/      // Integration tests (parallel)
```

### React Native Development Standards

```javascript
// React Native Structure (Create in parallel)
src/
├── screens/               // Screen components (parallel)
│   ├── HomeScreen.tsx
│   ├── ProfileScreen.tsx
│   └── SettingsScreen.tsx
├── components/            // Reusable components (parallel)
│   ├── common/           // Shared components
│   ├── forms/            // Form components
│   └── ui/               // UI elements
├── navigation/           // Navigation setup
├── services/             // API and business logic (parallel)
├── store/                // State management
├── hooks/                // Custom hooks (parallel)
├── utils/                // Utility functions
├── assets/               // Images, fonts, etc.
└── __tests__/            // Tests (parallel)
```

### Concurrent File Creation Pattern

```javascript
// Always create related files in parallel
[BatchTool]:
  // Create screen with navigation, styles, and tests
  - Write("src/screens/ProductScreen.tsx", screenComponent)
  - Write("src/screens/ProductScreen.styles.ts", screenStyles)
  - Write("__tests__/screens/ProductScreen.test.tsx", screenTests)
  - Write("src/navigation/ProductNavigator.tsx", navigation)
  
  // Create corresponding native modules
  - Write("ios/Modules/ProductModule.swift", iosModule)
  - Write("android/app/src/main/java/com/app/ProductModule.kt", androidModule)
  
  // Create shared services
  - Write("src/services/ProductService.ts", productService)
  - Write("__tests__/services/ProductService.test.ts", serviceTests)
```

## 🐝 MOBILE DEVELOPMENT SWARM ORCHESTRATION

### Specialized Agent Roles

```yaml
mobile_architect:
  role: Mobile System Designer
  focus: [app-architecture, navigation-flow, data-modeling]
  concurrent_tasks: [ios-design, android-design, cross-platform-strategy]
  platforms: [ios, android, react-native]

ios_developer:
  role: Native iOS Development
  focus: [swift-development, uikit, swiftui, ios-patterns]
  concurrent_tasks: [multiple-screens, custom-components, animations]
  expertise: [ios-guidelines, app-store-optimization]

android_developer:
  role: Native Android Development  
  focus: [kotlin-development, jetpack-compose, android-patterns]
  concurrent_tasks: [activities, fragments, material-design]
  expertise: [android-guidelines, play-store-optimization]

react_native_developer:
  role: Cross-Platform Development
  focus: [react-native, typescript, bridge-modules]
  concurrent_tasks: [shared-components, platform-specific-code]
  expertise: [performance-optimization, native-modules]

mobile_tester:
  role: Mobile Quality Assurance
  focus: [unit-testing, ui-testing, device-testing]
  concurrent_tasks: [automated-tests, manual-testing, performance-testing]
  tools: [xctest, espresso, detox, appium]

mobile_devops:
  role: Mobile CI/CD & Deployment
  focus: [app-store-deployment, ci-cd-pipelines, code-signing]
  concurrent_tasks: [ios-deployment, android-deployment, beta-distribution]
  expertise: [fastlane, app-center, firebase]
```

### Topology Recommendation

```bash
# For mobile development projects
claude-flow hive init --topology hierarchical --agents 6

# Agent distribution:
# - 1 Mobile Architect (coordinator)
# - 1 iOS Developer (native iOS development)
# - 1 Android Developer (native Android development) 
# - 1 React Native Developer (cross-platform)
# - 1 Mobile Tester (comprehensive testing)
# - 1 Mobile DevOps (deployment and CI/CD)
```

## 🧠 MOBILE DEVELOPMENT MEMORY MANAGEMENT

### Context Storage Patterns

```javascript
// Store mobile-specific project context
mobile_memory_patterns: {
  "mobile/architecture/pattern": "MVVM with Clean Architecture principles",
  "mobile/navigation/strategy": "Stack navigation with tab navigator",
  "mobile/state/management": "Redux Toolkit with RTK Query for API state",
  "mobile/styling/system": "Styled Components with theme provider",
  "mobile/testing/strategy": "Jest + React Native Testing Library + Detox E2E",
  "mobile/deployment/strategy": "Fastlane for automated App Store deployments",
  "mobile/performance/optimization": "Hermes engine + native optimizations",
  "mobile/offline/strategy": "Redux Persist + AsyncStorage with sync",
  "mobile/push/notifications": "Firebase Cloud Messaging with deep linking",
  "mobile/analytics/tracking": "Firebase Analytics + Crashlytics"
}
```

### Platform-Specific Decisions

```javascript
// Track platform-specific architectural decisions
platform_decisions: {
  "ios": {
    "ui_framework": {
      "decision": "SwiftUI",
      "rationale": "Modern declarative UI with better state management",
      "alternatives": ["UIKit", "Hybrid approach"],
      "date": "2024-01-15"
    },
    "state_management": {
      "decision": "Combine + ObservableObject",
      "rationale": "Native reactive programming with SwiftUI",
      "alternatives": ["Redux", "MVC"],
      "date": "2024-01-15"
    }
  },
  "android": {
    "ui_framework": {
      "decision": "Jetpack Compose",
      "rationale": "Modern UI toolkit with better performance",
      "alternatives": ["XML Views", "Hybrid approach"],
      "date": "2024-01-15"
    },
    "architecture": {
      "decision": "MVVM + Hilt",
      "rationale": "Google recommended architecture with DI",
      "alternatives": ["MVP", "Clean Architecture only"],
      "date": "2024-01-15"
    }
  },
  "react_native": {
    "navigation": {
      "decision": "React Navigation v6",
      "rationale": "Most mature navigation solution",
      "alternatives": ["React Native Navigation", "Native navigation"],
      "date": "2024-01-15"
    }
  }
}
```

## 🚀 MOBILE DEPLOYMENT & CI/CD

### Build Process (Parallel Execution)

```yaml
# Cross-platform build pipeline
mobile_build_stages:
  ios_build:
    - "cd ios && xcodebuild -workspace App.xcworkspace -scheme App -configuration Release"
    - "cd ios && xcodebuild test -workspace App.xcworkspace -scheme AppTests"
    - "fastlane ios beta" # TestFlight deployment
  
  android_build:
    - "cd android && ./gradlew assembleRelease"
    - "cd android && ./gradlew testReleaseUnitTest"
    - "fastlane android beta" # Play Console internal testing
  
  react_native_build:
    - "npx react-native bundle --platform ios --dev false"
    - "npx react-native bundle --platform android --dev false"
    - "npm run test:ci"
    
  quality_checks:
    - "npm run lint"
    - "npm run type-check"
    - "npm run test:e2e"
    - "npx detox test --configuration ios.sim.release"
```

### Environment Configuration

```bash
# Development environment
REACT_APP_API_URL=https://dev-api.yourapp.com
REACT_APP_ENVIRONMENT=development
IOS_BUNDLE_ID=com.yourcompany.yourapp.dev
ANDROID_PACKAGE_NAME=com.yourcompany.yourapp.dev
ENABLE_FLIPPER=true

# Staging environment
REACT_APP_API_URL=https://staging-api.yourapp.com
REACT_APP_ENVIRONMENT=staging
IOS_BUNDLE_ID=com.yourcompany.yourapp.staging
ANDROID_PACKAGE_NAME=com.yourcompany.yourapp.staging
ENABLE_FLIPPER=false

# Production environment
REACT_APP_API_URL=https://api.yourapp.com
REACT_APP_ENVIRONMENT=production
IOS_BUNDLE_ID=com.yourcompany.yourapp
ANDROID_PACKAGE_NAME=com.yourcompany.yourapp
ENABLE_FLIPPER=false
```

## 📊 MOBILE MONITORING & ANALYTICS

### App Performance Monitoring

```javascript
// Mobile-specific monitoring setup
mobile_monitoring: {
  performance: {
    ios: "Xcode Instruments + Firebase Performance",
    android: "Android Studio Profiler + Firebase Performance", 
    react_native: "Flipper + React Native Performance"
  },
  
  crash_reporting: {
    ios: "Firebase Crashlytics + native crash reports",
    android: "Firebase Crashlytics + Google Play crashes",
    react_native: "Crashlytics + React Native error boundaries"
  },
  
  user_analytics: {
    events: "Firebase Analytics + custom event tracking",
    user_behavior: "Firebase Analytics + user journey mapping",
    retention: "Firebase Analytics + cohort analysis"
  },
  
  app_store_metrics: {
    ios: "App Store Connect analytics + ASO tools",
    android: "Google Play Console + ASO optimization"
  }
}
```

### Real-User Monitoring

```javascript
// Mobile RUM implementation
mobile_rum: {
  network_monitoring: "Monitor API call performance and failures",
  ui_performance: "Track screen load times and user interactions", 
  device_metrics: "Battery usage, memory consumption, CPU usage",
  user_experience: "App launch time, navigation performance",
  offline_behavior: "Track offline usage patterns and sync issues"
}
```

## 🔒 MOBILE SECURITY & COMPLIANCE

### Security Patterns

```javascript
// Mobile security checklist
mobile_security: {
  data_protection: {
    encryption: "AES-256 for local data, TLS 1.3 for network",
    keychain: "iOS Keychain Services, Android Keystore",
    biometric_auth: "Touch ID, Face ID, Android Biometric API",
    secure_storage: "Encrypted local storage for sensitive data"
  },
  
  network_security: {
    certificate_pinning: "SSL certificate pinning for API calls",
    api_security: "JWT tokens with refresh rotation",
    request_signing: "HMAC signing for critical API requests",
    proxy_detection: "Detect and prevent proxy/debugging tools"
  },
  
  app_protection: {
    code_obfuscation: "ProGuard for Android, Swift obfuscation",
    anti_tampering: "Runtime Application Self-Protection (RASP)",
    jailbreak_detection: "Detect rooted/jailbroken devices",
    debug_detection: "Prevent debugging in production builds"
  },
  
  compliance: {
    data_privacy: "GDPR compliance with user consent management",
    app_store_guidelines: "Follow iOS and Android guidelines",
    accessibility: "WCAG compliance for mobile accessibility",
    children_privacy: "COPPA compliance for apps targeting children"
  }
}
```

### Platform-Specific Security

```swift
// iOS Security Implementation
class SecurityManager {
    static func enableSecureFlag() {
        // Prevent screenshots in app switcher
        NotificationCenter.default.addObserver(
            forName: UIApplication.willResignActiveNotification,
            object: nil, queue: .main) { _ in
            // Add blur view or hide sensitive content
        }
    }
    
    static func detectJailbreak() -> Bool {
        // Check for jailbreak indicators
        let paths = ["/Applications/Cydia.app", "/usr/sbin/sshd", "/etc/apt"]
        return paths.contains { FileManager.default.fileExists(atPath: $0) }
    }
}
```

```kotlin
// Android Security Implementation
class SecurityManager {
    companion object {
        fun enableSecureFlag(activity: Activity) {
            activity.window.setFlags(
                WindowManager.LayoutParams.FLAG_SECURE,
                WindowManager.LayoutParams.FLAG_SECURE
            )
        }
        
        fun detectRootAccess(): Boolean {
            val paths = arrayOf("/system/app/Superuser.apk", "/system/xbin/su")
            return paths.any { File(it).exists() }
        }
    }
}
```

## 🧪 MOBILE TESTING STRATEGY

### Testing Pyramid (Parallel Execution)

```javascript
// Execute all mobile test types in parallel
[BatchTool - Mobile Testing]:
  // Unit Tests (Parallel)
  - Bash("npm run test:unit") // React Native unit tests
  - Bash("cd ios && xcodebuild test -workspace App.xcworkspace -scheme AppTests") // iOS unit tests  
  - Bash("cd android && ./gradlew testDebugUnitTest") // Android unit tests
  
  // Integration Tests (Parallel)
  - Bash("npm run test:integration") // API integration tests
  - Bash("cd ios && xcodebuild test -workspace App.xcworkspace -scheme AppIntegrationTests") // iOS integration
  - Bash("cd android && ./gradlew connectedAndroidTest") // Android integration
  
  // E2E Tests (Parallel where possible)
  - Bash("npx detox test --configuration ios.sim.debug") // iOS E2E
  - Bash("npx detox test --configuration android.emu.debug") // Android E2E
  
  // Performance Tests
  - Bash("npm run test:performance") // React Native performance
  - Bash("cd ios && instruments -t 'Time Profiler' -D profile.trace build/App.app") // iOS profiling
```

### Test Organization

```javascript
// Mobile test file structure (create in parallel)
tests/
├── unit/
│   ├── components/        // Component unit tests (parallel)
│   ├── services/          // Service unit tests (parallel)
│   ├── utils/             // Utility unit tests (parallel)
│   └── hooks/             // Custom hook tests (parallel)
├── integration/
│   ├── api/               // API integration tests
│   ├── navigation/        // Navigation flow tests
│   └── storage/           // Storage integration tests
├── e2e/
│   ├── ios/               // iOS E2E tests
│   ├── android/           // Android E2E tests
│   └── shared/            // Cross-platform E2E tests
├── performance/
│   ├── load_time/         // App launch performance
│   ├── memory/            // Memory usage tests
│   └── battery/           // Battery consumption tests
└── accessibility/
    ├── ios/               // iOS accessibility tests
    └── android/           // Android accessibility tests
```

## 🎨 MOBILE UI/UX PATTERNS

### Component Development (Always Parallel)

```javascript
// Create mobile component ecosystem in parallel
[BatchTool - Mobile Component Creation]:
  // Cross-platform component
  - Write("src/components/Button/Button.tsx", buttonComponent)
  - Write("src/components/Button/Button.styles.ts", buttonStyles)
  - Write("src/components/Button/Button.test.tsx", buttonTests)
  - Write("src/components/Button/Button.stories.tsx", buttonStories)
  
  // Platform-specific implementations
  - Write("ios/Components/CustomButton.swift", iosButton)
  - Write("android/app/src/main/java/com/app/ui/CustomButton.kt", androidButton)
  
  // Variants (parallel)
  - Write("src/components/Button/PrimaryButton.tsx", primaryVariant)
  - Write("src/components/Button/SecondaryButton.tsx", secondaryVariant)
  - Write("src/components/Button/IconButton.tsx", iconVariant)
```

### Responsive Design Patterns

```typescript
// Mobile-first responsive design
interface ScreenDimensions {
  width: number;
  height: number;
  scale: number;
}

const useResponsiveDesign = () => {
  const screenData = Dimensions.get('window');
  
  const breakpoints = {
    small: screenData.width < 375,   // iPhone SE
    medium: screenData.width < 414,  // iPhone 11 Pro Max
    large: screenData.width >= 414,  // Large phones
    tablet: screenData.width >= 768  // iPad
  };
  
  return {
    isSmall: breakpoints.small,
    isMedium: breakpoints.medium,
    isLarge: breakpoints.large,
    isTablet: breakpoints.tablet,
    screenData
  };
};
```

### Platform-Specific Styling

```javascript
// Platform-specific styles (create in parallel)
[BatchTool - Platform Styling]:
  // iOS-specific styles
  - Write("src/styles/ios.styles.ts", `
    import { Platform } from 'react-native';
    
    export const iosStyles = Platform.select({
      ios: {
        shadow: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        navigation: {
          backgroundColor: '#f8f9fa',
          borderBottomWidth: 0.5,
          borderBottomColor: '#c7c7cc',
        }
      },
      default: {}
    });
  `)
  
  // Android-specific styles  
  - Write("src/styles/android.styles.ts", `
    import { Platform } from 'react-native';
    
    export const androidStyles = Platform.select({
      android: {
        elevation: {
          elevation: 5,
        },
        navigation: {
          backgroundColor: '#ffffff',
          elevation: 4,
        },
        ripple: {
          borderless: false,
          color: 'rgba(0, 0, 0, 0.12)',
        }
      },
      default: {}
    });
  `)
```

## 🚀 PERFORMANCE OPTIMIZATION

### Mobile Performance Patterns

```javascript
// Mobile-specific performance optimization
mobile_performance: {
  rendering: {
    list_optimization: "FlatList with getItemLayout and keyExtractor",
    image_optimization: "FastImage with caching and lazy loading",
    navigation_optimization: "Lazy loading screens with React.lazy",
    animation_optimization: "Native animations with react-native-reanimated"
  },
  
  memory_management: {
    image_caching: "Intelligent image cache with size limits",
    data_persistence: "Strategic use of AsyncStorage vs SQLite",
    component_unmounting: "Proper cleanup in useEffect hooks",
    memory_leaks: "Regular memory profiling and leak detection"
  },
  
  network_optimization: {
    api_caching: "Intelligent API response caching",
    request_batching: "Batch multiple API requests",
    offline_support: "Comprehensive offline data handling",
    compression: "Gzip compression for API responses"
  },
  
  native_optimization: {
    ios: "Instruments profiling + Core Data optimization",
    android: "Android Studio Profiler + Room database optimization",
    react_native: "Hermes engine + native module optimization"
  }
}
```

### Battery & Resource Optimization

```javascript
// Mobile resource optimization strategies
resource_optimization: {
  battery_efficiency: {
    background_tasks: "Minimize background processing",
    location_services: "Efficient GPS usage with appropriate accuracy",
    network_calls: "Batch network requests to reduce radio usage",
    screen_brightness: "Respect system dark mode preferences"
  },
  
  storage_optimization: {
    app_size: "Code splitting and dynamic imports",
    asset_optimization: "WebP images and vector graphics",
    cache_management: "Intelligent cache cleanup policies",
    data_compression: "Compress local data storage"
  },
  
  cpu_optimization: {
    main_thread: "Keep main thread free for UI interactions",
    background_processing: "Use background threads for heavy computation",
    algorithm_efficiency: "Optimize data processing algorithms",
    native_modules: "Move heavy computation to native modules"
  }
}
```

## 📱 PLATFORM-SPECIFIC FEATURES

### iOS-Specific Implementation

```swift
// iOS-specific feature implementation
[BatchTool - iOS Features]:
  - Write("ios/Features/SiriShortcuts.swift", `
    import Intents
    import IntentsUI
    
    class SiriShortcutsManager {
        static func donateShortcut(for activity: NSUserActivity) {
            activity.isEligibleForPrediction = true
            activity.isEligibleForSearch = true
            activity.persistentIdentifier = "com.app.shortcut"
            INInteraction(intent: nil, response: nil).donate()
        }
    }
  `)
  
  - Write("ios/Features/HealthKit.swift", `
    import HealthKit
    
    class HealthKitManager {
        private let healthStore = HKHealthStore()
        
        func requestAuthorization() {
            let readTypes: Set<HKObjectType> = [
                HKObjectType.quantityType(forIdentifier: .stepCount)!
            ]
            
            healthStore.requestAuthorization(toShare: nil, read: readTypes) { success, error in
                // Handle authorization result
            }
        }
    }
  `)
```

### Android-Specific Implementation

```kotlin
// Android-specific feature implementation
[BatchTool - Android Features]:
  - Write("android/app/src/main/java/com/app/features/AndroidAutoBackup.kt", `
    import android.app.backup.BackupAgentHelper
    import android.app.backup.SharedPreferencesBackupHelper
    
    class AndroidAutoBackup : BackupAgentHelper() {
        companion object {
            const val PREFS_BACKUP_KEY = "prefs"
        }
        
        override fun onCreate() {
            SharedPreferencesBackupHelper(this, "app_preferences").also {
                addHelper(PREFS_BACKUP_KEY, it)
            }
        }
    }
  `)
  
  - Write("android/app/src/main/java/com/app/features/AdaptiveIcon.kt", `
    import android.app.Activity
    import android.content.pm.ShortcutInfo
    import android.content.pm.ShortcutManager
    import android.graphics.drawable.Icon
    
    class AdaptiveIconManager(private val activity: Activity) {
        fun createDynamicShortcuts() {
            val shortcutManager = activity.getSystemService(ShortcutManager::class.java)
            val shortcut = ShortcutInfo.Builder(activity, "dynamic_shortcut")
                .setShortLabel("Quick Action")
                .setIcon(Icon.createWithResource(activity, R.drawable.ic_shortcut))
                .build()
            
            shortcutManager?.dynamicShortcuts = listOf(shortcut)
        }
    }
  `)
```

## 🌐 CROSS-PLATFORM CONSIDERATIONS

### Code Sharing Strategies

```javascript
// Cross-platform code sharing patterns
code_sharing: {
  business_logic: {
    shared: "Services, utilities, API clients, data models",
    platform_specific: "Platform APIs, native modules, UI components",
    strategy: "Maximum business logic sharing, native UI where needed"
  },
  
  ui_sharing: {
    shared_components: "Generic components with platform adaptations",
    platform_components: "Platform-specific complex UI components",
    styling: "Shared theme with platform-specific overrides"
  },
  
  testing_sharing: {
    shared_tests: "Business logic tests, API integration tests",
    platform_tests: "UI tests, platform-specific feature tests",
    e2e_tests: "Shared test scenarios with platform implementations"
  }
}
```

### Platform Adaptation Patterns

```typescript
// Platform adaptation implementation
[BatchTool - Platform Adaptation]:
  - Write("src/utils/PlatformUtils.ts", `
    import { Platform } from 'react-native';
    
    export const PlatformUtils = {
      isIOS: Platform.OS === 'ios',
      isAndroid: Platform.OS === 'android',
      
      select: <T>(options: { ios?: T; android?: T; default: T }): T => {
        return Platform.select({
          ios: options.ios,
          android: options.android,
          default: options.default
        }) ?? options.default;
      },
      
      getNavigationHeight: (): number => {
        return Platform.select({
          ios: 44, // iOS navigation bar height
          android: 56, // Android action bar height
          default: 50
        });
      }
    };
  `)
  
  - Write("src/components/PlatformButton.tsx", `
    import React from 'react';
    import { Platform, TouchableOpacity, TouchableNativeFeedback, View } from 'react-native';
    
    interface PlatformButtonProps {
      onPress: () => void;
      children: React.ReactNode;
    }
    
    export const PlatformButton: React.FC<PlatformButtonProps> = ({ onPress, children }) => {
      if (Platform.OS === 'android') {
        return (
          <TouchableNativeFeedback onPress={onPress} background={TouchableNativeFeedback.Ripple('#e0e0e0', false)}>
            <View>{children}</View>
          </TouchableNativeFeedback>
        );
      }
      
      return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          {children}
        </TouchableOpacity>
      );
    };
  `)
```

---

## 📚 Related Mobile Development Resources

- **[React Native Patterns](CLAUDE-MD-React-Native)** - React Native specific development
- **[API Development](CLAUDE-MD-API-Development)** - Backend API integration
- **[TypeScript Patterns](CLAUDE-MD-TypeScript)** - Type-safe mobile development
- **[Performance Optimization](CLAUDE-MD-High-Performance)** - Mobile performance optimization

---

**📱 Mobile Development Success**: This template ensures parallel cross-platform development with native performance, comprehensive testing, platform-specific optimizations, and production-ready deployment strategies for both iOS and Android.