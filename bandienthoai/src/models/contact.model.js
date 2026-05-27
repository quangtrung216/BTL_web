const Contact = {
  tableName: 'contacts',
  modelName: 'Contact',
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
      key: '',
      extra: ''
    },
    {
      name: 'email',
      type: 'varchar(100)',
      nullable: 'NO',
      key: '',
      extra: ''
    },
    {
      name: 'phone',
      type: 'varchar(20)',
      nullable: 'YES',
      key: '',
      extra: ''
    },
    {
      name: 'subject',
      type: 'varchar(255)',
      nullable: 'YES',
      key: '',
      extra: ''
    },
    {
      name: 'message',
      type: 'text',
      nullable: 'NO',
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
  ],
  fillable: [
  'name',
  'email',
  'phone',
  'subject',
  'message',
  'created_at'
  ],
  searchable: [
  'name',
  'email',
  'phone',
  'subject',
  'message'
  ],
  foreignKeys: [
  ]
};

module.exports = Contact;
