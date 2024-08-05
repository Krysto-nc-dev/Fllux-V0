import Link from 'next/link'
import React from 'react'

type Props = {}

const Unauthorized = (props: Props) => {
  return (
    <div className="p-4 text-center h-screen w-screen flex justify-center items-center flex-col">
      <h1 className="text-3xl md:text-6xl">Accès non autorisé!</h1>
      <p>Veuillez contacter le support ou le propriétaire de l'entreprise pour obtenir l'accès</p>
      <Link
        href="/"
        className="mt-4 bg-primary p-2"
      >
        Retour à l'accueil
      </Link>
    </div>
  )
}

export default Unauthorized
