import { Switch, Route } from "@/lib/routing";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/CartContext";

import HomePage from "@/pages/HomePage";
import ProductPage from "@/pages/ProductPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import CheckoutSuccessPage from "@/pages/CheckoutSuccessPage";
import AccountPage from "@/pages/AccountPage";
import OrdersPage from "@/pages/OrdersPage";
import ContactPage from "@/pages/ContactPage";
import SimpleContactPage from "@/pages/SimpleContactPage";
import AdminPage from "@/pages/AdminPage";

import BenefitsPage from "@/pages/BenefitsPage";
import StoryPage from "@/pages/StoryPage";
import HowToUsePage from "@/pages/HowToUsePage";
import ReviewsPage from "@/pages/ReviewsPage";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/product/:slug" component={ProductPage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/checkout/success" component={CheckoutSuccessPage} />
          <Route path="/account" component={AccountPage} />
          <Route path="/orders" component={OrdersPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/contact-simple" component={SimpleContactPage} />
          <Route path="/benefits" component={BenefitsPage} />
          <Route path="/story" component={StoryPage} />
          <Route path="/how-to-use" component={HowToUsePage} />
          <Route path="/reviews" component={ReviewsPage} />
          <Route path="/admin" component={AdminPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router />
        <Toaster />
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
