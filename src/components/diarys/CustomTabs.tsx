import { memo } from "react";

// 自定义 Tabs 组件
const CustomTabs = memo(({ 
    activeKey, 
    onChange, 
    items 
  }: { 
    activeKey: string;
    onChange: (key: string) => void;
    items: { key: string; label: string }[];
  }) => {
    return (
      <div className="custom-tabs">
        {items.map(item => (
          <div
            key={item.key}
            className={`tab-item ${activeKey === item.key ? 'active' : ''}`}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </div>
        ))}
      </div>
    );
  });

export default CustomTabs;