import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import RouteLoader from "@/components/route-loader";
import CookieConsent from "@/components/cookie-consent";
import SiteFooter from "@/components/site-footer";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Builder from "@/pages/builder";
import Templates from "@/pages/templates";
import Payment from "@/pages/payment";
import PaymentCallbackPage from "@/pages/payment-callback";
import DownloadPage from "@/pages/download";
import ConditionsPage from "@/pages/conditions";
import ConfidentialitePage from "@/pages/confidentialite";
import AidePage from "@/pages/aide";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/builder" component={Builder} />
      <Route path="/templates" component={Templates} />
      <Route path="/payment/callback" component={PaymentCallbackPage} />
      <Route path="/payment" component={Payment} />
      <Route path="/download" component={DownloadPage} />
      <Route path="/conditions" component={ConditionsPage} />
      <Route path="/confidentialite" component={ConfidentialitePage} />
      <Route path="/aide" component={AidePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <RouteLoader>
            <div className="min-h-screen flex flex-col">
              <div className="flex-1">
                <Router />
              </div>
              <SiteFooter />
            </div>
          </RouteLoader>
          <CookieConsent />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
