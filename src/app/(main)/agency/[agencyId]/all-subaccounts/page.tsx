import { AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { getAuthUserDetails } from '@/lib/queries';
import { SubAccount } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

import React from 'react';
import DeleteButton from './_components/delete-bouton';

type Props = {
  params: { agencyId: string };
};

const AllSubAccountsPage: React.FC<Props> = async ({ params }) => {
  const user = await getAuthUserDetails();

  if (!user) return null;

  return (
    <AlertDialog>
      <div className='flex flex-col'>
        <Button>Créer un sous compte</Button>
        <Command className='rounded-lg bg-transparent mt-3'>
          <CommandInput placeholder='rechercher un compte...' />
          <CommandList>
            {/* <CommandEmpty>Aucun résultat trouvé</CommandEmpty> */}
            <CommandGroup heading='Sous-comptes'>
              {user.Agency.SubAccount.length ? (
                user.Agency.SubAccount.map((subAccount: SubAccount) => (
                  <CommandItem  className="h-32 !bg-background my-2 text-primary border-[1px] border-border p-4 rounded-lg hover:!bg-background cursor-pointer transition-all" key={subAccount.id}>
                    <Link href={`/subaccount/${subAccount.id}`} className='flex gap-4 w-full h-full'>
                     <div className="relative w-32 "> 
                        <Image
                         src={subAccount.subAccountLogo}
                         alt="sous compte logo"
                         fill 
                         className = "rounded-md object-contain bg-muted/50 p-4"
                        />
                     </div>
                     <div className="flex flex-col justify-between">
                        <div className='flex flex-col'> {subAccount.name}

                            <span className='text-muted-foreground text-xs'>{subAcount.address}</span>
                        </div>
                     </div>
                    </Link>
                    <AlertDialogTrigger asChild>
                        <Button className="text-red-600 w-20 hover:bg-red-600 hover:text-white" size={'sm'} variant={'destructive'}>
                            Supprimer
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertHeader>
                        <AlertTitle className="text-left">
    Êtes-vous certain de vouloir supprimer ce sous-compte ?
  </AlertTitle>
  <AlertDescription className='text-left'>
    Cette action est irréversible
  </AlertDescription>
                        </AlertHeader>
                        <AlertDialogFooter  className="flex items-center">
                            <AlertDialogCancel className='mb-2' >Annuler</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive hover:bg-destructive">
                                <DeleteButton subaccountId={subaccount.id}/>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                  </CommandItem>
                ))
              ) : (
                <div className="text-muted-foreground text-center p-4 "> Aucun comptes</div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </AlertDialog>
  );
};

export default AllSubAccountsPage;
