import React from 'react'
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
  } from "@/components/ui/menubar"
  

const Navbar = () => {
  return (
<Menubar>
  <MenubarMenu>
    <MenubarTrigger>
        <a href="/" style={{float: 'right'}}>Home</a>
    </MenubarTrigger>
    <MenubarTrigger>
        <a href="/calc" style={{float: 'right'}}>App</a>
    </MenubarTrigger>
  </MenubarMenu>
</Menubar>

  )
}

export default Navbar