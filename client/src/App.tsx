import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Products from "@/pages/products";
import Inventory from "@/pages/inventory";
import Suppliers from "@/pages/suppliers";
import Customers from "@/pages/customers";
import Orders from "@/pages/orders";
import PurchaseOrders from "@/pages/purchase-orders";
import SalesOrders from "@/pages/sales-orders";
import Reports from "@/pages/reports";
import Users from "@/pages/users";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/products" component={Products} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/suppliers" component={Suppliers} />
      <Route path="/customers" component={Customers} />
      <Route path="/orders" component={Orders} />
      <Route path="/purchase-orders" component={PurchaseOrders} />
      <Route path="/sales-orders" component={SalesOrders} />
      <Route path="/returns" component={() => <div className="p-8 text-white">Returns & Adjustments page coming soon...</div>} />
      <Route path="/payments" component={() => <div className="p-8 text-white">Payment Management page coming soon...</div>} />
      <Route path="/notifications" component={() => <div className="p-8 text-white">Notifications page coming soon...</div>} />
      <Route path="/reports" component={Reports} />
      <Route path="/users" component={Users} />
      <Route path="/settings" component={() => <div className="p-8 text-white">Settings page coming soon...</div>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
