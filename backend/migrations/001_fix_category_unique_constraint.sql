-- 修复分类唯一性约束
-- 问题：当前 categories.name 是全局唯一的，但应该允许不同父分类下有同名子分类
-- 解决：将唯一性约束改为组合唯一性（name + parent_id）

-- 1. 删除旧的唯一性约束
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_name_key;

-- 2. 添加新的组合唯一性约束
ALTER TABLE categories ADD CONSTRAINT uq_category_name_parent UNIQUE (name, parent_id);

-- 注意：运行此脚本前，请确保当前数据库中没有违反新约束的数据
-- 即：同一 parent_id 下不能有重复的 name
