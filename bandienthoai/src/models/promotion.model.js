const Promotion = {
  tableName: 'promotions',
  modelName: 'Promotion',
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
      name: 'code',
      type: 'varchar(50)',
      nullable: 'NO',
      key: 'UNI',
      extra: ''
    },
    {
      name: 'name',
      type: 'varchar(100)',
      nullable: 'NO',
      key: '',
      extra: ''
    },
    {
      name: 'discount_type',
      type: "enum('percent','fixed')",
      nullable: 'NO',
      key: '',
      extra: ''
    },
    {
      name: 'discount_value',
      type: 'decimal(10,2)',
      nullable: 'NO',
      key: '',
      extra: ''
    },
    {
      name: 'min_order_value',
      type: 'decimal(10,2)',
      nullable: 'NO',
      key: '',
      extra: ''
    },
    {
      name: 'start_date',
      type: 'datetime',
      nullable: 'NO',
      key: 'MUL',
      extra: ''
    },
    {
      name: 'end_date',
      type: 'datetime',
      nullable: 'NO',
      key: '',
      extra: ''
    },
    {
      name: 'usage_limit',
      type: 'int',
      nullable: 'YES',
      key: '',
      extra: ''
    },
    {
      name: 'is_active',
      type: 'tinyint(1)',
      nullable: 'YES',
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
  'code',
  'name',
  'discount_type',
  'discount_value',
  'min_order_value',
  'start_date',
  'end_date',
  'usage_limit',
  'is_active',
  'created_at',
  'updated_at'
  ],
  searchable: [
  'code',
  'name'
  ],
  foreignKeys: [
  ]
};

module.exports = Promotion;
