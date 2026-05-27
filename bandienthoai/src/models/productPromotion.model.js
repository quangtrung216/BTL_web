const ProductPromotion = {
  tableName: 'product_promotions',
  modelName: 'ProductPromotion',
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
      name: 'product_id',
      type: 'int(10) unsigned',
      nullable: 'NO',
      key: 'MUL',
      extra: ''
    },
    {
      name: 'promotion_id',
      type: 'int(10) unsigned',
      nullable: 'NO',
      key: 'MUL',
      extra: ''
    },
    {
      name: 'created_at',
      type: 'datetime',
      nullable: 'NO',
      key: '',
      extra: ''
    },
  ],
  fillable: [
  'product_id',
  'promotion_id',
  'created_at'
  ],
  searchable: [

  ],
  foreignKeys: [
    {
      column: 'promotion_id',
      referencedTable: 'promotions',
      referencedColumn: 'id'
    },
    {
      column: 'product_id',
      referencedTable: 'products',
      referencedColumn: 'id'
    },
  ]
};

module.exports = ProductPromotion;
