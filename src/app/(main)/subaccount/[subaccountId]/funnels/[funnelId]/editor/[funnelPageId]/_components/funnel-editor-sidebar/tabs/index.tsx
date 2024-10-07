import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ImagesIcon, PaintbrushVertical, PenTool, Plus, ShoppingBagIcon, SquareStackIcon } from 'lucide-react'

type Props = {}

const TabList = (props: Props) => {
  return (
    <TabsList className=" flex items-center flex-col justify-evenly w-full bg-transparent h-fit gap-4 ">
      <TabsTrigger
        value="Settings"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <PenTool />
      </TabsTrigger>
      <TabsTrigger
        value="Themes"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <PaintbrushVertical />
      </TabsTrigger>
      <TabsTrigger
        value="Components"
        className="data-[state=active]:bg-muted w-10 h-10 p-0"
      >
        <Plus />
      </TabsTrigger>

      <TabsTrigger
        value="Layers"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <SquareStackIcon />
      </TabsTrigger>
      <TabsTrigger
        value="Media"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <ImagesIcon />
      </TabsTrigger>
      <TabsTrigger
        value="Inventory"
        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
      >
        <ShoppingBagIcon />
      </TabsTrigger>
    </TabsList>
  )
}

export default TabList
