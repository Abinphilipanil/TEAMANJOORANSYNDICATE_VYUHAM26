import React, { useState } from 'react';
import { WorkspaceFolderNode } from '@af03/contracts';
import { Folder, FolderOpen, FileText, ChevronRight, ChevronDown } from 'lucide-react';

interface FolderTreeProps {
  node: WorkspaceFolderNode;
  onSelectNode: (node: WorkspaceFolderNode) => void;
  selectedPath?: string;
  depth?: number;
}

export const FolderTree: React.FC<FolderTreeProps> = ({
  node,
  onSelectNode,
  selectedPath,
  depth = 0,
}) => {
  const [isOpen, setIsOpen] = useState(depth < 2); // Auto-expand top levels
  const isDirectory = node.type === 'directory';
  const isSelected = selectedPath === node.relativePath;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDirectory) {
      setIsOpen(!isOpen);
    }
    onSelectNode(node);
  };

  return (
    <div className="select-none text-sm">
      <div
        onClick={handleClick}
        className={`flex items-center gap-1.5 py-1 px-2 rounded-md cursor-pointer transition-colors ${
          isSelected
            ? 'bg-brand-50 text-brand-700 font-semibold'
            : 'text-slate-700 hover:bg-slate-100'
        }`}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
      >
        {isDirectory ? (
          <span className="text-slate-400 hover:text-slate-600">
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </span>
        ) : (
          <span className="w-3.5" />
        )}

        {isDirectory ? (
          isOpen ? (
            <FolderOpen className="w-4 h-4 text-amber-500 fill-amber-100 flex-shrink-0" />
          ) : (
            <Folder className="w-4 h-4 text-amber-500 fill-amber-100 flex-shrink-0" />
          )
        ) : (
          <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
        )}

        <span className="truncate">{node.name}</span>

        {node.type === 'file' && node.resourceMetadata?.fileSizeBytes !== undefined && (
          <span className="ml-auto text-[10px] text-slate-400 font-mono">
            {node.resourceMetadata.fileSizeBytes} B
          </span>
        )}
      </div>

      {isDirectory && isOpen && node.subfolders && (
        <div>
          {node.subfolders.map((sub) => (
            <FolderTree
              key={sub.relativePath}
              node={sub}
              onSelectNode={onSelectNode}
              selectedPath={selectedPath}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

