//src\app\(main)\subaccount\[subaccountId]\funnels\[funnelId]\editor\[funnelPageId]\_components\funnel-editor-sidebar\index.tsx
'use client'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import React from 'react'
import TabList from './tabs'
import SettingsTab from './tabs/settings-tab'
import MediaBucketTab from './tabs/media-bucket-tab'
import ComponentsTab from './tabs/components-tab'
import ThemesTab from './tabs/themes-tab'
import LayersTab from './tabs/layers-tab'
import InventoryTab from './tabs/inventory-tab'

type Props = {
  subaccountId: string
}

const FunnelEditorSidebar = ({ subaccountId }: Props) => {
  const { state } = useEditor()

  return (
    <Sheet
      open={true}
      modal={false}
    >
      <Tabs
        className="w-full "
        defaultValue="Settings"
      >
        <SheetContent
          showX={false}
          side="right"
          className={clsx(
            'mt-[97px] w-16 z-[80] shadow-none  p-0 focus:border-none transition-all overflow-hidden',
            { hidden: state.editor.previewMode }
          )}
        >
          <TabList />
        </SheetContent>
        <SheetContent
          showX={false}
          side="right"
          className={clsx(
            'mt-[97px] w-80 z-[40] shadow-none p-0 mr-16 bg-background h-full transition-all overflow-hidden ',
            { hidden: state.editor.previewMode }
          )}
        >
          <div className="grid gap-4 h-full pb-36 overflow-scroll">
            <TabsContent value="Settings">
              <SheetHeader className="text-left p-6">
                <SheetTitle>Styles</SheetTitle>
                <SheetDescription>
                  Show your creativity! You can customize every component as you
                  like.
                </SheetDescription>
              </SheetHeader>
              <SettingsTab />
            </TabsContent>
            <TabsContent value="Themes">
              <SheetHeader className="text-left p-6">
                <SheetTitle>Themes</SheetTitle>
                <SheetDescription>
                  Use custom themes to kick start your site design. These are completely customisable.
                </SheetDescription>
              </SheetHeader>
              <ThemesTab />
            </TabsContent>
            <TabsContent value="Layers">
              <SheetHeader className="text-left p-6">
                <SheetTitle>Layers</SheetTitle>
                <SheetDescription>
                  View the editor in a tree like structure.
                </SheetDescription>
              </SheetHeader>
              <LayersTab />
            </TabsContent>
            <TabsContent value="Media">
              <MediaBucketTab subaccountId={subaccountId} />
            </TabsContent>
            <TabsContent value="Components">
              <SheetHeader className="text-left p-6 ">
                <SheetTitle>Components</SheetTitle>
                <SheetDescription>
                  You can drag and drop components on the canvas
                </SheetDescription>
              </SheetHeader>
              <ComponentsTab />
            </TabsContent>
            <TabsContent value="Inventory">
              <SheetHeader className="text-left p-6 ">
                <SheetTitle>Inventory</SheetTitle>
                <SheetDescription>
                  Drag and drop products from your inventory into the editor.
                </SheetDescription>
              </SheetHeader>
              <InventoryTab subaccountId={subaccountId}/>
            </TabsContent>
          </div>
        </SheetContent>
      </Tabs>
    </Sheet>
  )
}

export default FunnelEditorSidebar
