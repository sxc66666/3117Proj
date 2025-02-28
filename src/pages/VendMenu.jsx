<FoodList
  foods={menuData}
  mode="vendor"
  onEdit={(food) => console.log('编辑菜品', food)}
  onDelete={(foodId) => console.log('删除菜品', foodId)}
/>
