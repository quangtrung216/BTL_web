const OrderItem = {
  tableName: 'order_items',
  modelName: 'OrderItem',
  primaryKey: 'id',
  columns: [
    {
      name: 'id',
      type: 'int(10) unsigned',
      nullable: 'NO',
      key: 'PRI',
      extra: 'auto_increment'
    },
    {
      name: 'order_id',
      type: 'int(10) unsigned',
      nullable: 'NO',
      key: 'MUL',
      extra: ''
    },
    {
      name: 'product_id',
      type: 'int(10) unsigned',
      nullable: 'NO',
      key: 'MUL',
      extra: ''
    },
    {
      name: 'quantity',
      type: 'int(10) unsigned',
      nullable: 'NO',
      key: '',
      extra: ''
    },
    {
      name: 'unit_price',
      type: 'decimal(15,2) unsigned',
      nullable: 'NO',
      key: '',
      extra: ''
    },
    {
      name: 'subtotal',
      type: 'decimal(15,2) unsigned',
      nullable: 'NO',
      key: '',
      extra: ''
    },
    {
      name: 'created_at',
      type: 'datetime',
      nullable: 'NO',
      key: '',
      extra: ''
    },
    {
      name: 'updated_at',
      type: 'datetime',
      nullable: 'NO',
      key: '',
      extra: 'on update current_timestamp()'
    },
  ],
  fillable: [
  'order_id',
  'product_id',
  'quantity',
  'unit_price',
  'subtotal',
  'created_at',
  'updated_at'
  ],
  searchable: [

  ],
  foreignKeys: [
    {
      column: 'product_id',
      referencedTable: 'products',
      referencedColumn: 'id'
    },
    {
      column: 'order_id',
      referencedTable: 'orders',
      referencedColumn: 'id'
    },
  ]
};

module.exports = OrderItem;
