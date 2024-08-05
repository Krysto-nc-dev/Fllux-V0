'use client'

import { SubAccount } from '@prisma/client'
import React, { useMemo, useState, useEffect } from 'react'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { ChevronsUpDown, Compass, Menu } from 'lucide-react'
import clsx from 'clsx'
import { AspectRatio } from '../ui/aspect-ratio'
import Image from 'next/image'
import { PopoverTrigger, Popover, PopoverContent } from '../ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import Link from 'next/link'

type Props = {
  defaultOpen?: boolean
  subAccounts: SubAccount[]
  sidebarOpt: any[] // Remplacez par AgencySidebarOption[] | SubAccountSidebarOption[] si défini
  sidebarLogo: string
  details: any
  user: any
  id: string
}

const MenuOptions = ({
  defaultOpen,
  subAccounts,
  sidebarLogo,
  sidebarOpt,
  details,
  user,
  id,
}: Props) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const openState = useMemo(() => (defaultOpen ? { open: true } : {}), [defaultOpen])

  if (!isMounted) return null

  return (
    <Sheet modal={false} {...openState}>
      <SheetTrigger
        asChild
        className="absolute left-4 top-4 z-[100] md:hidden flex"
      >
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        showX={!defaultOpen}
        side="left"
        className={clsx(
          "bg-background/80 backdrop-blur-xl fixed top-0 border-r-[1px] p-6",
          {
            "hidden md:inline-block z-0 w-[300px]": defaultOpen,
            'inline-block md:hidden z-[100] w-full': !defaultOpen
          }
        )}
      >
        <div>
          <AspectRatio ratio={16 / 5}>
            <Image
              src={sidebarLogo}
              alt="logo entreprise"
              fill
              className="rounded-md object-contain"
            />
          </AspectRatio>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="w-full my-4 flex items-center justify-between py-8">
                <div className='flex items-center text-left gap-2'>
                  <Compass />
                  <div className='flex flex-col'>
                    {details.name}
                    <span className='text-muted-foreground text-sm'>{details.city}</span>
                  </div>
                </div>
                <div>
                  <ChevronsUpDown size={16} className="text-muted-foreground" />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 h-80 z-[200]">
              <Command className='rounded-lg'>
                <CommandInput placeholder="Rechercher un compte..." />
                <CommandList className='pb-16'>
                  <CommandEmpty>Aucun résultat trouvé</CommandEmpty>
                  {(user?.role === "AGENCY_OWNER" || user?.role === "AGENCY_ADMIN") && user?.Agency && (
                    <CommandGroup heading="Entreprise">
                      <CommandItem 
                        className="!bg-transparent my-2 text-primary border-[1px] border-border p-2 rounded-md hover:bg-muted cursor-pointer transition-all"
                      >
                        {defaultOpen ? (
                          <Link href={`/agency/${user?.Agency.id}`} className="flex gap-4 w-full h-full">
                            <div className='relative w-16'>
                              <Image
                                src={user?.Agency?.agencyLogo}
                                alt="Logo entreprise"
                                fill
                                className='object-contain rounded-md'
                              />
                            </div>
                            <div className='flex flex-col'>
                              <span>{user?.Agency?.name}</span>
                              <span className='text-muted-foreground text-sm'>{user?.Agency?.city}</span>
                            </div>
                          </Link>
                        ) : (
                          <SheetClose asChild>
                            <Link href={`/agency/${user?.Agency.id}`} className="flex gap-4 w-full h-full">
                              <div className='relative w-16'>
                                <Image
                                  src={user?.Agency?.agencyLogo}
                                  alt="Logo entreprise"
                                  fill
                                  className='object-contain rounded-md'
                                />
                              </div>
                              <div className='flex flex-col'>
                                <span>{user?.Agency?.name}</span>
                                <span className='text-muted-foreground text-sm'>{user?.Agency?.city}</span>
                              </div>
                            </Link>
                          </SheetClose>
                        )}
                      </CommandItem>
                    </CommandGroup>
                  )}
                  <CommandGroup heading="Compte">
                    {!!subAccounts ? subAccounts.map((subaccount) => (
                      <CommandItem key={subaccount.id}>
                        {defaultOpen ? (
                          <Link href={`/subaccount/${subaccount.id}`} className="flex gap-4 w-full h-full">
                            <div className='relative w-16'>
                              <Image
                                src={subaccount.subAccountLogo}
                                alt="Logo sous-compte"
                                fill
                                className='object-contain rounded-md'
                              />
                            </div>
                            <div className='flex flex-col'>
                              <span>{subaccount.name}</span>
                              <span className='text-muted-foreground text-sm'>{subaccount.city}</span>
                            </div>
                          </Link>
                        ) : (
                          <SheetClose asChild>
                            <Link href={`/subaccount/${subaccount.id}`} className="flex gap-4 w-full h-full">
                              <div className='relative w-16'>
                                <Image
                                  src={subaccount.subAccountLogo}
                                  alt="Logo sous-compte"
                                  fill
                                  className='object-contain rounded-md'
                                />
                              </div>
                              <div className='flex flex-col'>
                                <span>{subaccount.name}</span>
                                <span className='text-muted-foreground text-sm'>{subaccount.city}</span>
                              </div>
                            </Link>
                          </SheetClose>
                        )}
                      </CommandItem>
                    )) : "Aucun comptes"}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MenuOptions
