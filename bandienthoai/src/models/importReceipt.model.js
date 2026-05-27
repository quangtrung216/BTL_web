const ImportReceipt = {
  tableName: 'import_receipts',
  modelName: 'ImportReceipt',
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
      name: 'receipt_code',
      type: 'varchar(50)',
      nullable: 'NO',
      key: 'UNI',
      extra: ''
    },
    {
      name: 'supplier_name',
      type: 'varchar(255)',
      nullable: 'NO',
      key: '',
      extra: ''
    },
    {
      name: 'created_by',
      type: 'int(10) unsigned',
      nullable: 'NO',
      key: 'MUL',
      extra: ''
    },
    {
      name: 'total_amount',
      type: 'decimal(15,2) unsigned',
      nullable: 'NO',
      key: '',
      extra: ''
    },
    {
      name: 'notes',
      type: 'text',
      nullable: 'YES',
      key: '',
      extra: ''
    },
    {
      name: 'created_at',
      type: 'datetime',
      nullable: 'NO',
      key: 'MUL',
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
  'receipt_code',
  'supplier_name',
  'created_by',
  'total_amount',
  'notes',
  'created_at',
  'updated_at'
  ],
  searchable: [
  'receipt_code',
  'supplier_name',
  'notes'
  ],
  foreignKeys: [
    {
      column: 'created_by',
      referencedTable: 'users',
      referencedColumn: 'id'
    },
  ]
};

module.exports = ImportReceipt;
