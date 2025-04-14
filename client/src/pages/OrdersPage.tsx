import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Order } from "@shared/schema";

export default function OrdersPage() {
  // For demo purposes, we'll use a hardcoded user ID
  const userId = 1;
  
  const { data: orders, isLoading, isError } = useQuery<Order[]>({
    queryKey: [`/api/orders/user/${userId}`],
  });
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="font-display font-bold text-3xl text-[#3a5a40] mb-8">My Orders</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="font-display font-bold text-3xl text-[#3a5a40] mb-8">My Orders</h1>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500 mb-4">There was an error loading your orders. Please try again later.</p>
            <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display font-bold text-3xl text-[#3a5a40]">My Orders</h1>
        <Link href="/account">
          <Button variant="outline">Back to Account</Button>
        </Link>
      </div>
      
      {orders && orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map(order => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>Order #{order.id}</CardTitle>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500 mb-4">
                  <p>Order Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                  <p>Total: ${order.total.toFixed(2)}</p>
                </div>
                
                <Link href={`/orders/${order.id}`}>
                  <Button variant="outline" size="sm">View Order Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="mb-4">You haven't placed any orders yet.</p>
            <Link href="/">
              <Button className="bg-[#3a5a40] hover:bg-[#588157]">Start Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
