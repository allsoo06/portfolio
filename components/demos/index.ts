import type { ComponentType } from "react";
import AssignmentDemo from "./AssignmentDemo";
import PortfolioDemo from "./PortfolioDemo";
import ShopDemo from "./ShopDemo";

// 프로젝트 slug → 체험판 컴포넌트. 새 체험판은 여기에 한 줄 추가.
export const DEMOS: Record<string, ComponentType> = {
  "ai-assignment": AssignmentDemo,
  "shopping-mall": ShopDemo,
  portfolio: PortfolioDemo,
};
