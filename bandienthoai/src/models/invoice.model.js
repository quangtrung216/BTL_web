const Invoice = {
  tableName: 'invoices',
  modelName: 'Invoice',
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
      key: 'UNI',
      extra: ''
    },
    {
      name: 'invoice_code',
      type: 'varchar(50)',
      nullable: 'NO',
      key: 'UNI',
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
      name: 'issue_date',
      type: 'datetime',
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
  'invoice_code',
  'created_by',
  'issue_date',
  'notes',
  'created_at',
  'updated_at'
  ],
  searchable: [
  'invoice_code',
  'notes'
  ],
  foreignKeys: [
    {
      column: 'order_id',
      referencedTable: 'orders',
      referencedColumn: 'id'
    },
    {
      column: 'created_by',
      referencedTable: 'users',
      referencedColumn: 'id'
    },
  ]
};

module.exports = Invoice;
