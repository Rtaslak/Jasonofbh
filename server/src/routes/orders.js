const express = require('express');
const router = express.Router();
const { Order } = require('../../models');
const { v4: uuidv4 } = require('uuid');

// GET /api/orders - Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']]
    });

    const parsedOrders = orders.map(order => {
      const data = order.toJSON();
      if (typeof data.metal === 'string') {
        try {
          data.metal = JSON.parse(data.metal);
        } catch {
          data.metal = null;
        }
      }
      return data;
    });

    res.status(200).json(parsedOrders);
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

    const data = order.toJSON();
    if (typeof data.metal === 'string') {
      try {
        data.metal = JSON.parse(data.metal);
      } catch {
        data.metal = null;
      }
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('[GET /api/orders/:id]', err);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

// POST /api/orders - Create a new order
router.post('/', async (req, res) => {
  try {
    let orderData = req.body;

    // If FormData wrapped payload is used
    if (typeof orderData.orderData === 'string') {
      orderData = JSON.parse(orderData.orderData);
    }

    // Assign UUID as primary key if not already set
    if (!orderData.id) {
      orderData.id = uuidv4();
    }

    // Generate incrementing order number
    const latestOrder = await Order.findOne({ order: [['orderNumber', 'DESC']] });
    orderData.orderNumber = latestOrder ? latestOrder.orderNumber + 1 : 1;

    // Serialize metal field if it's an object
    if (typeof orderData.metal === 'object') {
      orderData.metal = JSON.stringify(orderData.metal);
    }

    const newOrder = await Order.create(orderData);

    if (req.io) {
      req.io.emit('order_created', newOrder);
    }

    res.status(201).json(newOrder);
  } catch (err) {
    console.error('[POST /api/orders]', err);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// PUT /api/orders/:id - Update an order
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = req.body;

    // Handle FormData wrapped payload
    if (typeof updateData.orderData === 'string') {
      updateData = JSON.parse(updateData.orderData);
    }

    if (typeof updateData.metal === 'object') {
      updateData.metal = JSON.stringify(updateData.metal);
    }

    const updated = await Order.update(updateData, {
      where: { id },
      returning: true
    });

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

module.exports = router;
