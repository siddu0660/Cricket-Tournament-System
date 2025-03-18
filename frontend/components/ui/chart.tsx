"use client"

import * as React from "react"
import { TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

interface ChartContainerProps {
  children: React.ReactNode
  config: any
  className?: string
}

const ChartContext = React.createContext({
  config: {},
})

function useChartContext() {
  return React.useContext(ChartContext)
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ children, config, className, ...props }, ref) => {
    return (
      <ChartContext.Provider value={{ config }}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </ChartContext.Provider>
    )
  },
)
ChartContainer.displayName = "ChartContainer"

interface ChartTooltipProps {
  children: React.ReactNode
}

function ChartTooltip({ children }: ChartTooltipProps) {
  return <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
}
ChartTooltip.displayName = "ChartTooltip"

interface ChartTooltipTriggerProps {
  children: React.ReactNode
}

function ChartTooltipTrigger({ children }: ChartTooltipTriggerProps) {
  return <TooltipTrigger asChild>{children}</TooltipTrigger>
}
ChartTooltipTrigger.displayName = "ChartTooltipTrigger"

interface ChartTooltipContentProps {
  children?: React.ReactNode
  hideLabel?: boolean
}

function ChartTooltipContent({ children, hideLabel }: ChartTooltipContentProps) {
  return (
    <TooltipContent className="w-max">
      {children}
      {hideLabel && <span className="hidden"></span>}
    </TooltipContent>
  )
}
ChartTooltipContent.displayName = "ChartTooltipContent"

interface BarChartProps {
  children: React.ReactNode
  data: any[]
  layout: "vertical" | "horizontal"
  margin?: { top?: number; right?: number; bottom?: number; left?: number }
  accessibilityLayer?: any
}

function BarChart({ children, data, layout, margin, accessibilityLayer }: BarChartProps) {
  return <div>{children}</div>
}

interface BarProps {
  dataKey: string
  layout: "vertical" | "horizontal"
  radius?: number | number[]
}

function Bar({ dataKey, layout, radius }: BarProps) {
  return <div></div>
}

interface XAxisProps {
  dataKey: string
  type: "number" | "category"
  hide?: boolean
  tickLine?: boolean
  tickMargin?: number
  axisLine?: boolean
}

function XAxis({ dataKey, type, hide, tickLine, tickMargin, axisLine }: XAxisProps) {
  return <div></div>
}

interface YAxisProps {
  dataKey: string
  type: "number" | "category"
  hide?: boolean
  tickLine?: boolean
  tickMargin?: number
  axisLine?: boolean
}

function YAxis({ dataKey, type, hide, tickLine, tickMargin, axisLine }: YAxisProps) {
  return <div></div>
}

export {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ChartContainer,
  useChartContext,
  ChartTooltip,
  ChartTooltipTrigger,
  ChartTooltipContent,
}

