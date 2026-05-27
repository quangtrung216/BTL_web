const Cart = {
  tableName: 'carts',
  modelName: 'Cart',
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
      name: 'user_id',
      type: 'int(10) unsigned',
      nullable: 'NO',
      key: 'UNI',
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
  'user_id',
  'created_at',
  'updated_at'
  ],
  searchable: [

  ],
  foreignKeys: [
    {
      column: 'user_id',
      referencedTable: 'users',
      referencedColumn: 'id'
    },
  ]
};

module.exports = Cart;
