# Claude Code Configuration for React Projects

## 🚨 CRITICAL: REACT PARALLEL EXECUTION PATTERNS

**MANDATORY RULE**: React projects require component-based coordination with concurrent rendering and state management.

## 🚨 CRITICAL: CONCURRENT EXECUTION FOR ALL REACT OPERATIONS

**ABSOLUTE RULE**: ALL React operations MUST be concurrent/parallel in a single message:

### 🔴 MANDATORY CONCURRENT PATTERNS FOR REACT:

1. **Component Creation**: ALWAYS batch ALL component files in ONE message
2. **State Management**: ALWAYS batch ALL Redux/Context setup together
3. **Testing**: ALWAYS run ALL React Testing Library suites in parallel
4. **Build Operations**: ALWAYS batch ALL webpack/Vite operations
5. **Styling**: ALWAYS batch ALL CSS/styled-components together

### ⚡ REACT GOLDEN RULE: "1 MESSAGE = ALL COMPONENT ECOSYSTEM OPERATIONS"

**Examples of CORRECT React concurrent execution:**

```jsx
// ✅ CORRECT: Everything in ONE message
[Single Message]:
  - TodoWrite { todos: [10+ todos with all React tasks] }
  - Task("You are React architect. Coordinate via hooks for component design...")
  - Task("You are State manager. Coordinate via hooks for Redux/Context...")
  - Task("You are UI designer. Coordinate via hooks for styling...")
  - Bash("npx create-react-app my-app --template typescript")
  - Bash("cd my-app && npm install @reduxjs/toolkit react-redux")
  - Bash("cd my-app && npm install --save-dev @testing-library/react @testing-library/jest-dom")
  - Write("src/components/UserCard.tsx", userCardComponent)
  - Write("src/components/UserList.tsx", userListComponent)
  - Write("src/hooks/useUsers.ts", customHook)
  - Write("src/store/userSlice.ts", reduxSlice)
  - Write("src/context/AppContext.tsx", reactContext)
  - Write("src/services/api.ts", apiService)
  - Write("src/tests/UserCard.test.tsx", componentTests)
  - Bash("cd my-app && npm test -- --watchAll=false && npm run build")
```

## 🎯 REACT-SPECIFIC SWARM PATTERNS

### ⚛️ React Setup Coordination

**React Project Setup Strategy:**
```bash
# Always batch React setup
npx create-react-app my-app --template typescript
npm install @reduxjs/toolkit react-redux
npm install react-router-dom @types/react-router-dom
npm install styled-components @types/styled-components
npm start
```

**Parallel Development Setup:**
```jsx
// ✅ CORRECT: All setup in ONE message
[BatchTool]:
  - Bash("npx create-react-app react-app --template typescript")
  - Bash("cd react-app && npm install @reduxjs/toolkit react-redux react-router-dom")
  - Bash("cd react-app && npm install --save-dev @testing-library/react @testing-library/user-event")
  - Write("src/App.tsx", mainAppComponent)
  - Write("src/components/Header.tsx", headerComponent)
  - Write("src/components/Footer.tsx", footerComponent)
  - Write("src/pages/HomePage.tsx", homePageComponent)
  - Write("src/store/index.ts", reduxStore)
  - Write("src/types/index.ts", typeDefinitions)
  - Write("package.json", updatedPackageJson)
  - Bash("cd react-app && npm start")
```

### 🏗️ React Agent Specialization

**Agent Types for React Projects:**

1. **Component Architect Agent** - Component design, composition patterns
2. **State Management Agent** - Redux, Context, Zustand coordination
3. **UI/UX Agent** - Styling, animations, responsive design
4. **Testing Agent** - React Testing Library, Jest, E2E testing
5. **Performance Agent** - React.memo, useMemo, lazy loading
6. **Routing Agent** - React Router, navigation, protected routes

### 📱 Component Architecture Coordination

**Component Structure Setup:**
```jsx
// React component architecture
[BatchTool]:
  - Write("src/components/UI/Button.tsx", reusableButton)
  - Write("src/components/UI/Input.tsx", reusableInput)
  - Write("src/components/UI/Modal.tsx", modalComponent)
  - Write("src/components/Layout/Header.tsx", headerLayout)
  - Write("src/components/Layout/Sidebar.tsx", sidebarLayout)
  - Write("src/components/Features/UserProfile.tsx", featureComponent)
  - Write("src/components/Features/Dashboard.tsx", dashboardComponent)
  - Write("src/types/components.ts", componentTypes)
  - Bash("npm run storybook")
```

### 🔄 State Management Coordination

**Redux Toolkit Setup:**
```jsx
// Redux state management coordination
[BatchTool]:
  - Write("src/store/index.ts", configuredStore)
  - Write("src/store/slices/userSlice.ts", userReduxSlice)
  - Write("src/store/slices/authSlice.ts", authReduxSlice)
  - Write("src/store/slices/uiSlice.ts", uiReduxSlice)
  - Write("src/hooks/useAppDispatch.ts", typedDispatchHook)
  - Write("src/hooks/useAppSelector.ts", typedSelectorHook)
  - Write("src/types/store.ts", storeTypes)
  - Bash("npm test src/store/ && npm run build")
```

## 🧪 REACT TESTING COORDINATION

### ⚡ React Testing Library Strategy

**Component Testing Setup:**
```jsx
// Test coordination pattern
[BatchTool]:
  - Write("src/setupTests.ts", testSetupConfig)
  - Write("src/tests/components/UserCard.test.tsx", componentTests)
  - Write("src/tests/hooks/useUsers.test.ts", hookTests)
  - Write("src/tests/pages/HomePage.test.tsx", pageTests)
  - Write("src/tests/utils/testUtils.tsx", testingUtilities)
  - Write("src/tests/mocks/apiMocks.ts", apiMockHandlers)
  - Write("jest.config.js", jestConfiguration)
  - Bash("npm test -- --coverage --watchAll=false")
  - Bash("npm run test:components")
```

### 🔬 Advanced Testing Patterns

**E2E and Integration Testing:**
```jsx
[BatchTool]:
  - Write("cypress/integration/userFlow.spec.ts", e2eTests)
  - Write("cypress/support/commands.ts", customCommands)
  - Write("src/tests/integration/userFlow.test.tsx", integrationTests)
  - Bash("npm run cy:run && npm run test:integration")
```

## 🎨 REACT STYLING COORDINATION

### 💅 Styled Components Coordination

**Styling System Setup:**
```jsx
// Styled components coordination
[BatchTool]:
  - Write("src/styles/theme.ts", themeDefinition)
  - Write("src/styles/GlobalStyles.ts", globalStyling)
  - Write("src/components/UI/Button.styled.ts", styledButton)
  - Write("src/components/UI/Card.styled.ts", styledCard)
  - Write("src/utils/breakpoints.ts", responsiveBreakpoints)
  - Write("src/types/styled.d.ts", styledComponentTypes)
  - Bash("npm install styled-components @types/styled-components")
  - Bash("npm run build:styles")
```

### 🎯 CSS Modules Coordination

**CSS Modules Setup:**
```jsx
// CSS Modules coordination
[BatchTool]:
  - Write("src/components/UserCard.module.css", componentStyles)
  - Write("src/pages/HomePage.module.css", pageStyles)
  - Write("src/styles/variables.css", cssVariables)
  - Write("src/styles/mixins.css", cssMixins)
  - Write("src/types/css-modules.d.ts", cssModuleTypes)
  - Bash("npm run build:css")
```

## 🚀 REACT PERFORMANCE COORDINATION

### ⚡ Performance Optimization

**Performance Enhancement Batch:**
```jsx
[BatchTool]:
  - Write("src/components/VirtualizedList.tsx", virtualizedComponent)
  - Write("src/hooks/useDebounce.ts", debounceHook)
  - Write("src/hooks/useThrottle.ts", throttleHook)
  - Write("src/utils/lazyLoader.tsx", lazyLoadingUtils)
  - Write("src/components/Suspense/LoadingFallback.tsx", suspenseFallback)
  - Write("webpack.config.js", optimizedWebpackConfig)
  - Bash("npm run analyze && npm run build:prod")
```

### 🔄 Code Splitting Coordination

**Code Splitting Setup:**
```jsx
// Code splitting batch
[BatchTool]:
  - Write("src/pages/LazyHomePage.tsx", lazySuspenseComponent)
  - Write("src/routes/LazyRoutes.tsx", lazyRoutingSetup)
  - Write("src/utils/loadable.tsx", loadableWrapper)
  - Bash("npm run build && npm run analyze-bundle")
```

## 🌐 REACT ROUTING COORDINATION

### 🛣️ React Router Setup

**Routing Configuration:**
```jsx
// React Router coordination
[BatchTool]:
  - Write("src/routes/AppRouter.tsx", mainRouter)
  - Write("src/routes/ProtectedRoute.tsx", authProtectedRoutes)
  - Write("src/routes/PublicRoute.tsx", publicRoutes)
  - Write("src/pages/HomePage.tsx", homePageComponent)
  - Write("src/pages/ProfilePage.tsx", profilePageComponent)
  - Write("src/pages/NotFoundPage.tsx", notFoundComponent)
  - Write("src/hooks/useAuth.ts", authenticationHook)
  - Bash("npm install react-router-dom @types/react-router-dom")
```

## 🔒 REACT SECURITY COORDINATION

### 🛡️ Security Best Practices

**Security Implementation Batch:**
```jsx
[BatchTool]:
  - Write("src/utils/sanitizer.ts", inputSanitization)
  - Write("src/hooks/useAuth.ts", secureAuthHook)
  - Write("src/components/SecureRoute.tsx", routeProtection)
  - Write("src/utils/csrf.ts", csrfProtection)
  - Write("src/services/secureApi.ts", secureApiClient)
  - Write("src/types/security.ts", securityTypes)
  - Bash("npm install dompurify @types/dompurify")
  - Bash("npm audit fix")
```

**React Security Checklist:**
- XSS prevention (DOMPurify)
- CSRF protection
- Secure authentication
- Input validation
- Safe dangerouslySetInnerHTML usage
- Secure API communication
- Environment variable protection
- Content Security Policy

## 📱 REACT MOBILE COORDINATION

### 📲 React Native Integration

**React Native Setup:**
```jsx
// React Native coordination
[BatchTool]:
  - Write("src/components/mobile/MobileHeader.tsx", mobileComponent)
  - Write("src/hooks/useDeviceDetection.ts", deviceDetectionHook)
  - Write("src/styles/responsive.ts", responsiveStyles)
  - Write("src/utils/platform.ts", platformUtilities)
  - Bash("npm install react-native-web")
  - Bash("npm run build:mobile")
```

## 🧰 REACT ECOSYSTEM COORDINATION

### 📚 Popular Libraries Integration

**Third-party Libraries Batch:**
```jsx
[BatchTool]:
  - Write("src/components/forms/FormikForm.tsx", formikIntegration)
  - Write("src/components/charts/ChartComponent.tsx", chartjsIntegration)
  - Write("src/components/animations/AnimatedCard.tsx", framerMotionAnimation)
  - Write("src/utils/dateHelpers.ts", dateFnsUtilities)
  - Bash("npm install formik yup react-chartjs-2 framer-motion date-fns")
  - Bash("npm run build:with-deps")
```

### 🎭 UI Component Libraries

**UI Library Integration:**
```jsx
// UI library coordination
[BatchTool]:
  - Write("src/theme/materialTheme.ts", materialUITheme)
  - Write("src/components/MaterialButton.tsx", materialUIComponent)
  - Write("src/components/AntdTable.tsx", antDesignComponent)
  - Write("src/styles/chakraTheme.ts", chakraUITheme)
  - Bash("npm install @mui/material @emotion/react @emotion/styled")
  - Bash("npm install antd chakra-ui")
```

## 🔄 REACT CI/CD COORDINATION

### 🏗️ GitHub Actions for React

**CI/CD Pipeline Batch:**
```jsx
[BatchTool]:
  - Write(".github/workflows/react.yml", reactCI)
  - Write(".github/workflows/deploy.yml", netlifyDeployment)
  - Write("scripts/build.sh", buildScript)
  - Write("scripts/test.sh", testScript)
  - Write("netlify.toml", netlifyConfig)
  - Bash("npm run build && npm test -- --coverage && npm run lint")
```

### 🚀 Deployment Coordination

**Production Deployment:**
```jsx
[BatchTool]:
  - Write("Dockerfile", reactDockerfile)
  - Write("nginx.conf", nginxConfiguration)
  - Write("docker-compose.yml", dockerComposeReact)
  - Write("scripts/deploy.sh", deploymentScript)
  - Bash("npm run build:prod")
  - Bash("docker build -t react-app:latest .")
  - Bash("docker-compose up -d")
```

## 📊 REACT MONITORING COORDINATION

### 📈 Performance Monitoring

**Monitoring Setup:**
```jsx
[BatchTool]:
  - Write("src/utils/analytics.ts", analyticsIntegration)
  - Write("src/hooks/usePerformance.ts", performanceHook)
  - Write("src/components/ErrorBoundary.tsx", errorBoundaryComponent)
  - Write("src/utils/logger.ts", clientSideLogging)
  - Bash("npm install @sentry/react web-vitals")
  - Bash("npm run build:with-monitoring")
```

## 💡 REACT BEST PRACTICES

### 📝 Component Design Principles

1. **Single Responsibility**: One component, one purpose
2. **Composition over Inheritance**: Prefer composition patterns
3. **Props Interface Design**: Clear, typed prop interfaces
4. **Custom Hooks**: Extract reusable logic
5. **Error Boundaries**: Graceful error handling
6. **Accessibility**: ARIA labels, semantic HTML

### 🎯 Performance Optimization

1. **React.memo**: Prevent unnecessary re-renders
2. **useMemo/useCallback**: Memoize expensive operations
3. **Code Splitting**: Lazy load components
4. **Virtual Scrolling**: Handle large lists efficiently
5. **Bundle Analysis**: Optimize bundle size
6. **Image Optimization**: Lazy loading, WebP format

## 📚 REACT LEARNING RESOURCES

### 🎓 Recommended Topics

1. **Core React**: Components, hooks, state management
2. **Advanced Patterns**: Render props, compound components
3. **State Management**: Redux, Context, Zustand
4. **Testing**: React Testing Library, Jest, Cypress
5. **Performance**: Profiling, optimization techniques
6. **Ecosystem**: Router, forms, UI libraries

### 🔧 Essential Tools

1. **Development**: Create React App, Vite, Next.js
2. **State Management**: Redux Toolkit, Zustand, Jotai
3. **Styling**: Styled Components, Emotion, Tailwind CSS
4. **Testing**: React Testing Library, Jest, Cypress
5. **Build Tools**: Webpack, Vite, Rollup
6. **Dev Tools**: React DevTools, Redux DevTools

### 🌟 Advanced Features

1. **Concurrent Features**: Suspense, Transitions
2. **Server Components**: Next.js App Router
3. **Streaming**: Progressive rendering
4. **Micro-frontends**: Module federation
5. **PWA**: Service workers, offline support
6. **Native Integration**: React Native, Expo

---

**Remember**: React swarms excel with component-based coordination, parallel state management, and concurrent testing. Always batch component creation and leverage React's ecosystem for scalable, maintainable applications.