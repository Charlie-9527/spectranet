import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';

interface CategoryNode {
  id: number;
  name: string;
  description: string;
  parent_id: number | null;
  children: CategoryNode[];
}

interface CategoryTreeProps {
  onSelectCategory?: (categoryId: number | null, categoryName: string) => void;
  selectedCategoryId?: number | null;
}

export default function CategoryTree({ onSelectCategory, selectedCategoryId }: CategoryTreeProps) {
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryTree();
  }, []);

  const loadCategoryTree = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/categories/tree`);
      const data = await response.json();
      setCategoryTree(data);
    } catch (error) {
      console.error('加载分类树失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleNode = (nodeId: number) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleSelectCategory = (categoryId: number | null, categoryName: string) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId, categoryName);
    }
  };

  const renderNode = (node: CategoryNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedCategoryId === node.id;

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center py-2 px-2 hover:bg-gray-100 rounded cursor-pointer transition-colors ${
            isSelected ? 'bg-primary-50 text-primary-700 font-medium' : ''
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => handleSelectCategory(node.id, node.name)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="mr-1 hover:bg-gray-200 rounded p-0.5"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          {!hasChildren && <span className="w-5" />}
          
          {hasChildren ? (
            isExpanded ? (
              <FolderOpen className="w-4 h-4 mr-2 text-yellow-500" />
            ) : (
              <Folder className="w-4 h-4 mr-2 text-yellow-600" />
            )
          ) : (
            <span className="w-4 h-4 mr-2 flex items-center justify-center">
              <span className="w-2 h-2 bg-gray-400 rounded-full" />
            </span>
          )}
          
          <span className="text-sm">{node.name}</span>
          
          {hasChildren && (
            <span className="ml-auto text-xs text-gray-400">
              ({node.children.length})
            </span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        加载中...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center">
          <Folder className="w-4 h-4 mr-2" />
          分类导航
        </h3>
      </div>
      
      <div className="p-2 max-h-[600px] overflow-y-auto">
        <div
          className={`flex items-center py-2 px-2 hover:bg-gray-100 rounded cursor-pointer mb-2 ${
            selectedCategoryId === null ? 'bg-primary-50 text-primary-700 font-medium' : ''
          }`}
          onClick={() => handleSelectCategory(null, '全部分类')}
        >
          <Folder className="w-4 h-4 mr-2 text-blue-500" />
          <span className="text-sm font-medium">全部分类</span>
        </div>
        
        {categoryTree.map((node) => renderNode(node))}
      </div>
    </div>
  );
}
