const Promotion = {
  tableName: 'promotions',
  modelName: 'Promotion',
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
      name: 'title',
      type: 'varchar(255)',
      nullable: 'NO',
      key: '',
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
      name: 'discount_percent',
      type: 'decimal(5,2) unsigned',
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
      name: 'status',
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
  'title',
  'description',
  'discount_percent',
  'start_date',
  'end_date',
  'status',
  'created_at',
  'updated_at'
  ],
  searchable: [
  'title',
  'description'
  ],
  foreignKeys: [
  ]
};

module.exports = Promotion;
