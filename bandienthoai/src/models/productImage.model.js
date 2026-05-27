const ProductImage = {
  tableName: 'product_images',
  modelName: 'ProductImage',
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
      name: 'product_id',
      type: 'int(10) unsigned',
      nullable: 'NO',
      key: 'MUL',
      extra: ''
    },
    {
      name: 'image_url',
      type: 'varchar(255)',
      nullable: 'NO',
      key: '',
      extra: ''
    },
    {
      name: 'is_primary',
      type: 'tinyint(1)',
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
  'product_id',
  'image_url',
  'is_primary',
  'created_at',
  'updated_at'
  ],
  searchable: [
  'image_url'
  ],
  foreignKeys: [
    {
      column: 'product_id',
      referencedTable: 'products',
      referencedColumn: 'id'
    },
  ]
};

module.exports = ProductImage;
