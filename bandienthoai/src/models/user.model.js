const User = {
  tableName: 'users',
  modelName: 'User',
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
      name: 'full_name',
      type: 'varchar(100)',
      nullable: 'NO',
      key: '',
      extra: ''
    },
    {
      name: 'email',
      type: 'varchar(100)',
      nullable: 'NO',
      key: 'UNI',
      extra: ''
    },
    {
      name: 'phone',
      type: 'varchar(20)',
      nullable: 'YES',
      key: 'UNI',
      extra: ''
    },
    {
      name: 'password_hash',
      type: 'varchar(255)',
      nullable: 'NO',
      key: '',
      extra: ''
    },
    {
      name: 'address',
      type: 'varchar(255)',
      nullable: 'YES',
      key: '',
      extra: ''
    },
    {
      name: 'role_id',
      type: 'int(10) unsigned',
      nullable: 'NO',
      key: 'MUL',
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
  'full_name',
  'email',
  'phone',
  'password_hash',
  'address',
  'role_id',
  'status',
  'created_at',
  'updated_at'
  ],
  searchable: [
  'full_name',
  'email',
  'phone',
  'password_hash',
  'address'
  ],
  foreignKeys: [
    {
      column: 'role_id',
      referencedTable: 'roles',
      referencedColumn: 'id'
    },
  ]
};

module.exports = User;
