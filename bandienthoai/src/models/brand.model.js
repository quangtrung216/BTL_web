const Brand = {
  tableName: 'brands',
  modelName: 'Brand',
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
      name: 'name',
      type: 'varchar(100)',
      nullable: 'NO',
      key: 'UNI',
      extra: ''
    },
    {
      name: 'country',
      type: 'varchar(100)',
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
  'name',
  'country',
  'created_at',
  'updated_at'
  ],
  searchable: [
  'name',
  'country'
  ],
  foreignKeys: [
  ]
};

module.exports = Brand;
