import { useState, useEffect } from "react";
import PageTransition from "@/components/layout/PageTransition";
import { OrderList } from "@/components/orders/OrderList";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { OrderActions } from "@/components/orders/OrderActions";
import { useOrderManagement } from "@/hooks/useOrderManagement";
import { OrderCardView } from "@/components/orders/OrderCardView";
import { Button } from "@/components/ui/button";
import { ListFilter, LayoutGrid } from "lucide-react";

export default function Orders() {
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  const [isLoading, setIsLoading] = useState(true);
  const { 
    filteredOrders,
    selectedOrders,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
    handleSelectOrder,
    handleSelectAll,
    handleToggleEditMode,
    handleSaveEdit,
    handleDeleteOrder,
    handleDeleteSelected,
    handleAssignTag
  } = useOrderManagement();

  // Enhanced debugging
  useEffect(() => {
    console.log("[Orders Page] Initial render");
    
    // Set loading to false when orders data is available (even if empty)
    if (Array.isArray(filteredOrders)) {
      console.log("[Orders Page] Orders loaded, count:", filteredOrders.length);
      setIsLoading(false);
    }
    
    return () => {
      console.log("[Orders Page] Component unmounting");
    };
  }, [filteredOrders]);

  if (isLoading) {
    console.log("[Orders Page] Rendering loading state");
    return (
      <PageTransition>
        <div className="container py-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-muted-foreground">Loading orders...</div>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Enhanced debug logging to track orders data
  console.log("[Orders Page] Rendering with:", { 
    filteredOrdersCount: filteredOrders.length,
    hasFilteredOrders: filteredOrders.length > 0,
    selectedOrdersCount: Array.isArray(selectedOrders) ? selectedOrders.length : selectedOrders.size,
    searchTerm,
    statusFilter
  });

  return (
    <PageTransition>
      <div className="container py-6">
        <div className="flex flex-col space-y-1.5 mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track your manufacturing orders
          </p>
        </div>
        
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <OrderFilters 
            searchTerm={searchTerm} 
            statusFilter={statusFilter}
            setSearchTerm={setSearchTerm}
            setStatusFilter={setStatusFilter}
          />
          
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <div className="flex items-center gap-2 ml-0 sm:ml-2">
              <Button 
                variant={viewMode === 'list' ? "default" : "outline"} 
                size="icon" 
                onClick={() => setViewMode('list')}
                className="h-8 w-8"
              >
                <ListFilter className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'card' ? "default" : "outline"} 
                size="icon" 
                onClick={() => setViewMode('card')}
                className="h-8 w-8"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
            <OrderActions 
              selectedOrders={selectedOrders}
              onDeleteSelected={handleDeleteSelected}
            />
          </div>
        </div>
      
      {filteredOrders.length === 0 ? (
          <div className="text-center py-10 border rounded-md bg-muted/20">
            <p className="text-lg text-muted-foreground mb-4">No Orders Found</p>
            <p className="max-w-md mx-auto mb-6 text-sm text-muted-foreground">
              There are no orders in the system matching your current filters. 
              Try clearing your filters or create a new order.
            </p>
            <Button onClick={() => window.location.href = '/orders/new'}>
              Create New Order
            </Button>
          </div>
        ) : viewMode === 'list' ? (
          <OrderList 
            orders={filteredOrders}
            selectedOrders={selectedOrders}
            onSelectOrder={handleSelectOrder}
            onSelectAll={handleSelectAll}
            onSaveEdit={handleSaveEdit}
            onDeleteOrder={handleDeleteOrder}
            onToggleEditMode={handleToggleEditMode}
            onDeleteSelected={handleDeleteSelected}
            onAssignTag={handleAssignTag}
          />
        ) : (
          <OrderCardView
            orders={filteredOrders}
            selectedOrders={Array.isArray(selectedOrders) ? selectedOrders : Array.from(selectedOrders)}
            onSelectOrder={handleSelectOrder}
            onDeleteOrder={handleDeleteOrder}
            onAssignTag={handleAssignTag}
          />
        )}
      </div>
    </PageTransition>
  );
}
