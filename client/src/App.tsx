import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { lazy, Suspense } from "react";
import Layout from "./components/Layout";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const ArticlesListing = lazy(() => import("./pages/ArticlesListing"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const StartHere = lazy(() => import("./pages/StartHere"));
const About = lazy(() => import("./pages/About"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const TechniqueFinder = lazy(() => import("./pages/TechniqueFinder"));
const ToolsPage = lazy(() => import("./pages/ToolsPage"));
const QuizzesPage = lazy(() => import("./pages/QuizzesPage"));
const AssessmentsPage = lazy(() => import("./pages/AssessmentsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--aurora)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/articles" component={ArticlesListing} />
        <Route path="/article/:slug" component={ArticlePage} />
        <Route path="/category/:slug" component={CategoryPage} />
        <Route path="/start-here" component={StartHere} />
        <Route path="/about" component={About} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/terms" component={TermsOfService} />
        <Route path="/technique-finder" component={TechniqueFinder} />
        <Route path="/tools" component={ToolsPage} />
        <Route path="/quizzes" component={QuizzesPage} />
        <Route path="/assessments" component={AssessmentsPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Layout>
            <Router />
          </Layout>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
