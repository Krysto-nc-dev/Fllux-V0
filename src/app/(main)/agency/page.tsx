import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'
import { Plan } from '@prisma/client' // Correction du chemin d'importation
import AgencyDetails from '@/components/forms/agency-details'

const page = async ({ searchParams }: { searchParams: { plan: Plan; state: string; code: string } }) => {
  try {
    const agencyId = await verifyAndAcceptInvitation()
    console.log('agencyId:', agencyId)

    // Get user's details
    const user = await getAuthUserDetails()
    console.log('user ::::', user)

    if (agencyId) {
      if (user?.role === 'SUBACCOUNT_GUEST' || user?.role === 'SUBACCOUNT_USER') {
        return redirect(`/subaccount`)
      } else if (user?.role === 'AGENCY_OWNER' || user?.role === 'AGENCY_ADMIN') {
        if (searchParams.plan) {
          return redirect(`/agency/${agencyId}/billing?plan=${searchParams.plan}`)
        }

        if (searchParams.state) {
          const statePath = searchParams.state.split('___')[0]
          const stateAgencyId = searchParams.state.split('___')[1]
          if (!stateAgencyId) {
            return <div>Non autorisé</div>
          }
          return redirect(`/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`)
        } else {
          return redirect(`/agency/${agencyId}`)
        }
      } else {
        return <div>Non autorisé</div>
      }
    }

    const authUser = await currentUser()
    // console.log('authUser ::::', authUser)

    return (
      <div className='flex justify-center items-center mt-4'>
        <div className='mx-w-[850px] border-[1px] p-4 rounded-xl'>
          <h1 className='text-4xl'>Créer une Agence</h1>
          <AgencyDetails
            data={{
              companyEmail: authUser?.emailAddresses[0].emailAddress,
            }}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error:', error)
    return <div>Une erreur est survenue</div>
  }
}

export default page
