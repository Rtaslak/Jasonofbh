const express = require('express');
const { Order } = require('../../models');

module.exports = (app) => {
  const router = express.Router();

  // GET /api/orders - Get all orders (sorted by newest first)
  router.get('/', async (req, res) => {
    try {
      const orders = await Order.findAll({
        order: [['createdAt', 'DESC']] // ✅ Sort by newest first
      });
      res.status(200).json(orders);
    } catch (err) {
      console.error('[GET /api/orders]', err);
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  });

  // GET /api/orders/:id - Get order by ID
  router.get('/:id', async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      res.status(200).json(order);
    } catch (err) {
      console.error('[GET /api/orders/:id]', err);
      res.status(500).json({ message: 'Failed to fetch order' });
    }
  });

  // POST /api/orders - Create a new order
  router.post('/', async (req, res) => {
    try {
      const orderData = req.body;

      // Generate ID if not provided
      if (!orderData.id) {
        orderData.id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      const newOrder = await Order.create(orderData);

      // Broadcast to connected clients (if io is available)
      if (req.io) {
        req.io.emit('order_created', newOrder);
      }

      res.status(201).json(newOrder);
    } catch (err) {
      console.error('[POST /api/orders]', err);
      res.status(500).json({ message: 'Failed to create order' });
    }
  });

  // PUT /api/orders/:id - Update an existing order
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await Order.update(req.body, { where: { id }, returning: true });

      if (updated[0] === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const updatedOrder = updated[1][0];

      if (req.io) {
        req.io.emit('order_updated', updatedOrder);
      }

      res.status(200).json(updatedOrder);
    } catch (err) {
      console.error('[PUT /api/orders/:id]', err);
      res.status(500).json({ message: 'Failed to update order' });
    }
  });

  // DELETE /api/orders/:id - Delete an order
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Order.destroy({ where: { id } });

      if (!deleted) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (req.io) {
        req.io.emit('order_deleted', { id });
      }

      res.status(200).json({ message: 'Order deleted', id });
    } catch (err) {
      console.error('[DELETE /api/orders/:id]', err);
      res.status(500).json({ message: 'Failed to delete order' });
    }
  });

  app.use('/api/orders', router);
};
