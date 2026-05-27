const Category = {
  tableName: 'categories',
  modelName: 'Category',
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
      name: 'description',
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
  'name',
  'description',
  'created_at',
  'updated_at'
  ],
  searchable: [
  'name',
  'description'
  ],
  foreignKeys: [
  ]
};

module.exports = Category;
