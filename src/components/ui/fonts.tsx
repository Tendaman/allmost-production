'use client'

import { useEditor } from '@/providers/editor/editor-provider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const fonts = [
  { name: 'ABeeZee', value: "'ABeeZee', sans-serif" },
  { name: 'Abril Fatface', value: "'Abril Fatface', display" },
  { name: 'Alfa Slab One', value: "'Alfa Slab One', display" },
  { name: 'Anton', value: "'Anton', sans-serif" },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Arial Black', value: 'Arial Black, sans-serif' },
  { name: 'Bebas Neue', value: "'Bebas Neue', sans-serif" },
  { name: 'Bitter', value: "'Bitter', serif" },
  { name: 'Bookman', value: 'Bookman, serif' },
  { name: 'Cabin', value: "'Cabin', sans-serif" },
  { name: 'Cairo', value: "'Cairo', sans-serif" },
  { name: 'Comic Sans MS', value: 'Comic Sans MS, cursive' },
  { name: 'Cormorant Garamond', value: "'Cormorant Garamond', serif" },
  { name: 'Courier New', value: 'Courier New, monospace' },
  { name: 'Dancing Script', value: "'Dancing Script', cursive" },
  { name: 'Domine', value: "'Domine', serif" },
  { name: 'EB Garamond', value: "'EB Garamond', serif" },
  { name: 'Fira Sans', value: "'Fira Sans', sans-serif" },
  { name: 'Garamond', value: 'Garamond, serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Heebo', value: "'Heebo', sans-serif" },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Inconsolata', value: "'Inconsolata', monospace" },
  { name: 'Indie Flower', value: "'Indie Flower', cursive" },
  { name: 'Inter', value: "'Inter', sans-serif" },
  { name: 'Josefin Sans', value: "'Josefin Sans', sans-serif" },
  { name: 'Jost', value: "'Jost', sans-serif" },
  { name: 'Karla', value: "'Karla', sans-serif" },
  { name: 'Lato', value: "'Lato', sans-serif" },
  { name: 'Libre Baskerville', value: "'Libre Baskerville', serif" },
  { name: 'Lobster', value: "'Lobster', cursive" },
  { name: 'Lora', value: "'Lora', serif" },
  { name: 'Merriweather', value: "'Merriweather', serif" },
  { name: 'Monda', value: "'Monda', sans-serif" },
  { name: 'Montserrat', value: "'Montserrat', sans-serif" },
  { name: 'Mulish', value: "'Mulish', sans-serif" },
  { name: 'Nanum Gothic', value: "'Nanum Gothic', sans-serif" },
  { name: 'Noto Sans', value: "'Noto Sans', sans-serif" },
  { name: 'Nunito', value: "'Nunito', sans-serif" },
  { name: 'Old Standard TT', value: "'Old Standard TT', serif" },
  { name: 'Open Sans', value: "'Open Sans', sans-serif" },
  { name: 'Oswald', value: "'Oswald', sans-serif" },
  { name: 'Overpass', value: "'Overpass', sans-serif" },
  { name: 'Oxygen', value: "'Oxygen', sans-serif" },
  { name: 'Palatino', value: 'Palatino, serif' },
  { name: 'Playfair Display', value: "'Playfair Display', serif" },
  { name: 'Poppins', value: "'Poppins', sans-serif" },
  { name: 'PT Sans', value: "'PT Sans', sans-serif" },
  { name: 'Quicksand', value: "'Quicksand', sans-serif" },
  { name: 'Raleway', value: "'Raleway', sans-serif" },
  { name: 'Roboto', value: "'Roboto', sans-serif" },
  { name: 'Roboto Slab', value: "'Roboto Slab', serif" },
  { name: 'Rubik', value: "'Rubik', sans-serif" },
  { name: 'Source Sans Pro', value: "'Source Sans Pro', sans-serif" },
  { name: 'Space Mono', value: "'Space Mono', monospace" },
  { name: 'Spectral', value: "'Spectral', serif" },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
  { name: 'Ubuntu', value: "'Ubuntu', sans-serif" },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Work Sans', value: "'Work Sans', sans-serif" },
  { name: 'Zilla Slab', value: "'Zilla Slab', serif" }

]

export default function FontSelector() {
  const { state, dispatch } = useEditor()

  const handleFontChange = (font: string) => {
    dispatch({
      type: 'UPDATE_ELEMENT',
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          styles: {
            ...state.editor.selectedElement.styles,
            fontFamily: font,
          },
        },
      },
    })
  }

  return (
    <Select
      onValueChange={handleFontChange}
      value={state.editor.selectedElement.styles.fontFamily}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a font" />
      </SelectTrigger>
      <SelectContent>
        {fonts.map((font) => (
          <SelectItem key={font.value} value={font.value}>
            {font.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}