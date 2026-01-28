// 容器类型属性

// 主轴对齐方式
export enum MainAxisAlignment {
  Start,   // 靠头/靠左
  End,     // 靠尾/靠右
  Center,  // 居中对齐
  SpaceBetween,  // 两端对齐
}

// 交叉轴对齐方式
export enum CrossAxisAlignment {
  Start,   // 靠顶/靠左
  Center,  // 居中对齐
  End,     // 靠底/靠右
  Stretch  // 拉伸（填满交叉轴）
}

export interface BoxConstraints { 
  minWidth: number; 
  maxWidth: number; 
  minHeight: number; 
  maxHeight: number; 
}

