
// Department stations with empty order lists
const departmentStations = {
  1: [ // Designers
    { name: "Jed", description: "Creative design lead", orderIds: [] },
    { name: "Designer 1", description: "Custom design specialist", orderIds: [] },
    { name: "Designer 2", description: "Design technician", orderIds: [] },
    { name: "Designer 3", description: "CAD specialist", orderIds: [] },
    { name: "Diamond Couting", description: "Diamond inspection", orderIds: [] },
  ],
  2: [ // Jewelers
    { name: "Roger", description: "Master jeweler", orderIds: [] },
    { name: "Tro", description: "Gold specialist", orderIds: [] },
    { name: "Vicken", description: "Platinum expert", orderIds: [] },
    { name: "Simon", description: "Casting specialist", orderIds: [] },
    { name: "Hratch", description: "Assembly technician", orderIds: [] },
    { name: "Ara", description: "Stone setting prep", orderIds: [] },
    { name: "Hrant", description: "Metals fabrication", orderIds: [] },
    { name: "Engraving", description: "Custom engraving station", orderIds: [] },
  ],
  3: [ // Setters
    { name: "Steve Tch", description: "Technical setting expert", orderIds: [] },
    { name: "Steve", description: "Custom setting specialist", orderIds: [] },
    { name: "Hovig", description: "Fine detail setter", orderIds: [] },
    { name: "Paolo", description: "Precision setting specialist", orderIds: [] },
    { name: "Sako", description: "Diamond setting expert", orderIds: [] },
    { name: "Polisher", description: "Polishing station", orderIds: [] },
  ],
  4: [{ name: "Polisher", description: "Main polishing station", orderIds: [] }], // Polishers
  5: [{ name: "Diamond Counting", description: "Inventory management", orderIds: [] }], // Diamond Counting
  6: [{ name: "Shipping", description: "Order fulfillment", orderIds: [] }], // Shipping
};

module.exports = {
  departmentStations
};
