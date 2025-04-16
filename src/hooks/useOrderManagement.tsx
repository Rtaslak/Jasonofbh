import { useOrdersData } from "./orders/useOrdersData";
import { useOrderFiltering } from "./orders/useOrderFiltering";
import { useOrderSelection } from "./orders/useOrderSelection";
import { useOrderEditing } from "./orders/useOrderEditing";
import { useOrderDeletion } from "./orders/useOrderDeletion";
import { useTagAssignment } from "./orders/useTagAssignment";
import { useMemo, useEffect, useState } from "react";
import { type Order } from "@/types/orders";

export function useOrderManagement() {
  const { ordersList, refreshOrders, updateSingleOrder } = useOrdersData();

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const { searchTerm, statusFilter, setSearchTerm, setStatusFilter, filterOrders } = useOrderFiltering();
  const { selectedOrders, handleSelectOrder, handleSelectAll } = useOrderSelection();
  const { handleToggleEditMode, handleSaveEdit } = useOrderEditing((order: Order) => {
    updateSingleOrder(order.id, order);
  });

  const { handleDeleteOrder, handleDeleteSelected } = useOrderDeletion(
    () => refreshOrders(),
    () => handleSelectAll(false, []),
    refreshOrders
  );

  const { handleAssignTag } = useTagAssignment((orderId: string, updates: Partial<Order>) => {
    updateSingleOrder(orderId, updates);
  });

  // ✅ Sorting state
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // ✅ Filter + sort orders
  const filteredOrders = useMemo(() => {
    if (!Array.isArray(ordersList)) return [];

    const filtered = filterOrders(ordersList);
    const sorted = [...filtered].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortDirection === 'desc' ? bTime - aTime : aTime - bTime;
    });

    return sorted;
  }, [ordersList, filterOrders, searchTerm, statusFilter, sortDirection]);

  const handleSelectAllFiltered = (checked: boolean) => {
    handleSelectAll(checked, filteredOrders.map(order => order.id));
  };

  const handleSelectOrderAdapter = (orderId: string) => {
    const isCurrentlySelected = selectedOrders.has(orderId);
    handleSelectOrder(orderId, !isCurrentlySelected);
  };

  const handleSaveEditAdapter = (orderId: string) => {
    const order = filteredOrders.find(o => o.id === orderId);
    if (order) handleSaveEdit(order);
  };

  const handleDeleteSelectedAdapter = () => {
    handleDeleteSelected(selectedOrders);
  };

  return {
    filteredOrders,
    selectedOrders,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
    handleSelectOrder: handleSelectOrderAdapter,
    handleSelectAll: handleSelectAllFiltered,
    handleToggleEditMode,
    handleSaveEdit: handleSaveEditAdapter,
    handleDeleteOrder,
    handleDeleteSelected: handleDeleteSelectedAdapter,
    handleAssignTag,
    sortDirection,
    setSortDirection // ✅ expose toggle function
  };
}
