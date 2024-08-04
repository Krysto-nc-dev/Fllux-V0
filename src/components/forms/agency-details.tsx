'use client'

import { Agency } from '@prisma/client'
import { useForm } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import { NumberInput } from '@tremor/react'
import { v4 } from 'uuid'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { useToast } from '../ui/use-toast'
import FileUpload from '../global/file-upload'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'
import {
  deleteAgency,
  initUser,
  saveActivityLogsNotification,
  updateAgencyDetails,
  upsertAgency,
} from '@/lib/queries'
import { Button } from '../ui/button'
import Loading from '../global/loading'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import { User } from '@clerk/nextjs/server'

type Props = {
  data?: Partial<Agency>
}

const FormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Le nom de l'agence doit contenir au moins 2 caractères.",
    }),
  companyEmail: z.string().min(1),
  companyPhone: z.string().min(1),
  whiteLabel: z.boolean(),
  address: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  agencyLogo: z.string().min(1),
  // ridet: z.string().min(2).max(6),
  // fiscalYearStart: z.string().min(2),
  // fiscalYearEnd: z.string().min(2),
  // bp: z.string().min(1),
})

const AgencyDetails = ({ data }: Props) => {
  const { toast } = useToast()
  const router = useRouter()
  const [deletingAgency, setDeletingAgency] = useState(false)
  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: data?.name,
      companyEmail: data?.mail,
      companyPhone: data?.companyPhone,
      whiteLabel: data?.whiteLabel || false,
      address: data?.address,
      city: data?.city,
      zipCode: data?.zipCode,
      state: data?.state,
      country: data?.country || 'Nouvelle-Calédonie',
      agencyLogo: data?.agencyLogo,
      // ridet: data?.ridet,
      // fiscalYearStart: data?.fiscalYearStart,
      // fiscalYearEnd: data?.fiscalYearEnd,
      // bp: data?.bp,
    },
  })
  const isLoading = form.formState.isSubmitting

  useEffect(() => {
    if (data) {
      form.reset(data)
    }
  }, [data])


  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      let newUserData;
      let customerId;
  
      if (!data?.id) {
        const bodyData = {
          email: values.companyEmail,
          name: values.name,
          shipping: {
            address: {
              city: values.city,
              country: values.country,
              line1: values.address,
              postal_code: values.zipCode,
              state: values.zipCode,
            },
            name: values.name,
          },
          address: {
            city: values.city,
            country: values.country,
            line1: values.address,
            postal_code: values.zipCode,
            state: values.zipCode,
          },
        };
  
        // Décommentez et ajustez si nécessaire
        // const customerResponse = await fetch('/api/stripe/create-customer', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(bodyData),
        // });
        // const customerData: { customerId: string } = await customerResponse.json();
        // customerId = customerData.customerId;
      }
  
      newUserData = await initUser({ role: 'AGENCY_OWNER' });
  
      const response = await upsertAgency({
        id: data?.id ? data.id : v4(),
        address: values.address,
        // bp: values.bp,
        // ridet: values.ridet,
        // fiscalYearStart: values.fiscalYearStart,
        // fiscalYearEnd: values.fiscalYearEnd,
        agencyLogo: values.agencyLogo,
        city: values.city,
        companyPhone: values.companyPhone,
        country: values.country,
        name: values.name,
        state: values.state,
        whiteLabel: values.whiteLabel,
        zipCode: values.zipCode,
        createdAt: new Date(),
        updatedAt: new Date(),
        companyEmail: values.companyEmail,
        connectAccountId: '', // Remplissez si nécessaire
        goal: 5, // Ajustez si nécessaire
      });
  
      toast({
        title: 'Agence créée avec succès',
      });
  
      if (data?.id || response) {
        return router.refresh();
      }
      if(reponse) {
        return router.refresh()
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'Oups!',
        description: 'Impossible de créer votre agence',
      });
    }
  };

  const handleDeleteAgency = async () => {
    if (!data?.id) return
    setDeletingAgency(true)

    //WIP discontinue the subsciption
    try {
      const response = await deleteAgency(data.id)
      toast({
        title: 'Entreprise supprimée',
        description: 'Votre Entreprise et tous les sous-comptes ont été supprimés',
      })
      router.refresh()
    } catch (error) {
      console.log(error)
      toast({
        variant: 'destructive',
        title: 'Oups!',
        description: 'Impossible de supprimer votre entreprise',
      })
    }
    setDeletingAgency(false)
  }

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Informations sur votre entreprise</CardTitle>
          <CardDescription>
            Créons votre profile d'entreprise. Vous pourrez modifier ces
            paramètres plus tard depuis l'onglet des paramètres de l'entreprise.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                disabled={isLoading}
                control={form.control}
                name="agencyLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo de l'entreprise</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndpoint="agencyLogo"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Nom de l'entreprise'</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Le nom de votre entreprise"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyEmail"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Email de l'entreprise</FormLabel>
                      <FormControl>
                        <Input readOnly placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="companyPhone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        Numéro de téléphone de l'entreprise'
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Téléphone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                disabled={isLoading}
                control={form.control}
                name="whiteLabel"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border gap-4 p-4">
                    <div>
                      <FormLabel>Entreprise en marque blanche</FormLabel>
                      <FormDescription>
                        Activer le mode marque blanche affichera par défaut le
                        logo de votre entreprise à tous les sous-comptes. Vous
                        pouvez remplacer cette fonctionnalité à travers les
                        sous-comptes.
                      </FormDescription>
                    </div>

                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input placeholder="123 rue..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <Input placeholder="Ville" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Province</FormLabel>
                      <FormControl>
                        <Input placeholder="Province" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Code postal</FormLabel>
                      <FormControl>
                        <Input placeholder="Code postal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Pays</FormLabel>
                      <FormControl>
                        <Input placeholder="Pays" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              
              </div>
              {data?.id && (
                <div className="flex flex-col gap-2">
                  <FormLabel>Créer un objectif pour votre entrprise</FormLabel>
                  <FormDescription>
                    ✨ Créez un objectif pour votre entreprise. À mesure que
                    votre entreprise se développe, vos objectifs augmentent
                    également, alors n'oubliez pas de mettre la barre plus haut
                    !
                  </FormDescription>
                  <NumberInput
                    defaultValue={data?.goal}
                    onValueChange={async (val) => {
                      if (!data?.id) return
                      await updateAgencyDetails(data.id, { goal: val })
                      await saveActivityLogsNotification({
                        agencyId: data.id,
                        description: `Mise à jour de l'objectif de l'agence à | ${val} Sous-comptes`,
                        subaccountId: undefined,
                      })
                      router.refresh()
                    }}
                    min={1}
                    className="bg-background !border !border-input"
                    placeholder="Objectif de sous-comptes"
                  />
                </div>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loading />
                ) : (
                  "Enregistrer les informations de l'agence"
                )}
              </Button>
            </form>
          </Form>
          {data?.id && (
            <div className="flex flex-row items-center justify-between flex-col rounded-lg border border-destructive gap-4 p-4 mt-4">
              <div>
                <div>Zone de danger</div>
              </div>
              <div className="text-muted-foreground text-center">
                Supprimer votre entreprise ne peut pas être annulé. Cela supprimera
                également tous les sous-comptes et toutes les données relatives
                à vos sous-comptes. Les sous-comptes n'auront plus accès aux
                entonnoirs, contacts, etc.
              </div>
              <AlertDialogTrigger
                disabled={isLoading || deletingAgency}
                className="text-red-600 p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap"
              >
                {deletingAgency ? 'Suppression...' : "Supprimer l'agence"}
              </AlertDialogTrigger>
            </div>
          )}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-left">
                Êtes-vous absolument sûr ?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                Cette action ne peut pas être annulée. Cela supprimera
                définitivement le compte de votre entreprise et tous les sous-comptes
                associés.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex items-center">
              <AlertDialogCancel className="mb-2">Annuler</AlertDialogCancel>
              <AlertDialogAction
                disabled={deletingAgency}
                className="bg-destructive hover:bg-destructive"
                onClick={handleDeleteAgency}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </CardContent>
      </Card>
    </AlertDialog>
  )
}

export default AgencyDetails
