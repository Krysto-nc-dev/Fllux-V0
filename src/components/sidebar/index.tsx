import { getAuthUserDetails } from '@/lib/queries'
import React from 'react'
import { Agency } from '@prisma/client'
import MenuOptions from './menu-options'

type Props = {
  id: string
  type: 'agency' | 'subaccount'
}

const Sidebar = async ({ id, type }: Props) => {
  const user = await getAuthUserDetails()
  if (!user) return null
  if (!user.Agency) return null

  const details =
    type === 'agency'
      ? user.Agency
      : user.Agency.SubAccount.find((subaccount) => subaccount.id === id)

  if (!details) return null

  const isWhiteLabeledAgency = user.Agency.whiteLabel
  let sideBarLogo = user.Agency.agencyLogo || '/assets/plura-logo.svg'

  if (!isWhiteLabeledAgency) {
    if (type === 'subaccount') {
      sideBarLogo =
        user.Agency.SubAccount.find((subaccount) => subaccount.id === id)
          ?.subAccountLogo || user.Agency.agencyLogo
    }
  }

  const sidebarOpt =
    type === 'agency'
      ? user.Agency.sidebarOption || []
      : user.Agency.SubAccount.find((subaccount) => subaccount.id === id)
          ?.sidebarOption || []

  const subaccounts = user.Agency.SubAccount.filter((subaccount) =>
    user.Permission.find(
      (permission) =>
        permission.subAccountId === subaccount.id && permission.access,
    ),
  )

  return (
    <>
      <MenuOptions
        defaultOpen={true}
        details={details}
        id={id}
        sidebarLogo={sideBarLogo}
        sidebarOpt={sidebarOpt}
        subaccounts={subaccounts}
        user={user}
      />
      <MenuOptions
        details={details}
        id={id}
        sidebarLogo={sideBarLogo}
        sidebarOpt={sidebarOpt}
        subaccounts={subaccounts}
        user={user}
      />
    </>
  )
}

export default Sidebar
