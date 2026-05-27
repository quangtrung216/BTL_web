const ImportReceiptItem = {
  tableName: 'import_receipt_items',
  modelName: 'ImportReceiptItem',
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
      name: 'import_receipt_id',
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
      name: 'import_price',
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
  'import_receipt_id',
  'product_id',
  'quantity',
  'import_price',
  'subtotal',
  'created_at',
  'updated_at'
  ],
  searchable: [

  ],
  foreignKeys: [
    {
      column: 'import_receipt_id',
      referencedTable: 'import_receipts',
      referencedColumn: 'id'
    },
    {
      column: 'product_id',
      referencedTable: 'products',
      referencedColumn: 'id'
    },
  ]
};

module.exports = ImportReceiptItem;
