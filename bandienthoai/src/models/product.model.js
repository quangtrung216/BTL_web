const Product = {
  tableName: 'products',
  modelName: 'Product',
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
      name: 'category_id',
      type: 'int(10) unsigned',
      nullable: 'NO',
      key: 'MUL',
      extra: ''
    },
    {
      name: 'name',
      type: 'varchar(255)',
      nullable: 'NO',
      key: 'MUL',
      extra: ''
    },
    {
      name: 'description',
      type: 'text',
      nullable: 'YES',
      key: '',
      extra: ''
    },
    {
      name: 'base_price',
      type: 'decimal(10,2)',
      nullable: 'NO',
      key: '',
      extra: ''
    },
    {
      name: 'image_url',
      type: 'varchar(255)',
      nullable: 'YES',
      key: '',
      extra: ''
    },
    {
      name: 'stock_quantity',
      type: 'int',
      nullable: 'NO',
      key: '',
      extra: ''
    },
    {
      name: 'status',
      type: "enum('available','out_of_stock','hidden')",
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
  'name',
  'category_id',
  'description',
  'base_price',
  'image_url',
  'stock_quantity',
  'status',
  'created_at',
  'updated_at'
  ],
  searchable: [
  'name',
  'description',
  'image_url'
  ],
  foreignKeys: [
    {
      column: 'category_id',
      referencedTable: 'categories',
      referencedColumn: 'id'
    },
  ]
};

module.exports = Product;
