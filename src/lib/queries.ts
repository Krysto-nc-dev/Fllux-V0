'use server'

import { clerkClient, currentUser } from '@clerk/nextjs/server'
import { db } from './db'
import { redirect } from 'next/navigation'
import { PrismaClient, User } from '@prisma/client'
import { Agency } from '@Prisma/client'

export const getAuthUserDetails = async () => {
  const user = await currentUser()
  if (!user) {
    return
  }

  const userData = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress, // Correction : emailAddress au lieu de emailAdress
    },
    include: {
      Agency: {
        include: {
          SidebarOption: true,
          SubAccount: {
            include: {
              SidebarOption: true,
            },
          },
        },
      },
      Permissions: true,
    },
  })
  return userData
}

export const saveActivityLogsNotification = async ({
  agencyId,
  description,
  subAccountId,
}: {
  agencyId?: string
  description: string
  subAccountId?: string
}) => {
  const authUser = await currentUser()
  let userData

  if (!authUser) {
    const response = await db.user.findFirst({
      where: {
        Agency: {
          SubAccount: {
            some: { id: subAccountId },
          },
        },
      },
    })
    if (response) {
      userData = response
    }
  } else {
    userData = await db.user.findUnique({
      where: {
        email: authUser.emailAddresses[0].emailAddress,
      },
    })
  }

  if (!userData) {
    console.log('Utilisateur non trouvé')
    return
  }

  let foundAgencyId = agencyId

  if (!subAccountId) {
    throw new Error('Vous devez fournir un identifiant de sous-compte ou un identifiant d\'agence')
  }

  const subAccountResponse = await db.subAccount.findUnique({
    where: { id: subAccountId },
  })

  if (subAccountResponse) {
    foundAgencyId = subAccountResponse.agencyId
  }

  const notificationData = {
    notification: `${userData.name} | ${description}`,
    User: {
      connect: {
        id: userData.id,
      },
    },
    Agency: {
      connect: {
        id: foundAgencyId,
      },
    },
  }

  if (subAccountId) {
    notificationData.SubAccount = {
      connect: {
        id: subAccountId,
      },
    }
  }

  await db.notification.create({
    data: notificationData,
  })
}

export const createTeamUser = async (agencyId: string, user: User) => {
  // Correction : String -> string pour le type TypeScript
  if (user.role === 'AGENCY_OWNER') return null
  const response = await db.user.create({ data: { ...user, agencyId } }) // Ajout de l'agence ID au moment de la création
  return response
}

export const verifyAndAcceptInvitation = async () => {
  const user = await currentUser()

  if (!user) {
    redirect('agency/sign-in')
    return // Ajout du retour pour arrêter l'exécution si l'utilisateur n'est pas connecté
  }

  const invitationExists = await db.invitation.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
      status: 'PENDING',
    },
  })

  if (invitationExists) {
    const userDetails = await createTeamUser(invitationExists?.agencyId, {
      email: invitationExists.email,
      agencyId: invitationExists.agencyId,
      avatarUrl: user?.imageUrl,
      id: user?.id,
      name: `${user?.firstName} ${user?.lastName}`,
      role: invitationExists.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await saveActivityLogsNotification({
      agencyId: invitationExists?.agencyId,
      description: "Utilisateur accepté dans l'organisation",
      subAccountId: undefined,
    })

    if (userDetails) {
      await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
          role: userDetails.role || 'SUBACCOUNT_USER',
        },
      })
      await db.invitation.delete({
        where: {
          email: userDetails.email,
        },
      })

      return userDetails.agencyId
    } else {
      return null
    }
  } else {
    const agency = await db.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
    })
    return agency ? agency.agencyId : null
  }
}

export const updateAgencyDetails = async (
  agencyId: string,
  agencyDetails: Partial<Agency>,
) => {
  const response = await db.agency.update({
    where: {
      id: agencyId,
    },
    data: { ...agencyDetails },
  })
  return response
}


export const deleteAgency = async (agencyId: string) => {
    const response = await db.agency.delete({ where: { id: agencyId } })
    return response
  }
  
  export const initUser = async (newUser: Partial<User>) => {
    const user = await currentUser()
    if (!user) return
  
    const userData = await db.user.upsert({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
      update: newUser,
      create: {
        id: user.id,
        avatarUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName} ${user.lastName}`,
        role: newUser.role || 'SUBACCOUNT_USER',
      },
    })
  
    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        role: newUser.role || 'SUBACCOUNT_USER',
      },
    })
  
    return userData
  }

  export const upsertAgency = async (agency: Agency, price?: Plan) => {
    if (!agency.companyEmail) return null
    try {
      const agencyDetails = await db.agency.upsert({
        where: {
          id: agency.id,
        },
        update: agency,
        create: {
          users: {
            connect: { email: agency.companyEmail },
          },
          ...agency,
          SidebarOption: {
            create: [
              {
                name: 'Dashboard',
                icon: 'category',
                link: `/agency/${agency.id}`,
              },
              {
                name: 'Launchpad',
                icon: 'clipboardIcon',
                link: `/agency/${agency.id}/launchpad`,
              },
              {
                name: 'Billing',
                icon: 'payment',
                link: `/agency/${agency.id}/billing`,
              },
              {
                name: 'Settings',
                icon: 'settings',
                link: `/agency/${agency.id}/settings`,
              },
              {
                name: 'Sub Accounts',
                icon: 'person',
                link: `/agency/${agency.id}/all-subaccounts`,
              },
              {
                name: 'Team',
                icon: 'shield',
                link: `/agency/${agency.id}/team`,
              },
            ],
          },
        },
      })
      return agencyDetails
    } catch (error) {
      console.log(error)
    }
  }

  export const getNotificationAndUser = async (agencyId: string) => {
    try {
      const response = await db.notification.findMany({
        where: {agencyId},
        include: {
          User: true,
        },
        orderBy: { createdAt: 'desc' },
      })
      return response
    } catch (error) {

      console.log(error)

      
    }
  }