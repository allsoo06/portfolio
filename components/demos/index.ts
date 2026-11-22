import type { ComponentType } from "react";
import AssignmentDemo from "./AssignmentDemo";
import PortfolioDemo from "./PortfolioDemo";
import ShopDemo from "./ShopDemo";
import SubnetTool from "@/app/tools/_components/SubnetTool";
import ChmodTool from "@/app/tools/_components/ChmodTool";
import PasswordTool from "@/app/tools/_components/PasswordTool";
import HashTool from "@/app/tools/_components/HashTool";
import SortTool from "@/app/tools/_components/SortTool";

export const DEMOS: Record<string, ComponentType> = {
  "ai-assignment": AssignmentDemo,
  "shopping-mall": ShopDemo,
  portfolio: PortfolioDemo,
  "tool-subnet": SubnetTool,
  "tool-chmod": ChmodTool,
  "tool-password": PasswordTool,
  "tool-hash": HashTool,
  "tool-sort": SortTool,
};
