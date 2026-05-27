const Role = {
  tableName: 'roles',
  modelName: 'Role',
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
      type: 'varchar(50)',
      nullable: 'NO',
      key: 'UNI',
      extra: ''
    },
    {
      name: 'description',
      type: 'varchar(255)',
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

module.exports = Role;
