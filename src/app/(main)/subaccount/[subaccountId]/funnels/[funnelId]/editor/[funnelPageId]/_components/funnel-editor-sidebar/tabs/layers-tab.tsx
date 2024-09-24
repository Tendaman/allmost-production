"use client"
import { useEditor, EditorElement } from "@/providers/editor/editor-provider";
import { FunnelPage } from "@prisma/client";
import React from "react";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import EditorLayersTree from "./Layers-tab/EditorLayersTree";

interface LayersTabProps {}

const LayersTab: React.FC<LayersTabProps> = () => {
    const { pageDetails, dispatch, state } = useEditor();
    const [elements, setElements] = React.useState<EditorElement[]>(
      (JSON.parse(pageDetails?.content || "[]")[0].content as EditorElement[]) ||
        []
    );

    const handleSelectElement = (element: EditorElement | undefined) => {
      if (element) {
        dispatch({
          type: "CHANGE_CLICKED_ELEMENT",
          payload: {
            elementDetails: element,
          },
        });
      }
    };
  
    React.useEffect(() => {
      if (state.editor.elements.length) {
        setElements(state.editor.elements);
      }
    }, [state.editor.elements]);


  return (
    <div className="min-h-[900px] overflow-auto px-6">
      <EditorLayersTree
        data={elements}
        className="flex-shrink-0"
        onSelectChange={handleSelectElement}
      />
    </div>
  )
}

export default LayersTab
