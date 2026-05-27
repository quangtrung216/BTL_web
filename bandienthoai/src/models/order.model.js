const Order = {
  tableName: 'orders',
  modelName: 'Order',
  primaryKey: 'id',
  columns: [
    {
      name: 'id',
      type: 'bigint unsigned',
      nullable: 'NO',
      key: 'PRI',
      extra: 'auto_increment'
    },
    {
      name: 'user_id',
      type: 'bigint unsigned',
      nullable: 'YES',
      key: 'MUL',
      extra: ''
    },
    {
      name: 'promotion_id',
      type: 'bigint unsigned',
      nullable: 'YES',
      key: 'MUL',
      extra: ''
    },
    {
      name: 'order_code',
      type: 'varchar(50)',
      nullable: 'NO',
      key: 'UNI',
      extra: ''
    },
    {
      name: 'order_type',
      type: "enum('dine_in','takeaway','delivery')",
      nullable: 'NO',
      key: '',
      extra: ''
    },
    {
      name: 'status',
      type: "enum('pending','confirmed','preparing','ready','delivering','completed','cancelled')",
      nullable: 'YES',
      key: '',
      extra: ''
    },
    {
      name: 'payment_method',
      type: "enum('cash','bank_transfer','e_wallet')",
      nullable: 'NO',
      key: '',
      extra: ''
    },
    {
      name: 'subtotal',
      type: 'decimal(10,2)',
      nullable: 'NO',
      key: '',
      extra: ''
    },
    {
      name: 'discount_amount',
      type: 'decimal(10,2)',
      nullable: 'NO',
      key: '',
      extra: ''
    },
    {
      name: 'shipping_fee',
      type: 'decimal(10,2)',
      nullable: 'NO',
      key: '',
      extra: ''
    },
    {
      name: 'total_amount',
      type: 'decimal(10,2)',
      nullable: 'NO',
      key: '',
      extra: ''
    },
    {
      name: 'receiver_name',
      type: 'varchar(100)',
      nullable: 'YES',
      key: '',
      extra: ''
    },
    {
      name: 'receiver_phone',
      type: 'varchar(20)',
      nullable: 'YES',
      key: '',
      extra: ''
    },
    {
      name: 'receiver_address',
      type: 'varchar(255)',
      nullable: 'YES',
      key: '',
      extra: ''
    },
    {
      name: 'note',
      type: 'varchar(255)',
      nullable: 'YES',
      key: '',
      extra: ''
    },
    {
      name: 'created_at',
      type: 'timestamp',
      nullable: 'YES',
      key: '',
      extra: ''
    },
    {
      name: 'updated_at',
      type: 'timestamp',
      nullable: 'YES',
      key: '',
      extra: 'on update current_timestamp()'
    }
  ],
  fillable: [
    'user_id',
    'promotion_id',
    'order_code',
    'order_type',
    'status',
    'payment_method',
    'subtotal',
    'discount_amount',
    'shipping_fee',
    'total_amount',
    'receiver_name',
    'receiver_phone',
    'receiver_address',
    'note',
    'created_at',
    'updated_at'
  ],
  searchable: [
    'order_code',
    'receiver_name',
    'receiver_phone',
    'receiver_address',
    'note'
  ],
  foreignKeys: [
    {
      column: 'user_id',
      referencedTable: 'users',
      referencedColumn: 'id'
    },
    {
      column: 'promotion_id',
      referencedTable: 'promotions',
      referencedColumn: 'id'
    }
  ]
};

module.exports = Order;
